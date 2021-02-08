import { ErrorHelper } from "../../../base/error";
import { AddressModel } from "../address/address.model";
import { counterService } from "../counter/counter.service";
import { ICampaignSocialResult } from "./campaignSocialResult.model";
import Axios from "axios";
// import { IRegisService } from "./regisService.model";

export class CampaignSocialResultHelper {
  constructor(public campaignSocialResult: ICampaignSocialResult) { }

}
