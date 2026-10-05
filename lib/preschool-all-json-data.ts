// lib/preschool-all-json-data.ts
// Toàn bộ cơ sở dữ liệu số hóa đầy đủ từ hồ sơ Word/JSON thực tế của trường Mầm Non Đảo Tí Hon & Phước Thể
// Khối 3-4 Tuổi (Cô Võ Thị Hồng Sim, Bá Thị Thanh Xuân) & Nhóm 25-36 Tháng (Cô Nguyễn Thị Thu Thủy, Dương Thị Phương Linh)

export interface YearPlanThemeRow {
  themeName: string;
  totalWeeks: string;
  weekIndex: number;
  subThemeName: string;
  dateRange: string;
  integratedThemes: string[];
}

export interface YearObjectiveItem {
  code: string;
  title: string;
  subCode?: string;
  content: string;
  domain: 'Thể chất' | 'Nhận thức' | 'Ngôn ngữ' | 'Tình cảm - KNXH' | 'Thẩm mĩ';
}

export interface PreschoolDayPlan {
  dayOfWeek: string; // Hai, Ba, Tư, Năm, Sáu
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

export interface PreschoolWeekPlan {
  weekNumber: number;
  weekTitle: string;
  subTheme: string;
  duration: string;
  teacher: string;
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
    };
  };
  cornerSetup: {
    cornerName: string;
    activities: string;
    preparation: string;
  }[];
  days: PreschoolDayPlan[];
}

export interface PreschoolBookDossier {
  bookNumber: number;
  themeTitle: string;
  bookTitle: string;
  ageGroup: 'Lớp 3-4 tuổi' | 'Nhóm 25-36 tháng';
  teachers: string;
  schoolName: string;
  subUnit: string;
  approver: string;
  schoolYear: string;
  dateRange: string;
  totalWeeks: number;
  coverImages: {
    schoolCampus: string;
    classroomActivity: string;
  };
  timetable: {
    day: string;
    period: string;
    activity: string;
  }[];
  dailySchedule: {
    time: string;
    activity: string;
  }[];
  matrixObjectives: {
    category: string;
    targetCode: string;
    content: string;
    activityMapping: string;
  }[];
  environmentPlanning: {
    indoor: string[];
    outdoor: string[];
    social: string[];
  };
  weeks: PreschoolWeekPlan[];
}

