import _, { get } from "lodash";
import { AuthHelper } from "../helpers";
import { TokenHelper } from "../helpers/token.helper";
import { TokenExpiredError } from "jsonwebtoken";
import { ROLES } from "../constants/role.const";
import { ChatBotHelper, MessengerTokenDecoded } from "../helpers/chatbot.helper";
import { ObjectId } from "bson";
import { connect } from "mongodb";
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
    public tokenData?: TokenData,
    public token: string = null,
    public messengerSignPayload?: MessengerTokenDecoded
  ) { }

  isMember() {
    return get(this.tokenData, "role") == ROLES.MEMBER;
  }
  isCustomer() {
    return get(this.tokenData, "role") == ROLES.CUSTOMER;
  }
  isMessenger() {
    return get(this.tokenData, "role") == ROLES.MESSENGER;
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
      if (connection && connection.context) {
        sig = connection.context["x-sig"];
        psid = connection.context["x-psid"];
        pageId = connection.context["x-page-id"];
      }

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


  parseHeader(params: any) {
    try {
      const { req } = params;
      let campaignCode, collaboratorId, memberCode;

      if (req) {
        campaignCode = _.get(req, "headers.x-campaign-code");
        collaboratorId = _.get(req, "headers.x-collaborator-id");
        memberCode = _.get(req, "headers.x-code") || _.get(req, "query.x-code");
      }

      campaignCode = campaignCode ? campaignCode.replace("null", null) : null;
      collaboratorId = collaboratorId ? collaboratorId.replace("null", null) : null;
      memberCode = memberCode ? memberCode.replace("null", null) : null;

      this.collaboratorId = ObjectId.isValid(collaboratorId) ? collaboratorId : null;
      this.collaboratorId = collaboratorId;
      this.campaignCode = campaignCode;
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
  }

  auth(roles: string[]) {
    AuthHelper.acceptRoles(this, roles);
  }
}

export async function onContext(params: any) {
  let context: Context = new Context();
  await context.parseSig(params);
  context.parseToken(params);
  context.parseHeader(params);
  return context;
}
