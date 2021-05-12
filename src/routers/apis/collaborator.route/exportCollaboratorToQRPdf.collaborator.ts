import { createCanvas, loadImage } from "canvas";
import _, { isUndefined, set } from "lodash";
import { Types } from "mongoose";

import { Request, Response } from "../../../base/baseRoute";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../../graphql/context";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../../graphql/modules/collaborator/collaborator.model";
import { IMember, MemberModel } from "../../../graphql/modules/member/member.model";
import { SettingHelper } from "../../../graphql/modules/setting/setting.helper";
import { PrinterHelper } from "../../../helpers/printerHelper";

export const exportCollaboratorToQRPdf = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;
  context.auth(ROLES.ADMIN_EDITOR);

  const query: any = {};
  if (context.isMember()) {
    set(query, "memberId", context.id);
  } else if (req.query.memberId) {
    set(query, "memberId", req.query.memberId);
  }
  const collaborators = await CollaboratorModel.find(query);

  const memberIds = collaborators.map((col) => col.memberId).map(Types.ObjectId);
  const members = await MemberModel.find({ _id: { $in: memberIds } }).select("_id shopName");

  const pdfContent = await getPDFOrder({ collaborators, members });
  return PrinterHelper.responsePDF(res, pdfContent, `danh-sach-qr-ctv`);
};

const getBase64ImageFromURL = async (url: string) => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(url);
  ctx.drawImage(image, 0, 0, 300, 300);
  return ctx.canvas.toDataURL();
};

const getPDFOrder = async ({
  collaborators,
  members,
}: {
  collaborators: ICollaborator[];
  members: IMember[];
}) => {
  // collaborators = [];
  if (collaborators.length <= 0) return { content: [{}] };
  const qrCodes = [];
  const qrTexts = [];
  const qrShopNames = [];
  const host = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN);
  for (const collaborator of collaborators) {
    // console.log("collaborator", collaborator);
    const member = members.find(
      (member: IMember) => member._id.toString() === collaborator.memberId.toString()
    );
    // console.log("test", member);
    qrCodes.push({ qr: `${host}/ctv/${collaborator.shortCode}` });
    qrTexts.push(collaborator.name);
    if (member) {
      qrShopNames.push(member.shopName);
    } else {
      qrShopNames.push("");
    }
  }

  const styles = {
    styles: {},
    defaultStyle: {
      columnGap: 20,
    },
  };

  const body = [];

  for (let i = 0; i < qrTexts.length; i++) {
    // console.log('i % 3 == 0',i % 3 == 0);
    if (i % 3 == 0) {
      const qrCode1 = qrCodes[i];
      const qrText1 = qrTexts[i];
      const qrShopName1 = qrShopNames[i];

      const codes: any[] = [qrCode1];
      const texts: any[] = [qrText1];
      const shopNames: any[] = [qrShopName1];

      if (!isUndefined(qrTexts[i + 1])) {
        codes.push(qrCodes[i + 1]);
        texts.push(qrTexts[i + 1]);
        shopNames.push(qrShopNames[i + 1]);
      } else {
        codes.push({
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
          width: 164,
          height: 164,
        });
        texts.push("");
        shopNames.push("");
      }
      if (!isUndefined(qrTexts[i + 2])) {
        codes.push(qrCodes[i + 2]);
        texts.push(qrTexts[i + 2]);
        shopNames.push(qrShopNames[i + 2]);
      } else {
        codes.push({
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
          width: 164,
          height: 164,
        });
        texts.push("");
        shopNames.push("");
      }

      body.push(codes, texts, shopNames);
    }
  }

  // console.log("body", body);

  var dd = {
    pageMargins: [20, 20, 20, 20],
    content: [
      {
        table: {
          dontBreakRows: true,
          body,
        },
      },
    ],
    ...styles,
  };

  return dd;
};
