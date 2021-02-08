import { gql } from "apollo-server-express";
import { Gender } from "../member.model";

export default gql`
    type SubscriberInfo {
        "Mã subscriber"
        id: String
        "PSID Fanpage"
        psid: String
        "Tên facebook"
        name: String
        "Tên "
        firstName: String
        "Họ "
        lastName: String
        "Giới tính ${Object.values(Gender)}"
        gender: String
        "Khu vực"
        locale: String
        "Hình đại diện"
        profilePic: String
    }
`;
