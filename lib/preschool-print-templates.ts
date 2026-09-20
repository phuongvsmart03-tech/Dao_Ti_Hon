// lib/preschool-print-templates.ts
// Module xuất in và tạo template chuẩn theo đúng hồ sơ mẫu thực tế của trường mầm non

import {
  PreschoolAdminInfo,
  PreschoolTheme,
  WeekCurriculumPlan,
  DayLessonDetail,
} from './preschool-curriculum-data';

// SVG Corner Ornament for Certificate Frame
export const FLORAL_CORNER_SVG = `
<svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
  <path d="M10,10 C30,10 40,25 45,45 C25,40 10,30 10,10 Z" opacity="0.85"/>
  <path d="M10,10 C10,30 25,40 45,45 C40,25 30,10 10,10 Z" opacity="0.85"/>
  <path d="M12,12 L75,12 C60,18 50,30 45,45 C30,50 18,60 12,75 L12,12 Z" opacity="0.3"/>
  <circle cx="20" cy="20" r="5" />
  <circle cx="35" cy="18" r="3.5" />
  <circle cx="18" cy="35" r="3.5" />
  <path d="M5,5 L90,5 L90,10 L10,10 L10,90 L5,90 Z" />
  <path d="M12,12 L85,12 L85,14 L14,14 L14,85 L12,85 Z" />
</svg>
`;

export interface ThemeFullMatrixWeek {
  weekNumber: number;
  weekTitle: string;
  dateRangeStr: string;
  subThemeName: string;
  durationLabel: string;
  days: {
    dayName: string;
    dateStr: string;
    contentStr: string;
  }[];
}

export interface ThemeObjectiveRow {
  domainTitle: string;
  objectives: {
    mtCode: string;
    mtContent: string;
    eduContent: string;
    eduActivity: string;
  }[];
}

export interface ThemeEnvironmentData {
  themeTitle: string;
  durationWeeksStr: string;
  indoorMaterials: {
    classroom: string;
    learningMovement: string;
    corners: string;
    focusCorner: string;
    cornerCount: string;
  };
  outdoorMaterials: {
    landscape: string;
    outdoorToys: string;
    sandWaterNature: string;
    physicalDevelopment: string;
  };
  socialEnvironment: string[];
}

// Dữ liệu chuẩn cho Chủ Đề 7 (và dữ liệu nền tảng cho các chủ đề khác)
export const THEME_7_FULL_MATRIX_DATA: ThemeFullMatrixWeek[] = [
  {
    weekNumber: 1,
    weekTitle: 'Tuần 1',
    dateRangeStr: 'từ ngày 23/02 đến ngày 27/02/2026',
    subThemeName: 'Phương tiện giao thông đường bộ',
    durationLabel: '(1 tuần)',
    days: [
      {
        dayName: 'Hai',
        dateStr: '23/02/2026',
        contentStr: '- HĐKPKH: Khám phá về phương tiện giao thông đường bộ.(5E)',
      },
      {
        dayName: 'Ba',
        dateStr: '24/02/2026',
        contentStr: '- HĐÂN: DH: Đường em đi - NH: Ngã tư đường phố - TC: Đi đúng đường.',
      },
      {
        dayName: 'Tư',
        dateStr: '25/02/2026',
        contentStr: '- HĐLQTSĐ: Gộp 2 nhóm đối tượng và đếm.',
      },
      {
        dayName: 'Năm',
        dateStr: '26/02/2026',
        contentStr: '- HĐVH: Thơ “Xe chữa cháy”.(5E)',
      },
      {
        dayName: 'Sáu',
        dateStr: '27/02/2026',
        contentStr: '- HĐTD: Bò theo hướng thẳng, dích dắc.',
      },
    ],
  },
  {
    weekNumber: 2,
    weekTitle: 'Tuần 2',
    dateRangeStr: 'từ ngày 02/03 đến ngày 06/03/2026',
    subThemeName: 'Phương tiện giao thông đường thủy',
    durationLabel: '(1 tuần)',
    days: [
      {
        dayName: 'Hai',
        dateStr: '02/03/2026',
        contentStr: '- HĐKPKH: Khám phá về phương tiện giao thông đường thủy.(5E)',
      },
      {
        dayName: 'Ba',
        dateStr: '03/03/2026',
        contentStr: '- HĐTH: Vẽ, tô màu ô tô.(5E)',
      },
      {
        dayName: 'Tư',
        dateStr: '04/03/2026',
        contentStr: '- HĐLQTSĐ: Tách 1 nhóm thành 2 nhóm.',
      },
      {
        dayName: 'Năm',
        dateStr: '05/03/2026',
        contentStr: '- HĐVH: Truyện “Vì sao Thỏ cụt đuôi” (5E)',
      },
      {
        dayName: 'Sáu',
        dateStr: '06/03/2026',
        contentStr: '- HĐTD: Ném xa. TC: Ô tô và Chim sẻ.',
      },
    ],
  },
  {
    weekNumber: 3,
    weekTitle: 'Tuần 3',
    dateRangeStr: 'từ ngày 09/03 đến ngày 13/03/2026',
    subThemeName: 'Phương tiện giao thông đường sắt',
    durationLabel: '(1 tuần)',
    days: [
      {
        dayName: 'Hai',
        dateStr: '09/03/2026',
        contentStr: '- HĐKPKH: Khám phá về phương tiện giao thông đường sắt.(5E)',
      },
      {
        dayName: 'Ba',
        dateStr: '10/03/2026',
        contentStr: '- HĐÂN: DH: Đoàn tàu nhỏ - NH: Đường em đi - TC: Ai nhanh Nhất.',
      },
      {
        dayName: 'Tư',
        dateStr: '11/03/2026',
        contentStr: '- HĐLQTSĐ: So sánh giống nhau và khác nhau giữa các hình tròn, vuông, tam giác, chữ nhật.',
      },
      {
        dayName: 'Năm',
        dateStr: '12/03/2026',
        contentStr: '- HĐVH: Thơ “Đi chơi phố”(5E).',
      },
      {
        dayName: 'Sáu',
        dateStr: '13/03/2026',
        contentStr: '- HĐTD: Ném trúng đích thẳng đứng, chạy 12m.',
      },
    ],
  },
  {
    weekNumber: 4,
    weekTitle: 'Tuần 4',
    dateRangeStr: 'từ ngày 16/03 đến ngày 20/03/2026',
    subThemeName: 'Phương tiện giao thông đường hàng không',
    durationLabel: '(1 tuần)',
    days: [
      {
        dayName: 'Hai',
        dateStr: '16/03/2026',
        contentStr: '- HĐKPKH: Khám phá về phương tiện giao thông đường không.(5E)',
      },
      {
        dayName: 'Ba',
        dateStr: '17/03/2026',
        contentStr: '- HĐTH: Tô màu khinh khí cầu.(5E)',
      },
      {
        dayName: 'Tư',
        dateStr: '18/03/2026',
        contentStr: '- HĐLQTSĐ: Gộp tách nhóm có 4 đối tượng.',
      },
      {
        dayName: 'Năm',
        dateStr: '19/03/2026',
        contentStr: '- HĐVH: Truyện “Qua đường”.(5E)',
      },
      {
        dayName: 'Sáu',
        dateStr: '20/03/2026',
        contentStr: '- HĐTD: Bật tách khép chân qua 3 ô. TC: Ô tô và Chim sẻ.',
      },
    ],
  },
];