// ----------------------------------------------------------------------------------
// 1. DỰ KIẾN 35 TUẦN HỌC & 69 MỤC TIÊU NĂM HỌC 2025 - 2026 (LỚP 3-4 TUỔI)
// ----------------------------------------------------------------------------------
export const YEAR_PLAN_35_WEEKS_3_4T: YearPlanThemeRow[] = [
  { themeName: 'Lớp mẫu giáo của bé (2 tuần)', totalWeeks: '2 tuần', weekIndex: 0, subThemeName: 'Ổn định lớp (1 tuần)', dateRange: '08/09 - 12/09/2025', integratedThemes: ['Rèn nề nếp, làm quen lớp mới'] },
  { themeName: 'Lớp mẫu giáo của bé', totalWeeks: '2 tuần', weekIndex: 1, subThemeName: 'Lớp mẫu giáo của bé', dateRange: '15/09 - 19/09/2025', integratedThemes: ['Tư tưởng HCM', 'Bình đẳng giới', 'Bảo vệ môi trường', 'Kỹ năng sống', 'Bạo lực học đường'] },
  { themeName: 'Lớp mẫu giáo của bé', totalWeeks: '2 tuần', weekIndex: 2, subThemeName: 'Cô Giáo và các bạn', dateRange: '22/09 - 26/09/2025', integratedThemes: ['Tình cảm thầy trò, bạn bè thân ái'] },
  { themeName: 'Ngôi nhà thân yêu của bé (3 tuần)', totalWeeks: '3 tuần', weekIndex: 3, subThemeName: 'Ngôi nhà thân yêu của bé', dateRange: '29/09 - 03/10/2025', integratedThemes: ['Bình đẳng giới', 'Bảo vệ môi trường', 'Tiết kiệm năng lượng', 'Kỹ năng sống', 'Dinh dưỡng'] },
  { themeName: 'Ngôi nhà thân yêu của bé', totalWeeks: '3 tuần', weekIndex: 4, subThemeName: 'Những người thân trong gia đình bé', dateRange: '06/10 - 10/10/2025', integratedThemes: ['Kính trọng ông bà, vâng lời cha mẹ'] },
  { themeName: 'Ngôi nhà thân yêu của bé', totalWeeks: '3 tuần', weekIndex: 5, subThemeName: 'Đồ dùng thân yêu của bé', dateRange: '13/10 - 17/10/2025', integratedThemes: ['Giữ gìn bảo quản đồ dùng gia đình'] },
  { themeName: 'Bản Thân (4 tuần)', totalWeeks: '4 tuần', weekIndex: 6, subThemeName: 'Bé yêu mẹ (20/10)', dateRange: '20/10 - 24/10/2025', integratedThemes: ['Giới tính', 'Dinh dưỡng', 'Kỹ năng sống'] },
  { themeName: 'Bản Thân', totalWeeks: '4 tuần', weekIndex: 7, subThemeName: 'Bé ngoan lễ phép', dateRange: '27/10 - 31/10/2025', integratedThemes: ['Lễ phép, chào hỏi, cảm ơn, xin lỗi'] },
  { themeName: 'Bản Thân', totalWeeks: '4 tuần', weekIndex: 8, subThemeName: 'Bé đã lớn rồi', dateRange: '03/11 - 07/11/2025', integratedThemes: ['Tự phục vụ, nhận biết các bộ phận cơ thể'] },
  { themeName: 'Bản Thân', totalWeeks: '4 tuần', weekIndex: 9, subThemeName: 'Bé và các bạn', dateRange: '10/11 - 14/11/2025', integratedThemes: ['5 giác quan của bé, hòa đồng chia sẻ'] },
  { themeName: 'Những nghề bé biết (4 tuần)', totalWeeks: '4 tuần', weekIndex: 10, subThemeName: 'Ngày nhà giáo Việt Nam 20/11', dateRange: '17/11 - 21/11/2025', integratedThemes: ['Tư tưởng HCM', 'Nhà giáo Việt Nam', 'Bình đẳng giới', 'Biến đổi khí hậu', 'Kỹ năng sống'] },
  { themeName: 'Những nghề bé biết', totalWeeks: '4 tuần', weekIndex: 11, subThemeName: 'Nghề biển', dateRange: '24/11 - 28/11/2025', integratedThemes: ['Tìm hiểu đặc sản quê hương Phước Thể'] },
  { themeName: 'Những nghề bé biết', totalWeeks: '4 tuần', weekIndex: 12, subThemeName: 'Bác nông dân', dateRange: '01/12 - 05/12/2025', integratedThemes: ['Biết ơn người lao động, quý trọng hạt gạo'] },
  { themeName: 'Những nghề bé biết', totalWeeks: '4 tuần', weekIndex: 13, subThemeName: 'Cô Y tá, Bác sĩ', dateRange: '08/12 - 12/12/2025', integratedThemes: ['Dũng cảm khi khám bệnh, giữ gìn sức khỏe'] },
  { themeName: 'Những con vật yêu thích (4 tuần)', totalWeeks: '4 tuần', weekIndex: 14, subThemeName: 'Một số con vật quanh bé', dateRange: '15/12 - 19/12/2025', integratedThemes: ['Ngày QĐNDVN 22/12', 'Kỹ năng sống', 'Dinh dưỡng', 'Bảo vệ môi trường'] },
  { themeName: 'Những con vật yêu thích', totalWeeks: '4 tuần', weekIndex: 15, subThemeName: 'Một số con vật quý hiếm', dateRange: '22/12 - 26/12/2025', integratedThemes: ['Bảo vệ động vật hoang dã'] },
  { themeName: 'Những con vật yêu thích', totalWeeks: '4 tuần', weekIndex: 16, subThemeName: 'Một số con vật sống dưới nước', dateRange: '29/12/2025 - 02/01/2026', integratedThemes: ['Bảo vệ nguồn nước, môi trường biển'] },
  { themeName: 'Những con vật yêu thích', totalWeeks: '4 tuần', weekIndex: 17, subThemeName: 'Một số loài chim', dateRange: '05/01 - 09/01/2026', integratedThemes: ['Chăm sóc cây và chim muông'] },
  { themeName: 'Ôn tập (1 tuần)', totalWeeks: '1 tuần', weekIndex: 18, subThemeName: 'ÔN TẬP HỌC KỲ I', dateRange: '12/01 - 16/01/2026', integratedThemes: ['Hệ thống kiến thức HKI'] },
  { themeName: 'Cây, Hoa, Quả (3 tuần)', totalWeeks: '3 tuần', weekIndex: 19, subThemeName: 'Vườn cây của bé', dateRange: '19/01 - 23/01/2026', integratedThemes: ['Tư tưởng HCM (Tết trồng cây)', 'Biến đổi khí hậu', 'Kỹ năng sống', 'Dinh dưỡng'] },
  { themeName: 'Cây, Hoa, Quả', totalWeeks: '3 tuần', weekIndex: 20, subThemeName: 'Hoa ngày tết', dateRange: '26/01 - 30/01/2026', integratedThemes: ['Phong tục tết, hoa mai hoa đào'] },
  { themeName: 'Cây, Hoa, Quả', totalWeeks: '3 tuần', weekIndex: 21, subThemeName: 'Tết Nguyên Đán', dateRange: '02/02 - 06/02/2026', integratedThemes: ['Văn hóa ngày tết truyền thống'] },
  { themeName: 'Nghỉ Tết Nguyên Đán', totalWeeks: '2 tuần', weekIndex: -1, subThemeName: 'Nghỉ Tết Bính Ngọ', dateRange: '09/02 - 20/02/2026', integratedThemes: ['Vui tết an toàn, giữ gìn sức khỏe'] },
  { themeName: 'Bé đi đường an toàn (4 tuần)', totalWeeks: '4 tuần', weekIndex: 22, subThemeName: 'Phương tiện giao thông đường bộ', dateRange: '23/02 - 27/02/2026', integratedThemes: ['Bình đẳng giới', 'An toàn giao thông', 'Kỹ năng sống', 'Phòng chống tai nạn'] },
  { themeName: 'Bé đi đường an toàn', totalWeeks: '4 tuần', weekIndex: 23, subThemeName: 'Phương tiện giao thông đường thủy', dateRange: '02/03 - 06/03/2026', integratedThemes: ['Mặc áo phao an toàn khi đi thuyền'] },
  { themeName: 'Bé đi đường an toàn', totalWeeks: '4 tuần', weekIndex: 24, subThemeName: 'Phương tiện giao thông đường sắt', dateRange: '09/03 - 13/03/2026', integratedThemes: ['Quy tắc an toàn đường tàu'] },
  { themeName: 'Bé đi đường an toàn', totalWeeks: '4 tuần', weekIndex: 25, subThemeName: 'Phương tiện giao thông Đường không', dateRange: '16/03 - 20/03/2026', integratedThemes: ['Ước mơ phi công, máy bay'] },
  { themeName: 'Sự kì diệu của nước (4 tuần)', totalWeeks: '4 tuần', weekIndex: 26, subThemeName: 'Các hiện tượng thiên nhiên', dateRange: '23/03 - 27/03/2026', integratedThemes: ['Biến đổi khí hậu', 'Bảo vệ nguồn nước', 'Kỹ năng sống'] },
  { themeName: 'Sự kì diệu của nước', totalWeeks: '4 tuần', weekIndex: 27, subThemeName: 'Bé chơi với nước', dateRange: '30/03 - 03/04/2026', integratedThemes: ['Thí nghiệm vật chìm nổi, tan không tan'] },
  { themeName: 'Sự kì diệu của nước', totalWeeks: '4 tuần', weekIndex: 28, subThemeName: 'Sự kỳ diệu của nước', dateRange: '06/04 - 10/04/2026', integratedThemes: ['Tiết kiệm nước sinh hoạt'] },
  { themeName: 'Sự kì diệu của nước', totalWeeks: '4 tuần', weekIndex: 29, subThemeName: 'Thời gian ngày và đêm', dateRange: '13/04 - 17/04/2026', integratedThemes: ['Chu kỳ ngày đêm, mặt trời mặt trăng'] },
  { themeName: 'Phố phường bản làng em (3 tuần)', totalWeeks: '3 tuần', weekIndex: 30, subThemeName: 'Thủ đô và danh lam thắng cảnh', dateRange: '20/04 - 24/04/2026', integratedThemes: ['Tư tưởng HCM', 'Kỹ năng sống phòng tránh bắt cóc'] },
  { themeName: 'Phố phường bản làng em', totalWeeks: '3 tuần', weekIndex: 31, subThemeName: 'Cảnh đẹp quê em', dateRange: '27/04 - 01/05/2026', integratedThemes: ['Nghỉ giỗ tổ 10/3, nghỉ 30/4 - 1/5, chùa Cổ Thạch, Hòn Cau'] },
  { themeName: 'Phố phường bản làng em', totalWeeks: '3 tuần', weekIndex: 32, subThemeName: 'Bác Hồ và các cháu thiếu nhi', dateRange: '04/05 - 08/05/2026', integratedThemes: ['Kính yêu Bác Hồ, thực hiện 5 điều Bác dạy'] },
  { themeName: 'Tạm biệt lớp 3 tuổi (2 tuần)', totalWeeks: '2 tuần', weekIndex: 33, subThemeName: 'Tạm biệt bé 3 tuổi', dateRange: '11/05 - 15/05/2026', integratedThemes: ['Tư tưởng HCM', 'Bình đẳng giới', 'Kỹ năng sống'] },
  { themeName: 'Tạm biệt lớp 3 tuổi', totalWeeks: '2 tuần', weekIndex: 34, subThemeName: 'Ngày tết thiếu nhi 1/6', dateRange: '18/05 - 22/05/2026', integratedThemes: ['Quyền trẻ em, vui đón mùa hè'] },
  { themeName: 'Ôn Tập', totalWeeks: '1 tuần', weekIndex: 35, subThemeName: 'Ôn tập HKII & Tổng kết năm học', dateRange: '25/05 - 29/05/2026', integratedThemes: ['Đánh giá sự phát triển trẻ cuối năm'] },
];

