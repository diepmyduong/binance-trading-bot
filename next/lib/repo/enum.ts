function parseObjectToOptions(obj: any): Option[] {
  return Object.keys(obj).map((k) => ({ label: obj[k], value: k }));
}
function parseOptionsToObject(options: Option[]): { [key: string]: Option } {
  return options.reduce((obj, item) => ({ ...obj, [item.value]: item }), {});
}

export enum PointType {
  REWARD_POINT = "REWARD_POINT",
  RANKING_POINT = "RANKING_POINT",
}
export const PointTypeText = {
  REWARD_POINT: "Điểm thưởng",
  RANKING_POINT: "Điểm xét hạng",
};
export const PointTypeOptions = parseObjectToOptions(PointTypeText);

export enum CurrencyUnit {
  USD = "USD",
  VND = "VND",
  EUR = "EUR",
}
export const CurrencyUnitOptions = parseObjectToOptions(CurrencyUnit);

export enum ConvertPointType {
  TRANS_VAL = "TRANS_VAL", // Theo giá trị giao dịch,
  PRODUCt_QTY = "PRODUCt_QTY", // Theo số lượng sản phẩm
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DEACTIVE = "DEACTIVE",
  BLOCKED = "BLOCKED",
}
export const StatusText = {
  DEACTIVE: "Ngừng kích hoạt",
  ACTIVE: "Đang kích hoạt",
  INACTIVE: "Chưa kích hoạt",
  BLOCKED: "Đã bị khóa",
};
export const StatusOptions: Option[] = [
  { value: "DEACTIVE", label: "Ngừng kích hoạt", color: "accent" },
  { value: "ACTIVE", label: "Đang kích hoạt", color: "success" },
  { value: "INACTIVE", label: "Chưa kích hoạt", color: "bluegray" },
  { value: "BLOCKED", label: "Đã bị khóa", color: "primary" },
];
export const StatusOptionsObj = parseOptionsToObject(StatusOptions);

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
export const GenderText = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};
export const GenderOptions = parseObjectToOptions(GenderText);

export enum MemberStatus {
  DEACTIVE = "DEACTIVE", // Chưa kích hoạt
  ACTIVE = "ACTIVE", // Đang kích hoạt
  SUSPENDED = "SUSPENDED", // Bị nghi vấn
}
export const MemberStatusText = {
  DEACTIVE: "Chưa kích hoạt",
  ACTIVE: "Đang kích hoạt",
  SUSPENDED: "Bị nghi vấn",
};
export const MemberStatusOptions: Option[] = [
  { value: "DEACTIVE", label: "Ngừng kích hoạt", color: "accent" },
  { value: "ACTIVE", label: "Đang kích hoạt", color: "success" },
  { value: "SUSPENDED", label: "Bị nghi vấn", color: "primary" },
];
export const MemberStatusOptionsObj = parseOptionsToObject(StatusOptions);

export enum AccountType {
  CHD = "CHD", // Trẻ em
  ADL = "ADL", // Người lớn
}
export const AccountTypeText = {
  CHD: "Trẻ em",
  ADL: "Người lớn",
};
export const AccountTypeOptions = parseObjectToOptions(AccountTypeText);

export enum TransactionType {
  COMMERCIAL = "COMMERCIAL", // Giao dịch thương mại
  LOYALTY = "LOYALTY", // Giao dịch loyalty
}
export const TransactionTypeText = {
  COMMERCIAL: "Giao dịch thương mại",
  LOYALTY: "Giao dịch Loyalty",
};
export const TransactionTypeOptions = parseObjectToOptions(TransactionTypeText);

export enum EventType {
  SINH_NHAT_HOI_VIEN = "SINH_NHAT_HOI_VIEN",
  SINH_NHAT_CONG_TY = "SINH_NHAT_CONG_TY",
  KI_NIEM_THANH_VIEN = "KI_NIEM_THANH_VIEN",
  NGAY_TET_DUONG_LICH = "NGAY_TET_DUONG_LICH",
  NGAY_QUOC_TE_PHU_NU = "NGAY_QUOC_TE_PHU_NU",
  NGAY_PHU_NU_VIET_NAM = "NGAY_PHU_NU_VIET_NAM",
  OTHER = "OTHER",
}
export const EventTypeText = {
  SINH_NHAT_HOI_VIEN: "Sinh nhật hội viên",
  SINH_NHAT_CONG_TY: "Sinh nhật công ty",
  KI_NIEM_THANH_VIEN: "Kỉ niệm thành viên",
  NGAY_TET_DUONG_LICH: "Ngày tết dương lịch",
  NGAY_QUOC_TE_PHU_NU: "Ngày quốc tế phụ nữ",
  NGAY_PHU_NU_VIET_NAM: "Ngày phụ nữ Việt Nam",
  OTHER: "Sự kiện khác",
};
export const EventTypeOptions = parseObjectToOptions(EventTypeText);