// Dữ liệu mẫu Kế hoạch nội dung giáo dục chủ đề & Môi trường giáo dục
export const THEME_7_OBJECTIVES_DATA: ThemeObjectiveRow[] = [
  {
    domainTitle: 'I. Giáo dục phát triển thể chất',
    objectives: [
      {
        mtCode: 'MT3.1',
        mtContent: 'Đi hết đoạn đường hẹp.',
        eduContent: '- Cháu thực hiện các bài tập phát triển chung.\n- Cháu đi trong đường hẹp thành thạo.',
        eduActivity: '* Hoạt động thể dục sáng: Trẻ tập thành thạo các động tác: Tay, chân, bụng, bật.\n* Hoạt động học: Cháu tập các bài tập phát triển chung.',
      },
      {
        mtCode: 'MT8',
        mtContent: 'Phối hợp được cử động bàn tay, ngón tay trong một số các hoạt động.',
        eduContent: '- Trẻ lắp ghép các hình, xé cắt đường thẳng – tô vẽ hình.\n- Trẻ biết cài, cởi cúc xâu buộc dây.',
        eduActivity: '* Hoạt động chơi: Trẻ chơi các trò chơi khu thể chất.\n* Hoạt động học: Bò theo hướng thẳng, dích dắc; Ném xa; Ném trúng đích thẳng đứng, chạy 12m; Bật tách khép chân qua 3 ô.',
      },
    ],
  },
  {
    domainTitle: 'II. Giáo dục phát triển nhận thức',
    objectives: [
      {
        mtCode: 'MT18',
        mtContent: 'Quan tâm hứng thú với các sự vật, hiện tượng gần gũi như chăm chú quan sát sự vật, hiện tượng hay đặt câu hỏi về đối tượng.',
        eduContent: '- Trẻ biết quan tâm đến sự thay đổi của các hiện tượng xung quanh.\n- Trẻ biết đặt ra những câu hỏi về sự thay đổi đó.',
        eduActivity: '* Đón trẻ, họp mặt: Nhận ra sự thay đổi trong lớp qua tranh ảnh về chủ đề: “Bé đi đường an toàn”.',
      },
      {
        mtCode: 'MT25',
        mtContent: 'So sánh số lượng hai nhóm đối tượng trong phạm vi 5 bằng các cách khác nhau và nói được các từ: bằng nhau, nhiều hơn, ít hơn.',
        eduContent: '- Trẻ biết so sánh hai nhóm đối tượng trong phạm vi 5.\n- Trẻ dùng đúng các từ như nhiều hơn ít hơn, bằng nhau.',
        eduActivity: '* Hoạt động chơi: Trẻ biết đếm các đồ dùng, đồ chơi với số lượng là 5. Trẻ biết so sánh dùng từ nhiều hơn, ít hơn.',
      },
      {
        mtCode: 'MT30',
        mtContent: 'Sử dụng lời nói và hành động để chỉ vị trí đối tượng trong không gian so với bản thân.',
        eduContent: '- Sử dụng lời nói và hành động để chỉ vị trí đối tượng trong không gian so với bản thân.\n- Sử dụng lời nói và hành động để chỉ vị trí đối tượng.',
        eduActivity: '* Hoạt động chơi: Trẻ nhận xét được mối quan hệ đơn giản của sự vật, hiện tượng. Trẻ chơi vui vẻ, đúng luật cùng các bạn.\n* Đón trẻ, thể dục sáng: Trẻ thực hiện các bài tập phát triển chung.\n* Hoạt động học: Nhận ra đặc điểm khác nhau của xe đạp, xe máy,... Biết các luật giao thông phổ biến.\n- Khám phá khoa học: Khám phá về PTGT đường bộ, đường thủy, đường sắt, hàng không.',
      },
    ],
  },
  {
    domainTitle: 'III. Giáo dục phát triển ngôn ngữ',
    objectives: [
      {
        mtCode: 'MT38',
        mtContent: 'Nói rõ tiếng.',
        eduContent: '- Nói rõ từ khi giao tiếp\n- Nói rõ những gì mình mong muốn khi diễn đạt.',
        eduActivity: '* Đón trẻ, họp mặt sáng: Trẻ phụ cô những công việc trực nhật: cất đồ dùng cá nhân đúng quy định.\n* Giờ học: Đọc thơ: Đi chơi phố; Xe chữa cháy... Truyện: Vì sao Thỏ cụt đuôi; Bò mẹ, bê con...',
      },
    ],
  },
  {
    domainTitle: 'IV. Giáo dục phát triển tình cảm và kĩ năng xã hội',
    objectives: [
      {
        mtCode: 'MT49',
        mtContent: 'Mạnh dạn tham gia vào các hoạt động, trả lời câu hỏi.',
        eduContent: '- Lắng nghe và trả lời được câu hỏi của người đối thoại.\n- Lắng nghe và nhận xét ý kiến của người đối thoại.',
        eduActivity: '* Hoạt động học: Trẻ không giành đồ chơi với bạn.\n* Hoạt động góc: Trẻ chơi góc mà trẻ thích. Không giành đồ chơi với bạn.',
      },
      {
        mtCode: 'MT50',
        mtContent: 'Cố gắng thực hiện công việc đơn giản được giao. (CS31)',
        eduContent: '- Trẻ thực hiện những việc đơn giản theo trình tự thời gian.\n- Ví như: sáng học, trưa ăn cơm, chiều về với mẹ, tối xem phim...',
        eduActivity: '* Hoạt động chơi: Trẻ chơi các trò chơi về toán ở ngoài trời.\n- Tự nhặt rác bỏ vào thùng rác.',
      },
    ],
  },
  {
    domainTitle: 'V. Giáo dục phát triển thẩm mĩ',
    objectives: [
      {
        mtCode: 'MT60',
        mtContent: 'Chú ý nghe, thích thú, vỗ tay, nhún nhảy, lắc lư theo bài hát, bản nhạc; Thích nghe và đọc thơ đồng dao, ca dao, tục ngữ; thích nghe và kể câu chuyện.',
        eduContent: '- Trẻ chú ý nghe, thích thú, vỗ tay, nhún nhảy, lắc lư theo bài hát, bản nhạc.\n- Thích nghe và đọc thơ đồng dao, ca dao, tục ngữ; thích nghe và kể câu chuyện.',
        eduActivity: '* Hoạt động chơi: Trẻ thích hát các bài hát chủ đề: “Bé đi đường an toàn”.\n- Trẻ vẽ các phương tiện giao thông.\n* Hoạt động học: Trẻ hát được bài hát: Đường em đi; Đoàn tàu nhỏ...\n- Trẻ vẽ tô màu ô tô; Khinh khí cầu.',
      },
      {
        mtCode: 'MT63',
        mtContent: 'Sử dụng các nguyên vật liệu tạo hình để tạo ra sản phẩm theo sự gợi ý.',
        eduContent: '- Sử dụng các nguyên vật liệu mở để tạo ra các sản phẩm tạo hình.\n- Tạo ra sản phẩm tạo hình theo sự gợi ý giáo viên.',
        eduActivity: '* Hoạt động học: Thể hiện sự thích thú khi tạo ra những sản phẩm đẹp.\n- Thể hiện yêu thích khi xem các sản phẩm tạo ra.\n* Hoạt động chơi: Hát các bài hát chủ đề: “Bé đi đường an toàn”.',
      },
    ],
  },
];

