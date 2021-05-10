import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";
import _, { isEmpty, isUndefined, set } from "lodash";
import { PrinterHelper } from "../../../helpers/printerHelper";

import { createCanvas, loadImage } from "canvas";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../../graphql/modules/collaborator/collaborator.model";
import { Context } from "../../../graphql/context";
import { ROLES } from "../../../constants/role.const";
import {
  IMember,
  MemberModel,
} from "../../../graphql/modules/member/member.model";
import { isValidObjectId, Types } from "mongoose";
import { ErrorHelper } from "../../../base/error";
import { ObjectId } from "bson";

export const exportCollaboratorToQRPdf = async (
  req: Request,
  res: Response
) => {
  const context = (req as any).context as Context;
  context.auth(ROLES.ADMIN_EDITOR);

  const memberId: string = req.query.memberId
  ? req.query.memberId.toString()
  : null;

  if (!isEmpty(memberId)) {
    if (!isValidObjectId(memberId)) {
      throw ErrorHelper.requestDataInvalid("Mã bưu cục");
    }
  }

  const $match: any = {};

  if (memberId) {
    set($match, "memberId", new ObjectId(memberId));
  }

  if (context.isMember()) {
    set($match, "memberId", new ObjectId(context.id));
  }

  const collaborators = await CollaboratorModel.find({ ...$match });
  
  const memberIds = collaborators
    .map((col) => col.memberId)
    .map(Types.ObjectId);
  const members = await MemberModel.find({ _id: { $in: memberIds } }).select(
    "_id shopName"
  );

  // console.log("collaborators", collaborators.length);

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

const getPDFOrder = async ({ collaborators, members }: any) => {
  // collaborators = [];
  if (collaborators.length <= 0) return { content: [{}] };
  const qrCodes = [];
  const qrTexts = [];
  const qrShopNames = [];

  for (const collaborator of collaborators) {
    // console.log("collaborator", collaborator);
    const member = members.find(
      (member: IMember) =>
        member._id.toString() === collaborator.memberId.toString()
    );
    // console.log("test", member);
    qrCodes.push({ qr: collaborator.shortUrl });
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
    pageMargins: [ 20, 20, 20, 20 ],
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
