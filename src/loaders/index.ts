import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import expressLoader from "./express";
import { Logger } from "./logger";
import "../scheduler";
export default ({ expressApp }: any) => {
  expressLoader({ app: expressApp });
  Logger.info("Load Source Successfully!");
};

SettingHelper.seedingSetting();