export const THEME_7_ENVIRONMENT_DATA: ThemeEnvironmentData = {
  themeTitle: 'CHỦ ĐỀ 7: BÉ ĐI ĐƯỜNG AN TOÀN',
  durationWeeksStr: '4 tuần (từ ngày 23/02/2026 đến ngày 20/03/2026)',
  indoorMaterials: {
    classroom:
      'Thoáng mát, sạch sẽ, đủ ánh sáng; có cây xanh; có kệ để đồ chơi; có đủ bàn ghế cho học sinh học tập. Giáo viên trang trí lớp học đẹp mắt. Có đầy đủ đồ dùng đồ chơi trường mua sắm hoặc giáo viên tự làm bằng nguyên vật liệu mở để dạy hoặc cho trẻ chơi.',
    learningMovement:
      '• Giấy các loại: Xé-dán, gấp, cuộn thành quả bóng, bông hoa... trang trí lớp.\n• Các loại dây và các loại hột, hạt: Sợi len, dải lụa, sợi gai, dây nyion, dây chun để thắt, cột, đan, tết xỏ.. các loại đồ dùng đồ chơi ở lớp học của bé.\n• Nhạc cụ dành cho trẻ: Trống đàn, piano...\n• Kéo, bút chì, cọ vẽ, phấn vẽ, ống hút, rối tay..\n• Thực hiện các chuyển động tích cực của ngón tay theo nhịp điệu của trò chơi kèm theo lời thơ, đồng dao..',
    corners:
      'Được lựa chọn bố trí phù hợp với diện tích lớp học, số lượng trẻ và đồ dùng, đồ chơi vật liệu chơi sẵn có. Trẻ biết gọi tên và sắp đặt đồ dùng, đồ chơi, vật liệu chơi của mỗi góc phù hợp, sắp xếp hợp lí thân thiện, lôi cuốn sự chú ý của trẻ.',
    focusCorner:
      '“Xây ngã tư đường phố”, “xây dựng bến đỗ xe” để giáo dục cho trẻ biết bảo quản đồ dùng như: tranh ảnh và các con vật đảm bảo tình đoàn kết ở trẻ, phát huy được trí tưởng tượng về số đếm, so sánh số lượng đồ dùng trong lớp.',
    cornerCount:
      '5 góc:\n• Góc học tập: Trẻ thực hiện tốt các hoạt động xé dán ô tô, vẽ và tô màu tàu hỏa...\n• Góc phân vai: Trẻ thực hiện tốt các vai chơi như: Chú cảnh sát giao thông, người bán các loại xe máy.\n• Góc xây dựng: Trẻ xây dựng được ngã tư đường phố, bến đỗ xe và biết nêu lên nhận xét của mình khi xây dựng các công trình.\n• Góc âm nhạc: Trẻ hát múa các bài hát về chủ đề “Bé đi đường an toàn”\n• Góc khám phá: Biết pha các loại nước',
  },
  outdoorMaterials: {
    landscape:
      'Tạo khoảng không gian cho từng khu vực trong sân trường.\n• Khu vực cây cảnh: Các loại cây có bóng mát, vườn hoa, vườn rau, cỏ. Chọn các loại cây gần gũi với trẻ như: Cây me tây, cây bàng...\n• Xung quanh cây cô bố trí thêm ghế đá để trẻ ngồi chơi hoặc ngồi nghe cô kể chuyện ngoài trời.\n• Cô tạo cho trẻ khu vực vườn hoa để trẻ quan sát dễ dàng nhận biết các loại hoa và gọi tên.',
    outdoorToys:
      'Cô cho trẻ sử dụng thêm đồ dùng để trẻ chơi phong phú ở hoạt động ngoài trời như: Lâu đài cầu tuột, bập bênh, xích đu......Qua hoạt động các đồ chơi trẻ sẽ rèn luyện tố chất nhanh nhẹn, khéo léo, sự phối hợp nhịp nhàng của các vận động. Đảm bảo an toàn cho trẻ nằm trong tầm kiểm soát của giáo viên khi trẻ chơi để dễ dàng thực hiện.',
    sandWaterNature:
      'Khu vực này kích thích trẻ các hoạt động khám phá khoa học các đề tài về ngành nghề và làm những thí nghiệm đơn giản nên cô chuẩn bị vật liệu cát mịn, sỏi, bể nước, xẻng, chai lọ, hộp, khuôn hình, ô tô tải, rổ, thìa, bát...ở khu vực này trẻ được đong đo nước, xúc cát, làm các thí nghiệm cát khô, cát ướt, vật chìm, vật nổi....',
    physicalDevelopment:
      'Sân đá bóng: trồng cỏ nhân tạo; Trang bị xà ngang, bóng, quần áo thể thao, còi, giày... Đồ chơi bằng nguyên vật liệu mở: Bánh xe cho trẻ chui, bò, nhảy...; chai nước khoáng làm các con vật; hộp sữa trang trí các đường viền...',
  },
  socialEnvironment: [
    'Biết được ngày 8/03/2026 là ngày phụ nữ Việt Nam.',
    'Biết trong lớp có cô giáo và các bạn cùng nhau học và vui chơi, phát huy tinh thần đoàn kết cùng với bạn bè.',
    'Rèn cho trẻ kĩ năng tự phục vụ bản thân như: quét lớp, lau chùi bàn ghế, xếp chăn gối, rửa mặt, rửa tay, vệ sinh,...',
    'Trẻ biết kĩ năng giao tiếp: hành vi ứng xử văn hóa khi tham gia giao thông.',
    'An toàn cho trẻ là yêu cầu số 1: Khi mỗi thứ đồ chơi cô cho trẻ chơi phải đảm bảo sự an toàn cho trẻ ví dụ: xe máy, xe đạp...',
    'Đảm bảo cho trẻ về mặt tâm lí, tạo thuận lợi giáo dục các kĩ năng xã hội cho trẻ.',
    'Trẻ thường xuyên giao tiếp thể hiện sự thân thiện giữa trẻ và trẻ; giữa trẻ với người xung quanh.',
    'Hành vi, cử chỉ của giáo viên đối với trẻ, đối với người xung quanh luôn mẫu mực cho trẻ noi theo.',
  ],
};

