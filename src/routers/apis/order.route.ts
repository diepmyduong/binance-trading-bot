import { ROLES } from "../../constants/role.const";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { Context } from "../../graphql/context";

import { auth } from "../../middleware/auth";

import _, { isEmpty, reverse, set, sortBy } from "lodash";
import numeral from "numeral";
import { PrinterHelper } from "../../helpers/printerHelper";
import {
  // getShipMethods,
  IOrder,
  OrderStatus,
  ShipMethod,
} from "../../graphql/modules/order/order.model";
import { OrderModel } from "../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { MemberModel, MemberType } from "../../graphql/modules/member/member.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { SettingKey } from "../../configs/settingData";
import { createCanvas, loadImage } from 'canvas';
import { UtilsHelper } from "../../helpers";
import Excel from "exceljs";
import { ObjectId } from "bson";
import moment from "moment";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { AddressModel } from "../../graphql/modules/address/address.model";
import { BranchModel } from "../../graphql/modules/branch/branch.model";
import { isValidObjectId } from "mongoose";

class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get(
      "/exportOrderToPdf",
      [auth],
      this.route(this.exportOrderToPdf)
    );
    this.router.get(
      "/exportToMemberOrderToPdf",
      [auth],
      this.route(this.exportToMemberOrderToPdf)
    );

    this.router.get(
      "/exportOrdersReport",
      [auth],
      this.route(this.exportOrdersReport)
    );
  }

  async exportOrderToPdf(req: Request, res: Response) {
    const context = (req as any).context as Context;

    context.auth([ROLES.MEMBER]);
    const orderId = req.query.orderId;

    // console.log("orderId", orderId);

    let params: any = {
      _id: orderId,
    };

    if (context.isMember()) {
      params.sellerId = context.id;
    }

    // console.log("params", params);

    const order = await OrderModel.findOne(params);

    // console.log("order", order);

    if (!order) {
      throw ErrorHelper.requestDataInvalid("Tham số đầu vào không hợp lệ!");
    }

    const addressDelivery = await AddressDeliveryModel.findById(
      order.addressDeliveryId
    );
    const member = await MemberModel.findById(order.sellerId);
    const logoImageUrl = await SettingHelper.load(SettingKey.LOGO);

    const pdfContent = await getPDFOrder({ order, addressDelivery, member, logoImageUrl });
    return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
  }

  async exportToMemberOrderToPdf(req: Request, res: Response) {
    const context = (req as any).context as Context;
    const orderId = req.query.orderId;

    let params: any = {
      _id: orderId,
    };

    if (context.isMember()) {
      params.toMemberId = context.id;
    }

    const order = await OrderModel.findOne(params);

    if (!order) {
      throw ErrorHelper.requestDataInvalid("Tham số đầu vào không hợp lệ!");
    }

    const addressDelivery = await AddressDeliveryModel.findById(
      order.addressDeliveryId
    );

    const member = await MemberModel.findById(order.sellerId);

    const logoImageUrl = await SettingHelper.load(SettingKey.LOGO);

    const pdfContent = await getPDFOrder({ order, addressDelivery, member, logoImageUrl });
    return PrinterHelper.responsePDF(res, pdfContent, `don-hang-${order.code}`);
  }

  async exportOrdersReport(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);

    let data: any = [];
    let staticsticData: any = [];

    let fromDate: string = req.query.fromDate
      ? req.query.fromDate.toString()
      : null;
    let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
    const memberId: string = req.query.memberId
      ? req.query.memberId.toString()
      : null;

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


    if (memberId) {
      set(params, "sellerId", new ObjectId(memberId));
    }

    if (context.isMember()) {
      set(params, "sellerId", new ObjectId(context.id));
    }

    // console.log('params', params);

    const [orders, addressDeliverys, addressStorehouses, sellers, branches] = await Promise.all([
      OrderModel.find(params),
      AddressDeliveryModel.find({}),
      AddressStorehouseModel.find({}),
      MemberModel.find({}),
      BranchModel.find({})
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
      const addressDelivery = order.addressDeliveryId ? addressDeliverys.find(addr => addr.id.toString() === order.addressDeliveryId.toString()) : null;
      const addressStorehouse = order.addressStorehouseId ? addressStorehouses.find(addr => addr.id.toString() === order.addressStorehouseId.toString()) : null;

      const deliveryAddress = addressDelivery ? `${addressDelivery.name} - ${addressDelivery.address}` : null;
      const storehouseAddress = addressStorehouse ? `${addressStorehouse.name} - ${addressStorehouse.address}` : null;
      const buyerAddress = order.buyerAddress;
      const branch = branches.find(br => br.id.toString() === seller.branchId.toString());
      const createdDate = moment(order.createdAt);
      const finishedDate = order.finishedAt ? moment(order.finishedAt) : null;
      const toDate = moment(new Date());
      const orderDuration = order.isLate ? [OrderStatus.COMPLETED, OrderStatus.CANCELED, OrderStatus.FAILURE].includes(order.status) ? moment.duration(finishedDate.diff(createdDate)) : moment.duration(toDate.diff(createdDate)) : null;
      const remainTime = orderDuration ? `${orderDuration.days() - 1} Ngày ${orderDuration.hours()} Giờ` : "";
      const remainDays = orderDuration ? orderDuration.days() - 1 : 0;
      const remainHours = orderDuration ? orderDuration.hours() : 0;
      const params = {
        code: order.code,
        shopName: seller.shopName,
        shopCode: seller.code,
        shopDistrict: seller.district,
        branchName: branch.name,
        buyer: order.buyerName,
        buyerPhone: order.buyerPhone,
        shipMethod,
        deliveryAddress: order.shipMethod === ShipMethod.POST ? deliveryAddress : null,
        storehouseAddress: order.shipMethod === ShipMethod.VNPOST ? storehouseAddress : null,
        buyerAddress,
        district: seller.district,
        note: order.note,
        commission1: order.commission1,
        commission2: order.commission2,
        commission3: order.commission3,
        subTotal: order.subtotal,
        shipfee: order?.shipfee,
        amount: order.amount,
        status: statusText(order),
        createdDate: moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss'),
        finishedDate: order.finishedAt ? moment(order.finishedAt).format('DD/MM/YYYY HH:mm:ss') : "",
        logDate: moment(order.loggedAt).format('DD/MM/YYYY HH:mm:ss'),
        late: order.isLate ? "Trễ" : "",
        remainTime: order.isLate ? remainTime : "",
        remainDays: order.isLate ? remainDays : "",
        remainHours: order.isLate ? remainHours : ""
      }
      // console.log('count', i);
      data.push(params);
    }

    // console.log('data', data);

    const workbook = new Excel.Workbook();

    const createSheetData = (data: [], name: string) => {
      const sheet = workbook.addWorksheet(name);
      const excelHeaders = [
        "STT",
        "Mã đơn",

        "Bưu cục",
        "Mã bưu cục",
        "Quận / Huyện",
        "Chi nhánh",

        "Người mua",
        "Địa chỉ người mua",
        "SĐT",

        "PTVC",
        "Địa chỉ bưu cục nhận",
        "Địa chỉ bưu cục giao",

        "Ghi chú",
        "HH điểm bán",
        "HH CTV",
        "HH giao hàng",

        "Thành tiền",
        "Phí ship",
        "Tổng cộng",

        "Ngày đặt hàng",
        "Ngày hoàn tất",
        "Ngày xử lý gần nhất",
        "Tình trạng",
        "Trễ - Thời gian bị Trễ",
      ];

      sheet.addRow(excelHeaders);

      data.forEach((d: any, i: number) => {
        const dataRow = [
          i + 1,
          d.code,

          d.shopName,
          d.shopCode,
          d.shopDistrict,
          d.branchName,

          d.buyer,
          d.buyerAddress,
          d.buyerPhone,

          d.shipMethod,
          d.deliveryAddress,
          d.storehouseAddress,

          d.note,

          d.commission1,
          d.commission2,
          d.commission3,

          d.subTotal,
          d.shipfee,
          d.amount,

          d.createdDate,
          d.finishedDate,
          d.logDate,
          d.status,
          `${d.late} - ${d.remainTime}`,
        ];
        sheet.addRow(dataRow);
      });

      UtilsHelper.setThemeExcelWorkBook(sheet);
    }

    const POSTS_SHEET_NAME = "Danh sách đơn hàng";
    createSheetData(data, POSTS_SHEET_NAME);

    if (!context.isMember() && isEmpty(memberId)) {

      const q10_q11_name = "Bưu điện TT Phú Thọ"
      const q10_q11 = ["Quận 10", "Quận 11"];
      const q10_q11_data = data.filter((m: any) => q10_q11.includes(m.shopDistrict));

      const q12_hm_name = "Bưu điện Hóc Môn"
      const q12_hocmon = ["Quận 12", "Hóc Môn"];
      const q12_hocmon_data = data.filter((m: any) => q12_hocmon.includes(m.shopDistrict));

      const gv_bt_pn_name = "Bưu điện TT Gia Định"
      const gv_bt_pn = ["Gò Vấp", "Bình Thạnh", "Phú Nhuận"];
      const gv_bt_pn_data = data.filter((m: any) => gv_bt_pn.includes(m.shopDistrict));

      const tb_tp_name = "Bưu điện TT Tân Bình Tân Phú"
      const tb_tp = ["Tân Bình", "Tân Phú"];
      const tb_tp_data = data.filter((m: any) => tb_tp.includes(m.shopDistrict));

      const q1_q2_q3_name = "Bưu điện TT Sài gòn"
      const q1_q2_q3 = ["Quận 1", "Quận 2", "Quận 3"];
      const q1_q2_q3_data = data.filter((m: any) => q1_q2_q3.includes(m.shopDistrict) && m.shopCode !== "PKDBDHCM");

      const pkd_name = "Phòng KD Bưu điện HCM"
      const pkd_data = data.filter((m: any) => m.shopCode === "PKDBDHCM");

      const bt_bc_name = "Bưu điện Bình Chánh"
      const bt_bc = ["Bình Tân", "Bình Chánh"];
      const bt_bc_data = data.filter((m: any) => bt_bc.includes(m.shopDistrict));

      const q4_q7_name = "Bưu điện TT Phú Mỹ Hưng"
      const q4_q7 = ["Quận 4", "Quận 7"];
      const q4_q7_data = data.filter((m: any) => q4_q7.includes(m.shopDistrict));

      const nb_cg_name = "Bưu điện TT Nam Sài Gòn"
      const nb_cg = ["Nhà Bè", "Cần Giờ"];
      const nb_cg_data = data.filter((m: any) => nb_cg.includes(m.shopDistrict));

      const td_q9_name = "Bưu điện TT Thủ Đức"
      const td_q9 = ["Thủ Đức", "Quận 9"];
      const td_q9_data = data.filter((m: any) => td_q9.includes(m.shopDistrict));

      const q5_q6_q8_name = "Bưu điện TT Chợ Lớn"
      const q5_q6_q8 = ["Quận 5", "Quận 6", "Quận 8"];
      const q5_q6_q8_data = data.filter((m: any) => q5_q6_q8.includes(m.shopDistrict));

      const cc_name = "Bưu điện Củ Chi"
      const cc = ["Củ Chi"];
      const cc_data = data.filter((m: any) => cc.includes(m.shopDistrict));


      createSheetData(pkd_data, pkd_name);
      createSheetData(q10_q11_data, q10_q11_name);
      createSheetData(q12_hocmon_data, q12_hm_name);
      createSheetData(gv_bt_pn_data, gv_bt_pn_name);
      createSheetData(tb_tp_data, tb_tp_name);
      createSheetData(q1_q2_q3_data, q1_q2_q3_name);
      createSheetData(bt_bc_data, bt_bc_name);
      createSheetData(q4_q7_data, q4_q7_name);
      createSheetData(nb_cg_data, nb_cg_name);
      createSheetData(td_q9_data, td_q9_name);
      createSheetData(q5_q6_q8_data, q5_q6_q8_name);
      createSheetData(cc_data, cc_name);
    }

    return UtilsHelper.responseExcel(res, workbook, "danh_sach_don_hang");
  }

}

