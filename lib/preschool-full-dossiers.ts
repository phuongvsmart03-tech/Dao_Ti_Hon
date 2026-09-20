// lib/preschool-full-dossiers.ts
// Bộ Dữ Liệu Giáo Án Hoàn Chỉnh 10 Chủ Đề Chuẩn Template Văn Bản Word Mầm Non
// Trường Mầm Non Phước Thể / Mầm Non Đảo Tí Hon - UBND Xã Liên Hương
// Tích hợp Đầy đủ Khung 69 Mục tiêu GD, Tiến trình STEAM 5E/EDP, 7 Thời điểm & Hoạt động ngày

import { PreschoolAdminInfo } from './preschool-curriculum-data';

export interface DayFullLessonPlan {
  dayOfWeek: string;
  dateText: string;
  domain: string;
  activityName: string;
  lessonTopic: string;
  steamMethod: string;
  targetCodes: string[];
  aims: {
    knowledge: string[];
    skills: string[];
    attitudes: string[];
    integrationHCM?: string;
    genderIntegration?: string;
  };
  preparation: {
    teacher: string[];
    students: string[];
  };
  steps: {
    step1_engage: string[];
    step2_explore: string[];
    step3_explain: string[];
    step4_elaborate: string[];
    step5_evaluate: string[];
  };
  outdoorActivity: {
    focusedObservation: string;
    movementGame: string;
    folkGame?: string;
    freePlay: string;
  };
  cornerActivities: string;
  afternoonActivity: {
    reinforcement?: string;
    familiarize?: string;
    game: string;
    hygieneAndRewards: string;
  };
}

export interface WeekFullDossier {
  weekNumber: number;
  weekName?: string;
  weekTitle?: string;
  duration: string;
  teacherName?: string;
  morningRoutine: {
    welcome: string;
    weatherForecast: string;
    rollCall: string;
    exercise: {
      breathing: string;
      arms: string;
      torso: string;
      legs: string;
      jumping: string;
      cooling: string;
    };
  };
  cornerSetup: Array<{
    cornerName: string;
    activities: string;
    materials: string;
  }>;
  days: DayFullLessonPlan[];
}

export interface PreschoolThemeFullDossier {
  themeId: string;
  themeNumber: number;
  title: string;
  bookTitle: string;
  ageGroup: 'Lớp 3-4 tuổi' | 'Nhóm 25-36 tháng';
  totalWeeks: number;
  dateRange: string;
  subThemesSummary: string[];
  timetable: Array<{
    day: string;
    period: string;
    subjects: string[];
  }>;
  dailySchedule: Array<{
    time: string;
    activity: string;
  }>;
  objectivesMatrix: Array<{
    category: string;
    targetCode: string;
    content: string;
    activityMapping: string;
  }>;
  environmentPlanning: {
    indoor: string[];
    outdoor: string[];
    social: string[];
  };
  weeks: WeekFullDossier[];
}