// ==========================================
// 1. GENERATE TRANG BÌA (Cover Page)
// ==========================================
export function generateCoverPageHtml(
  adminInfo: PreschoolAdminInfo,
  themeTitle: string = 'QUYỂN 7: BÉ ĐI ĐƯỜNG AN TOÀN',
  ageGroup: string = '3 - 4 TUỔI'
): string {
  return `
  <div class="official-cover-page" style="position: relative; width: 100%; min-height: 270mm; border: 4px double #000; padding: 25px 30px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; text-align: center; background: #fff; page-break-after: always; break-after: page;">
    <!-- Decorative Floral Corner Top-Left -->
    <div style="position: absolute; top: 8px; left: 8px; width: 55px; height: 55px; color: #000;">
      ${FLORAL_CORNER_SVG}
    </div>
    <!-- Decorative Floral Corner Top-Right -->
    <div style="position: absolute; top: 8px; right: 8px; width: 55px; height: 55px; transform: scaleX(-1); color: #000;">
      ${FLORAL_CORNER_SVG}
    </div>
    <!-- Decorative Floral Corner Bottom-Left -->
    <div style="position: absolute; bottom: 8px; left: 8px; width: 55px; height: 55px; transform: scaleY(-1); color: #000;">
      ${FLORAL_CORNER_SVG}
    </div>
    <!-- Decorative Floral Corner Bottom-Right -->
    <div style="position: absolute; bottom: 8px; right: 8px; width: 55px; height: 55px; transform: scale(-1); color: #000;">
      ${FLORAL_CORNER_SVG}
    </div>

    <!-- Header Section -->
    <div style="margin-top: 15px;">
      <div style="font-size: 15px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">
        ${adminInfo.unitName}
      </div>
      <div style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 4px; text-decoration: underline; text-underline-offset: 4px;">
        ${adminInfo.schoolName}
      </div>
    </div>

    <!-- Center Main Title -->
    <div style="margin: 40px 0;">
      <h1 style="font-size: 26px; font-weight: 800; line-height: 1.4; text-transform: uppercase; margin: 0; padding: 0;">
        KẾ HOẠCH CHĂM SÓC &amp; GIÁO DỤC<br/>
        TRẺ ${ageGroup}
      </h1>

      <div style="margin-top: 35px; font-size: 18px; font-weight: bold; font-style: italic; line-height: 1.6;">
        GIÁO VIÊN: ${adminInfo.teachers.split(',').map((t) => t.trim().toUpperCase()).join('<br/>')}
      </div>
    </div>

    <!-- Bottom Theme Info -->
    <div style="margin-bottom: 25px;">
      <div style="font-size: 18px; font-style: italic; font-weight: 600; margin-bottom: 12px;">
        LỚP: ${ageGroup.toLowerCase()}
      </div>
      <div style="font-size: 22px; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: 0.5px;">
        ${themeTitle.startsWith('QUYỂN') ? themeTitle : `QUYỂN: ${themeTitle}`}
      </div>
      <div style="margin-top: 25px; font-size: 14px; font-weight: 600;">
        Năm học: ${adminInfo.schoolYear}
      </div>
    </div>
  </div>
  `;
}

// ==========================================
// 2. GENERATE THỜI KHÓA BIỂU & THỜI GIAN BIỂU
// ==========================================
export function generateTimetableAndScheduleHtml(
  adminInfo: PreschoolAdminInfo,
  ageGroup: string = '3-4 TUỔI'
): string {
  return `
  <div class="official-schedule-page" style="page-break-after: always; break-after: page; margin-bottom: 20px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      
      <!-- Frame 1: Thời khóa biểu -->
      <div style="border: 2px solid #000; padding: 14px 16px; position: relative; background: #fff; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="text-align: center; margin-bottom: 12px;">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase;">${adminInfo.unitName}</div>
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; text-decoration: underline;">${adminInfo.schoolName}</div>
            <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin-top: 14px; margin-bottom: 10px;">
              THỜI KHÓA BIỂU KHỐI ${ageGroup}
            </h2>
          </div>

          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11.5px; border: 1px solid #000;">
            <thead>
              <tr style="background: #f8fafc; text-align: center; font-weight: bold;">
                <th style="border: 1px solid #000; padding: 6px 4px; width: 16%;">Thứ</th>
                <th style="border: 1px solid #000; padding: 6px 4px; width: 16%;">Tiết</th>
                <th style="border: 1px solid #000; padding: 6px 6px;">Hoạt động giáo dục trong 1 ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center; font-weight: bold;">Hai</td>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center;">1 tiết</td>
                <td style="border: 1px solid #000; padding: 8px 6px; line-height: 1.4;">
                  - Hoạt động khám phá xã hội<br/>
                  - Hoạt động khám phá khoa học<br/>
                  - Kỹ năng xã hội
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center; font-weight: bold;">Ba</td>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center;">1 tiết</td>
                <td style="border: 1px solid #000; padding: 8px 6px; line-height: 1.4;">
                  - Hoạt động tạo hình<br/>
                  - Hoạt động âm nhạc
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center; font-weight: bold;">Tư</td>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center;">1 tiết</td>
                <td style="border: 1px solid #000; padding: 8px 6px; line-height: 1.4;">
                  - Hoạt động làm quen toán sơ đẳng
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center; font-weight: bold;">Năm</td>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center;">1 tiết</td>
                <td style="border: 1px solid #000; padding: 8px 6px; line-height: 1.4;">
                  - Thơ<br/>
                  - Truyện<br/>
                  - Phát triển ngôn ngữ: Làm quen các từ để hỏi
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center; font-weight: bold;">Sáu</td>
                <td style="border: 1px solid #000; padding: 8px 4px; text-align: center;">1 tiết</td>
                <td style="border: 1px solid #000; padding: 8px 6px; line-height: 1.4;">
                  - Hoạt động vận động
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="text-align: center; font-size: 12px; font-weight: bold; margin-top: 20px;">
          Năm học: ${adminInfo.schoolYear}
        </div>
      </div>

      <!-- Frame 2: Thời gian biểu -->
      <div style="border: 2px solid #000; padding: 14px 16px; position: relative; background: #fff; min-height: 250mm; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="text-align: center; margin-bottom: 12px;">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase;">${adminInfo.unitName}</div>
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; text-decoration: underline;">${adminInfo.schoolName}</div>
            <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin-top: 14px; margin-bottom: 10px;">
              THỜI GIAN BIỂU
            </h2>
          </div>

          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11.5px; border: 1px solid #000;">
            <thead>
              <tr style="background: #f8fafc; text-align: center; font-weight: bold;">
                <th style="border: 1px solid #000; padding: 6px 4px; width: 44%;">Thời gian</th>
                <th style="border: 1px solid #000; padding: 6px 6px;">Hoạt động giáo dục trong 1 ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">6h 45 phút - 8h 00 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Đón trẻ, chơi, thể dục sáng</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">8h 00 phút - 8h 40 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold;">Hoạt động học</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">8h 40 phút - 9h 20 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Chơi và các hoạt động góc</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">9h 20 phút - 10h 00 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Hoạt động ngoài trời</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">10h 00 phút - 11h10 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Vệ sinh ăn bữa chính</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">11h10 phút - 14h00 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Ngủ trưa</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">14h00 phút - 14h40 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Ăn bữa phụ, vệ sinh</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">14h40 phút - 15h40 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Hoạt động chiều, chơi</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 5px 6px; font-weight: bold; text-align: center;">15h40 phút - 17h00 phút</td>
                <td style="border: 1px solid #000; padding: 5px 6px;">Nêu gương chuẩn bị ra về, trả trẻ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="text-align: center; font-size: 12px; font-weight: bold; margin-top: 20px;">
          Năm học: ${adminInfo.schoolYear}
        </div>
      </div>

    </div>
  </div>
  `;
}