// ----------------------------------------------------------------------------------
// 2. KHUNG 69 MỤC TIÊU GIÁO DỤC NĂM HỌC 3-4 TUỔI (MT1 -> MT69)
// ----------------------------------------------------------------------------------
export const FULL_69_OBJECTIVES_3_4T: YearObjectiveItem[] = [
  // I. Giáo dục phát triển thể chất (MT1 - MT17)
  { code: 'MT1', title: 'Cân nặng, chiều cao', content: 'Cháu có chiều cao và cân nặng bình thường so với tuổi.', domain: 'Thể chất' },
  { code: 'MT1.1', title: 'Cân đo tháng 9 quý I', content: 'Cháu có chiều cao, cân nặng bình thường so với tuổi.', domain: 'Thể chất' },
  { code: 'MT1.2', title: 'Cân đo tháng 12 quý II', content: 'Cháu có chiều cao, cân nặng bình thường so với tuổi.', domain: 'Thể chất' },
  { code: 'MT1.3', title: 'Cân đo tháng 4 quý III', content: 'Cháu có chiều cao, cân nặng bình thường so với tuổi.', domain: 'Thể chất' },
  { code: 'MT2', title: 'Thực hiện đủ các động tác thể dục', content: 'Thực hiện thuần thục các nhóm bài tập cơ tay, bụng lườn, chân, bật.', domain: 'Thể chất' },
  { code: 'MT3', title: 'Giữ thăng bằng cơ thể trong vận động', content: 'Cháu thực hiện thuần thục các bài tập đi, chạy, bò, trườn, trèo, ném, bật nhảy.', domain: 'Thể chất' },
  { code: 'MT3.1', title: 'Đi hết đoạn đường hẹp', content: 'Cháu thực hiện bài tập phát triển chung, đi trong đường hẹp thành thạo.', domain: 'Thể chất' },
  { code: 'MT3.2', title: 'Đi kiễng gót liên tục 3m', content: 'Cháu thực hiện bài tập phát triển chung, đi kiễng gót liên tục 3m.', domain: 'Thể chất' },
  { code: 'MT4', title: 'Kiểm soát được các vận động', content: 'Cháu đổi hướng vận động theo tín hiệu và vật chuẩn.', domain: 'Thể chất' },
  { code: 'MT4.1', title: 'Đi chạy thay đổi tốc độ theo hiệu lệnh', content: 'Đổi hướng vận động theo tín hiệu và vật chuẩn.', domain: 'Thể chất' },
  { code: 'MT4.2', title: 'Chạy liên tục trong đường dích dắc không chệch ra ngoài (CS13)', content: 'Chạy dích dắc khéo léo không chạm chướng ngại vật.', domain: 'Thể chất' },
  { code: 'MT5', title: 'Phối hợp tay - mắt trong vận động', content: 'Biết phối hợp các giác quan mắt - tay để bắt, ném bóng.', domain: 'Thể chất' },
  { code: 'MT5.1', title: 'Tung bắt bóng với cô', content: 'Tung và bắt bóng nhịp nhàng không làm rơi bóng.', domain: 'Thể chất' },
  { code: 'MT5.2', title: 'Tự đập - bắt bóng 3 lần liên tiếp', content: 'Đập bóng xuống sàn và bắt bóng khéo léo 3 lần.', domain: 'Thể chất' },
  { code: 'MT6', title: 'Thể hiện nhanh, mạnh, khéo trong bài tập tổng hợp', content: 'Chạy, ném, bò một cách thuần thục, đúng kỹ thuật.', domain: 'Thể chất' },
  { code: 'MT6.1', title: 'Chạy 15m liên tục hướng thẳng', content: 'Chạy thẳng hướng mắt nhìn về trước 15m liên tục.', domain: 'Thể chất' },
  { code: 'MT6.2', title: 'Ném trúng đích nằm ngang', content: 'Dùng lực cổ tay ném túi cát trúng đích nằm ngang.', domain: 'Thể chất' },
  { code: 'MT6.3', title: 'Bò trong đường hẹp không chệch ra ngoài', content: 'Bò phối hợp tay nọ chân kia trong đường hẹp.', domain: 'Thể chất' },
  { code: 'MT7', title: 'Cử động bàn tay, ngón tay', content: 'Vo, xoáy, xoắn, vặn, búng, vê, ấn, gắn, nối bàn tay.', domain: 'Thể chất' },
  { code: 'MT7.1', title: 'Xoay tròn cổ tay', content: 'Thực hiện thuần thục các động tác xoay tròn cổ tay.', domain: 'Thể chất' },
  { code: 'MT7.2', title: 'Gập đan ngón tay vào nhau', content: 'Gập đan các ngón tay khéo léo, dẻo dai.', domain: 'Thể chất' },
  { code: 'MT8', title: 'Phối hợp cử động bàn tay trong hoạt động', content: 'Lắp ghép hình, xé dán, tô vẽ hình, cài cởi cúc, xâu buộc dây.', domain: 'Thể chất' },
  { code: 'MT9', title: 'Nói tên thực phẩm quen thuộc', content: 'Nhận biết các nhóm thực phẩm và lợi ích đối với sức khỏe.', domain: 'Thể chất' },
  { code: 'MT10', title: 'Nói tên món ăn hàng ngày (CS19)', content: 'Trứng rán, cá kho, canh rau, các món ăn chế biến đơn giản.', domain: 'Thể chất' },
  { code: 'MT11', title: 'Ăn uống đa dạng để mau lớn', content: 'Nhận biết các bữa ăn trong ngày và ăn nhiều loại thức ăn bổ dưỡng.', domain: 'Thể chất' },
  { code: 'MT12', title: 'Tự phục vụ sinh hoạt', content: 'Tập đánh răng, rửa tay bằng xà phòng, đi vệ sinh đúng nơi quy định.', domain: 'Thể chất' },
  { code: 'MT13', title: 'Sử dụng bát, thìa, cốc đúng cách', content: 'Cầm thìa xúc gọn gàng, không nói chuyện khi ăn, không làm rơi vãi.', domain: 'Thể chất' },
  { code: 'MT14', title: 'Hành vi tốt trong ăn uống', content: 'Mời cô mời bạn trước khi ăn, uống nước đun sôi, không uống nước lã.', domain: 'Thể chất' },
  { code: 'MT15', title: 'Vệ sinh phòng bệnh', content: 'Đội mũ khi ra nắng, bỏ rác đúng nơi, báo người lớn khi bị mệt.', domain: 'Thể chất' },
  { code: 'MT16', title: 'Tránh vật dụng nguy hiểm (CS21)', content: 'Tránh bàn là, bếp đang đun, ổ điện, ao hồ, vật sắc nhọn.', domain: 'Thể chất' },
  { code: 'MT17', title: 'Tránh hành động nguy hiểm (CS22)', content: 'Không cười đùa khi ăn quả có hạt, không ra khỏi trường khi chưa xin phép.', domain: 'Thể chất' },

  // II. Giáo dục phát triển nhận thức (MT18 - MT34)
  { code: 'MT18', title: 'Quan tâm sự vật hiện tượng xung quanh', content: 'Chăm chú quan sát sự vật và đặt câu hỏi về đối tượng.', domain: 'Nhận thức' },
  { code: 'MT19', title: 'Thu thập thông tin đối tượng', content: 'Xem sách, tranh ảnh và trò chuyện để thu thập thông tin.', domain: 'Nhận thức' },
  { code: 'MT20', title: 'Phân loại đối tượng theo 1 dấu hiệu', content: 'Phân loại phương tiện giao thông, đồ dùng đồ chơi theo dấu hiệu nổi bật.', domain: 'Nhận thức' },
  { code: 'MT21', title: 'Nhận ra mối quan hệ đơn giản', content: 'Nhận xét mối quan hệ giữa các sự vật, hiện tượng gần gũi.', domain: 'Nhận thức' },
  { code: 'MT22', title: 'Mô tả dấu hiệu nổi bật của đối tượng', content: 'Quan sát và mô tả dấu hiệu nổi bật với sự gợi mở của cô giáo.', domain: 'Nhận thức' },
  { code: 'MT23', title: 'Thể hiện hiểu biết qua các hoạt động', content: 'Thể hiện hiểu biết qua trò chơi, âm nhạc và tạo hình.', domain: 'Nhận thức' },
  { code: 'MT24', title: 'Đếm và nhận biết số lượng', content: 'Hỏi về số lượng và đếm các đồ vật xung quanh trong phạm vi 5.', domain: 'Nhận thức' },
  { code: 'MT24.1', title: 'Số lượng 1-2', content: 'Nhận biết, đếm đồ vật có số lượng 1, 2.', domain: 'Nhận thức' },
  { code: 'MT24.2', title: 'Số lượng 3', content: 'Nhận biết, đếm đồ vật có số lượng 3.', domain: 'Nhận thức' },
  { code: 'MT24.3', title: 'Số lượng 4', content: 'Nhận biết, đếm đồ vật có số lượng 4.', domain: 'Nhận thức' },
  { code: 'MT24.4', title: 'Số lượng 5', content: 'Nhận biết, đếm đồ vật có số lượng 5.', domain: 'Nhận thức' },
  { code: 'MT25', title: 'So sánh số lượng 2 nhóm đối tượng', content: 'Sử dụng từ: bằng nhau, nhiều hơn, ít hơn trong phạm vi 5.', domain: 'Nhận thức' },
  { code: 'MT26', title: 'Gộp tách nhóm đối tượng phạm vi 5', content: 'Biết gộp và tách 2 nhóm đối tượng trong phạm vi 5.', domain: 'Nhận thức' },
  { code: 'MT26.1', title: 'Gộp 2 nhóm đối tượng phạm vi 5', content: 'Biết gộp 2 nhóm đối tượng trong phạm vi 5 và đếm.', domain: 'Nhận thức' },
  { code: 'MT26.2', title: 'Tách 2 nhóm đối tượng phạm vi 5', content: 'Biết tách một nhóm thành 2 nhóm nhỏ trong phạm vi 5.', domain: 'Nhận thức' },
  { code: 'MT27', title: 'Nhận ra quy tắc sắp xếp đơn giản', content: 'Nhận biết và sao chép lại quy tắc xếp xen kẽ 1-1.', domain: 'Nhận thức' },
  { code: 'MT28', title: 'So sánh kích thước 2 đối tượng', content: 'Sử dụng các từ: to hơn/nhỏ hơn, dài hơn/ngắn hơn, cao hơn/thấp hơn.', domain: 'Nhận thức' },
  { code: 'MT29', title: 'Nhận dạng và gọi tên các hình', content: 'Nhận biết hình tròn, vuông, tam giác, chữ nhật và tính chất lăn.', domain: 'Nhận thức' },
  { code: 'MT29.1', title: 'Hình tròn, hình vuông', content: 'Phân biệt đặc điểm hình tròn (lăn được), hình vuông (có góc cạnh).', domain: 'Nhận thức' },
  { code: 'MT29.2', title: 'Tam giác, chữ nhật', content: 'Nhận biết hình tam giác (3 góc 3 cạnh), chữ nhật (2 cạnh dài 2 cạnh ngắn).', domain: 'Nhận thức' },
  { code: 'MT30', title: 'Chỉ vị trí không gian so với bản thân', content: 'Sử dụng lời nói chỉ vị trí: phía trước/sau, phía trên/dưới, phải/trái.', domain: 'Nhận thức' },
  { code: 'MT31', title: 'Nói họ tên, tuổi, giới tính bản thân', content: 'Nói tên tuổi, giới tính, người thân trong gia đình khi được trò chuyện.', domain: 'Nhận thức' },
  { code: 'MT32', title: 'Nói tên, công việc cô giáo và nhân viên trường', content: 'Biết tên và công việc của các cô giáo, bác bảo vệ, cô cấp dưỡng.', domain: 'Nhận thức' },
  { code: 'MT33', title: 'Kể tên sản phẩm của một số nghề (CS98)', content: 'Nói được dụng cụ và sản phẩm đặc trưng của các nghề phổ biến.', domain: 'Nhận thức' },
  { code: 'MT34', title: 'Kể tên danh lam thắng cảnh địa phương', content: 'Biết các địa danh Chùa Cổ Thạch, Hòn Cau, Bãi đá con tại Bình Thạnh.', domain: 'Nhận thức' },

  // III. Giáo dục phát triển ngôn ngữ (MT35 - MT47)
  { code: 'MT35', title: 'Thực hiện yêu cầu đơn giản', content: 'Hiểu lời nói và thực hiện các mệnh lệnh đơn giản của cô giáo.', domain: 'Ngôn ngữ' },
  { code: 'MT36', title: 'Hiểu nghĩa từ khái quát (CS36)', content: 'Rau, quả, con vật, đồ dùng gia đình, phương tiện giao thông.', domain: 'Ngôn ngữ' },
  { code: 'MT36.1', title: 'Rau, củ, quả', content: 'Các từ chỉ đặc điểm, lợi ích của rau củ quả.', domain: 'Ngôn ngữ' },
  { code: 'MT36.2', title: 'Con vật', content: 'Các từ chỉ tiếng kêu, môi trường sống của con vật.', domain: 'Ngôn ngữ' },
  { code: 'MT36.3', title: 'Gia đình', content: 'Các từ chỉ công dụng đồ dùng và các mối quan hệ gia đình.', domain: 'Ngôn ngữ' },
  { code: 'MT37', title: 'Lắng nghe và trả lời người đối thoại', content: 'Chú ý lắng nghe câu hỏi và trả lời tròn câu, rõ ràng.', domain: 'Ngôn ngữ' },
  { code: 'MT38', title: 'Nói rõ tiếng', content: 'Phát âm rõ ràng, diễn đạt mạch lạc mong muốn của bản thân.', domain: 'Ngôn ngữ' },
  { code: 'MT39', title: 'Sử dụng từ thông dụng chỉ sự vật hoạt động', content: 'Biết dùng từ ngữ mô tả các thí nghiệm, cảm nhận vị ngọt, chua, mặn.', domain: 'Ngôn ngữ' },
  { code: 'MT40', title: 'Sử dụng câu đơn, câu ghép (CS67)', content: 'Dùng câu khẳng định, phủ định, câu ghép diễn đạt ý nghĩ.', domain: 'Ngôn ngữ' },
  { code: 'MT41', title: 'Kể lại sự việc đơn giản (CS70)', content: 'Kể lại trình tự công việc: sáng học, trưa ăn cơm, chiều về với mẹ.', domain: 'Ngôn ngữ' },
  { code: 'MT42', title: 'Đọc thuộc thơ, ca dao, đồng dao', content: 'Đọc diễn cảm các bài thơ trong chủ đề với ngữ điệu sinh động.', domain: 'Ngôn ngữ' },
  { code: 'MT43', title: 'Kể lại truyện đơn giản bắt chước giọng điệu', content: 'Bắt chước ngữ điệu của nhân vật theo sự gợi ý của người lớn.', domain: 'Ngôn ngữ' },
  { code: 'MT44', title: 'Sử dụng từ lễ phép trong giao tiếp', content: 'Biết nói “Cảm ơn”, “Xin lỗi”, “Vâng ạ”, “Dạ thưa” đúng hoàn cảnh.', domain: 'Ngôn ngữ' },
  { code: 'MT45', title: 'Nói đủ nghe không lí nhí', content: 'Tự tin phát biểu to, rõ ràng trước tập thể lớp.', domain: 'Ngôn ngữ' },
  { code: 'MT46', title: 'Làm quen việc đọc xem tranh', content: 'Biết cầm sách đúng chiều, giở từng trang và gọi tên nhân vật tranh.', domain: 'Ngôn ngữ' },
  { code: 'MT47', title: 'Thích vẽ viết nguệch ngoạc', content: 'Dùng ký hiệu hoặc nét vẽ thể hiện ý tưởng và cảm xúc cá nhân.', domain: 'Ngôn ngữ' },

  // IV. Giáo dục phát triển tình cảm & kỹ năng xã hội (MT48 - MT58)
  { code: 'MT48', title: 'Nói tên tuổi giới tính và điều không thích', content: 'Tự tin nói về bản thân, sở thích và điều không thích.', domain: 'Tình cảm - KNXH' },
  { code: 'MT49', title: 'Mạnh dạn tham gia hoạt động', content: 'Tự tin xung phong, trả lời câu hỏi và tham gia góc chơi.', domain: 'Tình cảm - KNXH' },
  { code: 'MT50', title: 'Cố gắng hoàn thành công việc được giao (CS31)', content: 'Kiên trì hoàn thành bài tập nặn, xếp hình, thu dọn đồ chơi.', domain: 'Tình cảm - KNXH' },
  { code: 'MT51', title: 'Nhận biết cảm xúc qua nét mặt (CS35)', content: 'Nhận ra trạng thái vui, buồn, sợ hãi, tức giận, ngạc nhiên.', domain: 'Tình cảm - KNXH' },
  { code: 'MT52', title: 'Kính yêu Bác Hồ', content: 'Thích xem tranh ảnh, nghe kể chuyện, đọc thơ và múa hát về Bác Hồ.', domain: 'Tình cảm - KNXH' },
  { code: 'MT53', title: 'Thực hiện quy định lớp và gia đình', content: 'Cất đồ chơi gọn gàng sau khi chơi, vâng lời ông bà cha mẹ.', domain: 'Tình cảm - KNXH' },
  { code: 'MT54', title: 'Chào hỏi, cảm ơn, xin lỗi', content: 'Chào cô khi vào lớp, chào bố mẹ khi ra về, cảm ơn khi nhận quà.', domain: 'Tình cảm - KNXH' },
  { code: 'MT55', title: 'Chú ý nghe khi cô và bạn nói', content: 'Tôn trọng người nói, không ngắt lời cô giáo và bạn bè.', domain: 'Tình cảm - KNXH' },
  { code: 'MT56', title: 'Cùng chơi với bạn theo nhóm nhỏ', content: 'Hòa đồng, biết chia sẻ đồ chơi, không tranh giành đồ chơi.', domain: 'Tình cảm - KNXH' },
  { code: 'MT57', title: 'Quan tâm chăm sóc cây xanh', content: 'Thích ngắm hoa, tưới nước cho cây, không ngắt lá bẻ cành.', domain: 'Tình cảm - KNXH' },
  { code: 'MT58', title: 'Bỏ rác đúng nơi quy định', content: 'Tự giác nhặt rác bỏ vào thùng, giữ gìn môi trường trường lớp sạch đẹp.', domain: 'Tình cảm - KNXH' },

  // V. Giáo dục phát triển thẩm mĩ (MT59 - MT69)
  { code: 'MT59', title: 'Cảm nhận vẻ đẹp âm thanh và thiên nhiên', content: 'Vui sướng vỗ tay làm động tác mô phỏng khi nghe âm thanh gợi cảm.', domain: 'Thẩm mĩ' },
  { code: 'MT60', title: 'Thích thú nhún nhảy theo bài hát', content: 'Lắc lư, nhún nhảy theo giai điệu bài hát và đọc thơ đồng dao.', domain: 'Thẩm mĩ' },
  { code: 'MT61', title: 'Ngắm nhìn vẻ đẹp tác phẩm tạo hình', content: 'Vui sướng, chỉ sờ và nói lên cảm nhận trước tác phẩm đẹp.', domain: 'Thẩm mĩ' },
  { code: 'MT62', title: 'Hát và vận động tự nhiên', content: 'Hát đúng giai điệu bài hát quen thuộc và vận động minh họa tự nhiên.', domain: 'Thẩm mĩ' },
  { code: 'MT63', title: 'Sử dụng nguyên vật liệu mở tạo hình', content: 'Tận dụng lá cây, dĩa nhựa, vỏ sò tạo ra sản phẩm sáng tạo.', domain: 'Thẩm mĩ' },
  { code: 'MT64', title: 'Vẽ, xé các nét thẳng xiên ngang tạo tranh', content: 'Vẽ các nét cơ bản tạo thành bức tranh đơn giản.', domain: 'Thẩm mĩ' },
  { code: 'MT64.1', title: 'Vẽ nét thẳng xiên ngang', content: 'Cầm bút đúng cách vẽ tia nắng, mưa rơi, con đường.', domain: 'Thẩm mĩ' },
  { code: 'MT64.2', title: 'Xé dải dán sản phẩm đơn giản', content: 'Xé giấy thành dải dài làm dây cờ, đuôi diều.', domain: 'Thẩm mĩ' },
  { code: 'MT65', title: 'Lăn dọc xoay tròn ấn dẹp đất nặn', content: 'Tạo sản phẩm có 1 hoặc 2 khối (đôi đũa, quả bóng, bánh tròn).', domain: 'Thẩm mĩ' },
  { code: 'MT66', title: 'Xếp chồng, xếp cạnh tạo cấu trúc đơn giản', content: 'Xếp nhà 1 tầng, nhà cao tầng, gara ô tô, chuồng thú.', domain: 'Thẩm mĩ' },
  { code: 'MT67', title: 'Nhận xét tác phẩm tạo hình', content: 'Nêu nhận xét về sản phẩm của mình và của bạn (màu sắc, hình dáng).', domain: 'Thẩm mĩ' },
  { code: 'MT68', title: 'Vận động sáng tạo theo bài hát quen thuộc', content: 'Tự do sáng tạo động tác múa theo cảm xúc âm nhạc.', domain: 'Thẩm mĩ' },
  { code: 'MT69', title: 'Tạo sản phẩm theo ý thích và đặt tên', content: 'Nói ý tưởng sản phẩm tạo hình và tự hào đặt tên cho tác phẩm.', domain: 'Thẩm mĩ' },
];

