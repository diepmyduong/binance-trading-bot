import { ROLES } from "../../../constants/role.const";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";
import { ErrorHelper } from "../../../base/error";
import { Context } from "../../../graphql/context";

import { auth } from "../../../middleware/auth";

import _, { isEmpty, reverse, set, sortBy } from "lodash";
import numeral from "numeral";
import { PrinterHelper } from "../../../helpers/printerHelper";
import {
  // getShipMethods,
  IOrder,
  OrderStatus,
  ShipMethod,
} from "../../../graphql/modules/order/order.model";
import { OrderModel } from "../../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../../graphql/modules/orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../../graphql/modules/addressDelivery/addressDelivery.model";
import { MemberModel, MemberType } from "../../../graphql/modules/member/member.model";
import { UtilsHelper } from "../../../helpers";
import Excel from "exceljs";
import moment from "moment";
import { AddressStorehouseModel } from "../../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { BranchModel } from "../../../graphql/modules/branch/branch.model";
import { isValidObjectId, Types } from "mongoose";
import { CollaboratorModel } from "../../../graphql/modules/collaborator/collaborator.model";

//http://localhost:5555/api/commission/exportCommissionReport?fromDate=2021-04-01&toDate=2021-04-06&branchId=603717300ec1da6449646ac3&sellerIds=6038ba30ab0f5a2cfe0f4ab6|6038b74cab0f5a2cfe0f48ad&x-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJfaWQiOiI2MDExMmJmYTRlMTI1YTI4MjQzZjc4NmQiLCJ1c2VybmFtZSI6IlBLRCAtIELEkFRQIiwiaWF0IjoxNjE3NjEyNzU3LCJleHAiOjE2MjAyMDQ3NTd9.of8nz5oPteaLjZqlgNreGD-mBl6TFlWNK05yjvyhwO4

export const exportProductReport = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;
  
  context.auth(ROLES.ADMIN_EDITOR_MEMBER);

  let data: any = [];
  let staticsticData: any = [];

  let fromDate: string = req.query.fromDate ? req.query.fromDate.toString() : null;
  let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
  const memberId: string = req.query.memberId ? req.query.memberId.toString() : null;
  const branchId: any = req.query.branchId ? req.query.branchId.toString() : null;
  const memberIdsString = req.query.sellerIds ? req.query.sellerIds.toString() : null;


  let sellerIds: any = null;
  if (memberIdsString) {
    sellerIds = memberIdsString.split("|");
    if (sellerIds.length < 0)
      throw ErrorHelper.requestDataInvalid("Mã bưu cục");

    sellerIds.map((m: string) => {
      if (!isValidObjectId(m)) {
        throw ErrorHelper.requestDataInvalid("Mã bưu cục");
      }
    });

    sellerIds = sellerIds.map(Types.ObjectId);
  }


  if (!isValidObjectId(memberId)) {
    throw ErrorHelper.requestDataInvalid("Mã bưu cục");
  }

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const params: any = {};

  if ($gte) {
    set(params, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set(params, "createdAt.$lte", $lte);
  }



  //theo bưu cục nào
  if (context.isMember()) {
    set(params, "sellerId.$in", [context.id]);
  }
  else {
    if (branchId) {
      const memberIds = await MemberModel.find({ branchId }).select("_id");
      const sellerIds = memberIds.map(m => m.id);
      set(params, "sellerId.$in", sellerIds.map(Types.ObjectId));
    }
    else {
      if (sellerIds) {
        if (sellerIds.length > 0) {
          set(params, "sellerId.$in", sellerIds);
        }
        else {
          delete params.sellerIds;
        }
      }
    }
  }

  const [
    orders,
    addressDeliverys,
    addressStorehouses,
    collaborators,
    sellers,
    branches,
  ] = await Promise.all([
    OrderModel.find(params),
    AddressDeliveryModel.find({}).select('_id code'),
    AddressStorehouseModel.find({}).select('_id code'),
    CollaboratorModel.find({}).select("_id code name"),
    MemberModel.find({ activated: true }).select('_id code shopName district districtId branchId'),
    BranchModel.find({}).select("_id name")
  ]);

  const statusText = (order: any) => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return `Chờ duyệt`;
      case OrderStatus.CONFIRMED:
        return `Xác nhận`;
      case OrderStatus.DELIVERING:
        return `Đang giao`;
      case OrderStatus.COMPLETED:
        return `Hoàn thành`;
      case OrderStatus.FAILURE:
        return `Thất bại`;
      case OrderStatus.CANCELED:
        return `Đã huỷ`;
      case OrderStatus.RETURNED:
        return `Đã hoàn hàng`;
      default:
        return order.status;
    }
  }

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const shipMethod = order.shipMethod === ShipMethod.POST ? "Nhận hàng tại bưu cục" : "Giao hàng tại địa chỉ";
    const seller = sellers.find(member => member.id.toString() === order.sellerId.toString());
    const branch = branches.find(br => br.id.toString() === seller.branchId.toString());

    const params = {
      code: order.code,
      shopName: seller.shopName,
      shopCode: seller.code,
      shopDistrict: seller.district,
      branchCode: branch.code,
      branchName: branch.name,
      district: seller.district,
      commission1: order.commission1,
      commission2: order.commission2,
      commission3: order.commission3,
      commission: order.commission1 + order.commission2 + order.commission3,
      logDate: moment(order.loggedAt).format('DD/MM/YYYY HH:mm:ss'),
      createdDate: moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      finishedDate: order.finishedAt ? moment(order.finishedAt).format('DD/MM/YYYY HH:mm:ss') : "",
      status: statusText(order),
    }
    // console.log('count', i);
    data.push(params);
  }

  // console.log('data', data);
  const branchesData = [];

  const workbook = new Excel.Workbook();

  const createSheetData = (data: [], name: string) => {
    const sheet = workbook.addWorksheet(name);
    const excelHeaders = [
      "STT",
      "Mã đơn",
      "Mã cộng tác viên",
      "Cộng tác viên",

      "Bưu cục",
      "Mã bưu cục",
      "Quận / Huyện",
      "Chi nhánh",

      "HH điểm bán",
      "HH CTV",
      "HH giao hàng",
      "Tổng HH",

      "Ngày đặt hàng",
      "Ngày hoàn tất",
      "Tình trạng",
    ];

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i: number) => {
      const dataRow = [
        i + 1,
        d.code,

        d.collaboratorCode,
        d.collaboratorName,

        d.shopName,
        d.shopCode,
        d.shopDistrict,
        d.branchName,


        d.commission1,
        d.commission2,
        d.commission3,
        d.commission,

        d.createdDate,
        d.finishedDate,
        d.status,
      ];
      sheet.addRow(dataRow);
    });

    UtilsHelper.setThemeExcelWorkBook(sheet);
  }

  const POSTS_SHEET_NAME = "Danh sách hoa hồng đơn hàng";
  createSheetData(data, POSTS_SHEET_NAME);

  if (!context.isMember() && isEmpty(memberId)) {
    for (const branch of branches) {
      const branchData = data.filter((m: any) => m.branchCode === branch.code);
      branchesData.push({ name: branch.name, data: branchData });
    }
  }

  if (!context.isMember() && isEmpty(memberId)) {
    for (const branchData of branchesData) {
      createSheetData(branchData.data, branchData.name);
    }
  }

  return UtilsHelper.responseExcel(res, workbook, "danh_sach_hoa_hong");
}