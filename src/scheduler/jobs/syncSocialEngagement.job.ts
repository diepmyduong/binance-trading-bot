import { Job } from "agenda";
import { get, keyBy } from "lodash";
import moment from "moment-timezone";
import { SettingKey } from "../../configs/settingData";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { CollaboratorProductModel } from "../../graphql/modules/collaboratorProduct/collaboratorProduct.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { FacebookHelper } from "../../helpers/facebook.helper";
import { Agenda } from "../agenda";

export class SyncSocialEngagementJob {
  static jobName = "SyncSocialEngagement";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    const token = await SettingHelper.load(SettingKey.MEDIA_FACEBOOK_TOKEN);
    if (!token || token == "") return;
    console.log("Execute Job " + SyncSocialEngagementJob.jobName, moment().format());
    try {
      await syncCollaboratorSocialEngagement(job, token);
    } catch (err) {
      console.log("Đồng bộ dữ liệu tương tác lỗi", err.message);
    }
    try {
      await syncCollaboratorProductSocialEngagement(job, token);
    } catch (err) {
      console.log("Đồng bộ dữ liệu tương tác lỗi", err.message);
    }
    done();
  }
}

export default SyncSocialEngagementJob;
async function syncCollaboratorProductSocialEngagement(job: any, token: any) {
  const collaboratorProducts = await CollaboratorProductModel.find({});
  const keyData = keyBy(collaboratorProducts, "shortUrl");
  await job.touch();
  const urls = Object.keys(keyData);
  console.log("Đang truy xuất dữ liệu tương tác...");
  const results = await FacebookHelper.batchEngagement(urls, token);
  await job.touch();
  const bulk = CollaboratorProductModel.collection.initializeUnorderedBulkOp();
  for (const r of results) {
    const product = keyData[r.id];
    if (product) {
      bulk.find({ _id: product._id }).updateOne({
        $set: {
          likeCount: get(r, "engagement.reaction_count", 0),
          commentCount: get(r, "engagement.comment_count", 0),
          shareCount: get(r, "engagement.share_count", 0),
          engagementCount: get(r, "og_object.count", 0),
        },
      });
    }
  }
  if (bulk.length > 0) {
    console.log("Tiến hành cập nhật link chia sẻ", bulk.length, "link sản phẩm");
    await bulk.execute();
  }
  console.log("Đã cập nhật link chia sẻ");
}

async function syncCollaboratorSocialEngagement(job: any, token: any) {
  const collaborators = await CollaboratorModel.find({});
  const keyData = keyBy(collaborators, "shortUrl");
  await job.touch();
  const urls = Object.keys(keyData);
  console.log("Đang truy xuất dữ liệu tương tác...");
  const results = await FacebookHelper.batchEngagement(urls, token);
  await job.touch();
  const bulk = CollaboratorModel.collection.initializeUnorderedBulkOp();
  for (const r of results) {
    const collaborator = keyData[r.id];
    if (collaborator) {
      bulk.find({ _id: collaborator._id }).updateOne({
        $set: {
          likeCount: get(r, "engagement.reaction_count", 0),
          commentCount: get(r, "engagement.comment_count", 0),
          shareCount: get(r, "engagement.share_count", 0),
          engagementCount: get(r, "og_object.count", 0),
        },
      });
    }
  }
  if (bulk.length > 0) {
    console.log("Tiến hành cập nhật link chia sẻ", bulk.length, "link cộng tác viên");
    await bulk.execute();
  }
  console.log("Đã cập nhật link chia sẻ");
}