// ----------------------------------------------------------------------------------
// 3. DANH SÁCH 10 QUYỂN GIÁO ÁN CHI TIẾT (LỚP 3-4T & 25-36T)
// ----------------------------------------------------------------------------------

// Dữ liệu mẫu hoàn chỉnh Quyển 1: Lớp mẫu giáo của bé (Trang 1 -> 8 tách biệt)
import { THEME_1_DOSSIER } from './preschool-full-dossiers';

// Danh sách các Quyển Chủ Đề khối 3-4 Tuổi
export const MASTER_DOSSIER_LIST_3_4T = [
  {
    bookNumber: 1,
    themeTitle: 'LỚP MẪU GIÁO CỦA BÉ',
    bookTitle: 'QUYỂN 1: LỚP MẪU GIÁO CỦA BÉ',
    totalWeeks: 2,
    dateRange: 'Từ ngày 15/09/2025 đến 26/09/2025',
    subThemes: ['Tuần 1: Lớp học của bé (15/09 - 19/09)', 'Tuần 2: Cô giáo và các bạn (22/09 - 26/09)'],
    dossier: THEME_1_DOSSIER,
  },
  {
    bookNumber: 2,
    themeTitle: 'NGÔI NHÀ THÂN YÊU CỦA BÉ',
    bookTitle: 'QUYỂN 2: NGÔI NHÀ THÂN YÊU CỦA BÉ',
    totalWeeks: 3,
    dateRange: 'Từ ngày 29/09 đến 17/10/2025',
    subThemes: ['Tuần 1: Ngôi nhà thân yêu của bé (29/09 - 03/10)', 'Tuần 2: Những người thân trong gia đình bé (06/10 - 10/10)', 'Tuần 3: Đồ dùng thân yêu của bé (13/10 - 17/10)'],
  },
  {
    bookNumber: 3,
    themeTitle: 'BẢN THÂN',
    bookTitle: 'QUYỂN 3: BẢN THÂN',
    totalWeeks: 4,
    dateRange: 'Từ ngày 20/10 đến 14/11/2025',
    subThemes: ['Tuần 1: Bé yêu mẹ 20/10 (20/10 - 24/10)', 'Tuần 2: Bé ngoan lễ phép (27/10 - 31/10)', 'Tuần 3: Bé đã lớn rồi (03/11 - 07/11)', 'Tuần 4: Bé và các bạn (10/11 - 14/11)'],
  },
  {
    bookNumber: 4,
    themeTitle: 'NHỮNG NGHỀ BÉ BIẾT',
    bookTitle: 'QUYỂN 4: NHỮNG NGHỀ BÉ BIẾT',
    totalWeeks: 4,
    dateRange: 'Từ ngày 17/11 đến 12/12/2025',
    subThemes: ['Tuần 1: Ngày nhà giáo Việt Nam 20/11', 'Tuần 2: Nghề biển Phước Thể', 'Tuần 3: Bác nông dân', 'Tuần 4: Cô y tá, bác sĩ'],
  },
  {
    bookNumber: 5,
    themeTitle: 'NHỮNG CON VẬT YÊU THÍCH',
    bookTitle: 'QUYỂN 5: NHỮNG CON VẬT YÊU THÍCH',
    totalWeeks: 4,
    dateRange: 'Từ ngày 15/12/2025 đến 09/01/2026',
    subThemes: ['Tuần 1: Một số con vật quanh bé', 'Tuần 2: Một số con vật quý hiếm', 'Tuần 3: Một số con vật sống dưới nước', 'Tuần 4: Một số loài chim'],
  },
  {
    bookNumber: 6,
    themeTitle: 'CÂY, HOA, QUẢ',
    bookTitle: 'QUYỂN 6: CÂY, HOA, QUẢ',
    totalWeeks: 3,
    dateRange: 'Từ ngày 19/01/2026 đến 06/02/2026',
    subThemes: ['Tuần 1: Vườn cây của bé', 'Tuần 2: Hoa ngày tết', 'Tuần 3: Tết Nguyên Đán'],
  },
  {
    bookNumber: 7,
    themeTitle: 'BÉ ĐI ĐƯỜNG AN TOÀN',
    bookTitle: 'QUYỂN 7: BÉ ĐI ĐƯỜNG AN TOÀN',
    totalWeeks: 4,
    dateRange: 'Từ ngày 23/02/2026 đến 20/03/2026',
    subThemes: ['Tuần 1: Phương tiện giao thông đường bộ', 'Tuần 2: Phương tiện giao thông đường thủy', 'Tuần 3: Phương tiện giao thông đường sắt', 'Tuần 4: Phương tiện giao thông đường hàng không'],
  },
  {
    bookNumber: 8,
    themeTitle: 'SỰ KÌ DIỆU CỦA NƯỚC',
    bookTitle: 'QUYỂN 8: SỰ KÌ DIỆU CỦA NƯỚC',
    totalWeeks: 4,
    dateRange: 'Từ ngày 23/03/2026 đến 17/04/2026',
    subThemes: ['Tuần 1: Các hiện tượng thiên nhiên', 'Tuần 2: Bé chơi với nước', 'Tuần 3: Sự kỳ diệu của nước', 'Tuần 4: Thời gian ngày và đêm'],
  },
  {
    bookNumber: 9,
    themeTitle: 'PHỐ PHƯỜNG, BẢN LÀNG EM',
    bookTitle: 'QUYỂN 9: PHỐ PHƯỜNG, BẢN LÀNG EM',
    totalWeeks: 3,
    dateRange: 'Từ ngày 20/04/2026 đến 08/05/2026',
    subThemes: ['Tuần 1: Thủ đô và danh lam thắng cảnh', 'Tuần 2: Cảnh đẹp quê em (nghỉ 30/4 - 1/5)', 'Tuần 3: Bác Hồ và các cháu thiếu nhi'],
  },
  {
    bookNumber: 10,
    themeTitle: 'TẠM BIỆT LỚP 3 TUỔI',
    bookTitle: 'QUYỂN 10: TẠM BIỆT LỚP 3 TUỔI',
    totalWeeks: 2,
    dateRange: 'Từ ngày 11/05/2026 đến 22/05/2026',
    subThemes: ['Tuần 1: Tạm biệt bé 3 tuổi', 'Tuần 2: Ngày tết thiếu nhi 1/6'],
  },
];

