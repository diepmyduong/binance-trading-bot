import { Gender } from "../member.model";

export type SubscriberInfo = {
  id: string; // Mã subscriber
  psid: string; // PSID Fanpage
  name: string; // Tên facebook
  firstName: string; // Tên
  lastName: string; // Họ
  gender: Gender; // Giới tính
  locale: string; // Khu vực
  profilePic: string; // Hình đại diện
};