// ==========================================
// 3. GENERATE MA TRẬN 4 TUẦN TOÀN CHỦ ĐỀ (Images 1 & 2)
// ==========================================
export function generateFourWeeksMatrixHtml(
  adminInfo: PreschoolAdminInfo,
  themeTitle: string = 'CHỦ ĐỀ 7: BÉ ĐI ĐƯỜNG AN TOÀN (4 tuần)',
  ageGroup: string = '3-4 tuổi',
  weeksData: ThemeFullMatrixWeek[] = THEME_7_FULL_MATRIX_DATA
): string {
  // Render each week rows
  const rowsHtml = weeksData
    .map((week, wIdx) => {
      const daysCount = week.days.length;
      return week.days
        .map((day, dIdx) => {
          let leftColsHtml = '';
          if (wIdx === 0 && dIdx === 0) {
            const totalDaysCount = weeksData.reduce((acc, w) => acc + w.days.length, 0);
            leftColsHtml += `<td rowspan="${totalDaysCount}" style="border: 1px solid #000; padding: 8px 4px; text-align: center; font-weight: bold; vertical-align: middle; width: 10%;">${ageGroup}</td>`;
          }
          if (dIdx === 0) {
            leftColsHtml += `
            <td rowspan="${daysCount}" style="border: 1px solid #000; padding: 8px 4px; text-align: center; vertical-align: middle; width: 14%; font-weight: bold; line-height: 1.35;">
              ${week.weekTitle}<br/>
              <span style="font-weight: normal; font-size: 10.5px;">${week.dateRangeStr}</span>
            </td>
            <td rowspan="${daysCount}" style="border: 1px solid #000; padding: 8px 4px; text-align: center; vertical-align: middle; width: 15%; font-weight: bold; line-height: 1.35;">
              ${week.subThemeName}<br/>
              <span style="font-weight: normal; font-size: 10.5px;">${week.durationLabel}</span>
            </td>
          `;
          }

          return `
          <tr>
            ${leftColsHtml}
            <td style="border: 1px solid #000; padding: 5px 4px; text-align: center; width: 12%; font-weight: bold; line-height: 1.25;">
              ${day.dayName}<br/>
              <span style="font-weight: normal; font-size: 10.5px;">${day.dateStr}</span>
            </td>
            <td style="border: 1px solid #000; padding: 5px 8px; text-align: left; line-height: 1.35;">
              ${day.contentStr}
            </td>
          </tr>
        `;
        })
        .join('');
    })
    .join('');

  return `
  <div class="official-theme-matrix-page" style="page-break-after: always; break-after: page; margin-bottom: 24px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <div style="text-align: left;">
        <div style="font-size: 11px; font-weight: bold; text-transform: uppercase;">${adminInfo.unitName}</div>
        <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; text-decoration: underline;">${adminInfo.schoolName}</div>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 14px;">
      <h2 style="font-size: 15px; font-weight: 800; text-transform: uppercase; margin: 0;">
        KẾ HOẠCH GIÁO DỤC
      </h2>
      <h3 style="font-size: 13.5px; font-weight: 800; text-transform: uppercase; margin: 4px 0 0 0;">
        ${themeTitle}
      </h3>
    </div>

    <!-- Table -->
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #000;">
      <thead>
        <tr style="background: #f8fafc; text-align: center; font-weight: bold;">
          <th style="border: 1px solid #000; padding: 6px 4px; width: 10%;">Lớp</th>
          <th style="border: 1px solid #000; padding: 6px 4px; width: 14%;">Thời gian</th>
          <th style="border: 1px solid #000; padding: 6px 4px; width: 15%;">Chủ đề nhánh</th>
          <th colspan="2" style="border: 1px solid #000; padding: 6px 6px;">Kế hoạch nội dung</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>
  `;
}

// ==========================================
// 4. GENERATE KẾ HOẠCH NỘI DUNG & MÔI TRƯỜNG GIÁO DỤC (Image 5)
// ==========================================
export function generateThemeObjectivesAndEnvironmentHtml(
  adminInfo: PreschoolAdminInfo,
  themeTitle: string = 'CHỦ ĐỀ 7: BÉ ĐI ĐƯỜNG AN TOÀN',
  durationStr: string = '4 tuần (từ ngày 23/02 đến ngày 20/03/2026)',
  objectivesData: ThemeObjectiveRow[] = THEME_7_OBJECTIVES_DATA,
  envData: ThemeEnvironmentData = THEME_7_ENVIRONMENT_DATA
): string {
  const objRowsHtml = objectivesData
    .map((domain) => {
      const headerRow = `
      <tr style="background: #f1f5f9; font-weight: bold;">
        <td colspan="3" style="border: 1px solid #000; padding: 5px 8px; text-transform: uppercase; font-size: 11px;">
          ${domain.domainTitle}
        </td>
      </tr>
    `;
      const itemRows = domain.objectives
        .map(
          (item) => `
      <tr>
        <td style="border: 1px solid #000; padding: 5px 6px; width: 28%; vertical-align: top; font-size: 11px; line-height: 1.35;">
          <strong>${item.mtCode}:</strong> ${item.mtContent}
        </td>
        <td style="border: 1px solid #000; padding: 5px 6px; width: 34%; vertical-align: top; font-size: 11px; line-height: 1.35; white-space: pre-line;">
          ${item.eduContent}
        </td>
        <td style="border: 1px solid #000; padding: 5px 6px; width: 38%; vertical-align: top; font-size: 11px; line-height: 1.35; white-space: pre-line;">
          ${item.eduActivity}
        </td>
      </tr>
    `
        )
        .join('');
      return headerRow + itemRows;
    })
    .join('');

  const socialEnvListHtml = envData.socialEnvironment
    .map((item) => `<p style="margin: 3px 0 3px 12px; line-height: 1.35;">- ${item}</p>`)
    .join('');

  return `
  <div class="official-theme-objectives-page" style="page-break-after: always; break-after: page; margin-bottom: 24px;">
    <!-- Title -->
    <div style="text-align: center; margin-bottom: 12px;">
      <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 0;">
        KẾ HOẠCH NỘI DUNG GIÁO DỤC
      </h2>
      <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; margin: 3px 0 0 0;">
        ${themeTitle}
      </h3>
      <div style="font-size: 11px; font-style: italic; margin-top: 2px;">
        Thời gian thực hiện: ${durationStr}
      </div>
    </div>

    <!-- Table of Objectives -->
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #000; margin-bottom: 16px;">
      <thead>
        <tr style="background: #f8fafc; text-align: center; font-weight: bold;">
          <th style="border: 1px solid #000; padding: 5px 4px; width: 28%;">MỤC TIÊU GIÁO DỤC</th>
          <th style="border: 1px solid #000; padding: 5px 4px; width: 34%;">NỘI DUNG GIÁO DỤC</th>
          <th style="border: 1px solid #000; padding: 5px 4px; width: 38%;">HOẠT ĐỘNG GIÁO DỤC</th>
        </tr>
      </thead>
      <tbody>
        ${objRowsHtml}
      </tbody>
    </table>

    <!-- Môi Trường Giáo Dục -->
    <div style="margin-top: 16px; border-top: 1px dashed #000; padding-top: 12px;">
      <div style="text-align: center; margin-bottom: 10px;">
        <h3 style="font-size: 13.5px; font-weight: 800; text-transform: uppercase; margin: 0;">
          MÔI TRƯỜNG GIÁO DỤC
        </h3>
        <h4 style="font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 2px 0 0 0;">
          ${envData.themeTitle}
        </h4>
        <div style="font-size: 11px; font-style: italic;">
          Thời gian thực hiện: ${envData.durationWeeksStr}
        </div>
      </div>

      <div style="font-size: 11px; line-height: 1.4; text-align: justify;">
        <p style="font-weight: bold; margin: 6px 0 2px 0;">I/ Môi trường vật chất:</p>
        <p style="font-weight: bold; margin: 4px 0 2px 8px;">1/ Môi trường giáo dục vật chất bên trong lớp:</p>
        <div style="margin-left: 14px;">
          <p style="margin: 2px 0;"><strong>* Lớp học:</strong> ${envData.indoorMaterials.classroom}</p>
          <p style="margin: 2px 0; white-space: pre-line;"><strong>* Học tập và vận động:</strong>\n${envData.indoorMaterials.learningMovement}</p>
          <p style="margin: 2px 0;"><strong>* Các góc chơi:</strong> ${envData.indoorMaterials.corners}</p>
          <p style="margin: 2px 0;"><strong>- Mô hình góc có làm nổi bật góc trọng tâm như:</strong> ${envData.indoorMaterials.focusCorner}</p>
          <p style="margin: 2px 0; white-space: pre-line;"><strong>- Số góc đa dạng:</strong> ${envData.indoorMaterials.cornerCount}</p>
        </div>

        <p style="font-weight: bold; margin: 8px 0 2px 8px;">2/ Môi trường giáo dục vật chất bên ngoài lớp:</p>
        <div style="margin-left: 14px;">
          <p style="margin: 2px 0; white-space: pre-line;">${envData.outdoorMaterials.landscape}</p>
          <p style="margin: 2px 0;"><strong>+ Khu vực các thiết bị đồ chơi ngoài trời:</strong> ${envData.outdoorMaterials.outdoorToys}</p>
          <p style="margin: 2px 0;"><strong>+ Khu vực chơi với cát nước và các vật liệu thiên nhiên:</strong> ${envData.outdoorMaterials.sandWaterNature}</p>
          <p style="margin: 2px 0;"><strong>+ Khu hoạt động phát triển thể chất:</strong> ${envData.outdoorMaterials.physicalDevelopment}</p>
        </div>

        <p style="font-weight: bold; margin: 8px 0 2px 0;">II/ Môi trường xã hội:</p>
        <div style="margin-left: 8px;">
          ${socialEnvListHtml}
        </div>
      </div>
    </div>
  </div>
  `;
}

