import { ObjectId } from "bson";
import { createCanvas, loadImage } from "canvas";
import { chunk, keyBy, set, times } from "lodash";
import { Types } from "mongoose";

import { Request, Response } from "../../../base/baseRoute";
import { ErrorHelper } from "../../../base/error";
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
  const memberId: string = req.query.memberId ? req.query.memberId.toString() : null;
  const $match: any = {};
  if (memberId) {
    set($match, "memberId", new ObjectId(memberId));
  }
  if (context.isMember()) {
    set($match, "memberId", new ObjectId(context.id));
  }
  const collaborators = await CollaboratorModel.find({ ...$match });
  const memberIds = collaborators.map((col) => col.memberId).map(Types.ObjectId);
  const members = await MemberModel.find({ _id: { $in: memberIds } }).select("_id shopName");
  const pdfContent = await getPDFOrder({ collaborators, members });
  return PrinterHelper.responsePDF(res, pdfContent, `danh-sach-qr-ctv`);
};

const getPDFOrder = async ({
  collaborators,
  members,
}: {
  collaborators: ICollaborator[];
  members: IMember[];
}) => {
  if (collaborators.length <= 0) return { content: [{}] };
  const host = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN);
  const memberKeyById = keyBy(members, "_id");
  const qrCodes = collaborators.map((c) => {
    const member = memberKeyById[c.memberId];
    return {
      qr: `${host}/ctv/${c.shortCode}`,
      text: c.name,
      shopName: member ? member.shopName : "",
    };
  });
  const body = [];
  const chunkSize = 4;
  const qrSize = 100;
  const columnSize = 120;

  const qrChunk = chunk(qrCodes, chunkSize);
  for (const row of qrChunk) {
    let codes: any[] = row.map((r) => ({ qr: r.qr, fit: qrSize }));
    let texts = row.map((r) => r.text);
    let shopNames = row.map((r) => r.shopName);
    if (row.length < chunkSize) {
      const n = chunkSize - row.length;
      codes = [
        ...codes,
        ...times(n, () => ({
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=",
          width: 164,
          height: 164,
        })),
      ];
      texts = [...texts, ...times(n, () => "")];
      shopNames = [...shopNames, ...times(n, () => "")];
    }
    body.push([
      {
        table: {
          widths: times(chunkSize, () => columnSize),
          dontBreakRows: true,
          body: [codes, texts, shopNames],
        },
      },
    ]);
  }

  var dd = {
    pageSize: "A4",
    pageMargins: [20, 20, 20, 20],
    content: [
      {
        table: {
          dontBreakRows: true,
          body,
        },
        layout: "noBorders",
      },
    ],
    defaultStyle: { columnGap: 20, fontSize: 11 },
  };

  return dd;
};
