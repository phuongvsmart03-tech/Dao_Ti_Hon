// lib/preschool-curriculum-data.ts
// Dữ liệu Chuẩn Kế Hoạch Giáo Dục & Giáo Án Mầm Non 10 Chủ Đề và 69 Mục Tiêu Phát Triển Toàn Diện (STEAM 5E/EDP)

export interface PreschoolAdminInfo {
  unitName: string;
  schoolName: string;
  teachers: string;
  approver: string;
  schoolYear: string;
  location: string;
}

export const DEFAULT_PRESCHOOL_ADMIN: PreschoolAdminInfo = {
  unitName: 'UBND HUYỆN TUY PHONG — XÃ LIÊN HƯƠNG',
  schoolName: 'TRƯỜNG MẦM NON PHƯỚC THỂ (CƠ SỞ ĐẢO TÍ HON)',
  teachers: 'Võ Thị Hồng Sim, Bá Thị Thanh Xuân',
  approver: 'Phó Hiệu trưởng Chuyên môn Võ Thị Hồng Sim',
  schoolYear: '2025 - 2026',
  location: 'Liên Hương',
};

const STORAGE_KEY_ADMIN = 'preschool_admin_info_v2';

export function getStoredAdminInfo(): PreschoolAdminInfo {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PRESCHOOL_ADMIN, ...parsed };
      }
    } catch (e) {
      console.error('Error loading stored admin info:', e);
    }
  }
  return DEFAULT_PRESCHOOL_ADMIN;
}

export function saveStoredAdminInfo(info: PreschoolAdminInfo): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(info));
    } catch (e) {
      console.error('Error saving admin info:', e);
    }
  }
}

export interface PreschoolTheme {
  id: string;
  themeNumber: number;
  title: string;
  duration: string;
  weeksCount: number;
  description: string;
  subThemes: string[];
}

export interface PreschoolObjective {
  id: string;
  code: string;
  category: 'Thể chất' | 'Nhận thức' | 'Ngôn ngữ' | 'Tình cảm - KNXH' | 'Thẩm mĩ';
  title: string;
  targetContent: string;
  activities: string;
}

export interface DayLessonDetail {
  dayOfWeek: string;
  dateStr: string;
  subjectDomain: string;
  activityType: string;
  topic: string;
  objectives: {
    knowledge: string[];
    skills: string[];
    attitudes: string[];
    integrationHCM?: string;
    genderIntegration?: string;
  };
  preparation: {
    teacher: string;
    students: string;
  };
  steps: {
    step1_engage: string;
    step2_explore: string;
    step3_explain: string;
    step4_elaborate: string;
    step5_evaluate: string;
  };
  outdoorActivity: {
    purposeTitle: string;
    gameMovement: string;
    freePlay: string;
  };
  afternoonActivity: {
    activityName: string;
    guideContent: string;
  };
  poemStorySongText?: string;
}

export interface WeekScheduleMatrixItem {
  dayOfWeek: string;
  date: string;
  morning: string;
  studyActivity: string;
  cornerActivity: string;
  outdoorActivity: string;
  afternoonActivity: string;
}

export interface WeekCurriculumPlan {
  id: string;
  themeId: string;
  themeName: string;
  subTheme: string;
  ageGroup: 'Lớp 3-4 tuổi' | 'Nhóm 25-36 tháng';
  dateRange: string;
  signDate: string;
  scheduleMatrix: WeekScheduleMatrixItem[];
  dayDetails: DayLessonDetail[];
}

// 1. DANH MỤC 10 CHỦ ĐỀ NĂM HỌC 2025 - 2026 (KHỐI 3-4 TUỔI - MẪU GIÁO BÉ)
export const MASTER_THEMES_3_4T: PreschoolTheme[] = [
  {
    id: 'theme_1_truong_mam_non',
    themeNumber: 1,
    title: 'TRƯỜNG MẦM NON CỦA BÉ',
    duration: '08/09/2025 - 03/10/2025',
    weeksCount: 4,
    description: 'Giúp bé làm quen với trường lớp mầm non, cô giáo, các bạn, đồ dùng đồ chơi và tết Trung thu ấm áp.',
    subThemes: [
      'Tuần 1: Trường mầm non thân yêu của bé',
      'Tuần 2: Lớp học và các cô giáo của bé',
      'Tuần 3: Đồ dùng, đồ chơi quen thuộc trong lớp',
      'Tuần 4: Bé vui đón Tết Trung Thu rộn ràng',
    ],
  },
  {
    id: 'theme_2_ban_than',
    themeNumber: 2,
    title: 'BẢN THÂN BÉ YÊU',
    duration: '06/10/2025 - 31/10/2025',
    weeksCount: 4,
    description: 'Nhận biết các bộ phận cơ thể, giác quan, sở thích, giới tính và cách giữ gìn vệ sinh thân thể tự lập.',
    subThemes: [
      'Tuần 1: Tôi là ai? (Họ tên, ngày sinh, giới tính)',
      'Tuần 2: Các bộ phận trên cơ thể bé',
      'Tuần 3: Năm giác quan diệu kỳ của bé',
      'Tuần 4: Bé cần gì để lớn lên khỏe mạnh và an toàn?',
    ],
  },
  {
    id: 'theme_3_gia_dinh',
    themeNumber: 3,
    title: 'GIA ĐÌNH ẤM ÁP',
    duration: '03/11/2025 - 28/11/2025',
    weeksCount: 4,
    description: 'Tình cảm với ông bà, cha mẹ, anh chị em; ngôi nhà bé ở và các đồ dùng sinh hoạt trong gia đình.',
    subThemes: [
      'Tuần 1: Gia đình thân yêu của bé',
      'Tuần 2: Ngôi nhà thân thương bé ở',
      'Tuần 3: Đồ dùng sinh hoạt trong gia đình',
      'Tuần 4: Ngày hội tri ân các thầy cô giáo 20/11',
    ],
  },
  {
    id: 'theme_4_nghe_nghiep',
    themeNumber: 4,
    title: 'NGHỀ NGHIỆP TRONG XÃ HỘI',
    duration: '01/12/2025 - 02/01/2026',
    weeksCount: 5,
    description: 'Tìm hiểu về các nghề quen thuộc: Bác sĩ, Giáo viên, Nông dân, Chú bộ đội, Ngư dân miền biển Liên Hương.',
    subThemes: [
      'Tuần 1: Nghề sản xuất và dịch vụ (Bác sĩ, Cô giáo)',
      'Tuần 2: Nghề nông và nghề đánh bắt hải sản quê hương',
      'Tuần 3: Nghề xây dựng và nghề mộc',
      'Tuần 4: Chú bộ đội - Chú công an canh giữ bình yên (22/12)',
      'Tuần 5: Bé yêu các cô chú công nhân vệ sinh môi trường',
    ],
  },
  {
    id: 'theme_5_the_gioi_thuc_vat',
    themeNumber: 5,
    title: 'THẾ GIỚI THỰC VẬT & TẾT - MÙA XUÂN',
    duration: '05/01/2026 - 13/02/2026',
    weeksCount: 5,
    description: 'Khám phá các loại cây xanh, hoa thơm, quả ngọt, rau củ và không khí ngày Tết Nguyên Đán rực rỡ.',
    subThemes: [
      'Tuần 1: Cây xanh và bóng mát quanh trường',
      'Tuần 2: Một số loại hoa đẹp rực rỡ sắc màu',
      'Tuần 3: Quả ngọt và rau củ thơm ngon bổ dưỡng',
      'Tuần 4: Mùa xuân tươi đẹp và Tết sum vầy',
      'Tuần 5: Hội xuân mầm non và phong tục ngày Tết',
    ],
  },
  {
    id: 'theme_6_the_gioi_dong_vat',
    themeNumber: 6,
    title: 'THẾ GIỚI ĐỘNG VẬT',
    duration: '23/02/2026 - 27/03/2026',
    weeksCount: 5,
    description: 'Các con vật nuôi trong gia đình, động vật sống dưới nước (tôm cua cá biển), động vật sống trong rừng.',
    subThemes: [
      'Tuần 1: Động vật nuôi trong gia đình có 2 chân, 4 chân',
      'Tuần 2: Các con vật bơi lội dưới nước và hải sản miền biển',
      'Tuần 3: Động vật hoang dã sống trong rừng',
      'Tuần 4: Các loài chim bay trên trời và côn trùng có ích',
      'Tuần 5: Bé chăm sóc và bảo vệ các con vật đáng yêu',
    ],
  },
  {
    id: 'theme_7_giao_thong',
    themeNumber: 7,
    title: 'GIAO THÔNG QUANH BÉ',
    duration: '30/03/2026 - 24/04/2026',
    weeksCount: 4,
    description: 'Phương tiện giao thông đường bộ, đường thủy, hàng không và các luật lệ giao thông cơ bản cho trẻ.',
    subThemes: [
      'Tuần 1: Phương tiện giao thông đường bộ',
      'Tuần 2: Phương tiện giao thông đường thủy và thuyền thúng miền biển',
      'Tuần 3: Phương tiện giao thông đường sắt và đường hàng không',
      'Tuần 4: Bé chấp hành luật an toàn giao thông khi ra đường',
    ],
  },
  {
    id: 'theme_8_nuoc_hien_tuong_tu_nhien',
    themeNumber: 8,
    title: 'NƯỚC VÀ CÁC HIỆN TƯỢNG TỰ NHIÊN',
    duration: '27/04/2026 - 15/05/2026',
    weeksCount: 3,
    description: 'Ích lợi của nước ngọt, các nguồn nước, gió, mưa, nắng, cầu vồng và các mùa trong năm.',
    subThemes: [
      'Tuần 1: Nguồn nước và ích lợi của nước đối với sự sống',
      'Tuần 2: Mưa, gió, sấm chớp và vòng tuần hoàn của nước',
      'Tuần 3: Nắng, cầu vồng và mùa hè rực rỡ của bé',
    ],
  },
  {
    id: 'theme_9_que_huong_dat_nuoc_bac_ho',
    themeNumber: 9,
    title: 'QUÊ HƯƠNG - ĐẤT NƯỚC - BÁC HỒ KÍNH YÊU',
    duration: '18/05/2026 - 29/05/2026',
    weeksCount: 2,
    description: 'Quê hương Liên Hương - Tuy Phong biển bạc, đất nước Việt Nam tươi đẹp và tình cảm của Bác Hồ với thiếu nhi.',
    subThemes: [
      'Tuần 1: Quê hương Liên Hương - Biển đảo Tuy Phong mến yêu',
      'Tuần 2: Bác Hồ kính yêu và ngày hội Tết Thiếu nhi 1/6',
    ],
  },
  {
    id: 'theme_10_tong_ket_nam_hoc',
    themeNumber: 10,
    title: 'BÉ LÊN LỚP MẪU GIÁO NHỠ (TỔNG KẾT)',
    duration: '01/06/2026 - 05/06/2026',
    weeksCount: 1,
    description: 'Ôn tập kiến thức năm học, liên hoan tổng kết và chuẩn bị tâm thế vững vàng bước lên lớp 4-5 tuổi.',
    subThemes: ['Tuần 1: Bé vui tổng kết năm học và chuẩn bị lên lớp mới'],
  },
];