// ==========================================
// 5. GENERATE KẾ HOẠCH TUẦN CHI TIẾT (7 Thời Điểm) (Image 6)
// ==========================================
export function generateDetailedWeekPlan7TimepointsHtml(
  weekPlan: WeekCurriculumPlan,
  adminInfo: PreschoolAdminInfo
): string {
  const datesHeader = weekPlan.scheduleMatrix
    .map(
      (m) =>
        `<th style="border: 1px solid #000; padding: 6px 4px; width: 17%; text-align: center; font-weight: bold;">
          Thứ ${m.dayOfWeek.toLowerCase() === 'hai' ? 'hai' : m.dayOfWeek.toLowerCase() === 'ba' ? 'ba' : m.dayOfWeek.toLowerCase() === 'tư' ? 'tư' : m.dayOfWeek.toLowerCase() === 'năm' ? 'năm' : 'sáu'}<br/>
          <span style="font-weight: normal; font-size: 10px;">(${m.date})</span>
        </th>`
    )
    .join('');

  return `
  <div class="official-week-detailed-page" style="page-break-after: always; break-after: page; margin-bottom: 24px;">
    <!-- Title -->
    <div style="text-align: center; margin-bottom: 12px;">
      <h2 style="font-size: 15px; font-weight: 800; text-transform: uppercase; margin: 0;">
        KẾ HOẠCH TUẦN 1
      </h2>
      <div style="font-size: 12px; font-weight: 700; margin-top: 2px;">
        ${weekPlan.subTheme || 'Chủ đề nhánh: Phương tiện giao thông đường bộ'}
      </div>
      <div style="font-size: 11px; font-style: italic; margin-top: 2px;">
        Từ ngày ${weekPlan.dateRange}
      </div>
    </div>

    <!-- 7-Timepoints Matrix Table -->
    <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; border: 1px solid #000; line-height: 1.35;">
      <thead>
        <tr style="background: #f8fafc;">
          <th style="border: 1px solid #000; padding: 6px 4px; width: 15%; text-align: center; font-weight: bold;">Thời điểm</th>
          ${datesHeader}
        </tr>
      </thead>
      <tbody>
        <!-- 1. Đón chơi, thể dục sáng -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            1/ Đón chơi, thể dục sáng.
          </td>
          <td colspan="5" style="border: 1px solid #000; padding: 6px 8px; vertical-align: top; text-align: justify;">
            <p style="margin: 2px 0;"><strong>* Đón trẻ:</strong> Cô vui vẻ ân cần đón cháu vào lớp, nhắc trẻ chào cô và để đồ dùng cá nhân của cháu đúng nơi qui định. Trao đổi với phụ huynh những việc cần trong tuần và trong ngày. Trẻ chơi theo ý thích. Trẻ xem tivi. Chơi các góc (Cháu chơi theo ý thích).</p>
            <p style="margin: 2px 0;"><strong>* Dự báo thời tiết:</strong> Cô hỏi thứ, ngày, tháng, năm; sau đó cô hỏi về thời tiết có mây, mưa, nắng...tùy theo thời tiết trong ngày mà cô đặt câu hỏi cho phù hợp, cho cháu lên gắn thời tiết.</p>
            <p style="margin: 2px 0;"><strong>* Điểm danh:</strong> Cô cho từng tổ đứng lên điểm danh tổ của mình xem có vắng bạn nào không; sau đó tổ trưởng lên báo cáo với cô. Cô giáo dục cháu phải đi học đều khi nghỉ học phải xin phép cô....</p>
            <p style="margin: 2px 0;"><strong>* Tiêu chuẩn bé ngoan:</strong> Đi học đúng giờ, vâng lời cô giáo, biết chia sẻ đồ chơi cùng bạn.</p>
            <p style="margin: 2px 0;"><strong>* Thể dục sáng:</strong></p>
            <div style="margin-left: 10px;">
              <p style="margin: 1px 0;">• <strong>Khởi động:</strong> Di chuyển đội hình theo nhạc và đi các kiểu đi: Đi vòng tròn, đi kiễng chân - gót chân, chạy nhanh – chậm, chuyển hàng ngang.</p>
              <p style="margin: 1px 0;">• <strong>Trọng động:</strong></p>
              <div style="margin-left: 10px;">
                - Hô hấp 3: Làm tiếng máy bay.<br/>
                - Tay 1: Hai tay đưa lên cao, ra phía trước, dang ngang (4 lần – 4 nhịp)<br/>
                - Bụng 4: Đứng cúi người về trước (4 lần - 4 nhịp)<br/>
                - Chân 1: Đứng, khuỵu gối (4 lần - 2nhịp)<br/>
                - Bật 2: Bật tách, chụm chân tại chỗ. (4 lần – 4 nhịp)
              </div>
              <p style="margin: 1px 0;">• <strong>Hồi tĩnh:</strong> Uống nước. Tập các động tác kết hợp với nơ.</p>
              <p style="margin: 1px 0;">• <strong>Bài hát để tập:</strong> “Lớn lên cháu lái máy cày”</p>
            </div>
          </td>
        </tr>

        <!-- 2. Hoạt động học -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            2/ Hoạt động học.
          </td>
          ${weekPlan.scheduleMatrix
            .map(
              (m) => `
            <td style="border: 1px solid #000; padding: 6px 5px; vertical-align: top; font-weight: 600; font-size: 10.5px;">
              ${m.studyActivity}
            </td>
          `
            )
            .join('')}
        </tr>

        <!-- 3. Hoạt động góc -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            3/ Hoạt động góc
          </td>
          <td colspan="5" style="border: 1px solid #000; padding: 6px 8px; vertical-align: top;">
            <p style="margin: 2px 0;">• <strong>Góc học tập:</strong> Xếp đường đi .Dùng sỏi ,hột ,hạt xếp đường đi ,xếp một số phương tiện giao thông theo nhóm.</p>
            <p style="margin: 2px 0;">• <strong>Góc sách:</strong> Đọc sách tranh truyện về giao thông. Sưu tầm các tranh ảnh và làm thành sách về các loại phương tiện giao thông .</p>
            <p style="margin: 2px 0;">• <strong>Góc khám phá:</strong> Bón phân, bắt sâu, nhổ cỏ, tưới nước cho cây. Trẻ biết dùng xúc để múc phân bón vào dưới gốc cây xanh, khi thấy có sâu trên lá thì dùng cây gắp sâu, nhổ cỏ, tưới nước cho cây phát triển xanh tươi tốt. Các loại đồ dùng làm vườn như: cuốc, xẻng, xô,...</p>
            <p style="margin: 2px 0;">• <strong>Góc tạo hình:</strong> Vẽ, xé dán một số phương tiện giao thông. Sử dụng phối hợp một số nguyên vật liệu để nặn các đồ chơi.</p>
            <p style="margin: 2px 0;">• <strong>Góc xây dựng:</strong> Xây ngã tư đường phố. Trẻ biết sử dụng các nguyên vật liệu để xây ngã tư đường phố. Chuẩn bị: Một số đồ dùng xây nhà như: gạch, nhà, cây xanh,....</p>
            <p style="margin: 2px 0;">• <strong>Góc chơi âm nhạc:</strong> Hát, múa về chủ đề: Bé đi đường an toàn. Bài hát: Đường em đi; Đoàn tàu nhỏ; Em tập lái ô tô; Em đi chơi thuyền; Ngã tư đường phố;...</p>
          </td>
        </tr>

        <!-- 4. Hoạt động ngoài trời -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            4/ Hoạt động ngoài trời
          </td>
          ${weekPlan.scheduleMatrix
            .map(
              (m) => `
            <td style="border: 1px solid #000; padding: 6px 5px; vertical-align: top; font-size: 10px;">
              ${m.outdoorActivity}
            </td>
          `
            )
            .join('')}
        </tr>

        <!-- 5. Ăn, ngủ -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            5/ Ăn, ngủ
          </td>
          <td colspan="5" style="border: 1px solid #000; padding: 6px 8px; vertical-align: top;">
            - Rèn kĩ năng rửa tay đúng cách trước và sau khi ăn, sau khi đi vệ sinh, lau miệng sau khi ăn. Ăn hết suất, không nói chuyện trong giờ ngủ.
          </td>
        </tr>

        <!-- 6. Chơi hoạt động theo ý thích -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            6/ Chơi hoạt động theo ý thích (Chiều)
          </td>
          ${weekPlan.scheduleMatrix
            .map(
              (m) => `
            <td style="border: 1px solid #000; padding: 6px 5px; vertical-align: top; font-size: 10px;">
              ${m.afternoonActivity}
            </td>
          `
            )
            .join('')}
        </tr>

        <!-- 7. Trả trẻ -->
        <tr>
          <td style="border: 1px solid #000; padding: 6px 4px; font-weight: bold; text-align: center; vertical-align: top; background: #fdfdfd;">
            7/ Trả trẻ
          </td>
          <td colspan="5" style="border: 1px solid #000; padding: 6px 8px; vertical-align: top;">
            - Dọn dẹp đồ chơi gọn gàng đúng nơi quy định.<br/>
            - Chuẩn bị đồ dùng cá nhân; Nhắc nhở cháu chào cô, chào bố mẹ ra về an toàn.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Signature Block -->
    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 11.5px; text-align: center; page-break-inside: avoid;">
      <div style="width: 45%;">
        <div style="font-weight: bold; text-transform: uppercase;">PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</div>
        <div style="font-style: italic; color: #555; height: 50px; display: flex; align-items: center; justify-content: center;">
          (Ký và ghi rõ họ tên)
        </div>
        <div style="font-weight: bold;">${adminInfo.approver}</div>
      </div>

      <div style="width: 45%;">
        <div style="font-style: italic; margin-bottom: 2px;">${weekPlan.signDate || `${adminInfo.location}, ngày ... tháng ... năm 2026`}</div>
        <div style="font-weight: bold; text-transform: uppercase;">GIÁO VIÊN SOẠN BÀI</div>
        <div style="font-style: italic; color: #555; height: 50px; display: flex; align-items: center; justify-content: center;">
          (Ký và ghi rõ họ tên)
        </div>
        <div style="font-weight: bold;">${adminInfo.teachers}</div>
      </div>
    </div>
  </div>
  `;
}

