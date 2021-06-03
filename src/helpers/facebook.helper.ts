import Axios from "axios";
import { chunk } from "lodash";

import { ErrorHelper } from "../base/error";

export class FacebookHelper {
  static getEngagement = async (uri: any, token: any) => {
    // console.log('test', test);
    // console.log('encodeUrl', encodeUrl);
    // console.log('token', token);
    if (!token) {
      return {
        success: false,
        error: ErrorHelper.requestDataInvalid("Facebook token"),
      };
    }

    if (!uri) {
      return {
        success: false,
        error: ErrorHelper.requestDataInvalid("Affiliate Link"),
      };
    }

    const encodeUrl = encodeURIComponent(uri);
    let likeCount = 0,
      shareCount = 0,
      commentCount = 0;
    const getEngagement: any = await Axios.get(
      `https://graph.facebook.com/v4.0/${encodeUrl}?fields=engagement&access_token=${token}`
    )
      .then((res) => res)
      .catch((error) => {
        return { data: null };
      });

    const { data } = getEngagement;
    if (!data) {
      return {
        success: false,
        error: ErrorHelper.mgQueryFailed("facebook_engagement"),
      };
    }
    const { reaction_count, comment_count, share_count } = data.engagement;
    likeCount = reaction_count;
    commentCount = comment_count;
    shareCount = share_count;

    return {
      success: true,
      likeCount,
      shareCount,
      commentCount,
    };
  };

  static batchEngagement = async (urls: string[], token: string) => {
    const chunks = chunk(urls, 50);
    let result: any[] = [];
    for (const c of chunks) {
      const batch = [];
      for (const url of c) {
        batch.push({
          method: "GET",
          relative_url: `v4.0/?id=${url}`,
        });
      }
      result = [
        ...result,
        ...(await Axios.post(
          `https://graph.facebook.com`,
          { batch },
          { params: { access_token: token, fields: "og_object{engagement},engagement" } }
        ).then((res) => {
          return res.data.map((d: any) => JSON.parse(d.body));
        })),
      ];
    }
    return result;
  };
}