// 2. DANH MỤC 10 CHỦ ĐỀ KHỐI NHÀ TRẺ (25 - 36 THÁNG)
export const MASTER_THEMES_25_36T: PreschoolTheme[] = [
  {
    id: 'nt_theme_1_be_va_nhom_lop',
    themeNumber: 1,
    title: 'BÉ VÀ NHÓM LỚP NHÀ TRẺ CỦA BÉ',
    duration: '08/09/2025 - 03/10/2025',
    weeksCount: 4,
    description: 'Bé quen cô giáo, quen các bạn, thích nghi với môi trường nhóm lớp ấm cúng.',
    subThemes: ['Tuần 1: Bé đến lớp ngoan không khóc nhè', 'Tuần 2: Cô giáo yêu thương của bé', 'Tuần 3: Đồ chơi xúc xắc, gấu bông của bé', 'Tuần 4: Bé vui tết Trung Thu'],
  },
  {
    id: 'nt_theme_2_ban_than',
    themeNumber: 2,
    title: 'BÉ LÀ AI? (BẢN THÂN)',
    duration: '06/10/2025 - 31/10/2025',
    weeksCount: 4,
    description: 'Bé nhận biết mắt, mũi, miệng, tay, chân và biết tự xúc ăn sạch sẽ.',
    subThemes: ['Tuần 1: Tên của bé và quần áo xinh', 'Tuần 2: Đôi mắt, cái miệng xinh', 'Tuần 3: Đôi bàn tay, đôi bàn chân khéo', 'Tuần 4: Bé tập xúc cơm, uống nước'],
  },
  {
    id: 'nt_theme_3_do_choi_cua_be',
    themeNumber: 3,
    title: 'ĐỒ DÙNG & ĐỒ CHƠI CỦA BÉ',
    duration: '03/11/2025 - 28/11/2025',
    weeksCount: 4,
    description: 'Nhận biết các đồ chơi màu đỏ, màu vàng; bóng tròn, ô tô nhựa, búp bê.',
    subThemes: ['Tuần 1: Quả bóng tròn xinh xắn', 'Tuần 2: Xe ô tô chở đồ chơi', 'Tuần 3: Em búp bê ngoan ngoãn', 'Tuần 4: Bé biết cất đồ chơi gọn gàng'],
  },
  {
    id: 'nt_theme_4_nhung_nguoi_than_yeu',
    themeNumber: 4,
    title: 'NHỮNG NGƯỜI THÂN YÊU TRONG GIA ĐÌNH',
    duration: '01/12/2025 - 02/01/2026',
    weeksCount: 5,
    description: 'Tình cảm với ông bà, bố mẹ, biết vòng tay chào hỏi lễ phép.',
    subThemes: ['Tuần 1: Bố mẹ yêu quý của bé', 'Tuần 2: Ông bà hiền từ', 'Tuần 3: Bát thìa, ca cốc của bé ở nhà', 'Tuần 4: Chú bộ đội - Chú công an', 'Tuần 5: Bé biết vâng lời người lớn'],
  },
  {
    id: 'nt_theme_5_cay_va_nhung_bong_hoa_dep',
    themeNumber: 5,
    title: 'CÂY XANH & NHỮNG BÔNG HOA ĐẸP',
    duration: '05/01/2026 - 13/02/2026',
    weeksCount: 5,
    description: 'Quan sát hoa màu đỏ, hoa màu vàng, cây cỏ sân trường và tết vui.',
    subThemes: ['Tuần 1: Cây xanh sân trường', 'Tuần 2: Bông hoa màu đỏ, màu vàng', 'Tuần 3: Quả chuối, quả cam ngọt', 'Tuần 4: Bé đón Tết rực rỡ hoa mai, hoa đào', 'Tuần 5: Chúc tết ông bà, ba mẹ'],
  },
  {
    id: 'nt_theme_6_nhung_con_vat_dang_yeu',
    themeNumber: 6,
    title: 'NHỮNG CON VẬT ĐÁNG YÊU QUANH BÉ',
    duration: '23/02/2026 - 27/03/2026',
    weeksCount: 5,
    description: 'Con chó, con mèo, con gà trống gáy vang, đàn vịt bơi lội.',
    subThemes: ['Tuần 1: Con gà trống gáy ò ó o', 'Tuần 2: Chú vịt con bơi bơi lội', 'Tuần 3: Chú cún con trông nhà', 'Tuần 4: Con mèo mướp bắt chuột', 'Tuần 5: Con cá vàng bơi trong bể nước'],
  },
  {
    id: 'nt_theme_7_phuong_tien_giao_thong',
    themeNumber: 7,
    title: 'XE Ô TÔ, XE MÁY (GIAO THÔNG)',
    duration: '30/03/2026 - 24/04/2026',
    weeksCount: 4,
    description: 'Tiếng còi pim pim của ô tô, xe máy và an toàn khi ngồi sau xe máy.',
    subThemes: ['Tuần 1: Ô tô con, ô tô tải', 'Tuần 2: Xe máy, xe đạp', 'Tuần 3: Thuyền buồm lướt sóng', 'Tuần 4: Bé đội mũ bảo hiểm khi đi xe'],
  },
  {
    id: 'nt_theme_8_nuoc_va_gio_mat',
    themeNumber: 8,
    title: 'NƯỚC MÁT & BẦU TRỜI',
    duration: '27/04/2026 - 15/05/2026',
    weeksCount: 3,
    description: 'Bé rửa tay với nước sạch, gió mát thổi lá bay và trời mưa.',
    subThemes: ['Tuần 1: Nước mát bé rửa tay', 'Tuần 2: Trời nắng ấm và gió mát', 'Tuần 3: Trời mưa rơi tí tách'],
  },
  {
    id: 'nt_theme_9_bac_ho_kinh_yeu',
    themeNumber: 9,
    title: 'BÁC HỒ VỚI CÁC CHÁU NHỎ',
    duration: '18/05/2026 - 29/05/2026',
    weeksCount: 2,
    description: 'Bé ngắm ảnh Bác Hồ, hát bài hát về Bác Hồ và ngày Tết Thiếu nhi 1/6.',
    subThemes: ['Tuần 1: Ảnh Bác Hồ treo trên tường lớp', 'Tuần 2: Vui Tết Thiếu nhi 1/6'],
  },
  {
    id: 'nt_theme_10_be_khoe_be_ngoan',
    themeNumber: 10,
    title: 'BÉ KHỎE BÉ NGOAN LÊN LỚP MẦM',
    duration: '01/06/2026 - 05/06/2026',
    weeksCount: 1,
    description: 'Bé tăng cân khỏe mạnh, tự tin chào tạm biệt nhóm trẻ để lên lớp Mẫu giáo bé.',
    subThemes: ['Tuần 1: Bé tạm biệt nhà trẻ để lên lớp Mầm'],
  },
];