// ==========================================
// 6. GENERATE GIÁO ÁN CHI TIẾT NGÀY (STEAM 5E)
// ==========================================
export function generateDailySteam5ELessonHtml(
  dayDetail: DayLessonDetail,
  adminInfo: PreschoolAdminInfo,
  themeName: string = 'CHỦ ĐỀ 7: BÉ ĐI ĐƯỜNG AN TOÀN'
): string {
  const knowledgeHtml = dayDetail.objectives.knowledge
    .map((k) => `<li>${k}</li>`)
    .join('');
  const skillsHtml = dayDetail.objectives.skills
    .map((s) => `<li>${s}</li>`)
    .join('');
  const attitudesHtml = dayDetail.objectives.attitudes
    .map((a) => `<li>${a}</li>`)
    .join('');

  return `
  <div class="official-daily-lesson-page" style="page-break-after: always; break-after: page; margin-bottom: 24px; font-size: 11.5px; line-height: 1.45;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 14px;">
      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase;">${adminInfo.unitName}</div>
      <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; text-decoration: underline;">${adminInfo.schoolName}</div>
      
      <h2 style="font-size: 15px; font-weight: 800; text-transform: uppercase; margin: 12px 0 2px 0;">
        GIÁO ÁN CHI TIẾT (MÔ HÌNH STEAM 5E / EDP)
      </h2>
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #1e3a8a;">
        ${dayDetail.subjectDomain}
      </div>
      <div style="font-size: 13.5px; font-weight: 800; text-transform: uppercase; margin-top: 4px;">
        ${dayDetail.topic}
      </div>
      <div style="font-size: 11px; font-style: italic; margin-top: 2px;">
        Thứ ${dayDetail.dayOfWeek}, ngày ${dayDetail.dateStr} | ${themeName}
      </div>
    </div>

    <!-- I. MỤC TIÊU BÀI DẠY -->
    <div style="margin-bottom: 12px;">
      <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px 0; border-bottom: 1px solid #000; padding-bottom: 2px;">
        I. MỤC TIÊU BÀI HỌC (STEAM &amp; PHÁT TRIỂN TOÀN DIỆN)
      </h3>
      <div style="margin-left: 10px;">
        <p style="margin: 2px 0; font-weight: bold;">1. Kiến thức (S - T - E - A - M):</p>
        <ul style="margin: 2px 0 4px 18px; padding: 0;">${knowledgeHtml}</ul>

        <p style="margin: 2px 0; font-weight: bold;">2. Kỹ năng:</p>
        <ul style="margin: 2px 0 4px 18px; padding: 0;">${skillsHtml}</ul>

        <p style="margin: 2px 0; font-weight: bold;">3. Thái độ:</p>
        <ul style="margin: 2px 0 4px 18px; padding: 0;">${attitudesHtml}</ul>

        ${
          dayDetail.objectives.integrationHCM
            ? `<p style="margin: 2px 0;"><strong>* Tích hợp tư tưởng đạo đức Bác Hồ:</strong> ${dayDetail.objectives.integrationHCM}</p>`
            : ''
        }
        ${
          dayDetail.objectives.genderIntegration
            ? `<p style="margin: 2px 0;"><strong>* Giáo dục bình đẳng giới:</strong> ${dayDetail.objectives.genderIntegration}</p>`
            : ''
        }
      </div>
    </div>

    <!-- II. CHUẨN BỊ -->
    <div style="margin-bottom: 12px;">
      <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px 0; border-bottom: 1px solid #000; padding-bottom: 2px;">
        II. CHUẨN BỊ ĐỒ DÙNG &amp; HỌC LIỆU
      </h3>
      <div style="margin-left: 10px;">
        <p style="margin: 2px 0;"><strong>1. Đồ dùng của cô:</strong> ${dayDetail.preparation.teacher}</p>
        <p style="margin: 2px 0;"><strong>2. Đồ dùng của trẻ:</strong> ${dayDetail.preparation.students}</p>
      </div>
    </div>

    <!-- III. TIẾN TRÌNH TỔ CHỨC HOẠT ĐỘNG (5E) -->
    <div style="margin-bottom: 12px;">
      <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px 0; border-bottom: 1px solid #000; padding-bottom: 2px;">
        III. TIẾN TRÌNH HOẠT ĐỘNG THEO MÔ HÌNH STEAM (5E)
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #000;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="border: 1px solid #000; padding: 5px 4px; width: 22%; text-align: center; font-weight: bold;">Các bước tiến hành</th>
            <th style="border: 1px solid #000; padding: 5px 6px; text-align: center; font-weight: bold;">Hoạt động của Cô và Trẻ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 6px 6px; font-weight: bold; vertical-align: top; background: #fdfdfd;">
              1. Gắn kết (Engage)
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px; vertical-align: top; text-align: justify;">
              ${dayDetail.steps.step1_engage}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 6px 6px; font-weight: bold; vertical-align: top; background: #fdfdfd;">
              2. Khám phá (Explore)
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px; vertical-align: top; text-align: justify;">
              ${dayDetail.steps.step2_explore}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 6px 6px; font-weight: bold; vertical-align: top; background: #fdfdfd;">
              3. Giải thích (Explain)
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px; vertical-align: top; text-align: justify;">
              ${dayDetail.steps.step3_explain}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 6px 6px; font-weight: bold; vertical-align: top; background: #fdfdfd;">
              4. Áp dụng (Elaborate)
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px; vertical-align: top; text-align: justify;">
              ${dayDetail.steps.step4_elaborate}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 6px 6px; font-weight: bold; vertical-align: top; background: #fdfdfd;">
              5. Đánh giá (Evaluate)
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px; vertical-align: top; text-align: justify;">
              ${dayDetail.steps.step5_evaluate}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- IV. HOẠT ĐỘNG NGOÀI TRỜI & CHIỀU -->
    <div style="margin-bottom: 14px;">
      <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px 0; border-bottom: 1px solid #000; padding-bottom: 2px;">
        IV. HOẠT ĐỘNG NGOÀI TRỜI &amp; HOẠT ĐỘNG CHIỀU
      </h3>
      <div style="margin-left: 10px;">
        <p style="margin: 2px 0;"><strong>* Hoạt động ngoài trời:</strong> ${dayDetail.outdoorActivity.purposeTitle} | ${dayDetail.outdoorActivity.gameMovement} | ${dayDetail.outdoorActivity.freePlay}</p>
        <p style="margin: 2px 0;"><strong>* Hoạt động chiều:</strong> ${dayDetail.afternoonActivity.activityName} - ${dayDetail.afternoonActivity.guideContent}</p>
      </div>
    </div>

    ${
      dayDetail.poemStorySongText
        ? `
    <!-- PHỤ LỤC THƠ / TRUYỆN -->
    <div style="margin-bottom: 14px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 4px;">
      <h4 style="font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0 0 4px 0;">Phụ lục văn bản / Bài hát / Bài thơ:</h4>
      <pre style="font-family: inherit; font-size: 11px; white-space: pre-wrap; margin: 0; line-height: 1.4;">${dayDetail.poemStorySongText}</pre>
    </div>
    `
        : ''
    }

    <!-- Ký duyệt -->
    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 11px; text-align: center; page-break-inside: avoid;">
      <div style="width: 45%;">
        <div style="font-weight: bold; text-transform: uppercase;">BAN GIÁM HIỆU DUYỆT</div>
        <div style="font-style: italic; color: #555; height: 45px; display: flex; align-items: center; justify-content: center;">
          (Ký và ghi rõ họ tên)
        </div>
        <div style="font-weight: bold;">${adminInfo.approver}</div>
      </div>

      <div style="width: 45%;">
        <div style="font-weight: bold; text-transform: uppercase;">GIÁO VIÊN SOẠN BÀI</div>
        <div style="font-style: italic; color: #555; height: 45px; display: flex; align-items: center; justify-content: center;">
          (Ký và ghi rõ họ tên)
        </div>
        <div style="font-weight: bold;">${adminInfo.teachers}</div>
      </div>
    </div>
  </div>
  `;
}