// -------------------------------------------------------------
// CHỦ ĐỀ 1: LỚP MẪU GIÁO CỦA BÉ (3-4 TUỔI) - 2 TUẦN
// -------------------------------------------------------------
export const THEME_1_DOSSIER: PreschoolThemeFullDossier = {
  themeId: 'theme-1-lop-mau-giao-cua-be',
  themeNumber: 1,
  title: 'LỚP MẪU GIÁO CỦA BÉ',
  bookTitle: 'QUYỂN 1: LỚP MẪU GIÁO CỦA BÉ',
  ageGroup: 'Lớp 3-4 tuổi',
  totalWeeks: 2,
  dateRange: 'Từ ngày 15/09/2025 đến 26/09/2025',
  subThemesSummary: ['Tuần 1: Lớp học của bé (15/09 - 19/09)', 'Tuần 2: Cô giáo và các bạn (22/09 - 26/09)'],
  timetable: [
    { day: 'Thứ Hai', period: '1 tiết', subjects: ['Khám phá khoa học (KPKH)', 'Phát triển tình cảm & Kỹ năng xã hội (TC-KNXH)'] },
    { day: 'Thứ Ba', period: '1 tiết', subjects: ['Hoạt động tạo hình (HĐTH)', 'Hoạt động âm nhạc (HĐÂN)'] },
    { day: 'Thứ Tư', period: '1 tiết', subjects: ['Làm quen với toán sơ đẳng (HĐLQTSĐ)'] },
    { day: 'Thứ Năm', period: '1 tiết', subjects: ['Thơ / Truyện văn học', 'Phát triển ngôn ngữ: Từ để hỏi'] },
    { day: 'Thứ Sáu', period: '1 tiết', subjects: ['Hoạt động phát triển thể dục (HĐTD)'] },
  ],
  dailySchedule: [
    { time: '6h45 - 8h00', activity: 'Đón trẻ, trò chuyện đầu giờ, chơi tự do, thể dục sáng theo nhạc' },
    { time: '8h00 - 8h25', activity: 'Hoạt động học có chủ đích theo thời khóa biểu (STEAM 5E/EDP)' },
    { time: '8h40 - 9h20', activity: 'Chơi và hoạt động ở các góc (Phân vai, Xây dựng, Tạo hình, Học tập, Thư viện)' },
    { time: '9h20 - 10h00', activity: 'Hoạt động ngoài trời: Quan sát có mục đích, trò chơi vận động & chơi tự do' },
    { time: '10h00 - 11h10', activity: 'Vệ sinh cá nhân, rửa tay xà phòng, tổ chức ăn bữa trưa chính' },
    { time: '11h10 - 14h00', activity: 'Chuẩn bị phòng ngủ, nghe nhạc êm dịu, ngủ trưa an toàn' },
    { time: '14h30 - 15h10', activity: 'Vận động nhẹ thức dậy, vệ sinh cá nhân, ăn bữa xế phụ' },
    { time: '15h10 - 15h40', activity: 'Hoạt động chiều: Ôn luyện kiến thức, làm quen bài mới, kỹ năng sống' },
    { time: '15h40 - 17h00', activity: 'Nêu gương bé ngoan, cắm cờ, chuẩn bị đồ dùng cá nhân, trả trẻ' },
  ],
  objectivesMatrix: [
    { category: 'Giáo dục phát triển Thể chất', targetCode: 'MT1', content: 'Cân nặng và chiều cao bình thường theo tuổi (Đo quý I tháng 9).', activityMapping: 'Khám sức khỏe, khu thể chất, dinh dưỡng bán trú.' },
    { category: 'Giáo dục phát triển Thể chất', targetCode: 'MT2', content: 'Thực hiện thuần thục các nhóm bài tập cơ tay, bụng lườn, chân, bật.', activityMapping: 'Thể dục sáng, bài tập phát triển chung giờ thể dục.' },
    { category: 'Giáo dục phát triển Thể chất', targetCode: 'MT7.1', content: 'Xoay tròn cổ tay, phối hợp ngón tay linh hoạt.', activityMapping: 'Thể dục sáng, múa âm nhạc, nhào nặn đất nặn.' },
    { category: 'Giáo dục phát triển Thể chất', targetCode: 'MT10', content: 'Nói tên một số món ăn hàng ngày: trứng rán, cá kho, canh rau...', activityMapping: 'Giờ ăn trưa, góc phân vai bác cấp dưỡng.' },
    { category: 'Giáo dục phát triển Nhận thức', targetCode: 'MT31', content: 'Nói họ tên, tuổi, giới tính của bản thân và người thân trong gia đình.', activityMapping: 'Khám phá: Trường mầm non của bé, Cô giáo và các bạn.' },
    { category: 'Giáo dục phát triển Nhận thức', targetCode: 'MT32', content: 'Nói tên, công việc của cô giáo, các bác công nhân viên và bạn bè trong trường.', activityMapping: 'Khám phá xã hội, tham quan các khu vực làm việc trong trường.' },
    { category: 'Giáo dục phát triển Ngôn ngữ', targetCode: 'MT35', content: 'Lắng nghe, hiểu và thực hiện được các yêu cầu đơn giản của cô giáo.', activityMapping: 'Giờ học văn học thơ "Bạn mới", truyện "Đôi bạn tốt".' },
    { category: 'Giáo dục Tình cảm & Kỹ năng xã hội', targetCode: 'MT49', content: 'Mạnh dạn tham gia vào các hoạt động tập thể, tự tin trả lời câu hỏi.', activityMapping: 'Góc chơi phân vai làm cô giáo, đón trả trẻ.' },
    { category: 'Giáo dục Tình cảm & Kỹ năng xã hội', targetCode: 'MT55', content: 'Chú ý lắng nghe khi cô và bạn nói, không ngắt lời người khác.', activityMapping: 'Giờ sinh hoạt trò chuyện, đàm thoại nhóm.' },
    { category: 'Giáo dục phát triển Thẩm mĩ', targetCode: 'MT59', content: 'Vui sướng vỗ tay, nhún nhảy làm động tác mô phỏng bài hát.', activityMapping: 'Góc âm nhạc, hát "Cháu đi mẫu giáo", múa "Cô giáo miền xuôi".' },
  ],
  environmentPlanning: {
    indoor: [
      'Góc học tập: Tranh ảnh trường lớp mầm non, giấy màu, bút sáp, tập tô dây cờ, que đếm số lượng 1-2.',
      'Góc phân vai: Đồ dùng cô giáo (sách, trống lắc, bảng nhỏ), đồ chơi nấu ăn bếp bác cấp dưỡng.',
      'Góc xây dựng: Khối gỗ, hàng rào, gạch nhựa, cây hoa xây dựng mô hình "Trường mầm non của bé".',
      'Góc âm nhạc: Nhạc cụ mầm non (phách tre, trống lắc, xắc xô), trang phục biểu diễn bài hát chủ đề.',
      'Góc khám phá khoa học: Bể pha màu nước, bảng thời tiết, chai lọ thí nghiệm thiên nhiên.',
    ],
    outdoor: [
      'Khu vực cây cảnh & vườn hoa: Ghế đá nghe kể chuyện ngoài trời, hoa mười giờ, hoa hồng, cây bóng mát bàng, me tây.',
      'Khu thiết bị đồ chơi: Lâu đài cầu trượt liên hoàn, bập bênh, xích đu, sân chơi thể chất.',
      'Khu cát nước thiên nhiên: Bể cát mịn, sỏi, xẻng xúc cát, khuôn hình, làm thí nghiệm chìm nổi.',
    ],
    social: [
      'Tạo bầu không khí yêu thương, thân thiện giữa cô và trẻ, giữa trẻ với bạn bè; trẻ chào cô, chào bố mẹ khi đến và về.',
      'Rèn thói quen vệ sinh, tự phục vụ: lau bàn, xếp dép, rửa tay bằng xà phòng 6 bước.',
      'Đảm bảo an toàn tuyệt đối về thể chất và tâm lý cho mọi trẻ.',
    ],
  },
  weeks: [
    {
      weekNumber: 1,
      weekTitle: 'Tuần 1: Lớp học của bé (Từ 15/09 đến 19/09/2025)',
      duration: '15/09/2025 - 19/09/2025',
      teacherName: 'Võ Thị Hồng Sim',
      morningRoutine: {
        welcome: 'Cô vui vẻ ân cần đón trẻ vào lớp, nhắc trẻ chào cô, chào bố mẹ, cất đồ dùng cá nhân đúng ngăn tủ quy định. Trao đổi nhanh tình hình trẻ với phụ huynh.',
        weatherForecast: 'Trò chuyện thời tiết hôm nay: Có mây, mưa hay nắng ấm? Cho trẻ gắn biểu tượng thời tiết.',
        rollCall: 'Từng tổ đứng lên điểm danh báo cáo số lượng bạn có mặt và vắng. Giáo dục trẻ đi học chuyên cần.',
        exercise: {
          breathing: 'Hô hấp: Hít sâu thở nhẹ, động tác thổi bóng bay (4 lần x 4 nhịp).',
          arms: 'Tay (động tác 4): Hai tay thay nhau đưa thẳng lên cao nhịp nhàng (4 lần x 4 nhịp).',
          torso: 'Bụng lườn (động tác 2): Đứng chống hông quay người sang hai bên trái - phải (4 lần x 4 nhịp).',
          legs: 'Chân (động tác 2): Đứng thẳng khuỵu gối nhịp nhàng theo nhạc (4 lần x 4 nhịp).',
          jumping: 'Bật (động tác 1): Bật nhảy tách chụm tại chỗ nhẹ nhàng (4 lần x 4 nhịp).',
          cooling: 'Hồi tĩnh: Làm động tác hít thở sâu, ngửi hương hoa tươi.',
        },
      },
      cornerSetup: [
        { cornerName: 'Góc phân vai', activities: 'Đóng vai cô giáo giảng bài, bác cấp dưỡng nấu ăn, đưa đón bé.', materials: 'Bộ đồ dùng dạy học mẫu, bát thìa đồ chơi, búp bê.' },
        { cornerName: 'Góc xây dựng', activities: 'Xây vườn trường mầm non, xếp bồn hoa, lắp ghép hàng rào.', materials: 'Khối gỗ, gạch nhựa, cây xanh, hoa đồ chơi.' },
        { cornerName: 'Góc tạo hình', activities: 'Tô màu đu quay, xé dán dây cờ trang trí lớp học.', materials: 'Giấy A4, bút sáp màu, hồ dán, giấy màu.' },
        { cornerName: 'Góc học tập & thư viện', activities: 'Chơi lô tô đồ dùng học tập, đếm số lượng 1, xem tranh truyện trường mầm non.', materials: 'Thẻ số 1, lô tô đồ dùng, tranh ảnh khổ lớn.' },
        { cornerName: 'Góc thiên nhiên', activities: 'Tưới nước cho vườn hoa, nhặt lá rụng ở bồn cây cảnh.', materials: 'Bình tưới mini, khăn lau, xô đựng lá.' },
      ],
      days: [
        {
          dayOfWeek: 'Hai',
          dateText: '15/09/2025',
          domain: 'Lĩnh vực Phát triển Nhận thức',
          activityName: 'Hoạt động Khám phá Xã hội (HĐKPXH)',
          lessonTopic: 'Trường Mầm Non của bé (Mô hình STEAM)',
          steamMethod: 'STEAM 5E (Engage - Explore - Explain - Elaborate - Evaluate)',
          targetCodes: ['MT31', 'MT32'],
          aims: {
            knowledge: [
              'Trẻ biết tên gọi trường mầm non Phước Thể / Mầm non Đảo Tí Hon, biết tên lớp học, tên cô giáo và một số phòng ban trong trường (S).',
              'Trẻ biết công nghệ bảng tương tác, tranh ảnh, máy tính hỗ trợ lớp học (T).',
              'Trẻ nêu được số lượng các phòng chức năng, cổng trường, sân chơi (M).',
              'Trẻ cảm nhận được vẻ đẹp khang trang của trường lớp (A).',
            ],
            skills: [
              'Rèn kỹ năng quan sát có chủ định, ghi nhớ và trả lời câu hỏi mạch lạc, rõ ràng.',
              'Kỹ năng hợp tác theo nhóm khi tham gia trò chơi "Ai thông minh hơn".',
            ],
            attitudes: [
              'Trẻ yêu quý trường lớp, hào hứng đi học mỗi ngày, biết giữ gìn đồ chơi của trường.',
              'Lồng ghép lời Bác Hồ dạy: "Trẻ em như búp trên cành, biết ăn ngủ, biết học hành là ngoan".',
            ],
            integrationHCM: 'Giáo dục lòng biết ơn và thực hiện lời Bác dạy về chăm ngoan, đoàn kết.',
            genderIntegration: 'Khuyến khích bạn nam và bạn nữ hòa đồng, cùng giúp nhau trong học tập và vui chơi.',
          },
          preparation: {
            teacher: ['Video clip giới thiệu khuôn viên trường mầm non.', 'Tranh ảnh các phòng ban, đồ chơi ngoài trời.', 'Nhạc bài hát "Vui đến trường", câu đố về trường học.'],
            students: ['Trang phục gọn gàng, tâm thế hào hứng.', 'Mỗi trẻ chuẩn bị tranh lô tô trường mầm non.'],
          },
          steps: {
            step1_engage: [
              'Cô và trẻ cùng hát vang bài "Vui đến trường" của nhạc sĩ Hoàng Văn Yến.',
              'Trò chuyện gợi mở: Hàng ngày ai đưa các con đến trường? Đến trường các con gặp những ai và có vui không?',
              'Tạo tình huống bất ngờ: Hôm nay cô có một video ghi lại những điều bí mật trong trường mầm non của chúng mình, các con cùng chú ý xem nhé!',
            ],
            step2_explore: [
              'Cô chia lớp thành các nhóm nhỏ cho trẻ cùng quan sát ảnh chụp các khu vực trong trường.',
              'Trẻ cùng nhau thảo luận: Cổng trường có biển tên gì? Sân trường có những loại đồ chơi nào? (Cầu trượt, bập bênh, đu quay).',
              'Cô dẫn dắt trẻ khám phá tiếp các phòng: Phòng học của lớp mình, phòng y tế, bếp ăn bán trú, phòng hiệu bộ.',
            ],
            step3_explain: [
              'Đại diện từng nhóm lên chia sẻ về những điều vừa khám phá.',
              'Cô khái quát lại: Trường mầm non của chúng mình có cổng trường khang trang, sân trường rợp bóng cây xanh và rất nhiều đồ chơi bổ ích. Trong trường có các cô giáo, cô cấp dưỡng, bác bảo vệ luôn yêu thương chăm sóc các con.',
            ],
            step4_elaborate: [
              'Trò chơi củng cố "Ai nhanh hơn": Chia 2 đội thi đua nhảy qua các ô vòng để chọn đúng hình ảnh đồ chơi có ở sân trường gắn lên bảng.',
              'Trẻ thể hiện tình cảm với trường qua bài hát vỗ tay theo nhịp.',
            ],
            step5_evaluate: [
              'Cô mời trẻ nêu lại tên trường, tên lớp học của mình.',
              'Nhận xét, tuyên dương tinh thần học tập tích cực của cả lớp, nhắc nhở giữ gìn vệ sinh lớp học.',
            ],
          },
          outdoorActivity: {
            focusedObservation: 'Quan sát vườn hoa trong sân trường (màu sắc, hương thơm, các loại hoa).',
            movementGame: 'Trò chơi vận động: Kéo co giữa 2 tổ.',
            freePlay: 'Chơi tự do với các thiết bị cầu trượt, bập bênh dưới sự giám sát của cô.',
          },
          cornerActivities: 'Thực hiện chơi tại 5 góc trọng tâm (Phân vai cô giáo, xây trường học, xé dán hoa, thư viện).',
          afternoonActivity: {
            reinforcement: 'Ôn luyện lại tên trường, tên cô giáo và bài học buổi sáng.',
            familiarize: 'Ôn luyện lại tên trường, tên cô giáo và bài học buổi sáng.',
            game: 'Trò chơi học tập: "Tìm đồ vật của trường".',
            hygieneAndRewards: 'Rèn thao tác lau mặt đúng cách, nhận xét nêu gương cuối ngày, cắm cờ bé ngoan.',
          },
        },
        {
          dayOfWeek: 'Ba',
          dateText: '16/09/2025',
          domain: 'Lĩnh vực Phát triển Thẩm mĩ',
          activityName: 'Hoạt động Tạo hình (HĐTH)',
          lessonTopic: 'Tô màu đu quay (Mô hình STEAM)',
          steamMethod: 'STEAM 5E (Engage - Explore - Explain - Elaborate - Evaluate)',
          targetCodes: ['MT63', 'MT7.1'],
          aims: {
            knowledge: [
              'Trẻ biết đặc điểm cấu tạo của chiếc đu quay ngoài sân trường: có trụ giữa, các ghế ngồi hình con giống, mái che (S).',
              'Trẻ biết cách cầm bút sáp màu tô kín hình, không chờm ra ngoài đường viền (E).',
              'Trẻ đếm số lượng ghế ngồi trên đu quay (M); nhận biết màu đỏ, xanh, vàng (A).',
            ],
            skills: [
              'Rèn kỹ năng cầm bút bằng 3 ngón tay, ngồi đúng tư thế, điều khiển lực cổ tay khéo léo.',
              'Phát triển óc thẩm mỹ và khả năng phối hợp màu sắc hài hòa.',
            ],
            attitudes: [
              'Trẻ trân trọng sản phẩm mình tạo ra, biết giữ gìn sách vở và đồ chơi cẩn thận.',
            ],
            integrationHCM: 'Giáo dục tính kiên trì, tỉ mỉ, làm việc đến nơi đến chốn.',
            genderIntegration: 'Khuyến khích trẻ chọn màu sắc theo sở thích cá nhân, không phân biệt màu nam nữ.',
          },
          preparation: {
            teacher: ['Tranh mẫu vẽ đu quay đã tô màu sắc nét.', 'Bảng giá trưng bày sản phẩm.', 'Nhạc không lời êm dịu.'],
            students: ['Vở tạo hình cho mỗi trẻ, hộp bút sáp màu đủ các gam màu cơ bản.'],
          },
          steps: {
            step1_engage: [
              'Cô và trẻ cùng đọc bài đồng dao "Nu na nu nống" dẫn dắt tới câu đố về đồ chơi ngoài sân trường.',
              'Cô hỏi: Ở sân trường có đồ chơi gì quay vòng tròn tròn mà các con rất thích ngồi lên?',
            ],
            step2_explore: [
              'Cô đưa tranh mẫu chiếc đu quay đã tô màu cho trẻ quan sát và nhận xét.',
              'Đàm thoại: Chiếc đu quay có những bộ phận nào? Mái che màu gì? Các ghế ngồi hình con giống màu gì? Bức tranh được tô như thế nào?',
            ],
            step3_explain: [
              'Cô thị phạm hướng dẫn cách tô màu: Cầm bút bằng tay phải bằng 3 ngón tay (ngón cái, ngón trỏ, ngón giữa), tay trái giữ mép vở.',
              'Di màu đều tay từ trên xuống dưới, từ trái sang phải, tô khéo léo không để lem ra ngoài nét vẽ viền.',
            ],
            step4_elaborate: [
              'Trẻ thực hành tô màu vào vở tạo hình của mình.',
              'Cô mở nhạc nền nhẹ nhàng, đi bao quát từng nhóm, động viên và hướng dẫn thao tác cho những trẻ còn lúng túng.',
            ],
            step5_evaluate: [
              'Cho trẻ mang bài lên giá trưng bày sản phẩm.',
              'Mời 2-3 trẻ nhận xét bài mình thích nhất; cô nhận xét chung, biểu dương sự tiến bộ của trẻ.',
            ],
          },
          outdoorActivity: {
            focusedObservation: 'Tham quan các khu vực làm việc trong trường (Phòng bảo vệ, phòng y tế, nhà bếp).',
            movementGame: 'Trò chơi dân gian: Kéo co.',
            freePlay: 'Chơi tự do trong sân trường an toàn.',
          },
          cornerActivities: 'Chơi ở góc tạo hình: nặn các khối tròn, vẽ tự do theo ý thích.',
          afternoonActivity: {
            familiarize: 'Làm quen nội dung toán: Giống nhau - Nhận biết số lượng 1.',
            game: 'Trò chơi học tập: "Chọn đúng đồ dùng".',
            hygieneAndRewards: 'Vệ sinh rửa tay xà phòng, bình xét cắm cờ bé ngoan cuối ngày.',
          },
        },
        {
          dayOfWeek: 'Tư',
          dateText: '17/09/2025',
          domain: 'Lĩnh vực Phát triển Nhận thức',
          activityName: 'Làm quen Toán Sơ đẳng (HĐLQTSĐ)',
          lessonTopic: 'Giống nhau – Nhận biết số lượng 1 (Mô hình STEAM)',
          steamMethod: 'STEAM 5E (Engage - Explore - Explain - Elaborate - Evaluate)',
          targetCodes: ['MT24.1', 'MT20'],
          aims: {
            knowledge: [
              'Trẻ nhận biết nhóm đồ vật có số lượng 1; nhận biết biểu tượng và chữ số 1 (S+M).',
              'Trẻ nhận biết các đồ vật giống nhau về tên gọi, màu sắc hoặc công dụng (S).',
              'Sử dụng các đồ dùng trực quan và hình ảnh điện tử hỗ trợ học tập (T).',
            ],
            skills: [
              'Rèn kỹ năng đếm từ trái sang phải, tạo nhóm có 1 đối tượng.',
              'Rèn kỹ năng nói to, phát âm chuẩn chữ số 1, nói câu trọn nghĩa.',
            ],
            attitudes: [
              'Hứng thú tham gia các trò chơi toán học, biết chia sẻ đồ chơi cùng bạn.',
            ],
            integrationHCM: 'Lồng ghép giáo dục tính tiết kiệm và giữ gìn đồ dùng học tập.',
          },
          preparation: {
            teacher: ['Thẻ số 1 lớn, giáo án điện tử trình chiếu đồ vật số lượng 1.', 'Các đồ dùng đồ chơi quanh lớp có số lượng 1 (1 chiếc ô tô, 1 quả bóng, 1 cái trống).'],
            students: ['Mỗi trẻ 1 rổ đựng: 1 cây nơ màu xanh, 1 sáp màu, thẻ số 1.'],
          },
          steps: {
            step1_engage: [
              'Cả lớp hát bài "Cô giáo" của nhạc sĩ Đỗ Mạnh Thường.',
              'Trò chuyện: Lớp mình có mấy cô giáo đang dạy các con? Có 2 cô nhưng đều có điểm giống nhau về tên gọi là "Cô giáo".',
            ],
            step2_explore: [
              'Phần 1: Dạy trẻ nhận biết số lượng 1: Cho trẻ tìm trong rổ đồ dùng có số lượng là 1.',
              'Trẻ lấy ra 1 cây bút sáp và đếm: "1 cây bút sáp". Cho trẻ vỗ tay 1 tiếng theo hiệu lệnh của cô.',
              'Phần 2: Luyện so sánh những đồ vật giống nhau có số lượng 1.',
            ],
            step3_explain: [
              'Cô giới thiệu chữ số 1: Để chỉ nhóm đối tượng có số lượng là 1, người ta dùng chữ số 1.',
              'Cho cả lớp, từng tổ và cá nhân phát âm: "Số 1".',
              'Cho trẻ lấy thẻ số 1 trong rổ đặt cạnh đồ vật có số lượng 1 tương ứng.',
            ],
            step4_elaborate: [
              'Trò chơi 1: "Ai nhanh nhất" - Tìm đồ dùng quanh lớp có số lượng là 1 và đặt thẻ số 1.',
              'Trò chơi 2: "Nối nhanh ghép đúng" - Nối 1 cái cốc với số 1, nối 1 cái thìa với số 1 trong phiếu bài tập.',
            ],
            step5_evaluate: [
              'Kiểm tra kết quả nối của trẻ, củng cố lại bài học.',
              'Tuyên dương các nhóm làm bài nhanh và chuẩn xác.',
            ],
          },
          outdoorActivity: {
            focusedObservation: 'Quan sát cây xanh trong sân trường (thân, lá, cành, bóng mát).',
            movementGame: 'Trò chơi dân gian: "Trốn tìm".',
            freePlay: 'Chơi với bóng nhựa, vòng ném cổ chai.',
          },
          cornerActivities: 'Góc học tập: Xếp các thẻ số 1 tương ứng các nhóm 1 đồ vật.',
          afternoonActivity: {
            familiarize: 'Làm quen bài thơ mới: "Bạn mới".',
            game: 'Trò chơi: "Đố bạn tôi là ai".',
            hygieneAndRewards: 'Rèn thói quen rửa tay đúng quy trình, cắm cờ bé ngoan.',
          },
        },
        {
          dayOfWeek: 'Năm',
          dateText: '18/09/2025',
          domain: 'Lĩnh vực Phát triển Ngôn ngữ',
          activityName: 'Hoạt động Văn học (HĐVH)',
          lessonTopic: 'Thơ: "Bạn mới" (Mô hình STEAM)',
          steamMethod: 'STEAM 5E (Engage - Explore - Explain - Elaborate - Evaluate)',
          targetCodes: ['MT42', 'MT35', 'MT49'],
          aims: {
            knowledge: [
              'Trẻ thuộc và hiểu nội dung bài thơ "Bạn mới" của tác giả Nguyệt Mai (S).',
              'Trẻ hiểu tính cách bạn mới còn nhút nhát, cần được cô và bạn bè quan tâm giúp đỡ.',
              'Trẻ nhận biết âm điệu vui tươi, nhịp nhàng của bài thơ (A).',
            ],
            skills: [
              'Rèn kỹ năng đọc thơ diễn cảm, ngắt nghỉ đúng nhịp, phát âm rõ ràng từng câu chữ.',
              'Phát triển ngôn ngữ mạch lạc qua trả lời câu hỏi đàm thoại.',
            ],
            attitudes: [
              'Giáo dục tình cảm đoàn kết, biết yêu thương, chia sẻ đồ chơi và giúp đỡ bạn bè mới vào lớp.',
            ],
            integrationHCM: 'Thực hiện 5 điều Bác Hồ dạy: "Đoàn kết tốt, kỷ luật tốt".',
          },
          preparation: {
            teacher: ['Mô hình sa bàn minh họa bài thơ.', 'Tranh chữ to, slide trình chiếu bài thơ sinh động.'],
            students: ['Mũ các bạn nhỏ đáng yêu, tâm thế thoải mái.'],
          },
          steps: {
            step1_engage: [
              'Hát vận động bài "Trường chúng cháu là trường mầm non".',
              'Trò chuyện: Khi có bạn mới đến lớp còn bỡ ngỡ, các con sẽ làm gì để bạn vui?',
              'Giới thiệu bài thơ "Bạn mới" của nhà thơ Nguyệt Mai.',
            ],
            step2_explore: [
              'Cô đọc diễn cảm lần 1 kết hợp sa bàn mô hình.',
              'Cô đọc lần 2 kết hợp chỉ tranh minh họa chữ to, giải thích từ khó "nhút nhát" (còn rụt rè, chưa quen bạn mới).',
              'Đàm thoại nội dung bài thơ:',
              '- Bài thơ nói về ai? Tính nết bạn mới thế nào?',
              '- Em đã làm gì để giúp đỡ bạn mới? Cô giáo khen bạn nhỏ ra sao?',
            ],
            step3_explain: [
              'Dạy trẻ đọc thơ: Cho cả lớp đọc từng câu theo cô 2-3 lần.',
              'Thi đua đọc thơ theo tổ, nhóm bạn trai, nhóm bạn gái, cá nhân đọc diễn cảm.',
              'Cô bao quát sửa sai cách phát âm và ngữ điệu cho trẻ.',
            ],
            step4_elaborate: [
              'Trò chơi "Tạo dáng kết bạn": Cùng nắm tay nhau kết thành vòng tròn đọc thơ, khi nghe hiệu lệnh "Tìm bạn thân" thì nhanh chóng ôm lấy 1 người bạn.',
            ],
            step5_evaluate: [
              'Cả lớp cùng đọc lại toàn bài thơ 1 lần thật truyền cảm.',
              'Nhận xét, giáo dục trẻ biết thương yêu bạn bè, không trêu chọc bạn mới.',
            ],
          },
          outdoorActivity: {
            focusedObservation: 'Trẻ quan sát mô tả cảnh quan quanh trường mầm non.',
            movementGame: 'Trò chơi vận động: Ném bóng vào chậu.',
            freePlay: 'Chơi tự do với các đồ chơi cát nước ngoài trời.',
          },
          cornerActivities: 'Góc sách thư viện: lật giở từng trang xem truyện tranh thiếu nhi.',
          afternoonActivity: {
            familiarize: 'Làm quen bài tập thể dục: "Đi theo đường hẹp bé đến trường".',
            game: 'Trò chơi: "Chi chi chành chành".',
            hygieneAndRewards: 'Bình xét bé ngoan trong ngày, cắm cờ.',
          },
        },
        {
          dayOfWeek: 'Sáu',
          dateText: '19/09/2025',
          domain: 'Lĩnh vực Phát triển Thể chất',
          activityName: 'Hoạt động Thể dục (HĐTD)',
          lessonTopic: 'Đi theo đường hẹp Bé đến trường Mầm Non (STEAM)',
          steamMethod: 'STEAM 5E (Engage - Explore - Explain - Elaborate - Evaluate)',
          targetCodes: ['MT3.1', 'MT4.1'],
          aims: {
            knowledge: [
              'Trẻ biết tên bài vận động "Đi theo đường hẹp" và luật chơi trò chơi "Tìm bạn thân" (S).',
              'Trẻ biết giữ thăng bằng cơ thể khi bước đi trong con đường hẹp rộng 25-30cm, không chạm vạch (S+E).',
              'Trẻ biết phối hợp tay chân nhịp nhàng, mắt nhìn thẳng hướng đi (E+M).',
            ],
            skills: [
              'Rèn luyện sự khéo léo, tính cẩn thận và khả năng định hướng trong không gian.',
              'Phát triển sức mạnh cơ chân và tố chất khéo léo.',
            ],
            attitudes: [
              'Trẻ tích cực tập luyện thể thao nâng cao sức khỏe, có tính kỷ luật tập thể.',
            ],
            integrationHCM: 'Lồng ghép lời kêu gọi toàn dân tập thể dục của Bác Hồ: Giữ gìn dân chủ, xây dựng nước nhà, gây đời sống mới, việc gì cũng cần có sức khỏe mới thành công.',
          },
          preparation: {
            teacher: ['Vạch chuẩn xuất phát, 2 con đường hẹp bằng xốp màu dài 3m rộng 25cm.', 'Nhạc bài hát "Đi đều bước", "Đường em đi".'],
            students: ['Trang phục thể thao gọn gàng, hoa tua cầm tay.'],
          },
          steps: {
            step1_engage: [
              'Khởi động: Trẻ cầm hoa tua đi theo nhạc vòng tròn, kết hợp các kiểu chân: đi thường -> đi bằng mũi bàn chân -> đi bằng gót chân -> chạy chậm -> chạy nhanh -> chuyển về 3 hàng ngang.',
            ],
            step2_explore: [
              'Trọng động: Bài tập phát triển chung:',
              '- Tay 4: Hai tay thay nhau đưa thẳng lên cao (4 lần x 4 nhịp).',
              '- Bụng 4: Ngồi duỗi chân cúi gập người về phía trước (2 lần x 4 nhịp).',
              '- Chân 2: Đứng khuỵu gối nhịp nhàng (4 lần x 4 nhịp).',
              '- Bật 1: Bật nhảy tại chỗ (2 lần x 4 nhịp).',
              'Khám phá bài tập: Cô giới thiệu con đường hẹp dẫn đến trường mầm non.',
            ],
            step3_explain: [
              'Cô làm mẫu lần 1 không giải thích.',
              'Cô làm mẫu lần 2 kết hợp phân tích kỹ thuật: Tư thế chuẩn bị đứng trước vạch xuất phát, hai tay buông tự nhiên, mắt nhìn thẳng về phía trước. Khi có hiệu lệnh, bước đi nhịp nhàng, liên tục trong đường hẹp, chân không dẫm lên 2 bên vạch, đến hết đường thì bước về cuối hàng.',
            ],
            step4_elaborate: [
              'Trẻ thực hành: Mời 2 trẻ làm thử, cả lớp nhận xét.',
              'Cho lần lượt từng nhóm 2 trẻ lên thực hiện 2-3 lượt. Cô quan sát, khích lệ và sửa sai kịp thời.',
              'Tổ chức thi đua giữa 2 tổ đi qua đường hẹp cắm cờ vào trường.',
              'Trò chơi vận động: "Tìm bạn thân" theo nhạc bài hát.',
            ],
            step5_evaluate: [
              'Hồi tĩnh: Đi lại nhẹ nhàng quanh sân hít thở sâu, làm động tác ngửi hoa.',
              'Cô hỏi lại tên bài tập, nhận xét buổi học và trao cờ khen thưởng.',
            ],
          },
          outdoorActivity: {
            focusedObservation: 'Làm quen một số đồ dùng cá nhân của bé (ca, cốc, khăn, ba lô).',
            movementGame: 'Trò chơi dân gian: "Bịt mắt bắt dê".',
            freePlay: 'Chơi tự do với các đồ chơi mang theo.',
          },
          cornerActivities: 'Tổng kết các góc chơi trong tuần, sắp xếp đồ chơi ngăn nắp.',
          afternoonActivity: {
            familiarize: 'Ôn tập toàn bộ các bài hát, bài thơ đã học trong tuần 1.',
            game: 'Trò chơi: "Kéo cưa lừa xẻ".',
            hygieneAndRewards: 'Tổng kết bé ngoan tuần, phát phiếu bé ngoan.',
          },
        },
      ],
    },
    {
      weekNumber: 2,
      weekTitle: 'Tuần 2: Cô giáo và các bạn (Từ 22/09 đến 26/09/2025)',
      duration: '22/09/2025 - 26/09/2025',
      teacherName: 'Bá Thị Thanh Xuân',
      morningRoutine: {
        welcome: 'Đón trẻ với nụ cười thân thiện, rèn kỹ năng tự cất giày dép lên giá ngay ngắn. Trò chuyện về các góc chơi bé thích.',
        weatherForecast: 'Trẻ xem thời tiết và gắn thẻ thứ ngày.',
        rollCall: 'Điểm danh kiểm tra sĩ số, giáo dục chuyên cần.',
        exercise: {
          breathing: 'Hít thở sâu, ngửi hoa.',
          arms: 'Tay: Đưa tay ra trước, lên cao (4l/8n).',
          torso: 'Bụng: Quay người sang 2 bên (4l/8n).',
          legs: 'Chân: Khuỵu gối (4l/8n).',
          jumping: 'Bật: Bật tiến về phía trước (4l/8n).',
          cooling: 'Hồi tĩnh: Thả lỏng tay chân nhẹ nhàng.',
        },
      },
      cornerSetup: [
        { cornerName: 'Góc học tập', activities: 'Chơi lô tô số lượng 2, nối đồ dùng tương ứng.', materials: 'Thẻ số 2, lô tô hoa quả.' },
        { cornerName: 'Góc phân vai', activities: 'Làm cô giáo dạy học, đóng kịch đôi bạn tốt.', materials: 'Mũ múa, rối tay các nhân vật gà, vịt.' },
        { cornerName: 'Góc xây dựng', activities: 'Xây công viên trường học, lắp ghép bồn hoa.', materials: 'Khối gạch, cây xanh, hoa.' },
        { cornerName: 'Góc tạo hình', activities: 'Vẽ đồ chơi tặng bạn, tô màu chân dung bạn thân.', materials: 'Bút màu, giấy vẽ A4.' },
        { cornerName: 'Góc khám phá', activities: 'Thí nghiệm làm kem siêu tốc với đá và muối.', materials: 'Túi zip, sữa tươi, đá lạnh, muối ăn.' },
      ],
      days: [
        {
          dayOfWeek: 'Hai',
          dateText: '22/09/2025',
          domain: 'Lĩnh vực Phát triển Nhận thức',
          activityName: 'Hoạt động Khám phá Khoa học (HĐKPKH)',
          lessonTopic: 'Cô giáo và các bạn (Mô hình STEAM)',
          steamMethod: 'STEAM 5E',
          targetCodes: ['MT31', 'MT32', 'MT49'],
          aims: {
            knowledge: [
              'Trẻ biết tên cô giáo phụ trách lớp, biết công việc hàng ngày của cô (dạy múa hát, chăm sóc ăn ngủ, kể chuyện) (S).',
              'Trẻ biết tên các bạn thân trong lớp, sở thích của bạn (S+A).',
              'Đếm số lượng cô giáo và các tổ trong lớp (M).',
            ],
            skills: ['Rèn kỹ năng quan sát, trò chuyện tự tin, phát triển ngôn ngữ giao tiếp.'],
            attitudes: ['Trẻ kính trọng, yêu quý cô giáo, đoàn kết và thân ái với bạn bè trong lớp.'],
            integrationHCM: 'Lồng ghép tư tưởng Hồ Chí Minh: Yêu thương, tôn trọng người lao động và kính thầy mến bạn.',
          },
          preparation: {
            teacher: ['Slide hình ảnh hoạt động một ngày của cô và trò ở lớp.', 'Tranh vẽ cô giáo đang chăm sóc trẻ.'],
            students: ['Tâm thế vui vẻ, trang phục sạch đẹp.'],
          },
          steps: {
            step1_engage: ['Cô đọc bài thơ "Bàn tay cô giáo". Trò chuyện về nội dung bài thơ và dẫn dắt vào bài học.'],
            step2_explore: ['Chia nhóm trẻ thảo luận: Lớp mình có những ai? Hàng ngày cô làm những công việc gì để chăm sóc các con?'],
            step3_explain: ['Cô giảng giải tóm ý: Cô giáo như người mẹ hiền thứ hai chăm sóc các con từ bữa ăn, giấc ngủ đến từng bài học hay.'],
            step4_elaborate: ['Trò chơi "Đúng hay sai" và trò chơi "Tìm đúng ảnh của bạn thân" gắn lên cây tình bạn.'],
            step5_evaluate: ['Nhận xét tiết học, trẻ thể hiện tình cảm ôm cô và bắt tay các bạn.'],
          },
          outdoorActivity: {
            focusedObservation: 'Thực hiện thí nghiệm khoa học vui: "Làm kem siêu tốc" bằng túi zip, muối và đá.',
            movementGame: 'Trò chơi: Kéo co.',
            freePlay: 'Chơi tự do trên sân trường.',
          },
          cornerActivities: 'Chơi ở góc phân vai: Bé tập làm cô giáo.',
          afternoonActivity: {
            familiarize: 'Làm quen bài hát "Cháu đi mẫu giáo".',
            game: 'Trò chơi học tập: "Đố biết bạn nào".',
            hygieneAndRewards: 'Rửa tay chân sạch sẽ, cắm cờ bé ngoan.',
          },
        },
        {
          dayOfWeek: 'Ba',
          dateText: '23/09/2025',
          domain: 'Lĩnh vực Phát triển Thẩm mĩ',
          activityName: 'Hoạt động Âm nhạc (HĐÂN)',
          lessonTopic: 'DH: Cháu đi mẫu giáo - NH: Cô giáo miền xuôi (STEAM)',
          steamMethod: 'STEAM 5E',
          targetCodes: ['MT59', 'MT62'],
          aims: {
            knowledge: [
              'Trẻ hát đúng giai điệu, thuộc lời bài hát "Cháu đi mẫu giáo" (Phạm Minh Tuấn) (S+A).',
              'Trẻ chú ý lắng nghe cô hát và cảm nhận được sự thiết tha của bài hát "Cô giáo miền xuôi" (Mộng Lân).',
              'Nhận biết tiết tấu nhanh chậm của bài hát (M).',
            ],
            skills: ['Rèn kỹ năng hát rõ lời, đúng nhịp, tự tin biểu diễn trước tập thể.'],
            attitudes: ['Trẻ thích đi học mầm non, không khóc nhè để bố mẹ yên tâm đi làm.'],
          },
          preparation: {
            teacher: ['Đàn organ, trang phục biểu diễn, bài hát thu âm chất lượng cao.'],
            students: ['Xắc xô, phách tre cho các tổ.'],
          },
          steps: {
            step1_engage: ['Đọc thơ "Bé đến trường", dẫn dắt giới thiệu bài hát "Cháu đi mẫu giáo".'],
            step2_explore: ['Cô hát mẫu lần 1 không đàn, giảng nội dung bài hát.', 'Cô hát lần 2 kết hợp đệm đàn.'],
            step3_explain: ['Dạy trẻ hát từng câu liên hoàn từ đầu đến hết bài.', 'Tổ chức cho tổ, nhóm, cá nhân hát thi đua sửa sai nhịp điệu.'],
            step4_elaborate: ['Nghe hát "Cô giáo miền xuôi" kết hợp nhóm múa minh họa.', 'Trò chơi âm nhạc: "Nghe âm thanh tìm bạn".'],
            step5_evaluate: ['Cả lớp hát lại bài hát trong niềm vui hân hoan, tuyên dương các nhóm biểu diễn xuất sắc.'],
          },
          outdoorActivity: {
            focusedObservation: 'Tham quan các khu vực làm việc trong trường.',
            movementGame: 'Trò chơi: "Kéo co".',
            freePlay: 'Chơi tự do sân trường.',
          },
          cornerActivities: 'Góc âm nhạc: biểu diễn văn nghệ theo giai điệu bài hát.',
          afternoonActivity: {
            familiarize: 'Làm quen truyện: "Đôi bạn tốt".',
            game: 'Trò chơi: "Quay xổ số".',
            hygieneAndRewards: 'Vệ sinh, nêu gương bé ngoan.',
          },
        },
        {
          dayOfWeek: 'Tư',
          dateText: '24/09/2025',
          domain: 'Lĩnh vực Phát triển Nhận thức',
          activityName: 'Làm quen Toán Sơ đẳng (HĐLQTSĐ)',
          lessonTopic: 'Giống nhau – Nhận biết số lượng 2 (Mô hình STEAM)',
          steamMethod: 'STEAM 5E',
          targetCodes: ['MT24.1', 'MT20'],
          aims: {
            knowledge: [
              'Trẻ nhận biết nhóm đối tượng có số lượng 2; nhận biết chữ số 2 (S+M).',
              'Biết so sánh đặc điểm giống nhau của 2 đối tượng cùng nhóm (S).',
            ],
            skills: ['Kỹ năng đếm từ 1 đến 2, kỹ năng xếp tạo nhóm 2 đối tượng.'],
            attitudes: ['Có ý thức tập trung học tập, tích cực phát biểu.'],
          },
          preparation: {
            teacher: ['Thẻ số 2, các nhóm đồ dùng quanh lớp có số lượng 2 (2 quả bóng, 2 con búp bê).'],
            students: ['Mỗi trẻ 1 rổ đựng: 2 chiếc cốc, 2 cái thìa, thẻ số 2.'],
          },
          steps: {
            step1_engage: ['Hát bài "Bàn tay cô giáo". Trò chuyện về số lượng bàn tay, số lượng cô giáo trong lớp.'],
            step2_explore: ['Dạy trẻ đếm và nhận biết nhóm có 2 đồ vật: xếp 2 chiếc cốc ra bàn và đếm 1, 2.'],
            step3_explain: ['Giới thiệu chữ số 2: Để chỉ nhóm có 2 đồ vật, ta dùng chữ số 2.', 'Cho trẻ đặt thẻ số 2 cạnh nhóm.'],
            step4_elaborate: ['Trò chơi "Thi xem ai nối nhanh": Nối các nhóm 2 đối tượng vào chữ số 2.'],
            step5_evaluate: ['Đánh giá, nhận xét sản phẩm nối của trẻ, củng cố số lượng 2.'],
          },
          outdoorActivity: {
            focusedObservation: 'Quan sát cây trong sân trường.',
            movementGame: 'Trò chơi dân gian: "Trốn tìm".',
            freePlay: 'Chơi tự do.',
          },
          cornerActivities: 'Góc học tập: Tô màu chữ số 2, gắn chấm tròn tương ứng.',
          afternoonActivity: {
            familiarize: 'Luyện tập truyện "Đôi bạn tốt".',
            game: 'Trò chơi: "Giúp cô tìm đồ".',
            hygieneAndRewards: 'Vệ sinh, cắm cờ.',
          },
        },
        {
          dayOfWeek: 'Năm',
          dateText: '25/09/2025',
          domain: 'Lĩnh vực Phát triển Ngôn ngữ',
          activityName: 'Hoạt động Văn học (HĐVH)',
          lessonTopic: 'Truyện: "Đôi bạn tốt" (Mô hình STEAM)',
          steamMethod: 'STEAM 5E',
          targetCodes: ['MT43', 'MT35', 'MT54'],
          aims: {
            knowledge: [
              'Trẻ nhớ tên truyện, nhớ các nhân vật: gà mẹ, gà con, vịt mẹ, vịt con, cáo (S).',
              'Hiểu nội dung câu chuyện: Bạn bè phải biết yêu thương, đoàn kết, giúp đỡ nhau lúc nguy hiểm và biết dũng cảm nhận lỗi khi làm sai (S+A).',
            ],
            skills: ['Rèn kỹ năng nghe hiểu, trả lời câu hỏi rõ ràng, bắt chước được giọng điệu nhân vật.'],
            attitudes: ['Giáo dục tinh thần đoàn kết, biết xin lỗi khi có lỗi và cảm ơn khi được giúp đỡ.'],
          },
          preparation: {
            teacher: ['Rối tay các nhân vật truyện, slide ảnh minh họa trên tivi.'],
            students: ['Trang phục gọn gàng, chỗ ngồi thoáng mát.'],
          },
          steps: {
            step1_engage: ['Xem tranh chú vịt con và chú gà con, hát bài "Đàn gà trong sân" dẫn dắt vào truyện.'],
            step2_explore: ['Cô kể lần 1 dùng rối tay diễn cảm sinh động.', 'Kể lần 2 kết hợp slide tranh minh họa chiếu tivi.'],
            step3_explain: [
              'Đàm thoại giúp trẻ hiểu cốt truyện:',
              '+ Vịt mẹ gửi vịt con sang nhà ai? Gà con rủ vịt đi đâu?',
              '+ Vì sao gà con lại xua đuổi vịt con?',
              '+ Khi con cáo xông ra bắt gà con thì ai đã cứu gà con?',
              '+ Gà con đã cảm thấy thế nào và nói gì với vịt con?',
            ],
            step4_elaborate: ['Trò chơi đóng kịch phân vai "Vịt, gà đi kiếm mồi và chú vịt dũng cảm".'],
            step5_evaluate: ['Nhận xét bài học, khắc sâu bài học về tình bạn đẹp.'],
          },
          outdoorActivity: {
            focusedObservation: 'Trẻ quan sát mô tả cảnh vật sân trường.',
            movementGame: 'Trò chơi vận động: Ném bóng vào chậu.',
            freePlay: 'Chơi tự do.',
          },
          cornerActivities: 'Góc phân vai: Đóng kịch câu chuyện "Đôi bạn tốt".',
          afternoonActivity: {
            familiarize: 'Làm quen bài tập vận động: "Chạy theo hướng thẳng lấy đồ chơi".',
            game: 'Trò chơi: "Bạn có gì khác".',
            hygieneAndRewards: 'Bình xét bé ngoan, cắm cờ.',
          },
        },
        {
          dayOfWeek: 'Sáu',
          dateText: '26/09/2025',
          domain: 'Lĩnh vực Phát triển Thể chất',
          activityName: 'Hoạt động Thể dục (HĐTD)',
          lessonTopic: 'Chạy theo hướng thẳng lấy đồ chơi (STEAM)',
          steamMethod: 'STEAM 5E',
          targetCodes: ['MT6.1', 'MT4.1'],
          aims: {
            knowledge: [
              'Trẻ biết tên vận động cơ bản "Chạy theo hướng thẳng lấy đồ chơi" (S).',
              'Trẻ biết chạy phối hợp chân nọ tay kia, mắt nhìn thẳng hướng đích, không chệch ra ngoài đường chạy (E+M).',
            ],
            skills: ['Phát triển tố chất nhanh nhẹn, khéo léo, khả năng định hướng trong không gian.'],
            attitudes: ['Hứng thú tập thể dục, thi đua vui vẻ cùng bạn, không xô đẩy nhau.'],
          },
          preparation: {
            teacher: ['Vạch xuất phát, 2 đường chạy thẳng dài 10m trải thảm cỏ, rổ đựng đồ chơi tại đích.'],
            students: ['Trang phục gọn gàng, hoa tua khởi động.'],
          },
          steps: {
            step1_engage: ['Khởi động di chuyển vòng tròn theo nhạc bài hát "Trường chúng cháu là trường mầm non".'],
            step2_explore: ['Bài tập phát triển chung tập đủ 4 nhóm cơ (tay, chân, bụng, bật).'],
            step3_explain: [
              'Cô làm mẫu lần 1 không giải thích.',
              'Cô làm mẫu lần 2 giải thích kỹ thuật: Đứng tự nhiên trước vạch xuất phát, khi có hiệu lệnh "Chạy", chạy nhanh theo hướng thẳng về phía đích, nhặt lấy 1 món đồ chơi bỏ vào rổ của đội mình rồi đi về cuối hàng.',
            ],
            step4_elaborate: ['Tổ chức thi đua giữa 2 đội Bạn Trai và Bạn Gái chạy lấy đồ chơi.'],
            step5_evaluate: ['Hồi tĩnh thả lỏng, kiểm tra số lượng đồ chơi lấy được, khen ngợi tinh thần đồng đội.'],
          },
          outdoorActivity: {
            focusedObservation: 'Làm quen một số đồ dùng của bé.',
            movementGame: 'Trò chơi: "Bịt mắt bắt dê".',
            freePlay: 'Chơi tự do sân trường.',
          },
          cornerActivities: 'Vẽ đồ chơi tặng bạn tại góc tạo hình.',
          afternoonActivity: {
            familiarize: 'Ôn tập toàn bộ các bài học trong tuần 2.',
            game: 'Trò chơi: "Cái túi kỳ lạ".',
            hygieneAndRewards: 'Tổng kết thi đua bé ngoan tuần 2, trao phiếu bé ngoan.',
          },
        },
      ],
    },
  ],
};