// 3. KHUNG 69 MỤC TIÊU GIÁO DỤC PHÁT TRIỂN TOÀN DIỆN (MT1 -> MT69) KHỐI 3-4 TUỔI
export const MASTER_PRESCHOOL_OBJECTIVES_3_4T: PreschoolObjective[] = [
  // I. LĨNH VỰC PHÁT TRIỂN THỂ CHẤT (MT1 -> MT16)
  {
    id: 'mt_1',
    code: 'MT1',
    category: 'Thể chất',
    title: 'Giữ thăng bằng cơ thể khi đi trên ghế thể dục',
    targetContent: 'Trẻ giữ được thăng bằng cơ thể khi thực hiện vận động: Đi trên ghế thể dục đầu đội túi cát, không làm rơi túi cát.',
    activities: 'Hoạt động Thể dục: Đi trên ghế thể dục, Đi thăng bằng trên vạch kẻ sẵn.',
  },
  {
    id: 'mt_2',
    code: 'MT2',
    category: 'Thể chất',
    title: 'Kiểm soát vận động khi đi dích dắc',
    targetContent: 'Kiểm soát được vận động khi đi thay đổi hướng theo vật chuẩn (đi dích dắc qua 4 - 5 hộp hoặc chướng ngại vật).',
    activities: 'Thể dục sáng, HĐ học: Đi dích dắc qua các chướng ngại vật.',
  },
  {
    id: 'mt_3',
    code: 'MT3',
    category: 'Thể chất',
    title: 'Bật liên tục qua các ô (vòng)',
    targetContent: 'Trẻ biết phối hợp chân bật liên tục về phía trước qua 3 - 4 ô/vòng tiếp đất nhẹ nhàng bằng mũi bàn chân.',
    activities: 'Hoạt động vận động: Bật liên tục vào các vòng tròn.',
  },
  {
    id: 'mt_4',
    code: 'MT4',
    category: 'Thể chất',
    title: 'Bò chui qua cổng / ống chui',
    targetContent: 'Biết phối hợp tay nọ chân kia bò chui qua cổng hoặc ống chui mà không chạm vào thành cổng.',
    activities: 'Hoạt động học Thể dục: Bò chui qua cổng, Bò trườn qua vật cản.',
  },
  {
    id: 'mt_5',
    code: 'MT5',
    category: 'Thể chất',
    title: 'Ném xa bằng một tay / Ném trúng đích',
    targetContent: 'Trẻ đứng chân trước chân sau, đưa bao cát từ dưới ra sau lên cao và ném mạnh về phía trước đạt cự ly 1.5 - 2m.',
    activities: 'HĐ Thể dục: Ném bóng vào rổ, Ném xa bằng 1 tay.',
  },
  {
    id: 'mt_6',
    code: 'MT6',
    category: 'Thể chất',
    title: 'Bắt bóng bằng 2 tay không làm rơi',
    targetContent: 'Bắt được bóng bằng 2 tay ở khoảng cách 1.5 - 2m khi cô giáo tung bắt bóng cùng trẻ.',
    activities: 'HĐ Ngoài trời, Thể dục: Tung và bắt bóng cùng cô.',
  },
  {
    id: 'mt_7',
    code: 'MT7',
    category: 'Thể chất',
    title: 'Vận động khéo léo của các ngón tay',
    targetContent: 'Sử dụng ngón tay để cầm thìa, cài cởi cúc áo to, xâu chuỗi hạt, xếp chồng 8-10 khối gỗ không đổ.',
    activities: 'HĐ Góc: Xâu vòng hạt tặng mẹ, Cài cúc áo, Xếp hình khối gỗ.',
  },
  {
    id: 'mt_8',
    code: 'MT8',
    category: 'Thể chất',
    title: 'Tập các động tác phát triển nhóm cơ',
    targetContent: 'Thực hiện thuần thục các động tác phát triển nhóm cơ và hô hấp trong bài thể dục sáng theo nhạc.',
    activities: 'Thể dục buổi sáng toàn trường: Bài tập phát triển chung theo nhạc.',
  },
  {
    id: 'mt_9',
    code: 'MT9',
    category: 'Thể chất',
    title: 'Tự xúc ăn hết suất không rơi vãi',
    targetContent: 'Tự cầm thìa xúc cơm gọn gàng, ăn hết suất, không làm rơi vãi thức ăn ra bàn và nhặt cơm rơi vào đĩa.',
    activities: 'Giờ tổ chức bữa ăn trưa bán trú tại lớp.',
  },
  {
    id: 'mt_10',
    code: 'MT10',
    category: 'Thể chất',
    title: 'Rửa tay bằng xà phòng đúng quy trình 6 bước',
    targetContent: 'Biết rửa tay bằng xà phòng trước khi ăn, sau khi đi vệ sinh và khi tay bẩn dưới vòi nước sạch.',
    activities: 'Rèn nền nếp vệ sinh cá nhân, HĐ đón trẻ và trước giờ ăn.',
  },
  {
    id: 'mt_11',
    code: 'MT11',
    category: 'Thể chất',
    title: 'Tự đi vệ sinh đúng nơi quy định',
    targetContent: 'Biết gọi cô khi có nhu cầu đi vệ sinh và tự đi vệ sinh đúng bồn cầu quy định, biết giật nước dội.',
    activities: 'Sinh hoạt hằng ngày, thói quen văn minh trong nhà vệ sinh.',
  },
  {
    id: 'mt_12',
    code: 'MT12',
    category: 'Thể chất',
    title: 'Nhận biết trang phục phù hợp thời tiết',
    targetContent: 'Biết mặc áo ấm, đội mũ nón khi trời lạnh; mặc quần áo mỏng thoáng mát và đội mũ khi trời nắng.',
    activities: 'HĐ Trò chuyện buổi sáng, Khám phá hiện tượng tự nhiên.',
  },
  {
    id: 'mt_13',
    code: 'MT13',
    category: 'Thể chất',
    title: 'Nhận biết các loại thực phẩm dinh dưỡng',
    targetContent: 'Kể tên được một số món ăn quen thuộc (thịt, cá, trứng, rau, sữa) và biết ăn nhiều loại thức ăn để mau lớn.',
    activities: 'HĐ Khám phá: Món ăn bé thích, Giờ ăn trưa dinh dưỡng.',
  },
  {
    id: 'mt_14',
    code: 'MT14',
    category: 'Thể chất',
    title: 'Tránh xa các vật dụng và nơi nguy hiểm',
    targetContent: 'Nhận biết và không đến gần nơi nguy hiểm: Phích nước nóng, ổ cắm điện, dao kéo, ao hồ, bậc thang dốc.',
    activities: 'HĐ Kỹ năng sống: Bé an toàn tại trường và ở nhà.',
  },
  {
    id: 'mt_15',
    code: 'MT15',
    category: 'Thể chất',
    title: 'Không đi theo người lạ khi chưa được phép',
    targetContent: 'Biết không nhận quà và không đi theo người lạ khi không có sự đồng ý của cha mẹ, cô giáo.',
    activities: 'HĐ Kỹ năng sống: Xử lý tình huống khi gặp người lạ.',
  },
  {
    id: 'mt_16',
    code: 'MT16',
    category: 'Thể chất',
    title: 'Chạy đổi hướng theo hiệu lệnh',
    targetContent: 'Chạy liên tục theo hướng thẳng hoặc đổi hướng theo hiệu lệnh của cô giáo một cách linh hoạt.',
    activities: 'HĐ Vận động, Trò chơi vận động ngoài trời: Mèo đuổi chuột, Cáo và thỏ.',
  },

  // II. LĨNH VỰC PHÁT TRIỂN NHẬN THỨC (MT17 -> MT33)
  {
    id: 'mt_17',
    code: 'MT17',
    category: 'Nhận thức',
    title: 'Khám phá đặc điểm nổi bật của đồ vật quanh bé',
    targetContent: 'Nói được tên, màu sắc, hình dạng, chất liệu và công dụng nổi bật của đồ dùng, đồ chơi quen thuộc.',
    activities: 'HĐ Khám phá khoa học (STEAM): Đồ chơi của bé.',
  },
  {
    id: 'mt_18',
    code: 'MT18',
    category: 'Nhận thức',
    title: 'Nhận biết đặc điểm một số con vật quen thuộc',
    targetContent: 'Chỉ ra và nói được tên, thức ăn, tiếng kêu và nơi sống của một số con vật nuôi, tôm cá biển quê hương.',
    activities: 'Khám phá thế giới động vật, Trò chuyện về biển đảo Liên Hương.',
  },
  {
    id: 'mt_19',
    code: 'MT19',
    category: 'Nhận thức',
    title: 'Phân biệt các loại cây, hoa, quả gần gũi',
    targetContent: 'So sánh điểm giống và khác nhau rõ nét của 2 loại quả (quả cam - quả bưởi, hoa hồng - hoa cúc).',
    activities: 'Khám phá thế giới thực vật: Bé khám phá quả bưởi (STEAM 5E).',
  },
  {
    id: 'mt_20',
    code: 'MT20',
    category: 'Nhận thức',
    title: 'Nhận biết các hiện tượng tự nhiên',
    targetContent: 'Nhận biết dấu hiệu của ngày và đêm; trời nắng, trời mưa và ích lợi của nước sạch.',
    activities: 'Khám phá khoa học: Nước và các hiện tượng tự nhiên.',
  },
  {
    id: 'mt_21',
    code: 'MT21',
    category: 'Nhận thức',
    title: 'Đếm trên đối tượng trong phạm vi 5',
    targetContent: 'Đếm được trên các đối tượng trong phạm vi 3 đến 5 và nói kết quả đếm (VD: 1, 2, 3 - tất cả có 3 bạn).',
    activities: 'HĐ Toán: Đếm đến 3, nhận biết nhóm có 3 đối tượng.',
  },
  {
    id: 'mt_22',
    code: 'MT22',
    category: 'Nhận thức',
    title: 'Nhận biết chữ số từ 1 đến 5',
    targetContent: 'Nhận biết các thẻ số từ 1 đến 5 và gắn thẻ số tương ứng với số lượng đồ vật trong nhóm.',
    activities: 'HĐ Làm quen với Toán: Nhận biết chữ số 1, 2, 3.',
  },
  {
    id: 'mt_23',
    code: 'MT23',
    category: 'Nhận thức',
    title: 'So sánh số lượng 2 nhóm đối tượng (Nhiều hơn - Ít hơn - Bằng nhau)',
    targetContent: 'So sánh số lượng 2 nhóm đối tượng bằng cách xếp tương ứng 1:1 và sử dụng từ bằng nhau, nhiều hơn, ít hơn.',
    activities: 'HĐ Toán: So sánh số lượng 2 nhóm trong phạm vi 4.',
  },
  {
    id: 'mt_24',
    code: 'MT24',
    category: 'Nhận thức',
    title: 'Nhận biết và gọi tên 4 hình cơ bản',
    targetContent: 'Nhận biết và gọi đúng tên hình tròn, hình vuông, hình tam giác, hình chữ nhật và lăn thử hình tròn.',
    activities: 'HĐ Toán: Bé vui cùng các hình khối kỳ diệu (STEAM EDP).',
  },
  {
    id: 'mt_25',
    code: 'MT25',
    category: 'Nhận thức',
    title: 'Phân biệt kích thước: To hơn - Nhỏ hơn',
    targetContent: 'So sánh và dùng đúng từ "to hơn - nhỏ hơn" khi đối chiếu kích thước giữa 2 đối tượng.',
    activities: 'HĐ Toán: Phân biệt to hơn - nhỏ hơn của quả bóng, cái bát.',
  },
  {
    id: 'mt_26',
    code: 'MT26',
    category: 'Nhận thức',
    title: 'Nhận biết chiều dài: Dài hơn - Ngắn hơn',
    targetContent: 'Đặt 2 đối tượng cạnh nhau trên cùng một mặt phẳng để so sánh và nhận biết đối tượng nào dài hơn, ngắn hơn.',
    activities: 'HĐ Toán: So sánh chiều dài 2 dải băng màu.',
  },
  {
    id: 'mt_27',
    code: 'MT27',
    category: 'Nhận thức',
    title: 'Nhận biết vị trí trong không gian',
    targetContent: 'Xác định đúng vị trí phía trên - phía dưới, phía trước - phía sau của bản thân trẻ.',
    activities: 'HĐ Toán: Xác định phía trên - dưới, trước - sau.',
  },
  {
    id: 'mt_28',
    code: 'MT28',
    category: 'Nhận thức',
    title: 'Nhận biết 4 màu sắc cơ bản',
    targetContent: 'Nhận biết và gọi đúng tên 4 màu: Đỏ, vàng, xanh dương, xanh lá cây trong đồ dùng đồ chơi.',
    activities: 'HĐ Tạo hình & Khám phá màu sắc.',
  },
  {
    id: 'mt_29',
    code: 'MT29',
    category: 'Nhận thức',
    title: 'Biết họ tên, tuổi và giới tính của bản thân',
    targetContent: 'Nói được họ tên đầy đủ, tuổi của mình và tự nhận biết mình là bạn trai hay bạn gái.',
    activities: 'Chủ đề Bản thân: Giới thiệu về bé yêu.',
  },
  {
    id: 'mt_30',
    code: 'MT30',
    category: 'Nhận thức',
    title: 'Biết tên các thành viên trong gia đình',
    targetContent: 'Kể tên ông bà, bố mẹ, anh chị em trong nhà và địa chỉ nhà ở hoặc tên thôn xóm bé sống.',
    activities: 'Chủ đề Gia đình: Ngôi nhà ấm áp của bé.',
  },
  {
    id: 'mt_31',
    code: 'MT31',
    category: 'Nhận thức',
    title: 'Nhận biết tên trường, tên lớp và tên cô giáo',
    targetContent: 'Nói đúng tên Trường Mầm non Phước Thể / Đảo Tí Hon, tên lớp Mầm và tên các cô giáo dạy lớp mình.',
    activities: 'Chủ đề Trường Mầm Non: Trường mầm non thân yêu.',
  },
  {
    id: 'mt_32',
    code: 'MT32',
    category: 'Nhận thức',
    title: 'Tìm hiểu nghề nghiệp của bố mẹ',
    targetContent: 'Kể được công việc chính của bố mẹ và một số dụng cụ làm việc của nghề đó (nghề giáo, ngư nghiệp, bác sĩ).',
    activities: 'Chủ đề Nghề Nghiệp: Nghề nghiệp của bố mẹ bé.',
  },
  {
    id: 'mt_33',
    code: 'MT33',
    category: 'Nhận thức',
    title: 'Kỹ năng giải quyết vấn đề đơn giản theo mô hình STEAM',
    targetContent: 'Biết đặt câu hỏi "Vì sao?", "Làm thế nào?" và cùng bạn thử nghiệm ghép nối nguyên vật liệu để tạo sản phẩm.',
    activities: 'Hoạt động STEAM 5E / EDP: Thiết kế bè nổi, lắp ghép cây xanh.',
  },

  // III. LĨNH VỰC PHÁT TRIỂN NGÔN NGỮ (MT34 -> MT46)
  {
    id: 'mt_34',
    code: 'MT34',
    category: 'Ngôn ngữ',
    title: 'Lắng nghe và hiểu lời nói trong giao tiếp',
    targetContent: 'Lắng nghe cô giáo và bạn bè nói, hiểu và làm theo được 2-3 yêu cầu liên tiếp của cô giáo.',
    activities: 'Trò chuyện sáng, sinh hoạt vòng tròn, HĐ học tập.',
  },
  {
    id: 'mt_35',
    code: 'MT35',
    category: 'Ngôn ngữ',
    title: 'Nói rõ ràng đủ câu',
    targetContent: 'Nói rõ ràng, diễn đạt ý muốn bằng câu đơn hoặc câu ghép ngắn (VD: "Thưa cô cho con xin nước uống").',
    activities: 'Giao tiếp hằng ngày trong giờ ăn, chơi và học.',
  },
  {
    id: 'mt_36',
    code: 'MT36',
    category: 'Ngôn ngữ',
    title: 'Đọc thơ diễn cảm',
    targetContent: 'Đọc thuộc và đọc diễn cảm các bài thơ trong chương trình (Bài thơ: Bạn mới, Bé yêu trăng, Cô dạy...).',
    activities: 'HĐ Làm quen Văn học: Dạy thơ Bé yêu biển lắm.',
  },
  {
    id: 'mt_37',
    code: 'MT37',
    category: 'Ngôn ngữ',
    title: 'Kể lại chuyện theo tranh minh họa',
    targetContent: 'Kể lại được trích đoạn câu chuyện đã học dựa vào tranh ảnh gợi ý và sự hướng dẫn của cô giáo.',
    activities: 'HĐ Văn học: Truyện Quả táo của ai, Ba chú heo con.',
  },
  {
    id: 'mt_38',
    code: 'MT38',
    category: 'Ngôn ngữ',
    title: 'Biết chào hỏi lễ phép và cảm ơn, xin lỗi',
    targetContent: 'Biết chào cô khi đến lớp và khi ra về; biết nói lời "cảm ơn" khi được giúp đỡ và "xin lỗi" khi làm sai.',
    activities: 'Rèn lễ nghi mầm non trong mọi thời điểm sinh hoạt.',
  },
  {
    id: 'mt_39',
    code: 'MT39',
    category: 'Ngôn ngữ',
    title: 'Làm quen với sách và tranh truyện',
    targetContent: 'Biết mở sách từng trang từ trái sang phải, không làm quăn mép hay xé rách sách truyện.',
    activities: 'HĐ Góc thư viện, Đọc sách trước giờ ngủ trưa.',
  },
  {
    id: 'mt_40',
    code: 'MT40',
    category: 'Ngôn ngữ',
    title: 'Nhận biết ký hiệu biểu tượng bằng tranh',
    targetContent: 'Nhận biết biểu tượng cá nhân (ca cốc, khăn mặt, tủ ba lô) và các biển báo vệ sinh, lối thoát hiểm.',
    activities: 'Đón trẻ, hướng dẫn sử dụng đồ dùng cá nhân.',
  },
  {
    id: 'mt_41',
    code: 'MT41',
    category: 'Ngôn ngữ',
    title: 'Mô tả lại sự vật hiện tượng đơn giản',
    targetContent: 'Biết sử dụng các tính từ miêu tả đặc điểm: tròn vo, dài ngoẵng, ngọt lịm, êm ái khi khám phá đồ vật.',
    activities: 'HĐ Khám phá khoa học, Trò chơi ngôn ngữ.',
  },
  {
    id: 'mt_42',
    code: 'MT42',
    category: 'Ngôn ngữ',
    title: 'Phát âm chuẩn tiếng Việt',
    targetContent: 'Phát âm rõ ràng các âm đầu l/n, s/x, tr/ch trong câu chuyện và bài hát.',
    activities: 'HĐ Văn học, Âm nhạc, sửa ngọng cho trẻ.',
  },
  {
    id: 'mt_43',
    code: 'MT43',
    category: 'Ngôn ngữ',
    title: 'Biết đặt câu hỏi để tìm hiểu thông tin',
    targetContent: 'Biết đặt câu hỏi: "Cái này là cái gì?", "Tại sao con bướm lại bay được?" với người lớn.',
    activities: 'HĐ Khám phá ngoài trời, trải nghiệm thiên nhiên.',
  },
  {
    id: 'mt_44',
    code: 'MT44',
    category: 'Ngôn ngữ',
    title: 'Tự tin trả lời câu hỏi của cô giáo',
    targetContent: 'Mạnh dạn đứng lên trả lời câu hỏi của cô giáo trước toàn lớp với giọng điệu tự tin.',
    activities: 'HĐ Học tập trung, hoạt động tập thể.',
  },
  {
    id: 'mt_45',
    code: 'MT45',
    category: 'Ngôn ngữ',
    title: 'Biết thể hiện cảm xúc qua giọng nói',
    targetContent: 'Biết thay đổi ngữ điệu giọng nói vui tươi khi kể chuyện vui hoặc nhẹ nhàng khi xin phép.',
    activities: 'Kịch bản sân khấu hóa mầm non, kể chuyện phân vai.',
  },
  {
    id: 'mt_46',
    code: 'MT46',
    category: 'Ngôn ngữ',
    title: 'Làm quen tư thế cầm bút và ngồi vẽ đúng',
    targetContent: 'Cầm bút bằng 3 ngón tay của bàn tay phải, ngồi thẳng lưng, ngực không tì vào bàn khi vẽ hoặc tô màu.',
    activities: 'HĐ Tạo hình: Tô màu tranh, vẽ nét nguệch ngoạc có chủ đích.',
  },

  // IV. LĨNH VỰC PHÁT TRIỂN TÌNH CẢM & KỸ NĂNG XÃ HỘI (MT47 -> MT57)
  {
    id: 'mt_47',
    code: 'MT47',
    category: 'Tình cảm - KNXH',
    title: 'Thể hiện tình cảm yêu thương với người thân và cô giáo',
    targetContent: 'Biết bày tỏ tình cảm yêu mến với bố mẹ, ông bà, cô giáo qua cử chỉ ôm, nụ cười và lời nói ân cần.',
    activities: 'Chủ đề Gia đình, Ngày hội 20/10 và 20/11.',
  },
  {
    id: 'mt_48',
    code: 'MT48',
    category: 'Tình cảm - KNXH',
    title: 'Biết chia sẻ đồ chơi cùng bạn',
    targetContent: 'Không tranh giành đồ chơi, biết nhường nhịn và chơi hòa đồng cùng bạn trong giờ hoạt động góc.',
    activities: 'Hoạt động góc phân vai và xây dựng.',
  },
  {
    id: 'mt_49',
    code: 'MT49',
    category: 'Tình cảm - KNXH',
    title: 'Tích hợp lời Bác Hồ dạy thiếu nhi',
    targetContent: 'Yêu quý Bác Hồ, thực hiện tốt 5 điều Bác Hồ dạy: Yêu tổ quốc, yêu đồng bào, học tập tốt, lao động tốt.',
    activities: 'HĐ Ngày lễ hội, Học tập theo tấm gương đạo đức Bác Hồ.',
  },
  {
    id: 'mt_50',
    code: 'MT50',
    category: 'Tình cảm - KNXH',
    title: 'Giáo dục bình đẳng giới',
    targetContent: 'Tôn trọng bạn bè không phân biệt giới tính, bạn trai giúp đỡ bạn gái và cùng nhau tham gia trò chơi.',
    activities: 'Mọi hoạt động vui chơi và học tập trong ngày.',
  },
  {
    id: 'mt_51',
    code: 'MT51',
    category: 'Tình cảm - KNXH',
    title: 'Tự giác cất dọn đồ chơi sau khi chơi',
    targetContent: 'Biết cùng bạn thu gom và xếp đồ dùng, đồ chơi gọn gàng vào đúng góc sau khi chơi xong.',
    activities: 'Kết thúc hoạt động góc, chuẩn bị chuyển hoạt động.',
  },
  {
    id: 'mt_52',
    code: 'MT52',
    category: 'Tình cảm - KNXH',
    title: 'Thực hiện nền nếp quy định của lớp',
    targetContent: 'Biết lắng nghe tiếng xắc xô hiệu lệnh, đi đứng trật tự thành hàng, không xô đẩy bạn.',
    activities: 'Giờ đón - trả trẻ, xếp hàng ra sân thể dục.',
  },
  {
    id: 'mt_53',
    code: 'MT53',
    category: 'Tình cảm - KNXH',
    title: 'Yêu thiên nhiên và bảo vệ môi trường',
    targetContent: 'Không vứt rác bừa bãi ra sân trường, biết bỏ rác vào thùng và chăm sóc tưới cây cảnh góc thiên nhiên.',
    activities: 'HĐ Lao động tự phục vụ, Chăm sóc góc thiên nhiên.',
  },
  {
    id: 'mt_54',
    code: 'MT54',
    category: 'Tình cảm - KNXH',
    title: 'Biết nhận biết cảm xúc vui, buồn, sợ hãi',
    targetContent: 'Nhận biết được nét mặt vui vẻ, buồn rầu, giận dữ qua tranh ảnh hoặc bạn bè và biết an ủi bạn.',
    activities: 'Kỹ năng xã hội: Nhận diện cảm xúc của bản thân.',
  },
  {
    id: 'mt_55',
    code: 'MT55',
    category: 'Tình cảm - KNXH',
    title: 'Tiết kiệm nước sạch và điện năng',
    targetContent: 'Biết tắt vòi nước sau khi rửa tay và nhắc bạn không nghịch nước, tắt quạt khi ra khỏi phòng.',
    activities: 'Giáo dục kỹ năng bảo vệ tài nguyên môi trường.',
  },
  {
    id: 'mt_56',
    code: 'MT56',
    category: 'Tình cảm - KNXH',
    title: 'Hợp tác làm việc nhóm theo mô hình STEAM',
    targetContent: 'Biết phân công nhiệm vụ đơn giản trong nhóm: Bạn lấy đồ, bạn dán keo, bạn giữ que gỗ.',
    activities: 'Hoạt động trải nghiệm sáng tạo STEAM 5E.',
  },
  {
    id: 'mt_57',
    code: 'MT57',
    category: 'Tình cảm - KNXH',
    title: 'Tự tin biểu diễn văn nghệ trước đám đông',
    targetContent: 'Mạnh dạn lên sân khấu hát múa trong các ngày hội bé đến trường, Tết Trung thu và Tết Thiếu nhi.',
    activities: 'Biểu diễn văn nghệ cuối tuần và ngày hội.',
  },

  // V. LĨNH VỰC PHÁT TRIỂN THẨM MĨ (MT58 -> MT69)
  {
    id: 'mt_58',
    code: 'MT58',
    category: 'Thẩm mĩ',
    title: 'Hát đúng giai điệu và lời bài hát',
    targetContent: 'Hát tự nhiên, đúng giai điệu và lời bài hát quen thuộc trong chương trình mầm non.',
    activities: 'HĐ Âm nhạc: Dạy hát Cháu đi mẫu giáo, Em yêu cây xanh.',
  },
  {
    id: 'mt_59',
    code: 'MT59',
    category: 'Thẩm mĩ',
    title: 'Vận động nhịp nhàng theo giai điệu bài hát',
    targetContent: 'Vận động theo tiết tấu chậm/nhanh: Vỗ tay, nhún nhảy, dậm chân theo giai điệu bài hát.',
    activities: 'HĐ Âm nhạc: Vận động múa minh họa theo nhạc.',
  },
  {
    id: 'mt_60',
    code: 'MT60',
    category: 'Thẩm mĩ',
    title: 'Chú ý lắng nghe cô hát và cảm nhận âm nhạc',
    targetContent: 'Lắng nghe cô giáo hát trọn vẹn bài hát và biết hưởng ứng cảm xúc theo giai điệu du dương/vui nhộn.',
    activities: 'Nghe hát dân ca, bài hát thiếu nhi quê hương.',
  },
  {
    id: 'mt_61',
    code: 'MT61',
    category: 'Thẩm mĩ',
    title: 'Sử dụng các nhạc cụ gõ đệm',
    targetContent: 'Biết sử dụng phách tre, trống lắc, xắc xô gõ đệm theo nhịp điệu bài hát cùng cô.',
    activities: 'HĐ Góc Âm nhạc: Biểu diễn ban nhạc tí hon.',
  },
  {
    id: 'mt_62',
    code: 'MT62',
    category: 'Thẩm mĩ',
    title: 'Vẽ các nét cơ bản (nét thẳng, nét xiên, nét cong)',
    targetContent: 'Sử dụng bút màu sáp để vẽ nét thẳng đứng, nét ngang, nét cong tròn khép kín tạo thành bức tranh đơn giản.',
    activities: 'HĐ Tạo hình: Vẽ mưa rơi, vẽ quả bóng tròn.',
  },
  {
    id: 'mt_63',
    code: 'MT63',
    category: 'Thẩm mĩ',
    title: 'Tô màu kín hình không chờm ra ngoài',
    targetContent: 'Biết chọn màu sắc phù hợp và tô màu đều tay, không chờm ra ngoài mép viền của hình vẽ.',
    activities: 'HĐ Tạo hình: Tô màu tranh vườn hoa, tô màu con cá.',
  },
  {
    id: 'mt_64',
    code: 'MT64',
    category: 'Thẩm mĩ',
    title: 'Nặn các hình khối đơn giản từ đất sét',
    targetContent: 'Sử dụng các kỹ năng xoay tròn, lăn dài, ấn dẹt đất nặn để tạo thành các loại quả, bánh quy, viên kẹo.',
    activities: 'HĐ Tạo hình: Nặn quả cam, nặn bánh sinh nhật.',
  },
  {
    id: 'mt_65',
    code: 'MT65',
    category: 'Thẩm mĩ',
    title: 'Xé dán giấy theo dải / vệt',
    targetContent: 'Dùng ngón tay xé dải giấy dài, xé vụn giấy và bôi hồ dán vào mặt trái để dán trang trí tranh.',
    activities: 'HĐ Tạo hình: Xé dán dải hoa cờ, xé dán vảy cá.',
  },
  {
    id: 'mt_66',
    code: 'MT66',
    category: 'Thẩm mĩ',
    title: 'Xếp dán các hình học tạo thành sản phẩm',
    targetContent: 'Chọn hình vuông, hình tam giác để xếp dán thành ngôi nhà; chọn hình tròn để làm ông mặt trời.',
    activities: 'HĐ Tạo hình: Dán ngôi nhà của bé (STEAM).',
  },
  {
    id: 'mt_67',
    code: 'MT67',
    category: 'Thẩm mĩ',
    title: 'Nhận xét vẻ đẹp của sản phẩm tạo hình',
    targetContent: 'Biết ngắm nhìn và chỉ ra bức tranh/sản phẩm mình thích nhất trong buổi trưng bày của lớp.',
    activities: 'Đánh giá sản phẩm cuối giờ học tạo hình.',
  },
  {
    id: 'mt_68',
    code: 'MT68',
    category: 'Thẩm mĩ',
    title: 'Sáng tạo sản phẩm từ nguyên vật liệu tái chế',
    targetContent: 'Biết sử dụng vỏ hộp sữa, nắp chai, lá cây rụng để trang trí thành con bướm, bông hoa xinh đẹp (Arts in STEAM).',
    activities: 'HĐ Dự án STEAM: Sáng tạo từ vật liệu thiên nhiên.',
  },
  {
    id: 'mt_69',
    code: 'MT69',
    category: 'Thẩm mĩ',
    title: 'Giữ gìn sản phẩm của mình và của bạn',
    targetContent: 'Trân trọng, không vò nát hay làm rách sản phẩm tranh vẽ của mình và của bạn bè trong lớp.',
    activities: 'Bảo quản sản phẩm tại góc triển lãm mầm non.',
  },
];