// ==========================================
// 7. TỔNG HỢP TOÀN BỘ HỒ SƠ CHUẨN IN (Full Bundle)
// ==========================================
export function generateFullPreschoolDossierHtml(
  adminInfo: PreschoolAdminInfo,
  weekPlan: WeekCurriculumPlan,
  themeTitle: string = 'QUYỂN 7: BÉ ĐI ĐƯỜNG AN TOÀN',
  ageGroup: string = '3-4 tuổi',
  selectedDayDetail?: DayLessonDetail
): string {
  const coverHtml = generateCoverPageHtml(adminInfo, themeTitle, ageGroup.toUpperCase());
  const scheduleHtml = generateTimetableAndScheduleHtml(adminInfo, ageGroup.toUpperCase());
  const fourWeeksMatrixHtml = generateFourWeeksMatrixHtml(
    adminInfo,
    `KẾ HOẠCH GIÁO DỤC ${themeTitle.toUpperCase()}`,
    ageGroup,
    THEME_7_FULL_MATRIX_DATA
  );
  const objAndEnvHtml = generateThemeObjectivesAndEnvironmentHtml(
    adminInfo,
    `KẾ HOẠCH NỘI DUNG GIÁO DỤC ${themeTitle.toUpperCase()}`,
    '4 tuần (từ ngày 23/02 đến ngày 20/03/2026)',
    THEME_7_OBJECTIVES_DATA,
    THEME_7_ENVIRONMENT_DATA
  );
  const weekDetailedHtml = generateDetailedWeekPlan7TimepointsHtml(weekPlan, adminInfo);
  const dailyDetailHtml = selectedDayDetail
    ? generateDailySteam5ELessonHtml(selectedDayDetail, adminInfo, themeTitle)
    : '';

  return `
  <div class="preschool-full-dossier" style="font-family: 'Times New Roman', 'Tinos', Times, serif; color: #000; background: #fff;">
    ${coverHtml}
    ${scheduleHtml}
    ${fourWeeksMatrixHtml}
    ${objAndEnvHtml}
    ${weekDetailedHtml}
    ${dailyDetailHtml}
  </div>
  `;
}