export enum GiveForm {
  PERMANENT = "PERMANENT", // Tặng điểm cố định
  PERCENT = "PERCENT", // Tặng điểm theo %
}
export const GiveFormText = {
  PERMANENT: "Cố định",
  PERCENT: "Theo %",
};
export const GiveFormOptions = parseObjectToOptions(GiveFormText);

export enum EmailType {
  CUSTOM = "CUSTOM", // Tuỳ chỉnh
  ACTIVE_PASSWORD = "ACTIVE_PASSWORD", // Kích hoạt mật khẩu
  GREETING_ACTIVATED = "GREETING_ACTIVATED", // Chào mừng kích hoạt thành công
  ONETIME_OTP = "ONETIME_OTP", // Thông báo tạo mã OTP thành công
  RESET_PASSWORD = "RESET_PASSWORD", // Thông báo yêu cầu reset mật khẩu
}

export enum SmsType {
  CUSTOM = "CUSTOM", // Tuỳ chỉnh
  ACTIVE_PASSWORD = "ACTIVE_PASSWORD", // Kích hoạt mật khẩu
  GREETING_ACTIVATED = "GREETING_ACTIVATED", // Chào mừng kích hoạt thành công
  ONETIME_OTP = "ONETIME_OTP", // Thông báo tạo mã OTP thành công
  RESET_PASSWORD = "RESET_PASSWORD", // Thông báo yêu cầu reset mật khẩu
}

export enum RankingTermType {
  PERMANENT_TERM = "PERMANENT_TERM",
  ROLLING_TERM = "ROLLING_TERM",
  NONE = "NONE",
}
export const RankingTermTypeText = {
  PERMANENT_TERM: "Kỳ hạn cố định theo năm",
  ROLLING_TERM: "Kỳ hạn cuốn chiếu",
  NONE: "Không kỳ hạn",
};
export const RankingTermTypeOptions = parseObjectToOptions(RankingTermTypeText);

export enum RewardPointTermType {
  PERMANENT_TERM = "PERMANENT_TERM",
  ROLLING_TERM = "ROLLING_TERM",
  NO_TERM = "NO_TERM",
  CONDITION_NO_TERM = "CONDITION_NO_TERM",
}
export const RewardPointTermTypeText = {
  NO_TERM: "Không kỳ hạn",
  PERMANENT_TERM: "Kỳ hạn cố định",
  ROLLING_TERM: "Kỳ hạn cuốn chiếu",
  CONDITION_NO_TERM: "Không kỳ hạn có điều kiện theo giao dịch",
};
export const RewardPointTermTypeOptions = parseObjectToOptions(RewardPointTermTypeText);

export enum TimeUnit {
  MONTH = "MONTH",
  YEAR = "YEAR",
}
export const TimeUnitText = {
  MONTH: "Tháng",
  YEAR: "Năm",
};
export const TimeUnitOptions = parseObjectToOptions(TimeUnitText);
export enum TimeUnitFull {
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}
export const TimeUnitFullText = {
  DAY: "Ngày",
  MONTH: "Tháng",
  YEAR: "Năm",
};
export const TimeUnitFullOptions = parseObjectToOptions(TimeUnitFullText);

export enum Currency {
  USD = "USD",
  VND = "VND",
}
export const CurrencyOptions: Option[] = [{ label: "VND", value: "VND" }];

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLIC = "PUBLIC",
}
export const PostStatusText = {
  DRAFT: "Bản nháp",
  PUBLIC: "Đã xuất bản",
};

export enum TransactStatus {
  PENDING = "PENDING", // Đang xử lý
  COMPLETE = "COMPLETE", // Hoàn thành
  CANCEL = "CANCEL", // "Huỷ"
}
export const TransactStatusText = {
  PENDING: "Đang xử lý",
  COMPLETE: "Hoàn thành",
  CANCEL: "Huỷ",
};

export enum MembershipConditionType {
  POINT = "POINT", // Điểm xét hạng
  TRANS = "TRANS", // Giao dịch xét hạng
  REVENUE = "REVENUE", // Doanh số xét hạng
  P_A_T = "P_A_T", // Điểm xét hạng và Giao dịch xét hạng
  P_A_R = "P_A_R", // Điểm xét hạng và daonh số xét hạng
  T_A_R = "T_A_R", // Giao dịch xét hạng và doanh số xét hạng
  P_O_T = "P_O_T", // Điểm xét hạng hoặc giao dịch xét hạng
  P_O_R = "P_O_R", // Điểm xét hạng hoặc doanh số xét hạng
  T_O_R = "T_O_R", // Giao dịch xét hạng hoặc doanh số xét hạng
}