// 4. KẾ HOẠCH MẪU TUẦN 1: CHỦ ĐỀ TRƯỜNG MẦM NON THÂN YÊU (STEAM 5E CHI TIẾT)
export const SAMPLE_WEEK_1_LESSON_PLAN_3_4T: WeekCurriculumPlan = {
  id: 'week_plan_sample_1',
  themeId: 'theme_1_truong_mam_non',
  themeName: 'CHỦ ĐỀ 1: TRƯỜNG MẦM NON CỦA BÉ',
  subTheme: 'Tuần 1: Trường mầm non thân yêu của bé',
  ageGroup: 'Lớp 3-4 tuổi',
  dateRange: '08/09/2025 đến 12/09/2025',
  signDate: 'Liên Hương, ngày 05 tháng 09 năm 2025',
  scheduleMatrix: [
    {
      dayOfWeek: 'Hai',
      date: '08/09/2025',
      morning: 'Đón trẻ vào lớp, hướng dẫn cất ba lô, giày dép. Thể dục sáng toàn trường bài "Trường chúng cháu là trường mầm non".',
      studyActivity: 'KPKH: Khám phá các khu vực trong trường mầm non (STEAM 5E)',
      cornerActivity: 'Phân vai: Cô giáo và học sinh; Xây dựng: Lắp ghép hàng rào trường lớp; Tạo hình: Tô màu đồ chơi.',
      outdoorActivity: 'Quan sát vườn hoa sân trường. TCVĐ: Mèo đuổi chuột. Chơi tự do xích đu, cầu trượt.',
      afternoonActivity: 'Làm quen bài hát "Cháu đi mẫu giáo". Nêu gương cắm cờ bé ngoan cuối ngày, trả trẻ an toàn.',
    },
    {
      dayOfWeek: 'Ba',
      date: '09/09/2025',
      morning: 'Đón trẻ, trò chuyện về tên gọi của các bạn trong lớp. Thể dục sáng tập theo nhạc phát triển thể lực.',
      studyActivity: 'THỂ DỤC: Đi trong đường hẹp đầu đội túi cát (MT1) — TCVĐ: Bắt bóng',
      cornerActivity: 'Khám phá: Thử nghiệm phân loại đồ chơi nhựa - gỗ; Sách truyện: Xem tranh ảnh cô giáo và bé.',
      outdoorActivity: 'Dạo chơi quanh sân trường, nhặt lá rụng bỏ thùng rác. TCDG: Nu na nu nống.',
      afternoonActivity: 'Rèn kỹ năng rửa tay 6 bước bằng xà phòng dưới vòi nước sạch. Bình cờ bé ngoan.',
    },
    {
      dayOfWeek: 'Tư',
      date: '10/09/2025',
      morning: 'Đón trẻ niềm nở, điểm danh buổi sáng. Tập thể dục sáng các động tác tay, chân, lườn bụng, bật nhảy.',
      studyActivity: 'TOÁN: Nhận biết hình tròn, hình vuông trong đồ dùng lớp học (MT24)',
      cornerActivity: 'Xây dựng: Xếp đường đi vào lớp; Phân vai: Cửa hàng bán đồ chơi mầm non; Tạo hình: Nặn quả bóng tròn.',
      outdoorActivity: 'Quan sát cây bàng sân trường. TCVĐ: Cáo và thỏ. Chơi tự do với bóng nhựa ngoài trời.',
      afternoonActivity: 'Đọc thơ "Bạn mới". Giáo dục tình đoàn kết, chia sẻ đồ chơi cùng bạn. Trả trẻ.',
    },
    {
      dayOfWeek: 'Năm',
      date: '11/09/2025',
      morning: 'Đón trẻ, kiểm tra thân nhiệt, trò chuyện ngày mới. Thể dục sáng với bài tập hô hấp hít thở sâu.',
      studyActivity: 'VĂN HỌC: Thơ "Cô dạy" — Dạy trẻ đọc thơ diễn cảm (MT36)',
      cornerActivity: 'Góc tạo hình: Dán ngôi nhà trường mầm non; Góc nghệ thuật: Hát múa các bài hát về trường lớp.',
      outdoorActivity: 'Vẽ phấn tự do trên sân trường. TCVĐ: Nhảy tiếp sức qua vòng. Chơi tự do.',
      afternoonActivity: 'Xem video an toàn mầm non: Không nghịch ổ điện, không leo trèo lan can. Trả trẻ.',
    },
    {
      dayOfWeek: 'Sáu',
      date: '12/09/2025',
      morning: 'Đón trẻ vui tươi, phát thẻ biểu tượng ngày. Thể dục sáng toàn trường bài tập thể dục tổng hợp.',
      studyActivity: 'TẠO HÌNH (STEAM): Thiết kế cờ dây trang trí lớp học mầm non (MT68)',
      cornerActivity: 'Tổng kết các góc chơi tuần; Triển lãm tranh cờ dây của bé; Ban nhạc tí hon biểu diễn văn nghệ.',
      outdoorActivity: 'Chăm sóc tưới nước bồn hoa lớp. TCVĐ: Kéo co tí hon. Chơi tự do theo ý thích.',
      afternoonActivity: 'Liên hoan văn nghệ cuối tuần, phát phiếu bé ngoan tuần 1, nhắc nhở trẻ chào cô ra về.',
    },
  ],
  dayDetails: [
    {
      dayOfWeek: 'Hai',
      dateStr: '08/09/2025',
      subjectDomain: 'LĨNH VỰC PHÁT TRIỂN NHẬN THỨC',
      activityType: 'HOẠT ĐỘNG KHÁM PHÁ KHOA HỌC (STEAM 5E)',
      topic: 'ĐỀ TÀI: KHÁM PHÁ TRƯỜNG MẦM NON ĐẢO TÍ HON CỦA BÉ',
      objectives: {
        knowledge: [
          'Trẻ biết tên trường, tên lớp học, các khu vực chính trong trường: Sân chơi, phòng học, nhà bếp bán trú, vườn hoa (S - Khoa học).',
          'Trẻ biết sử dụng thiết bị chụp ảnh mô hình, kính lúp quan sát vật liệu quanh sân trường (T - Công nghệ).',
          'Nhận biết số lượng đồ chơi, hình dạng các phòng học vuông, chữ nhật (M - Toán học).',
        ],
        skills: [
          'Rèn kỹ năng quan sát, ghi nhớ có chủ định và đặt câu hỏi tìm hiểu môi trường xung quanh (MT33).',
          'Rèn kỹ năng diễn đạt ngôn ngữ mạch lạc, nói tròn câu khi trả lời câu hỏi của cô giáo.',
        ],
        attitudes: [
          'Trẻ hào hứng, thích thú khi đến trường, yêu quý cô giáo và bạn bè.',
          'Có ý thức giữ gìn vệ sinh chung, không vứt rác ra sân trường.',
        ],
        integrationHCM: 'Tích hợp lời Bác Hồ dạy: "Trẻ em như búp trên cành, biết ăn ngủ biết học hành là ngoan".',
        genderIntegration: 'Giáo dục bình đẳng: Các bạn trai gái cùng giúp cô sắp xếp bàn ghế gọn gàng.',
      },
      preparation: {
        teacher: 'Video clip giới thiệu toàn cảnh trường mầm non, máy chiếu, hình ảnh các khu vực, nhạc bài hát "Trường chúng cháu là trường mầm non".',
        students: 'Tâm thế vui tươi, trang phục gọn gàng, tranh ảnh lô tô về trường lớp.',
      },
      steps: {
        step1_engage: 'Cô và trẻ cùng vận động nhún nhảy bài hát "Trường chúng cháu là trường mầm non". Cô đố trẻ: Chúng mình đang học ở ngôi trường nào? Trong trường có những gì đặc biệt? Dẫn dắt tạo sự tò mò cho trẻ.',
        step2_explore: 'Cô dẫn trẻ đi tham quan thực tế hoặc xem slide 3D các khu vực: Khu sân chơi ngoài trời, góc thiên nhiên, lớp học của bé, khu nhà bếp một chiều. Trẻ chia nhóm 3-4 bạn quan sát và thảo luận.',
        step3_explain: 'Cô mời đại diện từng nhóm lên chia sẻ: Con vừa quan sát được khu vực nào? Ở đó có những đồ dùng gì? Cô khái quát lại tên gọi, công dụng và ý nghĩa của từng phòng ban trong trường.',
        step4_elaborate: 'Trò chơi STEAM: "Kiến trúc sư tí hon" — Cho trẻ dùng các khối gỗ, hộp giấy để lắp ghép mô hình sân trường có cầu trượt, xích đu và hàng rào cây xanh.',
        step5_evaluate: 'Trưng bày mô hình các nhóm, cô nhận xét tuyên dương sự sáng tạo, nhắc nhở trẻ yêu quý bảo vệ ngôi trường thân yêu.',
      },
      outdoorActivity: {
        purposeTitle: 'Quan sát vườn hoa cánh bướm sân trường',
        gameMovement: 'Trò chơi vận động: Mèo đuổi chuột',
        freePlay: 'Chơi tự do với đồ chơi ngoài trời: Cầu trượt, bập bênh dưới sự giám sát của cô.',
      },
      afternoonActivity: {
        activityName: 'Làm quen bài hát "Cháu đi mẫu giáo"',
        guideContent: 'Cô hát mẫu cho trẻ nghe, hướng dẫn trẻ hát từng câu theo giai điệu vui tươi, rộn ràng.',
      },
      poemStorySongText: `BÀI HÁT: CHÁU ĐI MẪU GIÁO (Nhạc & Lời: Phạm Minh Tuấn)\n\nCháu lên ba cháu đi mẫu giáo\nCô thương cháu vì cháu không khóc nhè\nKhông khóc nhè để mẹ trồng cây trái\nBa vào nhà máy ông bà vui cấy cày\nLa la la la là la la la...`,
    },
    {
      dayOfWeek: 'Ba',
      dateStr: '09/09/2025',
      subjectDomain: 'LĨNH VỰC PHÁT TRIỂN THỂ CHẤT',
      activityType: 'HOẠT ĐỘNG THỂ DỤC VẬN ĐỘNG',
      topic: 'VẬN ĐỘNG CƠ BẢN: ĐI TRONG ĐƯỜNG HẸP ĐẦU ĐỘI TÚI CÁT (MT1)',
      objectives: {
        knowledge: ['Trẻ biết tên bài tập "Đi trong đường hẹp đầu đội túi cát" và biết giữ thăng bằng cơ thể khi di chuyển.'],
        skills: ['Rèn kỹ năng đi thẳng hướng, mắt nhìn về phía trước, giữ lưng thẳng không làm rơi túi cát (MT1).'],
        attitudes: ['Tự tin, kiên trì tham gia vận động và cổ vũ đồng đội.'],
        integrationHCM: 'Rèn luyện thân thể theo gương Bác Hồ vĩ đại: "Khỏe để học tập và giúp đỡ mọi người".',
      },
      preparation: {
        teacher: 'Vạch kẻ đường hẹp rộng 25cm dài 3m, túi cát may chuẩn mầm non, xắc xô hiệu lệnh, nhạc sôi động.',
        students: 'Mỗi trẻ 1 túi cát nhỏ, trang phục thể thao thoải mái, dép quai hậu hoặc chân trần trên thảm.',
      },
      steps: {
        step1_engage: 'Khởi động: Cho trẻ đi vòng tròn kết hợp các kiểu đi (đi bằng mũi chân, gót chân, chạy chậm, chạy nhanh) theo nhịp xắc xô.',
        step2_explore: 'Trọng động - BTPTC: Tập các động tác tay, chân, lườn, bật theo nhạc bài "Bé khỏe bé ngoan". Cô làm mẫu động tác đi trong đường hẹp đội túi cát 2 lần kèm phân tích chi tiết.',
        step3_explain: 'Cho 2 trẻ khá lên làm mẫu thử. Cô nhấn mạnh kỹ thuật: Đặt túi cát ngay ngắn trên đỉnh đầu, lưng thẳng, bước đi nhẹ nhàng trong vạch không giẫm lên vạch kẻ.',
        step4_elaborate: 'Trẻ lần lượt thực hiện (2-3 lần). Tổ chức thi đua giữa 2 đội "Thỏ Trắng" và "Gấu Nâu" chuyển quà vào kho.',
        step5_evaluate: 'Hồi tĩnh: Cho trẻ đi dạo nhẹ nhàng 1-2 vòng quanh sân thả lỏng các khớp tay chân.',
      },
      outdoorActivity: {
        purposeTitle: 'Dạo chơi quanh sân trường nhặt lá rụng bỏ thùng rác',
        gameMovement: 'Trò chơi dân gian: Nu na nu nống',
        freePlay: 'Chơi tự do với bóng nhựa, vẽ phấn trên sân.',
      },
      afternoonActivity: {
        activityName: 'Rèn kỹ năng rửa tay 6 bước',
        guideContent: 'Cô làm mẫu quy trình rửa tay bằng xà phòng theo hướng dẫn của Bộ Y Tế, cho trẻ thực hành theo nhóm.',
      },
    },
    {
      dayOfWeek: 'Tư',
      dateStr: '10/09/2025',
      subjectDomain: 'LĨNH VỰC PHÁT TRIỂN NHẬN THỨC (TOÁN)',
      activityType: 'HOẠT ĐỘNG LÀM QUEN VỚI TOÁN',
      topic: 'ĐỀ TÀI: NHẬN BIẾT VÀ PHÂN BIỆT HÌNH TRÒN, HÌNH VUÔNG (MT24)',
      objectives: {
        knowledge: [
          'Trẻ nhận biết, gọi đúng tên hình tròn, hình vuông (M).',
          'Biết đặc điểm: Hình tròn có đường bao cong tròn và lăn được; hình vuông có 4 cạnh, 4 góc bằng nhau và không lăn được (S).',
        ],
        skills: ['Rèn kỹ năng quan sát, so sánh, sờ đường bao của các hình khối và lăn thử nghiệm.'],
        attitudes: ['Hứng thú tham gia trò chơi toán học, biết giữ gìn đồ dùng học tập.'],
      },
      preparation: {
        teacher: 'Rổ đồ dùng có các hình tròn màu đỏ, hình vuông màu vàng cỡ lớn, slide hình ảnh đồ vật trong đời sống.',
        students: 'Mỗi trẻ một rổ gồm 1 hình tròn đỏ, 1 hình vuông vàng, bảng con.',
      },
      steps: {
        step1_engage: 'Hát bài "Hình khối diệu kỳ". Cô giới thiệu hộp quà bí mật từ bạn Búp Bê mang tặng lớp.',
        step2_explore: 'Trẻ mở hộp quà lấy hình tròn và hình vuông. Trẻ dùng tay sờ đường bao quanh hình và lăn thử 2 hình trên bàn để khám phá sự khác biệt.',
        step3_explain: 'Cô mời trẻ trả lời: Hình nào lăn được? Tại sao hình vuông không lăn được? Cô giải thích rõ tính chất góc cạnh và đường cong tròn khép kín.',
        step4_elaborate: 'Trò chơi 1: "Tìm đúng nhà" — Ai có hình tròn về nhà hình tròn, ai có hình vuông về nhà hình vuông. Trò chơi 2: Ghép hình tạo thành chiếc ô tô tải.',
        step5_evaluate: 'Cô nhận xét kết quả trò chơi, tuyên dương trẻ nhận biết nhanh và chính xác.',
      },
      outdoorActivity: {
        purposeTitle: 'Quan sát cây bàng sân trường mùa thu',
        gameMovement: 'Trò chơi vận động: Cáo và thỏ',
        freePlay: 'Chơi với đồ chơi ngoài trời liên hoàn.',
      },
      afternoonActivity: {
        activityName: 'Đọc thơ "Bạn mới"',
        guideContent: 'Cô đọc diễn cảm bài thơ, dạy trẻ biết chào đón và giúp đỡ các bạn mới vào lớp mầm.',
      },
      poemStorySongText: `BÀI THƠ: BẠN MỚI (Tác giả: Nguyệt Mai)\n\nBạn mới đến trường\nHãy còn nhút nhát\nEm dạy bạn hát\nRủ bạn cùng chơi\nCô thấy cô cười\nCô khen đoàn kết.`,
    },
    {
      dayOfWeek: 'Năm',
      dateStr: '11/09/2025',
      subjectDomain: 'LĨNH VỰC PHÁT TRIỂN NGÔN NGỮ',
      activityType: 'HOẠT ĐỘNG LÀM QUEN VĂN HỌC',
      topic: 'DẠY THƠ: "CÔ DẠY" — TÁC GIẢ PHẠM HỔ (MT36)',
      objectives: {
        knowledge: [
          'Trẻ nhớ tên bài thơ "Cô dạy", tên tác giả Phạm Hổ.',
          'Hiểu nội dung bài thơ: Cô giáo dạy bé giữ sạch đôi bàn tay, không bôi bẩn để tay trắng tinh và xinh đẹp.',
        ],
        skills: ['Đọc thuộc thơ, phát âm chuẩn, ngắt nghỉ đúng nhịp và thể hiện giọng điệu vui tươi, hồn nhiên (MT36).'],
        attitudes: ['Trẻ biết vâng lời cô giáo, giữ gìn vệ sinh thân thể sạch sẽ mỗi ngày.'],
      },
      preparation: {
        teacher: 'Tranh minh họa thơ điện tử sắc nét, mô hình đôi bàn tay xinh xắn, nhạc đệm êm dịu.',
        students: 'Tâm thế sẵn sàng, trang phục gọn gàng.',
      },
      steps: {
        step1_engage: 'Cô cho cả lớp chơi trò chơi "Giấu cái tay" và đàm thoại về đôi bàn tay thơm tho của bé.',
        step2_explore: 'Cô đọc thơ lần 1 diễn cảm kết hợp cử chỉ điệu bộ. Cô đọc thơ lần 2 kết hợp xem tranh trình chiếu minh họa.',
        step3_explain: 'Đàm thoại trích dẫn: Cô dạy bé điều gì? Đôi bàn tay sạch sẽ giúp ích gì cho bé? Giảng giải từ khó "trắng tinh".',
        step4_elaborate: 'Dạy trẻ đọc thơ: Cả lớp đọc cùng cô 2-3 lần, từng tổ thi đua đọc thơ, nhóm bạn trai/bạn gái và cá nhân đọc diễn cảm.',
        step5_evaluate: 'Cả lớp đọc lại bài thơ một lần nữa kết hợp múa minh họa. Cô nhận xét giờ học.',
      },
      outdoorActivity: {
        purposeTitle: 'Vẽ phấn tự do trên sân trường',
        gameMovement: 'Trò chơi: Nhảy tiếp sức qua vòng',
        freePlay: 'Chơi tự do theo ý thích.',
      },
      afternoonActivity: {
        activityName: 'Kỹ năng an toàn mầm non',
        guideContent: 'Cô hướng dẫn trẻ nhận biết ổ cắm điện, bậc tam cấp nguy hiểm và cách phòng tránh va chạm khi chạy chơi.',
      },
      poemStorySongText: `BÀI THƠ: CÔ DẠY (Tác giả: Phạm Hổ)\n\nMẹ, mẹ ơi cô dạy\nPhải giữ sạch đôi tay\nBàn tay mà lấm bẩn\nSách áo cũng bẩn ngay.\n\nMẹ, mẹ ơi cô dạy\nCãi nhau là không vui\nCái miệng nó xinh thế\nChỉ nói điều hay thôi!`,
    },
    {
      dayOfWeek: 'Sáu',
      dateStr: '12/09/2025',
      subjectDomain: 'LĨNH VỰC PHÁT TRIỂN THẨM MĨ (STEAM)',
      activityType: 'HOẠT ĐỘNG TẠO HÌNH (STEAM / EDP)',
      topic: 'DỰ ÁN STEAM: THIẾT KẾ DÂY CỜ HOA TRANG TRÍ LỚP HỌC (MT68)',
      objectives: {
        knowledge: [
          'Trẻ hiểu cách xâu ghép các hình tam giác, hình chữ nhật màu sắc bằng dây len để tạo thành dây cờ trang trí (E - Kỹ thuật).',
          'Nhận biết quy luật sắp xếp xen kẽ màu đỏ - vàng - xanh (M - Toán học).',
          'Cảm nhận vẻ đẹp rực rỡ của lớp học khi được trang trí cờ hoa (A - Nghệ thuật).',
        ],
        skills: ['Rèn kỹ năng xỏ dây qua lỗ, bôi keo dán giấy và phối hợp làm việc nhóm khéo léo (MT68).'],
        attitudes: ['Yêu quý sản phẩm mình làm ra, hào hứng chung tay trang trí lớp học đẹp đẽ.'],
      },
      preparation: {
        teacher: 'Mẫu dây cờ hoa hoàn chỉnh, dây len nhiều màu, các lá cờ giấy màu đã bấm sẵn lỗ, nhạc nền nhẹ nhàng.',
        students: 'Rổ nguyên vật liệu lá cờ bằng giấy nỉ/thủ công, keo dán, dây len dài 1m cho mỗi nhóm.',
      },
      steps: {
        step1_engage: 'Cô cho trẻ ngắm nhìn bức ảnh lớp học trang trí ngày hội và gợi ý: "Chúng mình cùng làm dây cờ hoa thật đẹp để treo quanh lớp nhé!".',
        step2_explore: 'Trẻ quan sát mẫu dây cờ hoa của cô, sờ chất liệu và thảo luận: Lá cờ hình gì? Dây cờ được xâu như thế nào?',
        step3_explain: 'Cô hướng dẫn quy trình EDP 5 bước: 1. Lên ý tưởng màu sắc -> 2. Chọn lá cờ -> 3. Luồn dây qua lỗ từ trước ra sau -> 4. Căn khoảng cách đều nhau -> 5. Kiểm tra hoàn thiện.',
        step4_elaborate: 'Trẻ chia nhóm 4 bạn cùng nhau thực hiện xâu dây cờ hoa. Cô quan sát, hỗ trợ trẻ gặp khó khăn khi luồn dây.',
        step5_evaluate: 'Treo dây cờ hoa các nhóm lên góc triển lãm lớp học. Trẻ cùng cô ngắm nhìn và bình chọn dây cờ rực rỡ nhất.',
      },
      outdoorActivity: {
        purposeTitle: 'Chăm sóc và tưới nước bồn hoa mười giờ lớp học',
        gameMovement: 'Trò chơi: Kéo co tí hon',
        freePlay: 'Chơi tự do xích đu, cầu trượt.',
      },
      afternoonActivity: {
        activityName: 'Văn nghệ cuối tuần & Nêu gương bé ngoan',
        guideContent: 'Trẻ biểu diễn các bài hát đã học trong tuần, cô nhận xét tuyên dương và trao phiếu bé ngoan tuần 1.',
      },
    },
  ],
};