// ----------------------------------------------------------------------------------
// 4. DANH MỤC KẾ HOẠCH GIÁO DỤC THÁNG (KHGD) KHỐI 25-36 THÁNG
// ----------------------------------------------------------------------------------
export const MONTHLY_PLANS_25_36T = [
  {
    themeNumber: 1,
    title: 'Bé vui đến trường',
    duration: '2 tuần (15/09 - 26/09/2025)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu (Phó Hiệu trưởng CM)',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Lớp học của bé (15/09 - 19/09/2025) - Cô Thủy phụ trách',
        schedule: [
          { day: 'Hai', date: '15/09/2025', activity: 'HĐNBTN: Trò chuyện về lớp học của bé (STEAM)' },
          { day: 'Ba', date: '16/09/2025', activity: 'HĐTH: Làm quen bút và giấy (STEAM)' },
          { day: 'Tư', date: '17/09/2025', activity: 'HĐNBPB: Tặng đồ chơi màu đỏ cho bé (STEAM)' },
          { day: 'Năm', date: '18/09/2025', activity: 'HĐVH: Cô giáo của em (STEAM)' },
          { day: 'Sáu', date: '19/09/2025', activity: 'PTVĐ: Đi theo hiệu lệnh. TC: Chim bay (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Cô giáo và các bạn (22/09 - 26/09/2025) - Cô Linh phụ trách',
        schedule: [
          { day: 'Hai', date: '22/09/2025', activity: 'HĐNBTN: Tìm hiểu về các công việc của cô giáo (STEAM)' },
          { day: 'Ba', date: '23/09/2025', activity: 'GDÂN: DH: Đi nhà trẻ - NH: Cô và mẹ - TCÂN: Bóng tròn to (STEAM)' },
          { day: 'Tư', date: '24/09/2025', activity: 'HĐNBPB: Tặng đồ chơi màu xanh cho bé (STEAM)' },
          { day: 'Năm', date: '25/09/2025', activity: 'HĐVH: Truyện “Đôi bạn tốt” (STEAM)' },
          { day: 'Sáu', date: '26/09/2025', activity: 'HĐVĐ: Bò trong đường hẹp. TC: Chim sẻ và ô tô (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 3,
    title: 'Bản thân',
    duration: '4 tuần (20/10 - 14/11/2025)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu (Phó Hiệu trưởng CM)',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Bé yêu mẹ (20/10 - 24/10/2025) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '20/10/2025', activity: 'HĐKPXH: Kỹ năng thể hiện cảm xúc (STEAM)' },
          { day: 'Ba', date: '21/10/2025', activity: 'HĐTH: Tô màu cái trống lắc (STEAM)' },
          { day: 'Tư', date: '22/10/2025', activity: 'HĐNBPB: Tặng đồ chơi có màu vàng cho bé (STEAM)' },
          { day: 'Năm', date: '23/10/2025', activity: 'HĐVH: Thơ: Bạn mới (STEAM)' },
          { day: 'Sáu', date: '24/10/2025', activity: 'HĐVĐ: Đi trong đường hẹp. TC: Chuyền bóng (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Bé ngoan lễ phép (27/10 - 31/10/2025) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '27/10/2025', activity: 'HĐNBTN: Trò chuyện Bé ngoan lễ phép (STEAM)' },
          { day: 'Ba', date: '28/10/2025', activity: 'HĐÂN: DH “Đi nhà trẻ” - NH: Khám tay - TCÂN: Nói đúng tên bạn (STEAM)' },
          { day: 'Tư', date: '29/10/2025', activity: 'HĐNBPB: Nhận biết hình tròn - hình vuông (STEAM)' },
          { day: 'Năm', date: '30/10/2025', activity: 'HĐVH: Truyện “Đôi tai xấu xí” (STEAM)' },
          { day: 'Sáu', date: '31/10/2025', activity: 'HĐVĐ: Đi bước qua vật cản. TC: Bắt bướm (STEAM)' },
        ],
      },
      {
        weekNum: 3,
        title: 'Tuần 3: Bé đã lớn rồi (03/11 - 07/11/2025) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '03/11/2025', activity: 'HĐNBTN: Làm quen 1 số bộ phận trên cơ thể của bé (STEAM)' },
          { day: 'Ba', date: '04/11/2025', activity: 'HĐTH: Xé giấy thành dải (STEAM)' },
          { day: 'Tư', date: '05/11/2025', activity: 'HĐNBPB: Nhận biết màu đỏ - màu xanh (STEAM)' },
          { day: 'Năm', date: '06/11/2025', activity: 'HĐVH: Thơ “Bàn tay mẹ” (STEAM)' },
          { day: 'Sáu', date: '07/11/2025', activity: 'HĐVĐ: Bước lên xuống bật cao 15cm. TC: Chim bay (STEAM)' },
        ],
      },
      {
        weekNum: 4,
        title: 'Tuần 4: Bé và các bạn (10/11 - 14/11/2025) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '10/11/2025', activity: 'HĐNBTN: Trò chuyện về 5 giác quan của bé (STEAM)' },
          { day: 'Ba', date: '11/11/2025', activity: 'HĐÂN: DH: Hai bàn tay của em - NH: Bé khỏe bé ngoan - TC: Bạn ở đâu (STEAM)' },
          { day: 'Tư', date: '12/11/2025', activity: 'HĐNBPB: Ôn nhận biết màu đỏ - vàng, to - nhỏ (STEAM)' },
          { day: 'Năm', date: '13/11/2025', activity: 'HĐVH: Truyện: Đôi bạn nhỏ (STEAM)' },
          { day: 'Sáu', date: '14/11/2025', activity: 'HĐVĐ: Bật tại chỗ. TC: Chuyền bóng (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 4,
    title: 'Những nghề bé biết',
    duration: '4 tuần (17/11 - 12/12/2025)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Ngày nhà giáo Việt Nam 20/11 (17/11 - 21/11/2025) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '17/11/2025', activity: 'HĐNBTN: Trò chuyện về ngày nhà giáo Việt Nam 20/11 (STEAM)' },
          { day: 'Ba', date: '18/11/2025', activity: 'HĐTH: Vẽ hoa tặng cô giáo (STEAM)' },
          { day: 'Tư', date: '19/11/2025', activity: 'HĐNBPB: Nhận biết màu đỏ, màu xanh, màu vàng (STEAM)' },
          { day: 'Năm', date: '20/11/2025', activity: 'HĐVH: Thơ “Các cô thợ” (STEAM)' },
          { day: 'Sáu', date: '21/11/2025', activity: 'HĐVĐ: Tung bóng bằng hai tay (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Nghề biển (24/11 - 28/11/2025) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '24/11/2025', activity: 'HĐNBTN: Trò chuyện về nghề biển (STEAM)' },
          { day: 'Ba', date: '25/11/2025', activity: 'HĐÂN: DH: Em tập lái ô tô, NH: Bố em làm phi công, TCÂN: Tai ai tinh (STEAM)' },
          { day: 'Tư', date: '26/11/2025', activity: 'HĐNBPB: Nhận biết số lượng một - nhiều (STEAM)' },
          { day: 'Năm', date: '27/11/2025', activity: 'HĐVH: Truyện “Cây rau của Thỏ út” (STEAM)' },
          { day: 'Sáu', date: '28/11/2025', activity: 'HĐVĐ: Đi có mang túi cát trên đầu (STEAM)' },
        ],
      },
      {
        weekNum: 3,
        title: 'Tuần 3: Bác nông dân (01/12 - 05/12/2025) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '01/12/2025', activity: 'HĐNBTN: Tìm hiểu về nghề nông (STEAM)' },
          { day: 'Ba', date: '02/12/2025', activity: 'HĐÂN: DH: Cháu yêu cô chú công nhân, NH: Em làm bác sĩ, TC: Nói đúng nghề (STEAM)' },
          { day: 'Tư', date: '03/12/2025', activity: 'HĐNBPB: Ôn nhận biết một, nhiều (STEAM)' },
          { day: 'Năm', date: '04/12/2025', activity: 'HĐVH: Truyện “Gà trống choai và hạt đậu” (STEAM)' },
          { day: 'Sáu', date: '05/12/2025', activity: 'HĐVĐ: Bật tách khép chân (STEAM)' },
        ],
      },
      {
        weekNum: 4,
        title: 'Tuần 4: Cô y tá, Bác sĩ (08/12 - 12/12/2025) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '08/12/2025', activity: 'HĐNBTN: Trò chuyện về cô y tá, Bác sĩ (STEAM)' },
          { day: 'Ba', date: '09/12/2025', activity: 'HĐTH: Tô màu cái xô cho cô cấp dưỡng (STEAM)' },
          { day: 'Tư', date: '10/12/2025', activity: 'HĐNBPB: Ôn nhận biết hình tròn, hình vuông, màu xanh vàng (STEAM)' },
          { day: 'Năm', date: '11/12/2025', activity: 'HĐVH: Thơ “Làm nghề như bố” (STEAM)' },
          { day: 'Sáu', date: '12/12/2025', activity: 'HĐVĐ: Chạy theo đường dích dắc (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 6,
    title: 'Ngày Tết của bé',
    duration: '3 tuần (19/01 - 06/02/2026)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Trò chuyện về ngày Tết (19/01 - 23/01/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '19/01/2026', activity: 'HĐNBTN: Trò chuyện cùng cháu về ngày Tết (STEAM)' },
          { day: 'Ba', date: '20/01/2026', activity: 'HĐÂN: DH: Sắp đến tết rồi (T1); NH: Lý cây bông; TCÂN: Tai ai tinh (STEAM)' },
          { day: 'Tư', date: '21/01/2026', activity: 'HĐNBPB: Ôn nhận biết to - nhỏ (STEAM)' },
          { day: 'Năm', date: '22/01/2026', activity: 'HĐVH: Thơ “Tết về đến ngõ” (STEAM)' },
          { day: 'Sáu', date: '23/01/2026', activity: 'HĐVĐ: Bò chui qua cổng (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Trò chơi ngày Tết (26/01 - 30/01/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '26/01/2026', activity: 'HĐNBTN: Trẻ làm quen các trò chơi ngày Tết (STEAM)' },
          { day: 'Ba', date: '27/01/2026', activity: 'HĐTH: Tô màu cái bánh chưng (STEAM)' },
          { day: 'Tư', date: '28/01/2026', activity: 'HĐNBPB: Nhận biết số lượng một - nhiều (STEAM)' },
          { day: 'Năm', date: '29/01/2026', activity: 'HĐVH: Truyện “Chiếc áo mùa xuân” (STEAM)' },
          { day: 'Sáu', date: '30/01/2026', activity: 'HĐVĐ: Đi có mang vật trên tay – Lộn cầu vồng (STEAM)' },
        ],
      },
      {
        weekNum: 3,
        title: 'Tuần 3: Món ăn hoa quả ngày Tết (02/02 - 06/02/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '02/02/2026', activity: 'HĐNBTN: Hoa quả và 1 số món ăn ngày Tết (STEAM)' },
          { day: 'Ba', date: '03/02/2026', activity: 'HĐÂN: DH: Sắp đến tết rồi (T2); NH: Bé chúc Tết; TCÂN: Nghe tiếng hát đoán tên (STEAM)' },
          { day: 'Tư', date: '04/02/2026', activity: 'HĐNBPB: Nhận biết vị trí trong không gian: trước - sau (STEAM)' },
          { day: 'Năm', date: '05/02/2026', activity: 'HĐVH: Thơ “Cây đào” (STEAM)' },
          { day: 'Sáu', date: '06/02/2026', activity: 'HĐVĐ: Ném xa bằng 1 tay (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 7,
    title: 'Bé đi đường an toàn',
    duration: '4 tuần (23/02 - 20/03/2026)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: PTGT đường bộ (23/02 - 27/02/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '23/02/2026', activity: 'HĐNBTN: Trò chuyện PTGT đường bộ (ô tô - xe máy) (STEAM)' },
          { day: 'Ba', date: '24/02/2026', activity: 'HĐTH: Tô màu ô tô (STEAM)' },
          { day: 'Tư', date: '25/02/2026', activity: 'HĐNBPB: Bé phân biệt ít - nhiều (STEAM)' },
          { day: 'Năm', date: '26/02/2026', activity: 'HĐVH: Truyện “Xe lu và xe ca” (STEAM)' },
          { day: 'Sáu', date: '27/02/2026', activity: 'HĐVĐ: Đi kết hợp với chạy (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: PTGT đường thủy (02/03 - 06/03/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '02/03/2026', activity: 'HĐNBTN: Trò chuyện PTGT đường thủy (Tàu thủy - thuyền buồm) (STEAM)' },
          { day: 'Ba', date: '03/03/2026', activity: 'HĐÂN: DH: Em đi chơi thuyền; NH: Bạn ơi có biết; TCÂN: Tai ai tinh (STEAM)' },
          { day: 'Tư', date: '04/03/2026', activity: 'HĐNBPB: Bé chọn hình tròn (STEAM)' },
          { day: 'Năm', date: '05/03/2026', activity: 'HĐVH: Thơ “Con thuyền” (STEAM)' },
          { day: 'Sáu', date: '06/03/2026', activity: 'HĐVĐ: Chạy theo hướng thẳng (STEAM)' },
        ],
      },
      {
        weekNum: 3,
        title: 'Tuần 3: PTGT đường sắt (09/03 - 13/03/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '09/03/2026', activity: 'HĐNBTN: Bé biết gì về tàu hỏa (STEAM)' },
          { day: 'Ba', date: '10/03/2026', activity: 'HĐÂN: DH: Đoàn tàu nhỏ xíu; NH: Qua ngã tư đường phố; TCÂN: Nghe tiếng hát (STEAM)' },
          { day: 'Tư', date: '11/03/2026', activity: 'HĐNBPB: Phân biệt hình tròn, hình vuông (STEAM)' },
          { day: 'Năm', date: '12/03/2026', activity: 'HĐVH: Truyện “Chiếc đầu máy xe lửa nhỏ tốt bụng” (STEAM)' },
          { day: 'Sáu', date: '13/03/2026', activity: 'HĐVĐ: Bật liên tục vào vòng (STEAM)' },
        ],
      },
      {
        weekNum: 4,
        title: 'Tuần 4: PTGT đường không (16/03 - 20/03/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '16/03/2026', activity: 'HĐNBTN: Trò chuyện về PTGT đường hàng không (máy bay – Trực thăng) (STEAM)' },
          { day: 'Ba', date: '17/03/2026', activity: 'HĐTH: Dán máy bay (STEAM)' },
          { day: 'Tư', date: '18/03/2026', activity: 'HĐNBPB: Bé chọn màu đỏ to - màu vàng nhỏ (STEAM)' },
          { day: 'Năm', date: '19/03/2026', activity: 'HĐVH: Thơ “Ơi chiếc máy bay” (STEAM)' },
          { day: 'Sáu', date: '20/03/2026', activity: 'HĐVĐ: Đi bước vào các ô (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 8,
    title: 'Cây, hoa, quả',
    duration: '3 tuần (23/03 - 10/04/2026)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Bé yêu cây xanh (23/03 - 27/03/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '23/03/2026', activity: 'HĐNBTN: Cây xanh quanh bé (STEAM)' },
          { day: 'Ba', date: '24/03/2026', activity: 'HĐTH: Dán lá cho cây hoa (STEAM)' },
          { day: 'Tư', date: '25/03/2026', activity: 'HĐNBPB: Nhận biết to – nhỏ (STEAM)' },
          { day: 'Năm', date: '26/03/2026', activity: 'HĐVH: Truyện “Nhổ củ cải” (STEAM)' },
          { day: 'Sáu', date: '27/03/2026', activity: 'HĐVĐ: Ném bóng trúng đích - TCVĐ: Đuổi bắt bóng (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Bé yêu hoa đẹp (30/03 - 03/04/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '30/03/2026', activity: 'HĐNBTN: Một số hoa (STEAM)' },
          { day: 'Ba', date: '31/03/2026', activity: 'HĐÂN: DH: Màu hoa; NH: Lý cây bông; TCÂN: Nghe tiếng hát (STEAM)' },
          { day: 'Tư', date: '01/04/2026', activity: 'HĐNBPB: Ôn nhận biết to, nhỏ (STEAM)' },
          { day: 'Năm', date: '02/04/2026', activity: 'HĐVH: Thơ: Dán hoa tặng mẹ (STEAM)' },
          { day: 'Sáu', date: '03/04/2026', activity: 'HĐVĐ: Đi trong đường hẹp 3m có mang vật trên tay (STEAM)' },
        ],
      },
      {
        weekNum: 3,
        title: 'Tuần 3: Quả ngọt quanh bé (06/04 - 10/04/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '06/04/2026', activity: 'HĐNBTN: Làm quen quả chuối, cam (STEAM)' },
          { day: 'Ba', date: '07/04/2026', activity: 'HĐTH: Tô màu quả táo (STEAM)' },
          { day: 'Tư', date: '08/04/2026', activity: 'HĐNBPB: Chọn quả màu xanh, đỏ (STEAM)' },
          { day: 'Năm', date: '09/04/2026', activity: 'HĐVH: Truyện “Gấu con ngoan” (STEAM)' },
          { day: 'Sáu', date: '10/04/2026', activity: 'HĐVĐ: Bò trong đường hẹp có mang vật trên lưng (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 9,
    title: 'Bé yêu mùa hè',
    duration: '4 tuần (13/04 - 08/05/2026)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Các hiện tượng thiên nhiên (13/04 - 17/04/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '13/04/2026', activity: 'HĐNBTN: Trò chuyện với trẻ về các HTTN (STEAM)' },
          { day: 'Ba', date: '14/04/2026', activity: 'HĐTH: Vẽ các tia nắng (STEAM)' },
          { day: 'Tư', date: '15/04/2026', activity: 'HĐNBPB: Ôn: Tặng đồ chơi màu vàng, xanh cho bé (STEAM)' },
          { day: 'Năm', date: '16/04/2026', activity: 'HĐVH: Truyện: Giọt nước tí xíu (STEAM)' },
          { day: 'Sáu', date: '17/04/2026', activity: 'HĐVĐ: Đi theo hiệu lệnh. TC: Kéo co (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Mùa hè đến rồi (20/04 - 24/04/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '20/04/2026', activity: 'HĐNBTN: Mùa hè đến rồi (STEAM)' },
          { day: 'Ba', date: '21/04/2026', activity: 'HĐÂN: DH: Trời nắng trời mưa; NH: Cho tôi đi làm mưa với; TC: Mưa to mưa nhỏ (STEAM)' },
          { day: 'Tư', date: '22/04/2026', activity: 'HĐNBPB: Ôn: Nhận biết một - nhiều (STEAM)' },
          { day: 'Năm', date: '23/04/2026', activity: 'HĐVH: Thơ “Hồ sen” (STEAM)' },
          { day: 'Sáu', date: '24/04/2026', activity: 'HĐVĐ: Ném bóng trúng đích - TCVĐ: Đuổi bắt bóng (STEAM)' },
        ],
      },
      {
        weekNum: 3,
        title: 'Tuần 3: Thời tiết mùa hè (27/04 - 01/05/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '27/04/2026', activity: 'Nghỉ lễ mùng 10/3 âm lịch Giỗ tổ Hùng Vương' },
          { day: 'Ba', date: '28/04/2026', activity: 'HĐTH: Tô màu chiếc áo của mẹ (STEAM)' },
          { day: 'Tư', date: '29/04/2026', activity: 'HĐNBPB: Nhận biết to, nhỏ (STEAM)' },
          { day: 'Năm', date: '30/04/2026', activity: 'Nghỉ lễ 30/4 Giải phóng Miền Nam' },
          { day: 'Sáu', date: '01/05/2026', activity: 'Nghỉ lễ 01/5 Quốc tế lao động' },
        ],
      },
      {
        weekNum: 4,
        title: 'Tuần 4: Trang phục mùa hè (04/05 - 08/05/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '04/05/2026', activity: 'HĐNBTN: Trang phục về mùa hè (STEAM)' },
          { day: 'Ba', date: '05/05/2026', activity: 'HĐÂN: DH: Nắng sớm; NH: Mưa rơi; TCAN: Âm thanh đó là gì? (STEAM)' },
          { day: 'Tư', date: '06/05/2026', activity: 'HĐNBPB: Nhận biết trên dưới (STEAM)' },
          { day: 'Năm', date: '07/05/2026', activity: 'HĐVH: Truyện “Chiếc ô của Thỏ trắng” (STEAM)' },
          { day: 'Sáu', date: '08/05/2026', activity: 'HĐVĐ: Đá bóng về trước 1,5m (STEAM)' },
        ],
      },
    ],
  },
  {
    themeNumber: 10,
    title: 'Bé lên mẫu giáo',
    duration: '2 tuần (11/05 - 22/05/2026)',
    teacher: 'Nguyễn Thị Thu Thủy & Dương Thị Phương Linh',
    approver: 'Lê Thị Ngọc Châu',
    weeks: [
      {
        weekNum: 1,
        title: 'Tuần 1: Lớp mẫu giáo của bé (11/05 - 15/05/2026) - Cô Thủy',
        schedule: [
          { day: 'Hai', date: '11/05/2026', activity: 'HĐNBTN: Khám phá môi trường mẫu giáo (STEAM)' },
          { day: 'Ba', date: '12/05/2026', activity: 'GDÂN: DH: Cháu đi mẫu giáo - NH: Trường chúng cháu là trường mầm non – TCÂN: Âm thanh đó là gì? (STEAM)' },
          { day: 'Tư', date: '13/05/2026', activity: 'HĐNBPB: Ôn: Phân biệt hình tròn, hình vuông (STEAM)' },
          { day: 'Năm', date: '14/05/2026', activity: 'HĐVH: Truyện “Vịt con đi học” (STEAM)' },
          { day: 'Sáu', date: '15/05/2026', activity: 'PTVĐ: Chạy theo hiệu lệnh. TC: Chuyền bóng (STEAM)' },
        ],
      },
      {
        weekNum: 2,
        title: 'Tuần 2: Ngày Tết thiếu nhi (18/05 - 22/05/2026) - Cô Linh',
        schedule: [
          { day: 'Hai', date: '18/05/2026', activity: 'HĐNBTN: Trò chuyện về ngày Tết thiếu nhi (STEAM)' },
          { day: 'Ba', date: '19/05/2026', activity: 'HĐTH: Tô màu bánh ga tô (STEAM)' },
          { day: 'Tư', date: '20/05/2026', activity: 'HĐNBPB: Ôn nhận biết màu đỏ, vàng, xanh (STEAM)' },
          { day: 'Năm', date: '21/05/2026', activity: 'HĐVH: Thơ “Bó hoa tặng cô” (STEAM)' },
          { day: 'Sáu', date: '22/05/2026', activity: 'HĐVĐ: Bò thẳng hướng và có vật trên lưng. TC: Nu na nu nống (STEAM)' },
        ],
      },
    ],
  },
];