export default new OrderRoute().router;

const getBase64ImageFromURL = async (url: string) => {
  const canvas = createCanvas(400, 400)
  const ctx = canvas.getContext('2d');
  const image = await loadImage(url);
  ctx.drawImage(image, 0, 0, 300, 300);
  return ctx.canvas.toDataURL();
};

const getPDFOrder = async ({ order, addressDelivery, member, logoImageUrl }: any) => {

  const imgBase64 = await getBase64ImageFromURL(logoImageUrl);

  const PHIEU_XUAT_KHO = {
    text: "Phiếu xuất kho",
    color: "#333333",
    width: "*",
    fontSize: 28,
    bold: true,
    alignment: "right",
    margin: [0, 0, 0, 15],
  };

  const MA_DON = {
    columns: [
      {
        text: "Mã đơn",
        color: "#aaaaab",
        bold: true,
        width: "*",
        fontSize: 12,
        alignment: "right",
      },
      {
        text: order.code,
        bold: true,
        color: "#333333",
        fontSize: 12,
        alignment: "right",
        width: 100,
      },
    ],
  };

  const NGAY_TAO = {
    columns: [
      {
        text: "Ngày tạo",
        color: "#aaaaab",
        bold: true,
        width: "*",
        fontSize: 12,
        alignment: "right",
      },
      {
        text: order.createdAt.toISOString().split(/T/)[0],
        bold: true,
        color: "#333333",
        fontSize: 12,
        alignment: "right",
        width: 100,
      },
    ],
  };
  const TINH_TRANG = {
    columns: [
      {
        text: "Status",
        color: "#aaaaab",
        bold: true,
        fontSize: 12,
        alignment: "right",
        width: "*",
      },
      {
        text: "PAID",
        bold: true,
        fontSize: 14,
        alignment: "right",
        color: "green",
        width: 100,
      },
    ],
  };
  const KHACH_HANG = {
    columns: [
      {
        text: "Khách hàng",
        color: "#aaaaab",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 20, 0, 5],
      },
      {
        text: order.buyerName,
        bold: true,
        color: "#333333",
        margin: [0, 20, 0, 5],
        alignment: "left",
      },
    ],
  };

  const CUA_HANG = {
    columns: [
      {
        text: "Bưu cục",
        color: "#aaaaab",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: member.shopName,
        bold: true,
        color: "#333333",
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
    ],
  };

  const DIA_CHI_CUA_HANG = {
    columns: [
      {
        text: "Cửa hàng",
        color: "#aaaaab",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: member.shopName,
        bold: true,
        color: "#333333",
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
    ],
  };

  const LOAI_DON__DIEM_THUONG = [
    {
      columns: [
        {
          text: "Loại đơn",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Điểm thưởng người bán",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Điểm thưởng người mua",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text: "Đơn cửa hàng",
          alignment: "left",
        },
        {
          text: moneyCast(order.sellerBonusPoint),
          alignment: "left",
        },
        {
          text: moneyCast(order.buyerBonusPoint),
          alignment: "left",
        },
      ],
    },
  ];

  const HOA_HONG = [
    {
      columns: [
        {
          text: "Hoa hồng điểm bán",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Hoa hồng cộng tác viên",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Hoa hồng kho",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text: moneyCast(order.commission1),
          alignment: "left",
        },
        {
          text: moneyCast(order.commission2),
          alignment: "left",
        },
        {
          text: moneyCast(order.commission3),
          alignment: "left",
        },
      ],
    },
  ];

  const PHUONG_THUC_GIAO_HANG = [
    {
      columns: [
        {
          text: "Phương thức giao hàng",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
        {
          text: "Mã vận đơn",
          bold: true,
          color: "#333333",
          margin: [0, 20, 0, 5],
          alignment: "left",
        },
      ],
    },
    {
      columns: [
        {
          text:
            ShipMethod.POST === order.shipMethod
              ? "Nhận hàng tại bưu cục"
              : "Giao hàng tại địa chỉ",
          alignment: "left",
        },
        {
          text: order.deliveryInfo ? order.deliveryInfo.itemCode : "[Không có]",
          alignment: "left",
        },
      ],
    },
  ];

  const DIA_DIEM_GIAO_NHAN =
    ShipMethod.POST === order.shipMethod
      ? [
        {
          columns: [
            {
              text: "Tên điểm nhận",
              bold: true,
              color: "#333333",
              margin: [0, 20, 0, 5],
              alignment: "left",
            },
            {
              text: "SĐT điểm nhận",
              bold: true,
              color: "#333333",
              margin: [0, 20, 0, 5],
              alignment: "left",
            },
            {
              text: "Địa chỉ điểm nhận",
              bold: true,
              color: "#333333",
              margin: [0, 20, 0, 5],
              alignment: "left",
            },
          ],
        },
        {
          columns: [
            {
              text: addressDelivery.name,
              alignment: "left",
            },
            {
              text: addressDelivery.phone,
              alignment: "left",
            },
            {
              text: addressDelivery.address,
              alignment: "left",
            },
          ],
        },
      ]
      : [
        {
          columns: [
            {
              text: "Địa chỉ giao",
              bold: true,
              color: "#333333",
              margin: [0, 20, 0, 5],
              alignment: "left",
            },
            {
              text: "SĐT khách hàng",
              bold: true,
              color: "#333333",
              margin: [0, 20, 0, 5],
              alignment: "left",
            },
          ],
        },
        {
          columns: [
            {
              text: `${order.buyerAddress} - ${order.buyerWard} -  ${order.buyerDistrict} -  ${order.buyerProvince}`,
              alignment: "left",
            },
            {
              text: order.buyerPhone,
              alignment: "left",
            },
          ],
        },
      ];

  const GHI_CHU = {
    columns: [
      {
        text: "Ghi chú",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Không có",
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
    ],
  };

  const DANH_SACH_SAN_PHAM = [
    {
      width: "100%",
      alignment: "center",
      text: "Danh sách sản phẩm",
      bold: true,
      margin: [0, 10, 0, 10],
      fontSize: 15,
    },
    " ",
    {
      table: {
        widths: ["5%", "40%", "10%", "20%", "20%"],
        body: [
          [
            { text: "STT", alignment: "center" },
            { text: "Tên hàng", alignment: "center" },
            { text: "Số lượng", alignment: "center" },
            { text: "Đơn giá", alignment: "center" },
            { text: "Thành tiền", alignment: "center" },
          ],
          ...(await getTableContent(order.itemIds)),
        ],
      },
    },
  ];

  const TIEN_HANG = {
    columns: [
      {
        text: "",
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Tiền hàng:",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
      {
        text: moneyCast(order.subtotal),
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const PHI_GIAO_HANG = {
    columns: [
      {
        text: "",
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Phí giao hàng:",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
      {
        text: moneyCast(order.shipfee),
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const TONG_CONG = {
    columns: [
      {
        text: "",
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Tổng cộng:",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 5],
        alignment: "left",
      },
      {
        text: moneyCast(order.amount),
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const CHU_KY = {
    columns: [
      {
        text: "Trưởng bưu cục",
        bold: true,
        fontSize: 14,
        alignment: "left",
        margin: [0, 0, 0, 5],
      },
      {
        text: "Nhân viên giao",
        bold: true,
        margin: [0, 0, 0, 5],
        alignment: "center",
      },
      {
        text: "Người nhận hàng",
        bold: true,
        margin: [0, 0, 0, 5],
        alignment: "right",
      },
    ],
  };

  const styles = {
    styles: {
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10,
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };



  const LOGO = {
    image: imgBase64,
    width: 150,
  };

  var dd = {
    content: [
      {
        columns: [
          LOGO,
          [
            PHIEU_XUAT_KHO,
            {
              stack: [
                MA_DON,
                NGAY_TAO,
                // TINH_TRANG,
              ],
            },
          ],
        ],
      },
      KHACH_HANG,
      CUA_HANG,
      // DIA_CHI_CUA_HANG,
      // ...LOAI_DON__DIEM_THUONG,
      // ...HOA_HONG,
      ...PHUONG_THUC_GIAO_HANG,
      ...DIA_DIEM_GIAO_NHAN,
      GHI_CHU,
      DANH_SACH_SAN_PHAM,
      "\n",
      TIEN_HANG,
      PHI_GIAO_HANG,
      TONG_CONG,
      "\n",
      CHU_KY,
    ],
    ...styles,
  };

  return dd;
};

const getTableContent = async (items: any) => {
  const data = await OrderItemModel.find({ _id: { $in: items } });

  // console.log("data",data);
  const contents: any[] = [];
  const fcAcsii = 65;
  for (let pr = 0; pr < data.length; pr++) {
    const product = data[pr];
    contents.push([
      { text: pr + 1, alignment: "center", fillColor: "#d9d9d9" }, //No
      {
        text: product.productName || " ",
        alignment: "center",
        fillColor: "#d9d9d9",
      }, //Model
      { text: product.qty || 0, alignment: "center", fillColor: "#d9d9d9" }, //SL
      {
        text: product.basePrice || 0,
        alignment: "right",
        fillColor: "#d9d9d9",
      }, //ĐƠN GIÁ
      {
        text: product.amount || 0,
        alignment: "right",
        fillColor: "#d9d9d9",
      }, //THÀNH TIỀN
    ]);
  }
  return contents;
};

const moneyCast = (value: any) => {
  return `${value ? `${numeral(value).format("0.0")} VND` : ""}`;
};
