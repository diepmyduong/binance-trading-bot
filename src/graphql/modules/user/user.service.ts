import { CrudService } from "../../../base/crudService";
import { UserModel, UserRole } from "./user.model";
import { ErrorHelper } from "../../../helpers/error.helper";
import { firebaseHelper } from "../../../helpers";
import { Types } from "mongoose";
class UserService extends CrudService<typeof UserModel> {
  constructor() {
    super(UserModel);
  }
  async deleteOne(id: string) {
    let user = await this.model.findOne({ _id: id });
    if (!user) throw ErrorHelper.recoredNotFound("Không tìm thấy dữ liệu");
    await firebaseHelper
      .deleteUser(user.uid)
      .then(async (res) => {
        await user.remove();
      })
      .catch((error) => {
        throw ErrorHelper.somethingWentWrong(error);
      });
    return user;
  }

  async deleteMany(ids: string[]) {
    let deletedCount = 0;
    const users = await UserModel.find({ _id: { $in: ids } });
    await firebaseHelper
      .deleteUsers(users.map((u) => u.uid.toString()))
      .then(async (res) => {
        const result = await this.model.deleteMany({ _id: { $in: ids } });
        deletedCount = result.deletedCount;
      })
      .catch((error) => {
        throw ErrorHelper.somethingWentWrong(error);
      });
    return deletedCount;
  }

  async getChatbotUser() {
    return await UserModel.findOneAndUpdate(
      { email: "chatbot@gmail.com" },
      {
        $setOnInsert: {
          name: "Mcom Chatbot",
          role: UserRole.ADMIN,
          uid: Types.ObjectId().toHexString(),
        },
      },
      { upsert: true, new: true }
    );
  }
}

const userService = new UserService();

export { userService };
