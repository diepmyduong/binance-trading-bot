import { ObjectId } from "bson";
import { TokenExpiredError } from "jsonwebtoken";
import _, { get } from "lodash";

import { SettingKey } from "../configs/settingData";
import { ROLES } from "../constants/role.const";
import { AuthHelper } from "../helpers";
import { ChatBotHelper, MessengerTokenDecoded } from "../helpers/chatbot.helper";
import { TokenHelper } from "../helpers/token.helper";
import { MemberModel } from "./modules/member/member.model";
import { SettingHelper } from "./modules/setting/setting.helper";

export type TokenData = {
  role: string;
  _id: string;
  [name: string]: string;
};
export type SignedRequestPayload = {
  psid: string;
  algorithm: string;
  thread_type: string;
  tid: string;
  issued_at: number;
  page_id: number;
};

export class Context {
  constructor(
    public isAuth: boolean = false,
    public isTokenExpired: boolean = false,
    public memberCode: string = null,
    public campaignCode: string = null,
    public collaboratorId: string = null,
    public xPageId: string = null,
    public xPsId: string = null,
    public tokenData?: TokenData,
    public token: string = null,
    public messengerSignPayload?: MessengerTokenDecoded
  ) {}

  isMember() {
    return get(this.tokenData, "role") == ROLES.MEMBER;
  }
  isCustomer() {
    return get(this.tokenData, "role") == ROLES.CUSTOMER;
  }
  isMessenger() {
    return get(this.tokenData, "role") == ROLES.MESSENGER;
  }
  isAdmin() {
    return get(this.tokenData, "role") == ROLES.ADMIN;
  }
  isEditor() {
    return get(this.tokenData, "role") == ROLES.EDITOR;
  }
  isStaff() {
    return get(this.tokenData, "role") == ROLES.STAFF;
  }
  get id() {
    return get(this.tokenData, "_id");
  }
  get sellerId() {
    return get(this.tokenData, "sellerId");
  }
  get pageId() {
    return get(this.tokenData, "pageId");
  }

  get psid() {
    return get(this.tokenData, "psid");
  }

  parseToken(params: any) {
    try {
      const { req, connection } = params;
      let token;

      if (req) {
        token = _.get(req, "headers.x-token") || _.get(req, "query.x-token");
      }

      if (connection && connection.context) {
        token = connection.context["x-token"];
      }

      if (token === "null") token = null;

      if (token) {
        const decodedToken: any = TokenHelper.decodeToken(token);
        this.isAuth = true;
        this.tokenData = decodedToken;
        this.token = token;
      }
    } catch (err) {
      // console.log("error", err);
      if (err instanceof TokenExpiredError) {
        this.isTokenExpired = true;
      }
      this.isAuth = false;
    } finally {
      return this;
    }
  }

  async parseSig(params: any) {
    try {
      const { req, connection } = params;
      let sig, psid, pageId;
      if (req) {
        sig = _.get(req, "headers.x-sig") || _.get(req, "query.x-sig");
        psid = _.get(req, "headers.x-psid") || _.get(req, "query.x-psid");
        pageId = _.get(req, "headers.x-page-id") || _.get(req, "query.x-page-id");
      }

      // console.log('parseSig',pageId);

      if (connection && connection.context) {
        sig = connection.context["x-sig"];
        psid = connection.context["x-psid"];
        pageId = connection.context["x-page-id"];
      }

      if (sig === "null") sig = null;
      if (psid === "null") psid = null;
      if (pageId === "null") pageId = null;

      if (psid && pageId) {
        this.messengerSignPayload = { pageId, psid, threadId: "" };
        this.isAuth = true;
        this.tokenData = { _id: psid, role: ROLES.MESSENGER };
      }

      if (sig) {
        const signPayload = await ChatBotHelper.decodeSignedRequest(sig);
        signPayload.psid = !signPayload.psid || signPayload.psid == "" ? psid : signPayload.psid;
        this.messengerSignPayload = signPayload;
        this.isAuth = true;
        this.tokenData = { _id: this.messengerSignPayload.psid, role: ROLES.MESSENGER };
      }
    } catch (err) {
    } finally {
      return this;
    }
  }

  parseHeader = (params: any) => {
    try {
      const { req } = params;
      let campaignCode, collaboratorId, memberCode, pageId, psid;
      if (req) {
        campaignCode = _.get(req, "headers.x-campaign-code");
        collaboratorId = _.get(req, "headers.x-collaborator-id");
        pageId = _.get(req, "headers.x-page-id");
        psid = _.get(req, "headers.x-psid");
        memberCode = _.get(req, "headers.x-code") || _.get(req, "query.x-code");
      }

      if (campaignCode === "null") campaignCode = null;
      if (collaboratorId === "null") collaboratorId = null;
      if (memberCode === "null") memberCode = null;
      if (pageId === "null") pageId = null;
      if (psid === "null") psid = null;

      this.collaboratorId = ObjectId.isValid(collaboratorId) ? collaboratorId : null;
      this.collaboratorId = collaboratorId;
      this.campaignCode = campaignCode;
      this.xPageId = pageId;
      this.xPsId = psid;
      this.memberCode = memberCode;
    } catch (err) {
      // console.log("error", err);
      if (err instanceof TokenExpiredError) {
        this.isTokenExpired = true;
      }
      this.isAuth = false;
    } finally {
      return this;
    }
  };

  modifyMemberCode = async () => {
    try {
      if (!this.memberCode) {
        if (this.xPageId) {
          const member = await MemberModel.findOne({ fanpageId: this.xPageId });
          if (member) {
            this.memberCode = member.code;
          } else {
            this.memberCode = await SettingHelper.load(SettingKey.DEFAULT_SHOP_CODE);
          }
        } else {
          this.memberCode = await SettingHelper.load(SettingKey.DEFAULT_SHOP_CODE);
        }
      }
      // console.log("this.memberCode",this.memberCode);
    } catch (err) {
      // console.log("error", err);
      if (err instanceof TokenExpiredError) {
        this.isTokenExpired = true;
      }
      this.isAuth = false;
    } finally {
      return this;
    }
  };

  auth(roles: string[]) {
    AuthHelper.acceptRoles(this, roles);
  }
}

export async function onContext(params: any) {
  let context: Context = new Context();
  await context.parseSig(params);
  await context.parseToken(params);
  context.parseHeader(params);
  await context.modifyMemberCode();
  return context;
}
