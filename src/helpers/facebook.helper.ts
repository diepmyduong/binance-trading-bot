import * as admin from "firebase-admin";
import { configs } from "../configs";
import { ErrorHelper } from "../base/error";
import Axios from "axios";
export class FacebookHelper {
    static getEngagement = async (uri: any, token: any) => {
        // console.log('test', test);
        // console.log('encodeUrl', encodeUrl);
        // console.log('token', token);
        if (!token) {
            return {
                success: false, error: ErrorHelper.requestDataInvalid("Facebook token")
            }
        }

        if (!uri) {
            return {
                success: false, error: ErrorHelper.requestDataInvalid("Affiliate Link")
            }
        }

        const encodeUrl = encodeURIComponent(uri);
        let likeCount = 0,
            shareCount = 0,
            commentCount = 0;
        const getEngagement: any = await Axios.get(`https://graph.facebook.com/v4.0/${encodeUrl}?fields=engagement&access_token=${token}`).then(res => res).catch(error => { return { data: null } });

        const { data } = getEngagement;
        if (!data) {
            return {
                success: false, error: ErrorHelper.mgQueryFailed("facebook_engagement")
            }

        }
        const { reaction_count, comment_count, share_count } = data.engagement;
        likeCount = reaction_count;
        commentCount = comment_count;
        shareCount = share_count;

        return {
            success: true, likeCount, shareCount, commentCount
        }
    }

}