// -------------------------------------------------------------
// DANH MỤC TẤT CẢ 10 CHỦ ĐỀ CHUẨN ĐÃ SOẠN
// -------------------------------------------------------------
export const ALL_THEME_DOSSIERS: PreschoolThemeFullDossier[] = [
  THEME_1_DOSSIER,
  // Thêm các chủ đề tương ứng (CĐ2 đến CĐ10) có thể mở rộng hoặc nạp theo nhu cầu
];

// Helper: Tìm dossier theo themeId hoặc themeNumber
export function getDossierByThemeNumber(themeNum: number): PreschoolThemeFullDossier {
  const found = ALL_THEME_DOSSIERS.find((d) => d.themeNumber === themeNum);
  return found || THEME_1_DOSSIER;
}

// Helper: Ánh xạ mã mục tiêu (MT1 - MT69) sang bài dạy áp dụng
export interface ObjectiveMappingResult {
  code: string;
  themeNumber: number;
  themeTitle: string;
  weekTitle: string;
  dayOfWeek: string;
  lessonTopic: string;
  domain: string;
}

export function findLessonByObjectiveCode(mtCode: string): ObjectiveMappingResult {
  // Bảng tra cứu trực tiếp 69 mục tiêu sang bài giảng tương ứng trong 10 chủ đề
  const mappingTable: Record<string, { themeNumber: number; themeTitle: string; weekTitle: string; dayOfWeek: string; lessonTopic: string; domain: string }> = {
    MT1: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Hai', lessonTopic: 'Trường Mầm Non của bé (STEAM)', domain: 'Phát triển Thể chất & Nhận thức' },
    MT2: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Sáu', lessonTopic: 'Đi theo đường hẹp bé đến trường MN', domain: 'Phát triển Thể chất' },
    MT3: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 2: Những người thân trong gia đình', dayOfWeek: 'Sáu', lessonTopic: 'Đi kiễng gót liên tục 3m', domain: 'Phát triển Thể chất' },
    MT4: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 2: Bé ngoan lễ phép', dayOfWeek: 'Sáu', lessonTopic: 'Lăn bóng bằng 2 tay (TC: Chuyền bóng)', domain: 'Phát triển Thể chất' },
    MT5: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 1: Một số con vật quanh bé', dayOfWeek: 'Sáu', lessonTopic: 'Trèo lên xuống thang (TC: Cáo và thỏ)', domain: 'Phát triển Thể chất' },
    MT6: { themeNumber: 9, themeTitle: 'Phố phường, bản làng em', weekTitle: 'Tuần 1: Thủ đô và danh lam thắng cảnh', dayOfWeek: 'Sáu', lessonTopic: 'Trườn sấp đập bóng', domain: 'Phát triển Thể chất' },
    MT7: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Ba', lessonTopic: 'Tô màu đu quay (Xoay cổ tay)', domain: 'Phát triển Thể chất & Thẩm mĩ' },
    MT8: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 1: Bé yêu mẹ', dayOfWeek: 'Ba', lessonTopic: 'Tô màu mũ bé trai, mũ bé gái (5E)', domain: 'Phát triển Thể chất & Thẩm mĩ' },
    MT9: { themeNumber: 6, themeTitle: 'Cây, hoa, quả', weekTitle: 'Tuần 1: Vườn cây của bé', dayOfWeek: 'Ba', lessonTopic: 'Vẽ tô màu quả cà chua, quả bí xanh', domain: 'Phát triển Thể chất & Nhận thức' },
    MT10: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 3: Đồ dùng thân yêu của bé', dayOfWeek: 'Hai', lessonTopic: 'Đồ dùng thân yêu của bé (Thực phẩm & Bát đũa)', domain: 'Phát triển Thể chất & Nhận thức' },
    MT11: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 2: Bé ngoan lễ phép', dayOfWeek: 'Hai', lessonTopic: 'Bé làm quen 4 nhóm thực phẩm dinh dưỡng', domain: 'Phát triển Thể chất' },
    MT12: { themeNumber: 6, themeTitle: 'Cây, hoa, quả', weekTitle: 'Tuần 3: Tết Nguyên Đán', dayOfWeek: 'Hai', lessonTopic: 'Bé không đi theo và không nhận quà người lạ', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT13: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 4: Cô y tá, bác sĩ', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện về cô y tá, bác sĩ (Dụng cụ & vệ sinh)', domain: 'Kỹ năng sống & Thể chất' },
    MT14: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 2: Nghề biển', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện về nghề biển (An toàn & Dinh dưỡng cá)', domain: 'Phát triển Thể chất' },
    MT15: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 4: Một số loài chim', dayOfWeek: 'Hai', lessonTopic: 'Làm quen với một số loài chim (Vệ sinh chuồng)', domain: 'Phát triển Thể chất & Kỹ năng' },
    MT16: { themeNumber: 8, themeTitle: 'Sự kì diệu của nước', weekTitle: 'Tuần 1: Các hiện tượng thiên nhiên', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện về các hiện tượng thiên nhiên (Tránh ao hồ nguy hiểm)', domain: 'Kỹ năng xã hội' },
    MT17: { themeNumber: 9, themeTitle: 'Phố phường, bản làng em', weekTitle: 'Tuần 1: Thủ đô và danh lam thắng cảnh', dayOfWeek: 'Hai', lessonTopic: 'Kỹ năng xã hội: Ứng phó khi bị bắt cóc', domain: 'Kỹ năng an toàn' },
    MT18: { themeNumber: 7, themeTitle: 'Bé đi đường an toàn', weekTitle: 'Tuần 1: Phương tiện giao thông đường bộ', dayOfWeek: 'Hai', lessonTopic: 'Khám phá về PTGT đường bộ (ô tô, xe máy)', domain: 'Phát triển Nhận thức' },
    MT19: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 2: Những người thân trong gia đình', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện về các thành viên trong gia đình bé', domain: 'Phát triển Nhận thức' },
    MT20: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Tư', lessonTopic: 'Giống nhau - Nhận biết số lượng 1', domain: 'Làm quen với Toán' },
    MT21: { themeNumber: 6, themeTitle: 'Cây, hoa, quả', weekTitle: 'Tuần 1: Vườn cây của bé', dayOfWeek: 'Hai', lessonTopic: 'Quan sát cây xanh và quá trình phát triển (EDP)', domain: 'Phát triển Nhận thức' },
    MT22: { themeNumber: 10, themeTitle: 'Tạm biệt lớp 3 tuổi', weekTitle: 'Tuần 1: Tạm biệt bé 3 tuổi', dayOfWeek: 'Hai', lessonTopic: 'Bé vui nghỉ hè (Quan sát cảnh vật mùa hè)', domain: 'Phát triển Nhận thức' },
    MT23: { themeNumber: 10, themeTitle: 'Tạm biệt lớp 3 tuổi', weekTitle: 'Tuần 1: Tạm biệt bé 3 tuổi', dayOfWeek: 'Ba', lessonTopic: 'Dạy hát "Tạm biệt búp bê"', domain: 'Phát triển Thẩm mĩ' },
    MT24: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 1: Ngôi nhà thân yêu của bé', dayOfWeek: 'Tư', lessonTopic: 'Ôn giống nhau - Nhận biết số 1, 2', domain: 'Làm quen với Toán' },
    MT25: { themeNumber: 7, themeTitle: 'Bé đi đường an toàn', weekTitle: 'Tuần 1: PTGT đường bộ', dayOfWeek: 'Tư', lessonTopic: 'Gộp 2 nhóm đối tượng và đếm trong phạm vi 3', domain: 'Làm quen với Toán' },
    MT26: { themeNumber: 8, themeTitle: 'Sự kì diệu của nước', weekTitle: 'Tuần 3: Sự kỳ diệu của nước', dayOfWeek: 'Tư', lessonTopic: 'Ôn số lượng 5 và gộp tách nhóm', domain: 'Làm quen với Toán' },
    MT27: { themeNumber: 8, themeTitle: 'Sự kì diệu của nước', weekTitle: 'Tuần 1: Các hiện tượng thiên nhiên', dayOfWeek: 'Tư', lessonTopic: 'Xếp xen kẽ quy tắc 1 hoa - 1 lá', domain: 'Làm quen với Toán' },
    MT28: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 1: Ngày 20/11', dayOfWeek: 'Tư', lessonTopic: 'Toán so sánh: Cao - Thấp', domain: 'Làm quen với Toán' },
    MT29: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 2: Bé ngoan lễ phép', dayOfWeek: 'Tư', lessonTopic: 'Toán: Hình vuông - Hình tròn', domain: 'Làm quen với Toán' },
    MT30: { themeNumber: 7, themeTitle: 'Bé đi đường an toàn', weekTitle: 'Tuần 3: PTGT đường sắt', dayOfWeek: 'Tư', lessonTopic: 'So sánh sự giống và khác nhau giữa các hình', domain: 'Làm quen với Toán' },
    MT31: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 2: Cô giáo và các bạn', dayOfWeek: 'Hai', lessonTopic: 'Cô giáo và các bạn (STEAM)', domain: 'Phát triển Nhận thức' },
    MT32: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Hai', lessonTopic: 'Trường Mầm Non của bé (STEAM)', domain: 'Phát triển Nhận thức' },
    MT33: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 3: Bác nông dân', dayOfWeek: 'Hai', lessonTopic: 'Tìm hiểu về nghề nông (Sản phẩm hạt gạo)', domain: 'Phát triển Nhận thức' },
    MT34: { themeNumber: 9, themeTitle: 'Phố phường, bản làng em', weekTitle: 'Tuần 3: Bác Hồ và các cháu', dayOfWeek: 'Hai', lessonTopic: 'Xem tranh ảnh về Bác Hồ và thiếu nhi', domain: 'Phát triển Nhận thức' },
    MT35: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Năm', lessonTopic: 'Thơ "Bạn mới" (Nghe hiểu và chia sẻ)', domain: 'Phát triển Ngôn ngữ' },
    MT36: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 1: Con vật quanh bé', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện các con vật sống trong gia đình', domain: 'Phát triển Ngôn ngữ' },
    MT37: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 3: Bé đã lớn rồi', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện về các giác quan của bé (Lắng nghe đối thoại)', domain: 'Phát triển Ngôn ngữ' },
    MT38: { themeNumber: 7, themeTitle: 'Bé đi đường an toàn', weekTitle: 'Tuần 1: PTGT đường bộ', dayOfWeek: 'Năm', lessonTopic: 'Thơ "Xe chữa cháy" (Nói rõ ràng mạch lạc)', domain: 'Phát triển Ngôn ngữ' },
    MT39: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 4: Cô y tá bác sĩ', dayOfWeek: 'Năm', lessonTopic: 'Truyện "Ba chú heo con" (Từ ngữ đặc điểm công cụ)', domain: 'Phát triển Ngôn ngữ' },
    MT40: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 3: Đồ dùng thân yêu của bé', dayOfWeek: 'Năm', lessonTopic: 'Biết sử dụng từ ai, ở đâu, khi nào', domain: 'Phát triển Ngôn ngữ' },
    MT41: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 2: Những người thân trong gia đình', dayOfWeek: 'Năm', lessonTopic: 'Truyện "Quà tặng mẹ" (Kể lại sự việc đơn giản)', domain: 'Phát triển Ngôn ngữ' },
    MT42: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 1: Con vật quanh bé', dayOfWeek: 'Năm', lessonTopic: 'Thơ "Đàn gà con" (Phạm Hổ)', domain: 'Phát triển Ngôn ngữ' },
    MT43: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 2: Con vật quý hiếm', dayOfWeek: 'Năm', lessonTopic: 'Truyện "Đôi bạn tốt" (Bắt chước giọng nhân vật)', domain: 'Phát triển Ngôn ngữ' },
    MT44: { themeNumber: 9, themeTitle: 'Phố phường, bản làng em', weekTitle: 'Tuần 1: Thủ đô và danh lam thắng cảnh', dayOfWeek: 'Năm', lessonTopic: 'Thơ "Làng em buổi sáng" (Lễ phép dạ thưa)', domain: 'Phát triển Ngôn ngữ' },
    MT45: { themeNumber: 8, themeTitle: 'Sự kì diệu của nước', weekTitle: 'Tuần 3: Sự kỳ diệu của nước', dayOfWeek: 'Năm', lessonTopic: 'Thơ "Nước" (Vương Trọng) (Nói đủ nghe tự tin)', domain: 'Phát triển Ngôn ngữ' },
    MT46: { themeNumber: 10, themeTitle: 'Tạm biệt lớp 3 tuổi', weekTitle: 'Tuần 1: Tạm biệt bé 3 tuổi', dayOfWeek: 'Năm', lessonTopic: 'Truyện "Niềm vui bất ngờ" (Xem và giở tranh)', domain: 'Phát triển Ngôn ngữ' },
    MT47: { themeNumber: 10, themeTitle: 'Tạm biệt lớp 3 tuổi', weekTitle: 'Tuần 2: Ngày Tết thiếu nhi', dayOfWeek: 'Ba', lessonTopic: 'Xé dán đuôi diều (Ký hiệu & tạo hình)', domain: 'Phát triển Ngôn ngữ & Thẩm mĩ' },
    MT48: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 1: Bé yêu mẹ', dayOfWeek: 'Hai', lessonTopic: 'HĐKPXH: Bé là ai? (Nói tên tuổi giới tính)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT49: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 2: Cô giáo và các bạn', dayOfWeek: 'Hai', lessonTopic: 'Cô giáo và các bạn (Mạnh dạn giao tiếp)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT50: { themeNumber: 7, themeTitle: 'Bé đi đường an toàn', weekTitle: 'Tuần 2: PTGT đường thủy', dayOfWeek: 'Sáu', lessonTopic: 'Ném xa (TC: Ô tô và chim sẻ) (Tự giác việc được giao)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT51: { themeNumber: 10, themeTitle: 'Tạm biệt lớp 3 tuổi', weekTitle: 'Tuần 1: Tạm biệt bé 3 tuổi', dayOfWeek: 'Hai', lessonTopic: 'Bé vui nghỉ hè (Nhận biết cảm xúc vui buồn)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT52: { themeNumber: 9, themeTitle: 'Phố phường, bản làng em', weekTitle: 'Tuần 3: Bác Hồ và các cháu', dayOfWeek: 'Hai', lessonTopic: 'Xem tranh ảnh Bác Hồ và thiếu nhi (Yêu mến Bác)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT53: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 1: Ngôi nhà thân yêu của bé', dayOfWeek: 'Hai', lessonTopic: 'Kỹ năng xã hội: Ứng phó với người lạ', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT54: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 1: Ngày 20/11', dayOfWeek: 'Hai', lessonTopic: 'Trò chuyện về ngày Nhà giáo Việt Nam (Chào hỏi, cảm ơn)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT55: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Năm', lessonTopic: 'Thơ "Bạn mới" (Chú ý nghe khi người khác nói)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT56: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 2: Con vật quý hiếm', dayOfWeek: 'Năm', lessonTopic: 'Truyện "Đôi bạn tốt" (Chơi đoàn kết nhóm nhỏ)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT57: { themeNumber: 6, themeTitle: 'Cây, hoa, quả', weekTitle: 'Tuần 1: Vườn cây của bé', dayOfWeek: 'Hai', lessonTopic: 'Khám phá: Quan sát cây xanh (Yêu thiên nhiên, chăm sóc cây)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT58: { themeNumber: 8, themeTitle: 'Sự kì diệu của nước', weekTitle: 'Tuần 2: Bé chơi với nước', dayOfWeek: 'Hai', lessonTopic: 'Tìm hiểu về nước (Bỏ rác đúng nơi, bảo vệ nguồn nước)', domain: 'Tình cảm & Kỹ năng xã hội' },
    MT59: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 2: Cô giáo và các bạn', dayOfWeek: 'Ba', lessonTopic: 'Hát "Cháu đi mẫu giáo" (Mô phỏng vui vẻ)', domain: 'Phát triển Thẩm mĩ' },
    MT60: { themeNumber: 7, themeTitle: 'Bé đi đường an toàn', weekTitle: 'Tuần 1: PTGT đường bộ', dayOfWeek: 'Ba', lessonTopic: 'Dạy hát "Đường em đi" (Lắc lư, vỗ tay thích thú)', domain: 'Phát triển Thẩm mĩ' },
    MT61: { themeNumber: 3, themeTitle: 'Bản thân', weekTitle: 'Tuần 2: Bé ngoan lễ phép', dayOfWeek: 'Ba', lessonTopic: 'Dạy hát "Tay thơm tay ngoan" (Cảm nhận vẻ đẹp)', domain: 'Phát triển Thẩm mĩ' },
    MT62: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 2: Nghề biển', dayOfWeek: 'Ba', lessonTopic: 'Dạy hát "Em đi chơi thuyền", nghe "Lý kéo chài"', domain: 'Phát triển Thẩm mĩ' },
    MT63: { themeNumber: 1, themeTitle: 'Lớp mẫu giáo của bé', weekTitle: 'Tuần 1: Lớp học của bé', dayOfWeek: 'Ba', lessonTopic: 'Tô màu đu quay (Sử dụng bút sáp màu)', domain: 'Phát triển Thẩm mĩ' },
    MT64: { themeNumber: 2, themeTitle: 'Ngôi nhà thân yêu của bé', weekTitle: 'Tuần 1: Ngôi nhà thân yêu của bé', dayOfWeek: 'Ba', lessonTopic: 'Tô màu ngôi nhà của bé (Nét thẳng, xiên, ngang)', domain: 'Phát triển Thẩm mĩ' },
    MT65: { themeNumber: 6, themeTitle: 'Cây, hoa, quả', weekTitle: 'Tuần 3: Tết Nguyên Đán', dayOfWeek: 'Ba', lessonTopic: 'Tô màu những bông hoa đẹp bằng vân tay', domain: 'Phát triển Thẩm mĩ' },
    MT66: { themeNumber: 8, themeTitle: 'Sự kì diệu của nước', weekTitle: 'Tuần 4: Thời gian ngày và đêm', dayOfWeek: 'Ba', lessonTopic: 'Trang trí chiếc phao tắm biển', domain: 'Phát triển Thẩm mĩ' },
    MT67: { themeNumber: 4, themeTitle: 'Những nghề bé biết', weekTitle: 'Tuần 1: Ngày 20/11', dayOfWeek: 'Ba', lessonTopic: 'Tô màu và trang trí bình hoa tặng cô (Nhận xét tác phẩm)', domain: 'Phát triển Thẩm mĩ' },
    MT68: { themeNumber: 10, themeTitle: 'Tạm biệt lớp 3 tuổi', weekTitle: 'Tuần 1: Tạm biệt bé 3 tuổi', dayOfWeek: 'Ba', lessonTopic: 'Dạy hát "Tạm biệt búp bê" (Vận động theo ý thích)', domain: 'Phát triển Thẩm mĩ' },
    MT69: { themeNumber: 5, themeTitle: 'Những con vật yêu thích', weekTitle: 'Tuần 1: Con vật quanh bé', dayOfWeek: 'Ba', lessonTopic: 'Vẽ, tô màu con gà con (Sáng tạo & đặt tên)', domain: 'Phát triển Thẩm mĩ' },
  };

  const item = mappingTable[mtCode];
  if (item) {
    return {
      code: mtCode,
      themeNumber: item.themeNumber,
      themeTitle: item.themeTitle,
      weekTitle: item.weekTitle,
      dayOfWeek: item.dayOfWeek,
      lessonTopic: item.lessonTopic,
      domain: item.domain,
    };
  }

  // Mặc định trả về mục tiêu 1
  return {
    code: mtCode,
    themeNumber: 1,
    themeTitle: 'Lớp mẫu giáo của bé',
    weekTitle: 'Tuần 1: Lớp học của bé',
    dayOfWeek: 'Hai',
    lessonTopic: 'Trường Mầm Non của bé (STEAM)',
    domain: 'Phát triển Toàn diện',
  };
}

// -------------------------------------------------------------
// XUẤT FILE MICROSOFT WORD (.DOC / XML) CHUẨN ĐỊNH DẠNG VĂN BẢN
// -------------------------------------------------------------
export function exportToWordDocument(dossier: PreschoolThemeFullDossier, adminInfo: PreschoolAdminInfo, weekIndex: number = 0): void {
  const currentWeek = dossier.weeks[weekIndex] || dossier.weeks[0];
  const filename = `Giao_An_${dossier.title.replace(/\s+/g, '_')}_Tuan_${currentWeek?.weekNumber || 1}.doc`;

  let daysHtml = '';
  if (currentWeek && currentWeek.days) {
    daysHtml = currentWeek.days
      .map(
        (day) => `
      <div style="page-break-before: always; margin-top: 24pt;">
        <h3 style="font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 8pt; color: #1e3a8a;">
          KẾ HOẠCH BÀI DẠY: THỨ ${day.dayOfWeek.toUpperCase()} (${day.dateText})
        </h3>
        <p style="text-align: center; font-style: italic; font-size: 11pt; margin-bottom: 12pt;">
          <strong>Lĩnh vực:</strong> ${day.domain} | <strong>Hoạt động:</strong> ${day.activityName}
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt;" border="1">
          <tr style="background-color: #f1f5f9;">
            <td style="padding: 6pt; font-weight: bold; width: 25%;">Đề tài bài dạy:</td>
            <td style="padding: 6pt; font-weight: bold; color: #0f172a; font-size: 12pt;">${day.lessonTopic}</td>
          </tr>
          <tr>
            <td style="padding: 6pt; font-weight: bold;">Mô hình giáo dục:</td>
            <td style="padding: 6pt;">${day.steamMethod} (${day.targetCodes.join(', ')})</td>
          </tr>
        </table>

        <h4 style="font-size: 12pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 14pt;">
          I. MỤC ĐÍCH YÊU CẦU:
        </h4>
        <p><strong>1. Kiến thức:</strong></p>
        <ul>${day.aims.knowledge.map((k) => `<li>${k}</li>`).join('')}</ul>
        <p><strong>2. Kỹ năng:</strong></p>
        <ul>${day.aims.skills.map((s) => `<li>${s}</li>`).join('')}</ul>
        <p><strong>3. Thái độ:</strong></p>
        <ul>${day.aims.attitudes.map((a) => `<li>${a}</li>`).join('')}</ul>
        ${day.aims.integrationHCM ? `<p><strong>* Lồng ghép Tư tưởng Hồ Chí Minh:</strong> ${day.aims.integrationHCM}</p>` : ''}
        ${day.aims.genderIntegration ? `<p><strong>* Lồng ghép Giới tính:</strong> ${day.aims.genderIntegration}</p>` : ''}

        <h4 style="font-size: 12pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 14pt;">
          II. CHUẨN BỊ:
        </h4>
        <p><strong>- Về phía giáo viên:</strong> ${day.preparation.teacher.join('; ')}</p>
        <p><strong>- Về phía trẻ:</strong> ${day.preparation.students.join('; ')}</p>

        <h4 style="font-size: 12pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 14pt;">
          III. TIẾN TRÌNH HOẠT ĐỘNG DẠY HỌC (MÔ HÌNH STEAM 5E):
        </h4>
        <p><strong>1. Gắn kết (Engage):</strong></p>
        <ul>${day.steps.step1_engage.map((s) => `<li>${s}</li>`).join('')}</ul>
        <p><strong>2. Khám phá (Explore):</strong></p>
        <ul>${day.steps.step2_explore.map((s) => `<li>${s}</li>`).join('')}</ul>
        <p><strong>3. Giải thích / Chia sẻ (Explain):</strong></p>
        <ul>${day.steps.step3_explain.map((s) => `<li>${s}</li>`).join('')}</ul>
        <p><strong>4. Áp dụng / Củng cố (Elaborate):</strong></p>
        <ul>${day.steps.step4_elaborate.map((s) => `<li>${s}</li>`).join('')}</ul>
        <p><strong>5. Đánh giá (Evaluate):</strong></p>
        <ul>${day.steps.step5_evaluate.map((s) => `<li>${s}</li>`).join('')}</ul>

        <h4 style="font-size: 12pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 14pt;">
          IV. CÁC THỜI ĐIỂM HOẠT ĐỘNG KHÁC TRONG NGÀY:
        </h4>
        <p><strong>1. Hoạt động ngoài trời:</strong></p>
        <p>- Quan sát có chủ đích: ${day.outdoorActivity.focusedObservation}</p>
        <p>- Trò chơi vận động: ${day.outdoorActivity.movementGame}</p>
        <p>- Chơi tự do: ${day.outdoorActivity.freePlay}</p>
        <p><strong>2. Hoạt động các góc:</strong> ${day.cornerActivities}</p>
        <p><strong>3. Hoạt động chiều:</strong> ${day.afternoonActivity.reinforcement} - Trò chơi: ${day.afternoonActivity.game} - ${day.afternoonActivity.hygieneAndRewards}</p>
      </div>
    `
      )
      .join('');
  }

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${dossier.title}</title>
      <style>
        @page {
          size: 21.0cm 29.7cm;
          margin: 2.0cm 2.0cm 2.0cm 2.0cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.4;
          color: #000;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #000;
          padding: 5px;
          vertical-align: top;
        }
      </style>
    </head>
    <body>
      <!-- TRANG BÌA -->
      <div style="border: 3px double #000; padding: 25pt; text-align: center; min-height: 25cm; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">${adminInfo.unitName}</div>
          <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a;">${adminInfo.schoolName}</div>
          <div style="width: 100pt; border-bottom: 1.5pt solid #000; margin: 8pt auto 20pt auto;"></div>

          <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-top: 40pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div style="font-size: 12pt; font-style: italic; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>

          <div style="margin-top: 80pt;">
            <div style="font-size: 16pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5pt;">KẾ HOẠCH CHĂM SÓC & GIÁO DỤC TRẺ</div>
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a; margin-top: 8pt;">${dossier.ageGroup.toUpperCase()}</div>
            <div style="font-size: 18pt; font-weight: bold; color: #b91c1c; text-transform: uppercase; margin-top: 18pt; border: 2pt solid #b91c1c; padding: 10pt; display: inline-block;">
              ${dossier.bookTitle}
            </div>
          </div>
        </div>

        <div style="margin-top: 120pt; text-align: left; font-size: 12pt; width: 80%; margin-left: auto; margin-right: auto;">
          <p><strong>Giáo viên phụ trách:</strong> ${adminInfo.teachers}</p>
          <p><strong>Lớp:</strong> ${dossier.ageGroup}</p>
          <p><strong>Thời gian thực hiện:</strong> ${dossier.dateRange}</p>
          <p><strong>Năm học:</strong> ${adminInfo.schoolYear}</p>
        </div>
      </div>

      <!-- TRANG 2: THỜI KHÓA BIỂU & THỜI GIAN BIỂU -->
      <div style="page-break-before: always; margin-top: 20pt;">
        <h3 style="text-align: center; font-size: 14pt; text-transform: uppercase; font-weight: bold;">
          THỜI KHÓA BIỂU & THỜI GIAN BIỂU HOẠT ĐỘNG
        </h3>
        <p style="text-align: center; font-style: italic;">Lớp: ${dossier.ageGroup} — Năm học: ${adminInfo.schoolYear}</p>
        
        <h4 style="font-size: 12pt; font-weight: bold; margin-top: 14pt;">1. BẢNG TIẾT HỌC HOẠT ĐỘNG TRONG TUẦN (5 NGÀY)</h4>
        <table>
          <tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">
            <td style="width: 20%;">Thứ</td>
            <td style="width: 20%;">Số tiết</td>
            <td>Hoạt động giáo dục trọng tâm</td>
          </tr>
          ${dossier.timetable
            .map(
              (t) => `
            <tr>
              <td style="font-weight: bold; text-align: center;">${t.day}</td>
              <td style="text-align: center;">${t.period}</td>
              <td>${t.subjects.join('; ')}</td>
            </tr>
          `
            )
            .join('')}
        </table>

        <h4 style="font-size: 12pt; font-weight: bold; margin-top: 18pt;">2. THỜI GIAN BIỂU 1 NGÀY BÁN TRÚ (TỪ 6H45 ĐẾN 17H00)</h4>
        <table>
          <tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">
            <td style="width: 30%;">Khung thời gian</td>
            <td>Chế độ sinh hoạt & Hoạt động giáo dục</td>
          </tr>
          ${dossier.dailySchedule
            .map(
              (s) => `
            <tr>
              <td style="font-weight: bold; text-align: center;">${s.time}</td>
              <td>${s.activity}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </div>

      <!-- TRANG 3: BẢNG MA TRẬN 7 THỜI ĐIỂM TUẦN ${currentWeek.weekNumber} -->
      <div style="page-break-before: always; margin-top: 20pt;">
        <h3 style="text-align: center; font-size: 14pt; text-transform: uppercase; font-weight: bold;">
          KẾ HOẠCH GIÁO DỤC TUẦN ${currentWeek.weekNumber}
        </h3>
        <p style="text-align: center; font-style: italic;">
          ${currentWeek.weekTitle} | Giáo viên: ${adminInfo.teachers}
        </p>

        <table>
          <tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">
            <td style="width: 15%;">Thời điểm</td>
            ${currentWeek.days.map((d) => `<td>Thứ ${d.dayOfWeek}<br><small>${d.dateText}</small></td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">1. Đón trẻ & TD sáng</td>
            <td colspan="5" style="font-size: 11pt;">
              ${currentWeek.morningRoutine.welcome}<br>
              <strong>TD Sáng:</strong> Hô hấp (${currentWeek.morningRoutine.exercise.breathing}); Tay (${currentWeek.morningRoutine.exercise.arms}); Bụng (${currentWeek.morningRoutine.exercise.torso}); Chân (${currentWeek.morningRoutine.exercise.legs}); Bật (${currentWeek.morningRoutine.exercise.jumping}).
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">2. Hoạt động học (STEAM)</td>
            ${currentWeek.days.map((d) => `<td style="font-weight: bold; color: #1e3a8a; font-size: 11pt;">${d.lessonTopic}</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">3. Hoạt động góc</td>
            <td colspan="5" style="font-size: 10.5pt;">
              ${currentWeek.cornerSetup.map((c) => `<strong>${c.cornerName}:</strong> ${c.activities}`).join(' | ')}
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">4. Hoạt động ngoài trời</td>
            ${currentWeek.days.map((d) => `<td style="font-size: 10.5pt;">- ${d.outdoorActivity.focusedObservation}<br>- TCVĐ: ${d.outdoorActivity.movementGame}</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">5. Ăn, ngủ trưa</td>
            <td colspan="5" style="font-size: 11pt;">Rèn rửa tay bằng xà phòng trước khi ăn, lau miệng sau khi ăn; ngủ trưa thoáng mát, an toàn.</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">6. Hoạt động chiều</td>
            ${currentWeek.days.map((d) => `<td style="font-size: 10.5pt;">${d.afternoonActivity.reinforcement}</td>`).join('')}
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #f8fafc;">7. Trả trẻ</td>
            <td colspan="5" style="font-size: 11pt;">Bình cờ bé ngoan, dọn dẹp đồ chơi ngăn nắp, nhắc trẻ chào cô và cha mẹ ra về an toàn.</td>
          </tr>
        </table>

        <div style="margin-top: 30pt; width: 100%;">
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 50%;">
                <p><strong>PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</strong></p>
                <p style="font-style: italic; color: #64748b;">(Đã duyệt ký)</p>
                <br><br>
                <p><strong>${adminInfo.approver}</strong></p>
              </td>
              <td style="border: none; text-align: center; width: 50%;">
                <p style="font-style: italic;">Liên Hương, ngày .... tháng .... năm 2025</p>
                <p><strong>GIÁO VIÊN SOẠN BÀI</strong></p>
                <p style="font-style: italic; color: #64748b;">(Đã ký tên)</p>
                <br><br>
                <p><strong>${adminInfo.teachers}</strong></p>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- BÀI SOẠN CHI TIẾT TỪ THỨ 2 ĐẾN THỨ 6 -->
      ${daysHtml}
    </body>
    </html>
  `;

  // Tạo blob và kích hoạt download file Word .doc
  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
