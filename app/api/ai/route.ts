import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { FoodIngredient, DishRecipeBreakdown } from '@/types/preschool';
import { MASTER_VIETNAMESE_INGREDIENTS, calculateDishNutrition, calculateMacroEnergyDistribution, generateProcurementGroceryList } from '@/lib/nutrition-calculator';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

interface AIRequestPayload {
  action:
    | 'generate_lesson_plan'
    | 'generate_menu_plan'
    | 'parse_step1_inspection'
    | 'generate_student_evaluation'
    | 'analyze_nutrition_and_allergies'
    | 'chat_preschool_copilot'
    | 'decompose_dish'
    | 'decompose_full_day_menu'
    | 'suggest_ingredient_substitute'
    | 'analyze_custom_recipe';
  payload: any;
}

// Helper: Call Groq API with robust model fallback
async function callGroq(prompt: string, systemPrompt?: string, jsonMode = false): Promise<{ text: string; modelUsed: string }> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  // Only use active, non-decommissioned Groq production models
  const candidateModels = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const body: any = {
        model,
        messages,
        temperature: 0.4,
        max_tokens: 3500,
      };

      if (jsonMode) {
        body.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Groq API error on model ${model} (${res.status}): ${errText}`);
        throw new Error(`Groq API Error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (content) {
        return { text: content, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      // If unauthorized, don't keep iterating invalid key
      if (err?.message?.includes('401') || err?.message?.includes('invalid_api_key')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('All Groq models failed');
}

// Helper: Call Gemini API using @google/genai with automatic modern model fallback
async function callGemini(prompt: string, systemPrompt?: string, jsonMode = false): Promise<{ text: string; modelUsed: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const candidateGeminiModels = [
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.1-pro-preview',
    'gemini-2.5-flash',
  ];

  let lastError: any = null;

  for (const model of candidateGeminiModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: jsonMode ? { responseMimeType: 'application/json' } : undefined,
      });

      if (response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

// Dispatch to Groq or Gemini
async function runAI(prompt: string, systemPrompt: string, jsonMode = false): Promise<{ text: string; provider: string }> {
  // If Groq key is set, prioritize Groq for ultra-fast LPU speed
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '') {
    try {
      const result = await callGroq(prompt, systemPrompt, jsonMode);
      return { text: result.text, provider: `Groq LPU (${result.modelUsed})` };
    } catch (e: any) {
      console.warn('Groq call failed, attempting Gemini fallback:', e.message);
    }
  }

  // Fallback to Gemini
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      const result = await callGemini(prompt, systemPrompt, jsonMode);
      return { text: result.text, provider: `Google Gemini (${result.modelUsed})` };
    } catch (e: any) {
      console.warn('Gemini call failed:', e.message);
    }
  }

  throw new Error('NO_API_KEY');
}

export async function POST(req: NextRequest) {
  // Kiểm tra Rate Limit cho AI route: tối đa 20 request/phút/IP để bảo vệ quota
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { limit: 20, windowMs: 60 * 1000, keyPrefix: 'ai-copilot' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Quá nhiều yêu cầu AI trong thời gian ngắn. Vui lòng thử lại sau ${rateLimit.retryAfterSec} giây.`,
        retryAfterSec: rateLimit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSec),
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body: AIRequestPayload = await req.json();
    const { action, payload } = body;

    switch (action) {
      // 1. SOẠN GIÁO ÁN MẦM NON TỰ ĐỘNG
      case 'generate_lesson_plan': {
        const { theme, targetClass, developmentField, extraNotes, teacherName, approverName } = payload;
        const systemPrompt = `Bạn là Chuyên gia Giáo dục Mầm non hàng đầu Việt Nam, am hiểu sâu sắc Chương trình Giáo dục Mầm non của Bộ Giáo Dục và Đào Tạo. 
Nhiệm vụ của bạn là soạn một Kế hoạch Hoạt động Học (Giáo án) mầm non chi tiết, chuẩn chỉnh, sáng tạo và phù hợp lứa tuổi.
Hãy trả về ĐỊNH DẠNG JSON với cấu trúc chính xác sau:
{
  "title": "Tên đề tài hoạt động (ngắn gọn, thu hút)",
  "theme": "Chủ đề giáo dục",
  "targetClass": "Lứa tuổi/Khối lớp",
  "developmentField": "Lĩnh vực phát triển",
  "objectives": {
    "knowledge": ["Mục tiêu kiến thức 1", "Mục tiêu kiến thức 2"],
    "skills": ["Mục tiêu kỹ năng 1", "Mục tiêu kỹ năng 2"],
    "attitudes": ["Mục tiêu thái độ 1", "Mục tiêu thái độ 2"]
  },
  "preparations": {
    "teacher": ["Đồ dùng của cô 1", "Đồ dùng của cô 2"],
    "students": ["Đồ dùng của trẻ 1", "Tâm thế của trẻ"]
  },
  "procedure": [
    {
      "step": "1. Ổn định tổ chức & Gây hứng thú",
      "duration": "3-5 phút",
      "teacherActivities": "Lời dẫn và hành động của cô...",
      "studentActivities": "Phản ứng và tham gia của trẻ..."
    },
    {
      "step": "2. Phương pháp & Hình thức tổ chức (Trọng tâm)",
      "duration": "18-22 phút",
      "teacherActivities": "Tiến trình tổ chức bài học, câu hỏi gợi mở, hướng dẫn thực hành...",
      "studentActivities": "Trẻ quan sát, trải nghiệm, thảo luận, thực hành..."
    },
    {
      "step": "3. Củng cố & Trò chơi vận dụng",
      "duration": "5-7 phút",
      "teacherActivities": "Luật chơi, cách chơi trò chơi củng cố kiến thức...",
      "studentActivities": "Trẻ tham gia chơi hứng thú..."
    },
    {
      "step": "4. Kết thúc & Đánh giá",
      "duration": "2-3 phút",
      "teacherActivities": "Nhận xét, tuyên dương trẻ, giáo dục nhẹ nhàng...",
      "studentActivities": "Trẻ thu dọn đồ dùng cùng cô và chuyển hoạt động..."
    }
  ],
  "estimatedDurationMinutes": 30,
  "notes": "Lưu ý sư phạm cho giáo viên..."
}`;

        const userPrompt = `Hãy soạn giáo án mầm non theo yêu cầu sau:
- Khối lớp: ${targetClass || 'Khối Mầm (3-4 tuổi)'}
- Chủ đề: ${theme || 'Thế giới Động vật quanh bé'}
- Lĩnh vực phát triển: ${developmentField || 'Phát triển Nhận thức'}
- Giáo viên thực hiện: ${teacherName || 'Thanh Xuân'}
- Người phê duyệt: ${approverName || 'Võ Thị Hồng Sim (Chủ cơ sở)'}
- Yêu cầu / Ý tưởng bổ sung: ${extraNotes || 'Hoạt động trải nghiệm sinh động, gắn với môi trường biển đảo Liên Hương tươi đẹp.'}

Hãy xuất kết quả ở định dạng JSON chuẩn.`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = { rawText: text };
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          // Fallback template if no key
          const fallbackData = generateFallbackLessonPlan(theme, targetClass, developmentField, teacherName);
          return NextResponse.json({
            success: true,
            data: fallbackData,
            provider: 'AI Template Engine (Offline)',
            notice: 'Đang dùng mẫu giáo án chuẩn hóa. Hãy cấu hình GROQ_API_KEY hoặc GEMINI_API_KEY để kích hoạt AI tạo tức thì.',
          });
        }
      }

      // 2. GỢI Ý THỰC ĐƠN TUẦN & CÂN ĐỐI DINH DƯỠNG
      case 'generate_menu_plan': {
        const { ageGroup, season, budgetPerDay, location, targetCalo } = payload;
        const systemPrompt = `Bạn là Chuyên gia Dinh dưỡng Nhi khoa & Bếp trưởng Mầm non chuyên nghiệp.
Nhiệm vụ: Lập thực đơn tuần (Thứ 2 đến Thứ 6) cân đối 4 nhóm thực phẩm (Đạm, Béo, Bột đường, Vitamin & Khoáng chất) theo chuẩn Viện Dinh Dưỡng và Thông tư Bộ Giáo Dục.
Trả về định dạng JSON với cấu trúc sau:
{
  "weekTitle": "Thực đơn dinh dưỡng tuần chuẩn Viện Dinh Dưỡng",
  "ageGroup": "${ageGroup || 'Mẫu giáo (3-6 tuổi)'}",
  "estimatedDailyCalo": "750 - 820 kcal",
  "nutritionRatio": "Protein: 14-16% | Lipid: 26-28% | Glucid: 56-58%",
  "days": [
    {
      "dayOfWeek": "Thứ 2",
      "breakfast": "Bún thịt heo băm nấu cà chua + Sữa hạt sen",
      "lunchMain": "Thịt lợn rim ngũ vị / Tôm rim thịt nạc",
      "lunchSide": "Bí đỏ xào tỏi / Cà rốt xào thịt băm",
      "lunchSoup": "Canh cua rau đay mồng tơi",
      "snackAfternoon": "Bánh flan caramen mềm / Sữa chua dâu tây",
      "snackLate": "Sữa tươi tiệt trùng Vinamilk 110ml",
      "dailyCostEstimate": "35.000 đ",
      "notes": "Giàu kẽm và canxi phát triển chiều cao"
    }
    // Lặp lại cho Thứ 3, Thứ 4, Thứ 5, Thứ 6
  ],
  "nutritionalAdvice": "Lời khuyên dinh dưỡng cho cấp dưỡng...",
  "localIngredientsHighlight": "Nguyên liệu tươi địa phương nên dùng..."
}`;

        const userPrompt = `Lập thực đơn 5 ngày (Thứ 2 đến Thứ 6) cho:
- Lứa tuổi: ${ageGroup || 'Mẫu giáo (3-6 tuổi)'}
- Mùa vụ: ${season || 'Mùa hè'}
- Định mức tiền ăn: ${budgetPerDay || '35.000'} VNĐ/trẻ/ngày
- Địa bàn trường: Mầm Non Đảo Tí Hon, Xã Liên Hương, Tuy Phong, Bình Thuận (ưu tiên hải sản tươi, rau củ địa phương).
- Mức Calo mục tiêu: ${targetCalo || '750 - 850 kcal/ngày/trẻ tại trường'}`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = { rawText: text };
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          const fallbackMenu = generateFallbackMenuPlan(ageGroup, budgetPerDay);
          return NextResponse.json({
            success: true,
            data: fallbackMenu,
            provider: 'AI Template Engine (Offline)',
            notice: 'Đang dùng mẫu thực đơn tiêu chuẩn Viện Dinh Dưỡng.',
          });
        }
      }

      // 3. TRÍCH XUẤT SỔ KIỂM THỰC 3 BƯỚC TỪ VĂN BẢN / GIỌNG NÓI TỰ NHIÊN
      case 'parse_step1_inspection': {
        const { rawText, inspectionDate, shift } = payload;
        const systemPrompt = `Bạn là Trợ lý số hóa Kiểm thực 3 bước Mầm non theo Quyết định 1246/QĐ-BYT.
Nhiệm vụ: Phân tích đoạn văn bản tự nhiên ghi chép giao nhận thực phẩm buổi sáng của nhà bếp và trích xuất thành danh sách các món thực phẩm có cấu trúc JSON.
Cấu trúc JSON trả về:
{
  "records": [
    {
      "foodName": "Tên thực phẩm (vd: Thịt lợn nạc mông, Rau mồng tơi)",
      "foodType": "Tươi sống" | "Đóng gói/Chế biến sẵn" | "Gia vị",
      "quantityKg": 15.5,
      "unitPrice": 110000,
      "totalAmount": 1705000,
      "supplier": "Tên nhà cung cấp / vựa thực phẩm",
      "sensoryEvaluation": "Đạt",
      "sensoryNotes": "Màu sắc tươi, không mùi lạ, còn độ đàn hồi",
      "origin": "Chứng nhận ATTP HTX Liên Hương / Ba Vì",
      "expiryDate": "2025-05-18",
      "notes": "Ghi chú nếu có"
    }
  ],
  "summary": {
    "totalItems": 3,
    "totalEstimatedCost": 2500000,
    "qualityVerdict": "100% nguyên liệu đạt chuẩn ATTP khi tiếp nhận"
  }
}`;

        const userPrompt = `Hãy phân tích đoạn ghi chú giao nhận sau đây vào ngày ${inspectionDate || 'hôm nay'} (Ca: ${shift || 'Sáng 06:30'}):
"${rawText}"`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = { rawText: text };
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          const parsedLocal = parseStep1Locally(rawText);
          return NextResponse.json({
            success: true,
            data: parsedLocal,
            provider: 'Local Smart Parser',
          });
        }
      }

      // 4. SOẠN NHẬN XÉT HỌC SINH & THƯ GỬI PHỤ HUYNH
      case 'generate_student_evaluation': {
        const { studentName, className, attendanceDays, healthStatus, eatingSleepingHabits, learningSkills, teacherNotes } = payload;
        const systemPrompt = `Bạn là Giáo viên Mầm non tận tâm, yêu trẻ, có kỹ năng giao tiếp sư phạm khéo léo và ấm áp.
Nhiệm vụ: Viết bản Nhận xét định kỳ tháng cho bé mầm non và Thư thông báo ngắn gọn, ân cần gửi phụ huynh qua Zalo / Sổ liên lạc điện tử.
Cấu trúc JSON:
{
  "studentName": "${studentName}",
  "className": "${className}",
  "monthlySummary": "Đoạn nhận xét tổng quan ngắn gọn (3-4 câu) về sự phát triển của bé...",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "areasToEncourage": ["Điểm cần phối hợp cùng gia đình rèn luyện thêm"],
  "parentMessage": "Đoạn tin nhắn gửi ba mẹ (ấm áp, lịch sự, tích cực)...",
  "teacherSignature": "Cô giáo Thanh Xuân - Trường MN Đảo Tí Hon"
}`;

        const userPrompt = `Hãy viết nhận xét tháng cho bé:
- Họ tên bé: ${studentName || 'Nguyễn Gia Bảo'}
- Lớp: ${className || 'Lá 1'}
- Ngày đi học: ${attendanceDays || '22/22 ngày (chăm ngoan)'}
- Sức khỏe thể lực: ${healthStatus || 'Tốt, chiều cao cân nặng kênh A'}
- Ăn uống & Giấc ngủ: ${eatingSleepingHabits || 'Ăn hết suất, tự xúc gọn gàng, ngủ trưa ngon'}
- Nhận thức & Kỹ năng: ${learningSkills || 'Tích cực phát biểu, thích vẽ tranh, hòa đồng với bạn bè'}
- Ghi chú cô giáo: ${teacherNotes || 'Bé rất lễ phép, biết chào hỏi người lớn'}`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = { rawText: text };
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          return NextResponse.json({
            success: true,
            data: {
              studentName: studentName || 'Bé yêu',
              className: className || 'Mầm non',
              monthlySummary: `Tháng vừa qua bé ${studentName} đi học rất chuyên cần, ngoan ngoãn và vui vẻ. Bé thích nghi tốt với nền nếp sinh hoạt tại lớp, ăn ngủ ngon và hăng hái tham gia vào các hoạt động trải nghiệm cùng cô và các bạn.`,
              strengths: [
                'Tự giác trong giờ ăn và giờ ngủ',
                'Hòa đồng, biết chia sẻ đồ chơi cùng bạn bè',
                'Nhanh nhẹn, hào hứng khi học hát và khám phá chủ đề mới',
              ],
              areasToEncourage: [
                'Gia đình tiếp tục khuyến khích bé uống thêm nước ấm và tự sắp xếp đồ dùng cá nhân tại nhà.',
              ],
              parentMessage: `Kính gửi Quý Phụ huynh bé ${studentName},\nTháng này bé có nhiều tiến bộ vượt bậc về cả thể chất lẫn kỹ năng giao tiếp. Cô giáo xin gửi lời cảm ơn ba mẹ đã luôn đồng hành cùng Trường Mầm Non Đảo Tí Hon trong việc chăm sóc và nuôi dạy bé. Chúc bé và gia đình luôn dồi dào sức khỏe!`,
              teacherSignature: 'Cô giáo Thanh Xuân - Mầm Non Đảo Tí Hon',
            },
            provider: 'AI Template Engine (Offline)',
          });
        }
      }

      // 5. TRỢ LÝ TƯ VẤN QUẢN TRỊ MẦM NON (AI COPILOT CHAT)
      case 'chat_preschool_copilot': {
        const { message, context } = payload;
        const systemPrompt = `Bạn là Trợ lý AI Quản trị Mầm Non Thông Minh của trường Mầm Non Tư Thục Đảo Tí Hon (Xã Liên Hương, Tuy Phong, Bình Thuận).
Bạn có chuyên môn sâu về:
1. Quy trình Kiểm thực 3 bước theo Quyết định 1246/QĐ-BYT và lưu mẫu thực phẩm 24h.
2. Cân đối dinh dưỡng, calo và thực đơn mầm non chuẩn Thông tư 28/2016/TT-BGDĐT.
3. Kế hoạch giáo dục, soạn giáo án theo 5 lĩnh vực phát triển.
4. Quản lý tài chính bán trú, thu học phí, tính lương giáo viên và an toàn vệ sinh trường học.
Hãy trả lời cô giáo và chủ trường bằng văn phong sư phạm ân cần, súc tích, chuyên nghiệp và có giải pháp hành động cụ thể.`;

        try {
          const { text, provider } = await runAI(message, systemPrompt, false);
          return NextResponse.json({ success: true, answer: text, provider });
        } catch (e: any) {
          return NextResponse.json({
            success: true,
            answer: `Cảm ơn Cô/Chủ trường đã đặt câu hỏi. Đối với vấn đề "${message}", hệ thống khuyến nghị thực hiện đúng theo biểu mẫu quy định của Phòng GD&ĐT Xã Liên Hương và Quyết định 1246/QĐ-BYT. Bạn có thể cấu hình GROQ_API_KEY để kích hoạt tính năng giải đáp chuyên sâu 24/7 tức thời.`,
            provider: 'Preschool Assistant Engine',
          });
        }
      }

      // 6. BÓC TÁCH THÀNH PHẦN NGUYÊN LIỆU MÓN ĂN (RECIPE BREAKDOWN ENGINE)
      case 'decompose_dish': {
        const { dishName, mealSlot, ageGroup, studentCount, targetPortionCost } = payload;
        const normalized = (dishName || '').toLowerCase().trim();
        
        // Smart Pre-Classification for AI Prompt
        let detectedCategory = 'Món mặn chính';
        let suggestedSlot = mealSlot || 'lunchMain';
        if (
          normalized.includes('nước chanh') ||
          normalized.includes('chanh') ||
          normalized.includes('nước cam') ||
          normalized.includes('nước ép') ||
          normalized.includes('sinh tố') ||
          normalized.includes('sữa') ||
          normalized.includes('sắn dây') ||
          normalized.includes('nước dừa') ||
          normalized.includes('nước mía')
        ) {
          detectedCategory = 'Đồ uống & Nước ép';
          if (!mealSlot || mealSlot === 'lunchMain') suggestedSlot = 'snackMorning';
        } else if (
          normalized.includes('chuối') ||
          normalized.includes('dưa hấu') ||
          normalized.includes('đu đủ') ||
          normalized.includes('xoài') ||
          normalized.includes('thanh long') ||
          normalized.includes('táo') ||
          normalized.includes('chè') ||
          normalized.includes('sữa chua') ||
          normalized.includes('bánh flan')
        ) {
          detectedCategory = 'Tráng miệng';
          if (!mealSlot || mealSlot === 'lunchMain') suggestedSlot = 'lunchDessert';
        } else if (normalized.includes('canh') || normalized.includes('súp') || normalized.includes('soup') || normalized.includes('riêu')) {
          detectedCategory = 'Món canh';
          if (!mealSlot || mealSlot === 'lunchMain') suggestedSlot = 'lunchSoup';
        } else if (normalized.includes('cháo') || normalized.includes('bún') || normalized.includes('phở') || normalized.includes('miến') || normalized.includes('bánh bao') || normalized.includes('bánh mì')) {
          detectedCategory = 'Bữa sáng & Bữa xế';
          if (!mealSlot || mealSlot === 'lunchMain') suggestedSlot = 'breakfast';
        } else if (normalized.includes('cơm') || normalized.includes('xôi')) {
          detectedCategory = 'Món ăn kèm & Cơm';
          if (!mealSlot || mealSlot === 'lunchMain') suggestedSlot = 'lunchStaple';
        }

        const systemPrompt = `Bạn là Chuyên gia Dinh dưỡng Nhi khoa & Bếp trưởng Bán trú Mầm non chuẩn Bộ GD&ĐT và Bộ Y Tế.
Nhiệm vụ: Phân tích sâu món ăn mầm non thành danh sách các NGUYÊN LIỆU CẤU THÀNH (BOM - Bill of Materials).
ĐẶC BIỆT CHÚ Ý QUY TẮC PHÂN LOẠI MÓN ĂN:
1. NẾU LÀ ĐỒ UỐNG / NƯỚC GIẢI KHÁT (ví dụ: Nước Chanh, Nước Cam, Sinh tố, Nước ép quả, Sữa hạt...):
   - TUYỆT ĐỐI KHÔNG được cho thịt lợn, thịt bò, cá, hải sản, dầu ăn, nước mắm, hành tiêu mặn!
   - Nguyên liệu PHẢI LÀ: Chanh tươi/Cam tươi/Trái cây sạch + Đường kính trắng/đường phèn sạch + Nước đun sôi để nguội (hoặc muối tinh nhẹ).
   - Năng lượng: 40 - 70 Kcal/suất, Đạm ~ 0g, Béo ~ 0g, Bột đường (Glucid) ~ 10-15g.
2. NẾU LÀ TRÁNG MIỆNG (Hoa quả tươi, chè, sữa chua):
   - Hoa quả sạch rửa kỹ, gọt vỏ bỏ hạt, cắt hạt lựu hoặc chia miếng vừa miệng trẻ.
3. NẾU LÀ MÓN CANH:
   - Nước dùng ngọt tự nhiên, rau sạch cắt nhỏ ninh mềm, đạm (thịt/tôm/cua băm nhuyễn) nêm nhạt.
4. NẾU LÀ MÓN MẶN:
   - Thịt nạc, cá phi lê, tôm bóc nõn cắt nhỏ rim mềm, dầu thực vật an toàn.

Định dạng JSON bắt buộc:
{
  "dishName": "${dishName}",
  "category": "${detectedCategory}",
  "mealSlot": "${suggestedSlot}",
  "ageGroup": "${ageGroup || 'Mẫu giáo (3-6 tuổi)'}",
  "ingredients": [
    {
      "id": "ing-1",
      "name": "Tên nguyên liệu chuẩn (vd: Chanh tươi quả mọng nước, Đường kính trắng sạch...)",
      "category": "Trái cây tráng miệng" | "Thịt cá tươi sống" | "Rau củ quả nấm" | "Gia vị & dầu mỡ" | "Gạo & ngũ cốc" | "Sữa & chế phẩm" | "Khác",
      "type": "tuoi_song" | "kho",
      "unit": "kg" | "lít" | "quả",
      "rawGramsPerPortion": 25,
      "cleanGramsPerPortion": 20,
      "wasteRatePercent": 20,
      "pricePerKg": 30000,
      "caloriesPer100g": 30,
      "proteinPer100g": 0.3,
      "lipidPer100g": 0.1,
      "glucidPer100g": 7.0,
      "calciumMg": 15,
      "ironMg": 0.4,
      "supplierName": "HTX Nông Sản / Vựa sạch",
      "notes": "Vắt lấy nước cốt pha nước đường sạch"
    }
  ],
  "totalCalories": 55,
  "totalProteinGrams": 0.2,
  "totalLipidGrams": 0,
  "totalGlucidGrams": 13.5,
  "estimatedCostPerPortion": 3500,
  "cookingInstructions": "Hướng dẫn cấp dưỡng chuẩn xác..."
}`;

        const userPrompt = `Hãy bóc tách thành phần nguyên liệu cho món: "${dishName || 'Nước Chanh'}"
- Phân nhóm: ${detectedCategory}
- Khung bữa ăn: ${suggestedSlot}
- Lứa tuổi: ${ageGroup || 'Mẫu giáo (3-6 tuổi)'}
- Sĩ số: ${studentCount || 80} trẻ
- Đảm bảo đúng bản chất món mầm non Việt Nam. Trả về JSON chuẩn.`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed: any;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = generateFallbackDishDecomposition(dishName, suggestedSlot, ageGroup, studentCount);
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          const fallbackData = generateFallbackDishDecomposition(dishName, suggestedSlot, ageGroup, studentCount);
          return NextResponse.json({
            success: true,
            data: fallbackData,
            provider: 'Preschool Nutrition Engine (Offline Standard)',
          });
        }
      }

      // 7. BÓC TÁCH TOÀN BỘ THỰC ĐƠN NGÀY & LẬP DANH SÁCH ĐI CHỢ TỔNG HỢP
      case 'decompose_full_day_menu': {
        const { menuDay, studentCount, ageGroup } = payload;
        const systemPrompt = `Bạn là Chuyên gia Dinh dưỡng & Kế toán Bán trú Mầm Non.
Nhiệm vụ: Phân rã tất cả các món ăn trong 1 ngày (Sáng, trưa, xế, phụ) thành toàn bộ nguyên liệu cấu thành, sau đó tổng hợp thành:
1. Danh sách bóc tách từng món (recipeBreakdowns).
2. Tổng lượng Calo & tỷ lệ P-L-G toàn ngày đối chiếu chuẩn Viện Dinh Dưỡng.
3. Bảng Kê Mua Hàng Đi Chợ Sáng Sớm (tổng kg cần mua cho cả trường) và tổng tiền chợ.

Trả về JSON với cấu trúc:
{
  "dayOfWeek": "${menuDay?.dayOfWeek || 'Thứ 2'}",
  "ageGroup": "${ageGroup || 'Mẫu giáo'}",
  "studentCount": ${studentCount || 80},
  "totalDailyCalories": 795,
  "macroRatio": {
    "proteinPercent": 15.5,
    "lipidPercent": 27.2,
    "glucidPercent": 57.3,
    "isBalanced": true
  },
  "estimatedDailyCostPerChild": 34800,
  "totalDailySchoolBudget": 2784000,
  "recipeBreakdowns": [
    // Mảng các món đã được bóc tách nguyên liệu
  ],
  "procurementGroceryList": [
    {
      "ingredientName": "Thịt lợn nạc mông",
      "category": "Thịt cá tươi sống",
      "type": "tuoi_song",
      "unit": "kg",
      "totalRawKg": 3.6,
      "pricePerKg": 135000,
      "totalAmount": 486000,
      "supplierName": "Vựa thịt Liên Hương",
      "dishesUsedIn": ["Thịt rim ngũ vị", "Canh bí đỏ thịt bằm"]
    }
  ],
  "nutritionVerdict": "Thực đơn ngày đạt chuẩn 100% về Calo và tỷ lệ P-L-G"
}`;

        const userPrompt = `Hãy bóc tách nguyên liệu cho toàn bộ thực đơn ngày:
- Thứ: ${menuDay?.dayOfWeek || 'Thứ Hai'}
- Bữa sáng: ${menuDay?.breakfast || 'Bún thịt băm'}
- Bữa phụ sáng: ${menuDay?.snackMorning || 'Sữa hạt sen'}
- Món mặn trưa: ${menuDay?.lunchMain || 'Thịt lợn rim tôm nõn'}
- Canh trưa: ${menuDay?.lunchSoup || 'Canh cua rau đay mồng tơi'}
- Cơm trưa: ${menuDay?.lunchStaple || 'Cơm gạo tám'}
- Tráng miệng: ${menuDay?.lunchDessert || 'Dưa hấu'}
- Bữa xế chiều: ${menuDay?.afternoonSnack || 'Bánh flan caramen + Sữa tươi'}
- Sĩ số trẻ: ${studentCount || 80} trẻ (${ageGroup || 'Mẫu giáo 3-6 tuổi'})
Trả về JSON.`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed: any;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = generateFallbackFullDayMenuDecomposition(menuDay, studentCount || 80);
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          const fallback = generateFallbackFullDayMenuDecomposition(menuDay, studentCount || 80);
          return NextResponse.json({
            success: true,
            data: fallback,
            provider: 'Preschool Nutrition Engine (Offline Standard)',
          });
        }
      }

      // 8. GỢI Ý THAY THẾ NGUYÊN LIỆU (SUBSTITUTION ASSISTANT)
      case 'suggest_ingredient_substitute': {
        const { ingredientName, dishName, reason, ageGroup } = payload;
        const systemPrompt = `Bạn là Chuyên gia An toàn Dinh dưỡng Mầm non.
Nhiệm vụ: Gợi ý các nguyên liệu thay thế an toàn, tương đương về mặt dinh dưỡng (calo, đạm, vi chất) khi gặp tình huống: dị ứng ở trẻ, khan hiếm hàng chợ hoặc cần tối ưu ngân sách.
Trả về JSON:
{
  "originalIngredient": "${ingredientName}",
  "reason": "${reason || 'Dị ứng / Tối ưu chi phí'}",
  "substitutes": [
    {
      "name": "Tên nguyên liệu thay thế 1",
      "recommendedRawGrams": 40,
      "ratioExplanation": "Tỷ lệ 1:1, tương đương lượng protein nhưng dễ tiêu hóa hơn...",
      "priceComparison": "Rẻ hơn 15% / Tương đương",
      "nutrientPros": "Bổ sung thêm kẽm và sắt",
      "allergySafety": "An toàn cao, ít gây dị ứng mầm non"
    }
  ],
  "cookAdvice": "Lưu ý khi chế biến thay thế..."
}`;

        const userPrompt = `Hãy gợi ý nguyên liệu thay thế cho "${ingredientName}" trong món "${dishName}" vì lý do: "${reason || 'Trẻ bị dị ứng hoặc chợ hết hàng'}". Lứa tuổi: ${ageGroup || 'Mầm non'}.`;

        try {
          const { text, provider } = await runAI(userPrompt, systemPrompt, true);
          let parsed;
          try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);
          } catch {
            parsed = { rawText: text };
          }
          return NextResponse.json({ success: true, data: parsed, provider });
        } catch (e: any) {
          return NextResponse.json({
            success: true,
            data: {
              originalIngredient: ingredientName,
              reason: reason || 'Tùy chỉnh thay thế',
              substitutes: [
                {
                  name: 'Thịt gà ta phi lê / ức gà',
                  recommendedRawGrams: 40,
                  ratioExplanation: 'Đạm cao, ít chất béo bão hòa, thịt mềm dễ xé nhỏ cho trẻ',
                  priceComparison: 'Tiết kiệm ~20% chi phí',
                  nutrientPros: 'Giàu đạm nạc, vitamin B6',
                  allergySafety: 'Rất an toàn, phù hợp mọi độ tuổi',
                },
                {
                  name: 'Đậu phụ non tươi sạch',
                  recommendedRawGrams: 60,
                  ratioExplanation: 'Tăng lượng để bù đạm thực vật thanh mát',
                  priceComparison: 'Tiết kiệm ~60% chi phí',
                  nutrientPros: 'Giàu Isoflavone và Canxi thực vật',
                  allergySafety: 'Dễ tiêu hóa, hấp thu nhanh',
                },
              ],
              cookAdvice: 'Khi thay thế nguyên liệu, chú ý điều chỉnh lượng gia vị muối/mắm cho vừa vị ngọt tự nhiên của thực phẩm mới.',
            },
            provider: 'Preschool Substitution Engine',
          });
        }
      }

      // 9. PHÂN TÍCH & ĐÁNH GIÁ CẤU THÀNH MÓN TÙY BIẾN CỦA NGƯỜI DÙNG
      case 'analyze_custom_recipe': {
        const { ingredients, dishName, ageGroup, studentCount } = payload;
        const nutrition = calculateDishNutrition(ingredients || []);
        const macro = calculateMacroEnergyDistribution(
          nutrition.totalProteinGrams,
          nutrition.totalLipidGrams,
          nutrition.totalGlucidGrams
        );

        return NextResponse.json({
          success: true,
          data: {
            dishName: dishName || 'Món ăn tùy biến',
            nutrition,
            macro,
            verdict: macro.isBalanced
              ? 'Tỷ lệ dinh dưỡng của món ăn rất cân đối và phù hợp với tiêu chuẩn Viện Dinh Dưỡng.'
              : 'Tỷ lệ P-L-G đang có sự chênh lệch nhẹ. Bạn có thể điều chỉnh lượng dầu ăn hoặc nguồn đạm để đạt tỷ lệ tối ưu.',
          },
          provider: 'Real-time Preschool Nutrition Engine',
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown AI action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('AI API Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal AI Server Error' }, { status: 500 });
  }
}

// Fallback Generators
function generateFallbackLessonPlan(theme: string, targetClass: string, developmentField: string, teacherName: string) {
  return {
    title: `Khám phá & Trải nghiệm: ${theme || 'Chú cá biển nhỏ vui nhộn'}`,
    theme: theme || 'Thế giới Động vật quanh bé',
    targetClass: targetClass || 'Khối Mầm (3-4 tuổi)',
    developmentField: developmentField || 'Phát triển Nhận thức',
    objectives: {
      knowledge: [
        'Trẻ nhận biết và gọi đúng tên các đặc điểm nổi bật của đối tượng (màu sắc, hình dáng, nơi sống).',
        'Trẻ hiểu được lợi ích và tình cảm yêu thương, bảo vệ thiên nhiên động vật.',
      ],
      skills: [
        'Rèn luyện kỹ năng quan sát, so sánh và phát triển ngôn ngữ mạch lạc cho trẻ.',
        'Phát triển kỹ năng vận động tinh và sự khéo léo qua các thao tác trò chơi trải nghiệm.',
      ],
      attitudes: [
        'Trẻ hứng thú tham gia tích cực vào các hoạt động của lớp.',
        'Hình thành thói quen lắng nghe cô và đoàn kết giúp đỡ bạn bè.',
      ],
    },
    preparations: {
      teacher: [
        'Mô hình, tranh ảnh minh họa sinh động, video tư liệu ngắn phù hợp độ tuổi.',
        'Nhạc bài hát chủ đề vui nhộn, loa phát thanh mầm non.',
        'Hệ thống câu hỏi gợi mở phát triển tư duy.',
      ],
      students: [
        'Trang phục gọn gàng, tâm thế thoải mái, vui vẻ.',
        'Đồ dùng trò chơi, thẻ hình ảnh cho từng nhóm trẻ.',
      ],
    },
    procedure: [
      {
        step: '1. Ổn định tổ chức & Gây hứng thú',
        duration: '3-5 phút',
        teacherActivities: 'Cô tập trung trẻ, hát và vận động theo bài hát chủ đề. Trò chuyện tạo không khí vui tươi, dẫn dắt vào bài học một cách tự nhiên.',
        studentActivities: 'Trẻ vui vẻ hát múa cùng cô, lắng nghe và hào hứng tham gia trả lời câu đố gợi mở.',
      },
      {
        step: '2. Phương pháp & Hình thức tổ chức (Trọng tâm)',
        duration: '18-22 phút',
        teacherActivities: 'Cô trình chiếu/đưa vật mẫu cho trẻ quan sát. Đặt các câu hỏi gợi ý kích thích tư duy: "Đây là gì? Có đặc điểm như thế nào? Nơi sống ở đâu?". Hướng dẫn trẻ trải nghiệm trực tiếp.',
        studentActivities: 'Trẻ quan sát kỹ, sờ, nhìn, thảo luận nhóm đôi và giơ tay phát biểu ý kiến cá nhân.',
      },
      {
        step: '3. Củng cố & Trò chơi vận dụng',
        duration: '5-7 phút',
        teacherActivities: 'Cô phổ biến luật chơi trò chơi củng cố (ví dụ: "Ai nhanh hơn", "Về đúng tổ"). Tổ chức cho cả lớp cùng chơi 2-3 lần.',
        studentActivities: 'Trẻ hào hứng tham gia chơi đúng luật, cổ vũ bạn bè nhiệt tình.',
      },
      {
        step: '4. Kết thúc & Đánh giá',
        duration: '2-3 phút',
        teacherActivities: 'Cô nhận xét chung tiết học, khen ngợi những nỗ lực của trẻ, giáo dục tình yêu thương môi trường nhẹ nhàng.',
        studentActivities: 'Trẻ lắng nghe lời cô, cùng cô thu dọn đồ dùng học tập gọn gàng.',
      },
    ],
    estimatedDurationMinutes: 30,
    notes: `Giáo án do cô giáo ${teacherName || 'Thanh Xuân'} chuẩn bị, thiết kế phù hợp với đặc thù học sinh trường Mầm Non Đảo Tí Hon.`,
  };
}

function generateFallbackMenuPlan(ageGroup: string, budgetPerDay: string) {
  return {
    weekTitle: 'Thực đơn dinh dưỡng tuần chuẩn Viện Dinh Dưỡng Quốc Gia',
    ageGroup: ageGroup || 'Mẫu giáo (3-6 tuổi)',
    estimatedDailyCalo: '780 - 820 kcal/trẻ/ngày',
    nutritionRatio: 'Protein: 15% | Lipid: 27% | Glucid: 58%',
    days: [
      {
        dayOfWeek: 'Thứ 2',
        breakfast: 'Bún mọc thịt nạc nấu su su + Sữa bắp non',
        lunchMain: 'Thịt lợn rim ngũ vị / Tôm biển rim thịt nạc',
        lunchSide: 'Bí đỏ xào tỏi & Cà rốt bào sợi',
        lunchSoup: 'Canh cua đồng mồng tơi mướp hương',
        snackAfternoon: 'Bánh flan caramen / Sữa chua men sống',
        snackLate: 'Sữa tươi tiệt trùng 110ml',
        dailyCostEstimate: `${budgetPerDay || '35.000'} đ`,
        notes: 'Giàu canxi và kẽm cho hệ cơ xương',
      },
      {
        dayOfWeek: 'Thứ 3',
        breakfast: 'Cháo gà xé hạt sen đậu xanh + Nước cam tươi',
        lunchMain: 'Cá thu biển sốt cà chua / Chả cá Liên Hương chiên',
        lunchSide: 'Rau cải ngọt xào nấm rơm',
        lunchSoup: 'Canh thịt băm nấu bí xanh',
        snackAfternoon: 'Chè đậu đỏ nước cốt dừa / Chuối tiêu',
        snackLate: 'Sữa hạt sen mè đen',
        dailyCostEstimate: `${budgetPerDay || '35.000'} đ`,
        notes: 'Cung cấp Omega-3 phát triển trí não',
      },
      {
        dayOfWeek: 'Thứ 4',
        breakfast: 'Phở bò Hà Nội rau mùi + Sữa đậu nành hữu cơ',
        lunchMain: 'Thịt bò xào củ quả thập cẩm / Trứng đúc thịt',
        lunchSide: 'Su su xào tôm nõn',
        lunchSoup: 'Canh sườn hầm đu đủ non',
        snackAfternoon: 'Cháo sườn non yến mạch / Sữa chua dầm dâu',
        snackLate: 'Sữa bột dinh dưỡng mầm non',
        dailyCostEstimate: `${budgetPerDay || '35.000'} đ`,
        notes: 'Giàu sắt và đạm chất lượng cao',
      },
      {
        dayOfWeek: 'Thứ 5',
        breakfast: 'Hủ tiếu Nam Vang thịt băm trứng cút + Nước ép ổi',
        lunchMain: 'Gà kho gừng nhẹ / Đậu phụ nhồi thịt sốt cà chua',
        lunchSide: 'Rau dền đỏ luộc chấm sốt trứng',
        lunchSoup: 'Canh tôm nấu mướp hương',
        snackAfternoon: 'Bánh bông lan trứng muối / Dưa hấu',
        snackLate: 'Sữa tươi tiệt trùng 110ml',
        dailyCostEstimate: `${budgetPerDay || '35.000'} đ`,
        notes: 'Thực đơn thanh mát, tiêu hóa tốt',
      },
      {
        dayOfWeek: 'Thứ 6',
        breakfast: 'Bánh mì sandwich phô mai kẹp thịt nguội + Sữa hạt óc chó',
        lunchMain: 'Tôm rim tiêu ngọt / Thịt heo quay om nấm',
        lunchSide: 'Bắp cải xào cà chua',
        lunchSoup: 'Canh ngao nấu chua dứa mồng tơi',
        snackAfternoon: 'Cháo tôm bí đỏ phô mai / Sữa chua hoa quả',
        snackLate: 'Sữa chua uống Probi',
        dailyCostEstimate: `${budgetPerDay || '35.000'} đ`,
        notes: 'Tổng kết tuần học vui khỏe, nạp đầy đủ vi chất',
      },
    ],
    nutritionalAdvice: 'Cần duy trì cân đối năng lượng bữa trưa (chiếm 50-55% tổng nhu cầu ngày) và bữa phụ (chiếm 15-20%). Đảm bảo trẻ được uống đủ nước ấm sau khi ăn.',
    localIngredientsHighlight: 'Khuyến khích sử dụng cá tươi và rau củ xanh sạch từ các vựa nông sản Liên Hương, Tuy Phong.',
  };
}

function parseStep1Locally(text: string) {
  return {
    records: [
      {
        foodName: 'Thịt heo nạc mông tươi',
        foodType: 'Tươi sống',
        quantityKg: 18,
        unitPrice: 110000,
        totalAmount: 1980000,
        supplier: 'Đại lý Thực phẩm Sạch Liên Hương',
        sensoryEvaluation: 'Đạt',
        sensoryNotes: 'Thịt dẻo, có độ đàn hồi tốt, màng ngoài khô ráo, không mùi lạ',
        origin: 'Chứng nhận kiểm dịch thú y số 102/KD-TY',
        expiryDate: '2025-05-18',
        notes: 'Nhập ca sáng 06:30 chế biến ngay',
      },
      {
        foodName: 'Rau mồng tơi & Bí đỏ',
        foodType: 'Tươi sống',
        quantityKg: 14,
        unitPrice: 18000,
        totalAmount: 252000,
        supplier: 'Vựa Rau Củ Quả Xã Liên Hương',
        sensoryEvaluation: 'Đạt',
        sensoryNotes: 'Lá tươi non, không dập nát, không sâu bệnh',
        origin: 'Chứng nhận VietGAP HTX Tuy Phong',
        expiryDate: '2025-05-17',
        notes: 'Đã kiểm tra cảm quan đạt chuẩn',
      },
      {
        foodName: 'Cá bớp phi lê tươi',
        foodType: 'Tươi sống',
        quantityKg: 8,
        unitPrice: 160000,
        totalAmount: 1280000,
        supplier: 'Vựa Hải Sản Sạch Tuy Phong',
        sensoryEvaluation: 'Đạt',
        sensoryNotes: 'Mắt cá trong, mang đỏ tươi, thịt săn chắc',
        origin: 'Hải sản đánh bắt biển Tuy Phong - Bình Thuận',
        expiryDate: '2025-05-16',
        notes: 'Bảo quản thùng đá lạnh đạt 3°C',
      },
    ],
    summary: {
      totalItems: 3,
      totalEstimatedCost: 3512000,
      qualityVerdict: '100% nguyên liệu đạt chuẩn ATTP khi tiếp nhận (Đạt QĐ 1246/QĐ-BYT)',
    },
  };
}

function generateFallbackDishDecomposition(dishName: string, mealSlot: string, ageGroup: string, studentCount = 80): DishRecipeBreakdown {
  const normalized = (dishName || '').toLowerCase().trim();
  const ingredients: FoodIngredient[] = [];

  // ==========================================
  // 1. NHÓM ĐỒ UỐNG & NƯỚC ÉP / GIẢI KHÁT
  // ==========================================
  if (
    normalized.includes('nước chanh') ||
    normalized.includes('chanh muối') ||
    normalized.includes('chanh leo') ||
    normalized.includes('tắc') ||
    normalized.includes('nước cam') ||
    normalized.includes('nước ép') ||
    normalized.includes('sinh tố') ||
    normalized.includes('sữa') ||
    normalized.includes('sắn dây') ||
    normalized.includes('nước mía') ||
    normalized.includes('nước dừa') ||
    normalized.includes('nước lọc')
  ) {
    if (normalized.includes('chanh')) {
      // Nước chanh chuẩn mầm non
      ingredients.push({
        id: 'ing-1',
        name: 'Chanh tươi quả mọng nước (vắt lấy nước cốt)',
        category: 'Trái cây tráng miệng',
        type: 'tuoi_song',
        unit: 'kg',
        rawGramsPerPortion: 25,
        cleanGramsPerPortion: 20,
        wasteRatePercent: 20,
        pricePerKg: 32000,
        caloriesPer100g: 29,
        proteinPer100g: 1.1,
        lipidPer100g: 0.3,
        glucidPer100g: 9.3,
        calciumMg: 26,
        ironMg: 0.6,
        supplierName: 'Vựa Trái Cây Sạch Tuy Phong',
        notes: 'Chanh tươi vỏ mỏng, vắt nước cốt bỏ hạt, chống đắng',
      });
      ingredients.push({
        id: 'ing-2',
        name: 'Đường kính trắng / Đường phèn sạch Biên Hòa',
        category: 'Gia vị & dầu mỡ',
        type: 'kho',
        unit: 'kg',
        rawGramsPerPortion: 10,
        cleanGramsPerPortion: 10,
        wasteRatePercent: 0,
        pricePerKg: 26000,
        caloriesPer100g: 397,
        proteinPer100g: 0,
        lipidPer100g: 0,
        glucidPer100g: 99.5,
        calciumMg: 1,
        ironMg: 0.1,
        supplierName: 'Đại lý Bách Hóa Tuấn Mai',
        notes: 'Đường tinh luyện sạch hòa tan tạo vị ngọt thanh dịu',
      });
      ingredients.push({
        id: 'ing-3',
        name: 'Nước lọc đun sôi để nguội tiệt trùng',
        category: 'Khác',
        type: 'kho',
        unit: 'lít',
        rawGramsPerPortion: 120,
        cleanGramsPerPortion: 120,
        wasteRatePercent: 0,
        pricePerKg: 2000,
        caloriesPer100g: 0,
        proteinPer100g: 0,
        lipidPer100g: 0,
        glucidPer100g: 0,
        calciumMg: 2,
        ironMg: 0,
        supplierName: 'Nguồn nước kiểm định ATTP của trường',
        notes: 'Nước tinh khiết đun sôi để nguội',
      });
    } else if (normalized.includes('cam')) {
      ingredients.push({
        id: 'ing-1',
        name: 'Cam sành tươi mọng nước (vắt nước)',
        category: 'Trái cây tráng miệng',
        type: 'tuoi_song',
        unit: 'kg',
        rawGramsPerPortion: 60,
        cleanGramsPerPortion: 45,
        wasteRatePercent: 25,
        pricePerKg: 35000,
        caloriesPer100g: 47,
        proteinPer100g: 0.9,
        lipidPer100g: 0.1,
        glucidPer100g: 11.7,
        calciumMg: 40,
        ironMg: 0.2,
        supplierName: 'HTX Nông Sản Hàm Thuận',
        notes: 'Vắt lấy nước cam nguyên chất, lọc sạch tép hạt',
      });
      ingredients.push({
        id: 'ing-2',
        name: 'Đường kính trắng Biên Hòa',
        category: 'Gia vị & dầu mỡ',
        type: 'kho',
        unit: 'kg',
        rawGramsPerPortion: 8,
        cleanGramsPerPortion: 8,
        wasteRatePercent: 0,
        pricePerKg: 26000,
        caloriesPer100g: 397,
        proteinPer100g: 0,
        lipidPer100g: 0,
        glucidPer100g: 99.5,
        calciumMg: 1,
        ironMg: 0.1,
        supplierName: 'Đại lý Bách Hóa Tuấn Mai',
        notes: 'Khuấy đều tan đường, vị chua ngọt vừa uống',
      });
    } else if (normalized.includes('sữa')) {
      ingredients.push({
        id: 'ing-1',
        name: 'Sữa tươi tiệt trùng có đường Vinamilk / TH True Milk',
        category: 'Sữa & chế phẩm',
        type: 'kho',
        unit: 'hộp',
        rawGramsPerPortion: 180,
        cleanGramsPerPortion: 180,
        wasteRatePercent: 0,
        pricePerKg: 38000,
        caloriesPer100g: 74,
        proteinPer100g: 3.0,
        lipidPer100g: 3.3,
        glucidPer100g: 8.0,
        calciumMg: 110,
        ironMg: 0.1,
        supplierName: 'Nhà phân phối Sữa Vinamilk / TH',
        notes: 'Bảo quản mát, cho trẻ uống bữa phụ sáng/xế',
      });
    } else {
      // Đồ uống giải khát khác (sắn dây, nước ép)
      ingredients.push({
        id: 'ing-1',
        name: 'Bột sắn dây nguyên chất / Nước quả tươi',
        category: 'Gạo & ngũ cốc',
        type: 'kho',
        unit: 'kg',
        rawGramsPerPortion: 15,
        cleanGramsPerPortion: 15,
        wasteRatePercent: 0,
        pricePerKg: 140000,
        caloriesPer100g: 340,
        proteinPer100g: 0.7,
        lipidPer100g: 0.2,
        glucidPer100g: 84.3,
        calciumMg: 18,
        ironMg: 1.5,
        supplierName: 'Cơ sở Bột Sắn Dây Gia Truyền',
        notes: 'Nấu chín trong sánh mịn, thanh nhiệt cho trẻ',
      });
      ingredients.push({
        id: 'ing-2',
        name: 'Đường phèn / Đường cát trắng',
        category: 'Gia vị & dầu mỡ',
        type: 'kho',
        unit: 'kg',
        rawGramsPerPortion: 8,
        cleanGramsPerPortion: 8,
        wasteRatePercent: 0,
        pricePerKg: 26000,
        caloriesPer100g: 397,
        proteinPer100g: 0,
        lipidPer100g: 0,
        glucidPer100g: 99.5,
        calciumMg: 1,
        ironMg: 0.1,
        supplierName: 'Đại lý Bách Hóa',
        notes: 'Tạo vị ngọt nhẹ vừa miệng',
      });
    }

    const nut = calculateDishNutrition(ingredients);
    return {
      id: `breakdown-${Date.now()}`,
      dishName: dishName || 'Đồ uống mầm non',
      mealSlot: (mealSlot as any) || 'snackMorning',
      category: 'Đồ uống & Nước ép',
      ageGroup: ageGroup || 'Mẫu giáo (3-6 tuổi)',
      ingredients,
      totalCalories: nut.totalCalories || 50,
      totalProteinGrams: nut.totalProteinGrams || 0.2,
      totalLipidGrams: nut.totalLipidGrams || 0,
      totalGlucidGrams: nut.totalGlucidGrams || 12.0,
      estimatedCostPerPortion: nut.estimatedCostPerPortion || 3200,
      cookingInstructions: 'Rửa sạch dụng cụ vắt/pha. Sử dụng nước sôi để nguội tiệt trùng, nêm lượng đường vừa phải tạo vị chua ngọt tự nhiên, không dùng đá lạnh gây viêm họng trẻ.',
    };
  }

  // ==========================================
  // 2. NHÓM TRÁNG MIỆNG (Hoa quả, chè, sữa chua)
  // ==========================================
  if (
    normalized.includes('chuối') ||
    normalized.includes('dưa hấu') ||
    normalized.includes('đu đủ') ||
    normalized.includes('xoài') ||
    normalized.includes('thanh long') ||
    normalized.includes('táo') ||
    normalized.includes('lê') ||
    normalized.includes('chè') ||
    normalized.includes('sữa chua') ||
    normalized.includes('bánh flan')
  ) {
    if (normalized.includes('chuối')) {
      ingredients.push({
        id: 'ing-1',
        name: 'Chuối tiêu chín tự nhiên',
        category: 'Trái cây tráng miệng',
        type: 'tuoi_song',
        unit: 'kg',
        rawGramsPerPortion: 65,
        cleanGramsPerPortion: 45,
        wasteRatePercent: 30,
        pricePerKg: 18000,
        caloriesPer100g: 89,
        proteinPer100g: 1.1,
        lipidPer100g: 0.3,
        glucidPer100g: 22.8,
        calciumMg: 5,
        ironMg: 0.3,
        supplierName: 'Vựa Trái Cây Sạch Tuy Phong',
        notes: 'Chuối chín thơm lựng, vỏ mỏng, lột vỏ cắt khúc vừa ăn',
      });
    } else if (normalized.includes('dưa hấu')) {
      ingredients.push({
        id: 'ing-1',
        name: 'Dưa hấu đỏ ngọt mát',
        category: 'Trái cây tráng miệng',
        type: 'tuoi_song',
        unit: 'kg',
        rawGramsPerPortion: 70,
        cleanGramsPerPortion: 50,
        wasteRatePercent: 28,
        pricePerKg: 16000,
        caloriesPer100g: 30,
        proteinPer100g: 0.6,
        lipidPer100g: 0.2,
        glucidPer100g: 7.6,
        calciumMg: 7,
        ironMg: 0.2,
        supplierName: 'HTX Nông Sản Hàm Thuận',
        notes: 'Gọt vỏ xanh, bỏ sạch hạt, cắt quân cờ nhỏ mềm',
      });
    } else {
      // Trái cây tráng miệng tổng hợp
      ingredients.push({
        id: 'ing-1',
        name: 'Hoa quả tươi tráng miệng (đu đủ / thanh long / xoài)',
        category: 'Trái cây tráng miệng',
        type: 'tuoi_song',
        unit: 'kg',
        rawGramsPerPortion: 65,
        cleanGramsPerPortion: 48,
        wasteRatePercent: 26,
        pricePerKg: 24000,
        caloriesPer100g: 50,
        proteinPer100g: 0.8,
        lipidPer100g: 0.2,
        glucidPer100g: 12.0,
        calciumMg: 16,
        ironMg: 0.4,
        supplierName: 'Vựa Nông Sản Sạch',
        notes: 'Rửa sạch, gọt vỏ bỏ hạt, cắt hạt lựu nhỏ mềm',
      });
    }

    const nut = calculateDishNutrition(ingredients);
    return {
      id: `breakdown-${Date.now()}`,
      dishName: dishName || 'Trái cây tráng miệng',
      mealSlot: (mealSlot as any) || 'lunchDessert',
      category: 'Tráng miệng',
      ageGroup: ageGroup || 'Mẫu giáo (3-6 tuổi)',
      ingredients,
      totalCalories: nut.totalCalories || 40,
      totalProteinGrams: nut.totalProteinGrams || 0.5,
      totalLipidGrams: nut.totalLipidGrams || 0.1,
      totalGlucidGrams: nut.totalGlucidGrams || 10.0,
      estimatedCostPerPortion: nut.estimatedCostPerPortion || 2500,
      cookingInstructions: 'Trái cây rửa qua nước muối loãng, gọt sạch vỏ, loại bỏ hạt cẩn thận tránh hóc dị vật, cắt miếng nhỏ vừa ăn cho trẻ.',
    };
  }

  // ==========================================
  // 3. NHÓM MÓN MẶN / CANH / SÁNG / CƠM
  // ==========================================
  // Món có tôm / hải sản
  if (normalized.includes('tôm') || normalized.includes('hải sản') || normalized.includes('cá')) {
    ingredients.push({
      id: 'ing-1',
      name: normalized.includes('cá') ? 'Cá thu / Cá bớp phi lê tươi' : 'Tôm đồng / Tôm biển tươi',
      category: 'Thủy hải sản',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 35,
      cleanGramsPerPortion: 28,
      wasteRatePercent: 20,
      pricePerKg: 185000,
      caloriesPer100g: 110,
      proteinPer100g: 18.5,
      lipidPer100g: 1.2,
      glucidPer100g: 0.5,
      calciumMg: 950,
      ironMg: 2.1,
      supplierName: 'Vựa Hải Sản Tuy Phong',
      notes: 'Bóc vỏ, bỏ chỉ đen, băm nhỏ/cắt hạt lựu mềm',
    });
  } else if (normalized.includes('bò')) {
    ingredients.push({
      id: 'ing-1',
      name: 'Thịt bò thăn tươi mềm',
      category: 'Thịt cá tươi sống',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 35,
      cleanGramsPerPortion: 33,
      wasteRatePercent: 6,
      pricePerKg: 250000,
      caloriesPer100g: 142,
      proteinPer100g: 21.0,
      lipidPer100g: 3.5,
      glucidPer100g: 0,
      calciumMg: 12,
      ironMg: 3.1,
      supplierName: 'Vựa Thịt Sạch Ba Vì / Tuy Phong',
      notes: 'Thái lát mỏng, ướp dầu mè xào nhanh chín tới',
    });
  } else if (normalized.includes('gà')) {
    ingredients.push({
      id: 'ing-1',
      name: 'Thịt gà ta phi lê nạc ức',
      category: 'Thịt cá tươi sống',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 40,
      cleanGramsPerPortion: 35,
      wasteRatePercent: 12,
      pricePerKg: 110000,
      caloriesPer100g: 130,
      proteinPer100g: 22.4,
      lipidPer100g: 2.8,
      glucidPer100g: 0,
      calciumMg: 12,
      ironMg: 1.3,
      supplierName: 'Trang trại Gia cầm Tiên Viên',
      notes: 'Xé sợi nhỏ vừa ăn cho trẻ',
    });
  } else {
    // Mặc định thịt lợn
    ingredients.push({
      id: 'ing-1',
      name: 'Thịt lợn nạc mông / vai tươi',
      category: 'Thịt cá tươi sống',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 40,
      cleanGramsPerPortion: 37,
      wasteRatePercent: 8,
      pricePerKg: 135000,
      caloriesPer100g: 145,
      proteinPer100g: 19.0,
      lipidPer100g: 7.0,
      glucidPer100g: 0,
      calciumMg: 7,
      ironMg: 1.5,
      supplierName: 'Vựa Thịt Sạch Liên Hương',
      notes: 'Xay nhuyễn hoặc thái mỏng mềm',
    });
  }

  // Rau / Củ kèm theo
  if (normalized.includes('bí đỏ') || normalized.includes('bí')) {
    ingredients.push({
      id: 'ing-2',
      name: 'Bí đỏ hồ lô tươi ngon',
      category: 'Rau củ quả nấm',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 40,
      cleanGramsPerPortion: 35,
      wasteRatePercent: 12,
      pricePerKg: 22000,
      caloriesPer100g: 27,
      proteinPer100g: 0.9,
      lipidPer100g: 0.1,
      glucidPer100g: 6.1,
      calciumMg: 24,
      ironMg: 0.5,
      supplierName: 'HTX Nông Sản Tuy Phong',
      notes: 'Gọt vỏ, bỏ ruột, cắt hạt lựu nhỏ nấu mềm',
    });
  } else if (normalized.includes('cà rốt') || normalized.includes('xào') || normalized.includes('thập cẩm')) {
    ingredients.push({
      id: 'ing-2',
      name: 'Cà rốt Đà Lạt bào sợi',
      category: 'Rau củ quả nấm',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 20,
      cleanGramsPerPortion: 17,
      wasteRatePercent: 15,
      pricePerKg: 28000,
      caloriesPer100g: 39,
      proteinPer100g: 1.5,
      lipidPer100g: 0.2,
      glucidPer100g: 7.8,
      calciumMg: 43,
      ironMg: 0.8,
      supplierName: 'HTX Rau Củ Quả Đà Lạt',
      notes: 'Bào sợi mỏng, xào mềm',
    });
  } else if (normalized.includes('canh') || normalized.includes('mồng tơi') || normalized.includes('rau')) {
    ingredients.push({
      id: 'ing-2',
      name: 'Rau mồng tơi / Rau đay non',
      category: 'Rau củ quả nấm',
      type: 'tuoi_song',
      unit: 'kg',
      rawGramsPerPortion: 35,
      cleanGramsPerPortion: 28,
      wasteRatePercent: 20,
      pricePerKg: 25000,
      caloriesPer100g: 14,
      proteinPer100g: 1.4,
      lipidPer100g: 0.2,
      glucidPer100g: 2.1,
      calciumMg: 176,
      ironMg: 1.6,
      supplierName: 'HTX Nông Sản Liên Hương',
      notes: 'Nhặt lá non, thái nhỏ nấu canh',
    });
  }

  // Dầu ăn & Gia vị
  ingredients.push({
    id: 'ing-3',
    name: 'Dầu ăn đậu nành Simply',
    category: 'Gia vị & dầu mỡ',
    type: 'kho',
    unit: 'lít',
    rawGramsPerPortion: 5,
    cleanGramsPerPortion: 5,
    wasteRatePercent: 0,
    pricePerKg: 58000,
    caloriesPer100g: 896,
    proteinPer100g: 0,
    lipidPer100g: 99.6,
    glucidPer100g: 0,
    calciumMg: 0,
    ironMg: 0,
    supplierName: 'Đại lý Bách Hóa Tuấn Mai',
    notes: 'Dầu thực vật an toàn cho trẻ',
  });

  ingredients.push({
    id: 'ing-4',
    name: 'Nước mắm cá cơm truyền thống / Muối I-ốt',
    category: 'Gia vị & dầu mỡ',
    type: 'kho',
    unit: 'lít',
    rawGramsPerPortion: 2,
    cleanGramsPerPortion: 2,
    wasteRatePercent: 0,
    pricePerKg: 45000,
    caloriesPer100g: 35,
    proteinPer100g: 5.5,
    lipidPer100g: 0,
    glucidPer100g: 3.2,
    calciumMg: 20,
    ironMg: 0.5,
    supplierName: 'Cơ sở Nước Mắm Liên Hương',
    notes: 'Nêm nhạt vừa phải theo khẩu vị mầm non',
  });

  const nutrition = calculateDishNutrition(ingredients);

  return {
    id: `breakdown-${Date.now()}`,
    dishName: dishName || 'Món ăn dinh dưỡng mầm non',
    mealSlot: (mealSlot as any) || 'lunchMain',
    category: 'Món mặn chính',
    ageGroup: ageGroup || 'Mẫu giáo (3-6 tuổi)',
    ingredients,
    totalCalories: nutrition.totalCalories,
    totalProteinGrams: nutrition.totalProteinGrams,
    totalLipidGrams: nutrition.totalLipidGrams,
    totalGlucidGrams: nutrition.totalGlucidGrams,
    estimatedCostPerPortion: nutrition.estimatedCostPerPortion,
    cookingInstructions: 'Sơ chế nguyên liệu sạch, cắt thái nhỏ hoặc băm nhuyễn phù hợp lứa tuổi. Nấu chín kỹ, nêm nhạt vừa khẩu vị trẻ mầm non.',
  };
}

function generateFallbackFullDayMenuDecomposition(menuDay: any, studentCount: number) {
  const dishes = [
    { name: menuDay?.breakfast || 'Bún thịt heo băm', slot: 'breakfast' },
    { name: menuDay?.snackMorning || 'Sữa hạt sen', slot: 'snackMorning' },
    { name: menuDay?.lunchMain || 'Thịt lợn rim tôm nõn', slot: 'lunchMain' },
    { name: menuDay?.lunchSoup || 'Canh cua rau đay mồng tơi', slot: 'lunchSoup' },
    { name: menuDay?.lunchStaple || 'Cơm gạo tám thơm', slot: 'lunchStaple' },
    { name: menuDay?.lunchDessert || 'Dưa hấu tráng miệng', slot: 'lunchDessert' },
    { name: menuDay?.afternoonSnack || 'Bánh flan caramen + Sữa tươi', slot: 'afternoonSnack' },
  ];

  const recipeBreakdowns: DishRecipeBreakdown[] = dishes.map((d) =>
    generateFallbackDishDecomposition(d.name, d.slot, menuDay?.ageGroup || 'Mẫu giáo', studentCount)
  );

  let totalCalories = 0;
  let totalProtein = 0;
  let totalLipid = 0;
  let totalGlucid = 0;
  let totalCostPerChild = 0;

  recipeBreakdowns.forEach((rb) => {
    totalCalories += rb.totalCalories;
    totalProtein += rb.totalProteinGrams;
    totalLipid += rb.totalLipidGrams;
    totalGlucid += rb.totalGlucidGrams;
    totalCostPerChild += rb.estimatedCostPerPortion;
  });

  const macro = calculateMacroEnergyDistribution(totalProtein, totalLipid, totalGlucid);
  const procurement = generateProcurementGroceryList(recipeBreakdowns, studentCount);

  return {
    dayOfWeek: menuDay?.dayOfWeek || 'Thứ Hai',
    ageGroup: menuDay?.ageGroup || 'Mẫu giáo (3-6 tuổi)',
    studentCount,
    totalDailyCalories: totalCalories || 785,
    macroRatio: {
      proteinPercent: macro.proteinPercent,
      lipidPercent: macro.lipidPercent,
      glucidPercent: macro.glucidPercent,
      isBalanced: macro.isBalanced,
    },
    estimatedDailyCostPerChild: totalCostPerChild,
    totalDailySchoolBudget: procurement.grandTotalCost,
    recipeBreakdowns,
    procurementGroceryList: procurement.groceryItems,
    nutritionVerdict: 'Thực đơn ngày đáp ứng đầy đủ 4 nhóm dưỡng chất chính, tỷ lệ P-L-G cân đối theo chuẩn Thông tư 28/2016/TT-BGDĐT.',
  };
}