export function isMembershipConditionTypePoint(conditionType: MembershipConditionType) {
  return [
    MembershipConditionType.POINT,
    MembershipConditionType.P_A_R,
    MembershipConditionType.P_A_T,
    MembershipConditionType.P_O_R,
    MembershipConditionType.P_O_T,
  ].includes(conditionType);
}
export function isMembershipConditionTypeTrans(conditionType: MembershipConditionType) {
  return [
    MembershipConditionType.TRANS,
    MembershipConditionType.T_A_R,
    MembershipConditionType.T_O_R,
    MembershipConditionType.P_A_T,
    MembershipConditionType.P_O_T,
  ].includes(conditionType);
}
export function isMembershipConditionTypeRevenue(conditionType: MembershipConditionType) {
  return [
    MembershipConditionType.REVENUE,
    MembershipConditionType.P_A_R,
    MembershipConditionType.P_O_R,
    MembershipConditionType.T_A_R,
    MembershipConditionType.T_O_R,
  ].includes(conditionType);
}

export const MembershipConditionTypeText = {
  POINT: "Điểm xét hạng",
  TRANS: "Giao dịch xét hạng",
  REVENUE: "Doanh số xét hạng",
  P_A_T: "Điểm xét hạng và Giao dịch xét hạng",
  P_A_R: "Điểm xét hạng và doanh số xét hạng",
  T_A_R: "Giao dịch xét hạng và doanh số xét hạng",
  P_O_T: "Điểm xét hạng hoặc giao dịch xét hạng",
  P_O_R: "Điểm xét hạng hoặc doanh số xét hạng",
  T_O_R: "Giao dịch xét hạng hoặc doanh số xét hạng",
};
export const MembershipConditionTypeOptions = parseObjectToOptions(MembershipConditionTypeText);

export enum VoucherType { // Loại voucher
  OFFER_ITEM = "OFFER_ITEM", // voucher Tặng sản phẩm
  DISCOUNT = "DISCOUNT", // voucher giảm giá
  PROMOTE = "PROMOTE", // voucher nâng hạng
  SERVICE = "SERVICE", // voucher dịch vụ
}
export const VoucherTypeText = {
  OFFER_ITEM: "Tặng sản phẩm",
  DISCOUNT: "Giảm giá",
  PROMOTE: "Nâng hạng",
  SERVICE: "Dịch vụ",
};
export const VoucherTypeOptions = parseObjectToOptions(VoucherTypeText);

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
export const UserRoleText = {
  ADMIN: "Quản trị viên",
  USER: "Người dùng",
};

export enum UserStatus {
  ACTIVE = "ACTIVE", // Hoạt động
  INACTIVE = "INACTIVE", // Không hoạt động
  BLOCKED = "BLOCKED", // Bị Khoá
}
export const UserStatusText = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
  BLOCKED: "Bị Khoá",
};

export enum PeriodType {
  ALL = "ALL", // Từ đầu
  D = "D", // Ngày
  W = "W", // Tuần
  M = "M", // Tháng
}
export const PeriodTypeText = {
  ALL: "Từ đầu",
  D: "Ngày",
  W: "Tuần",
  M: "Tháng",
};
export const PeriodTypeOptions = parseObjectToOptions(PeriodTypeText);

export enum ActivityRuleType {
  PROV_EMAIL = "PROV_EMAIL", // Cung cấp Email
  TRANS_FQ = "TRANS_FQ", // Tần xuất giao dịch
}
export const ActivityRuleTypeText = {
  PROV_EMAIL: "Cung cấp Email",
  TRANS_FQ: "Tần suất giao dịch",
};
export const ActivityRuleTypeOptions = parseObjectToOptions(ActivityRuleTypeText);

export enum MVoucherType {
  SYSTEM = "SYSTEM", // Hệ thống cung cấp
  GOT_IT = "GOT_IT", // Got It cung cấp
}
export const MVoucherTypeText = {
  SYSTEM: "Hệ thống cung cấp",
  GOT_IT: "Got It cung cấp",
};

export enum MVocuherStt {
  STILL_VALID = "STILL_VALID", // Còn hiệu lực
  EXPIRED = "EXPIRED", // Hết hiệu lực
}
export const MVocuherSttText = {
  STILL_VALID: "Còn hiệu lực",
  EXPIRED: "Hết hiệu lực",
};

export enum MemberLogType {
  CHANGE_RANK = "CHANGE_RANK", // Đổi hạng
  CHANGE_EMAIL = "CHANGE_EMAIL", // Đổi email
  CHANGE_PHONE = "CHANGE_PHONE", // Đổi điện thoại
  LOGIN = "LOGIN", // Đăng nhập
}
export const MemberLogTypeText = {
  CHANGE_RANK: "Đổi hạng",
  CHANGE_EMAIL: "Đổi email",
  CHANGE_PHONE: "Đổi điện thoại",
  LOGIN: "Đăng nhập",
};
