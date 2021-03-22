import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { firebaseHelper, VietnamPostHelper } from "../../helpers";
// import { ObjectId } from "mongodb";
// import khongdau from "khong-dau";

class TestRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/", this.route(this.addAddressToShop));
  }

  async test(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");
    res.sendStatus(200);
  }

  async addAddressToShop(req: Request, res: Response) {
    // console.log("aaaaaaaaaa ........");

    const shops = await MemberModel.find({ isPost: true });

    const addressDeliverys = await AddressDeliveryModel.find({ isPost: true });

    const addressStorehouses = await AddressStorehouseModel.find({
      isPost: true,
    });

    for (const member of shops) {
      const params: any = {
        addressStorehouseIds: addressStorehouses.map((id) => id),
        addressDeliveryIds: addressDeliverys.map((id) => id),
      };

      const mainAddressStorehouseId = addressStorehouses.find(
        (addr) => addr.code === member.code
      );

      params.mainAddressStorehouseId = mainAddressStorehouseId;

      await MemberModel.findByIdAndUpdate(
        member.id,
        { $set: params },
        { new: true }
      );
    }

    res.sendStatus(200);
  }

  async updateAddressByShop(req: Request, res: Response) {
    const members = await MemberModel.find({ isPost: true });

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      // console.log("member.code", i,member.code);

      const post = await VietnamPostHelper.getPostByAddress(
        member.provinceId,
        member.districtId,
        member.wardId
      );

      const location = {
        coordinates: [post ? post.Longitude : 0, post ? post.Latitude : 0],
        type: "Point",
      };

      const addressDelivery = await AddressDeliveryModel.findOne({
        code: member.code,
      });

      const params: any = {
        code: member.code,
        province: member.province,
        district: member.district,
        ward: member.ward,
        provinceId: member.provinceId,
        districtId: member.districtId,
        wardId: member.wardId,
        name: member.shopName,
        email: member.username,
        phone: member.phone,
        address: member.address,
        isPost: true,
      };

      if (location) {
        params.location = location;
      } else {
        params.location = {
          coordinates: [0, 0],
          type: "Point",
        };
      }

      if (addressDelivery) {
        await AddressDeliveryModel.findOneAndUpdate(
          { code: member.code },
          params,
          { new: true }
        );
      } else {
        await AddressDeliveryModel.create(params);
      }

      const addressStorehouse = await AddressStorehouseModel.findOne({
        code: member.code,
      });

      if (addressStorehouse) {
        await AddressStorehouseModel.findOneAndUpdate(
          { code: member.code },
          params,
          { new: true }
        );
      } else {
        await AddressStorehouseModel.create(params);
      }
    }

    res.sendStatus(200);
  }

  async updateStorehouseLocation(req: Request, res: Response) {
    const storehouses = await AddressStorehouseModel.find({});

    // console.log("storehouses", storehouses);

    for (const storehouse of storehouses) {
      const post = await VietnamPostHelper.getPostByAddress(
        storehouse.provinceId,
        storehouse.districtId,
        storehouse.wardId
      );

      const location = {
        coordinates: [post.Longitude, post.Latitude],
        type: "Point",
      };

      // console.log("location", location);
      await AddressStorehouseModel.findByIdAndUpdate(
        storehouse.id,
        {
          location,
        },
        { new: true }
      );
    }

    res.sendStatus(200);
  }

  async deleteFirebase(req: Request, res: Response) {
    const emails = [
      "bckhlbavi@hcmpost.vn",
      "cskhtmdt.hcmpost@gmail.com",
      "bc.tanphu@hcmpost.vn",
      "tanbinh@hcmpost.vn",
      "baucat@hcmpost.vn",
      "godau@hcmpost.vn",
      "baqueo@hcmpost.vn",
      "chihoa@hcmpost.vn",
      "taythanh@hcmpost.vn",
      "bctansonnhat@hcmpost.vn",
      "bdkcntb@gmail.com",
      "bayhien@hcmpost.vn",
      "Bcluybanbich@gmail.com",
      "tranthingocuyen73@gmail.com",
      "huong.phamthao@gmail.com",
      "chauuyen1985@gmail.com",
      "bckhlbinhtan.bdhcm@vnpost.vn",
      "bckhlbinhchanh.bdhcm@vnpost.vn",
      "bcbinhtridong.bdhcm@vnpost.vn",
      "bcvinhloc.bdhcm@vnpost.vn",
      "bcbahom.bdhcm@vnpost.vn",
      "bcdienbonxa.bdhcm@vnpost.vn",
      "bcttbinhchanh.bdhcm@vnpost.vn",
      "bcbinhhung.bdhcm@vnpost.vn",
      "bcbinhhunghoa.bdhcm@vnpost.vn",
      "bcmuitau.bdhcm@vnpost.vn",
      "bcanlac.bdhcm@vnpost.vn",
      "bcleminhxuan.bdhcm@vnpost.vn",
      "bcchobinhchanh.bdhcm@vnpost.vn",
      "bctankien.bdhcm@vnpost.vn",
      "bccauxang.bdhcm@vnpost.vn",
      "bchohoclam.bdhcm@vnpost.vn",
      "bcphongphu.bdhcm@vnpost.vn",
      "vhxphongphu.bdhcm@vnpost.vn",
      "vhxdaphuoc.bdhcm@vnpost.vn",
      "vhxtannhut.bdhcm@vnpost.vn",
      "vhxtanquytay.bdhcm@vnpost.vn",
      "khl.thuduc@hcmpost.vn",
      "bc.thuduc@hcmpost.vn",
      "bcbinhtrieu@hcmpost.vn",
      "bcchonho@hcmpost.vn",
      "bcphuocbinh@hcmpost.vn",
      "bclinhtrung@gmail.com",
      "bcbinhtho@hcmpost.vn",
      "ngochanle78@gmail.com",
      "thu.july0507@gmail.com",
      "bcbinhchieu@gmail.com",
      "bcphuoclong@hcmpost.vn",
      "nhutamnguyen001@gmail.com",
      "nguyenhongtham716323@gmail.com",
      "minhthaonguyen2019@gmail.com",
      "levy90dng@gmail.com",
      "khanhle2790@.gmail.com",
      "phattruong1702@gmail.com",
      "nckhlnguyenoanh.bdhcm@vnpost.vn",
      "bckhlphandangluu.bdhcm@vnpost.vn",
      "bcbinhthanh.bdhcm@vnpost.vn",
      "bcphunhuan.bdhcm@vnpost.vn",
      "bcgovap.bdhcm@vnpost.vn",
      "bclevantho.bdhcm@vnpost.vn",
      "bcphanhuyich.bdhcm@vnpost.vn",
      "bcthinghe.bdhcm@vnpost.vn",
      "bcthongtayhoi.bdhcm@vnpost.vn",
      "bchangxanh.bdhcm@vnpost.vn",
      "bcannhon.bdhcm@vnpost.vn",
      "bcthanhda.bdhcm@vnpost.vn",
      "bcanhoi.bdhcm@vnpost.vn",
      "bcxommoi.bdhcm@vnpost.vn",
      "bcdongba.bdhcm@vnpost.vn",
      "bclevansy.bdhcm@vnpost.vn",
      "bcvanthanh.bdhcm@vnpost.vn",
      "bctrungnuvuong.bdhcm@vnpost.vn",
      "cbchuvanan.bdhcm@vnpost.vn",
      "hanh.dtt@hcmpost.vn",
      "quan5@hcmpost.vn",
      "thumy.chanhhung@gmail.com",
      "buucucq8@gmail.com",
      "bc.quan6@hcmpost.vn",
      "bcminhphung@hcmpost.vn",
      "bdrachong@gmail.com",
      "bd.nguyentrai@gmail.com",
      "votanluc.150291@gmail.com",
      "nguyenduyduong@hcmpost.vn",
      "vtble@hcmpost.vn",
      "thuhoainguyen9112019@gmail.com",
      " trungthien120915@gmail.com",
      "nguyenduyduong@hcmpost.vn",
      "nttha75@gmail.com",
      "nguyentuongvan.ori@gmail.com",
      "hanhvyngan@gmail.com",
      "cuong.nhutthanh@gmai.com",
      "bckhlsaigon@gmail.com ",
      "gdqtsg@gmail.com",
      "buucuctranhungdao@gmail.com",
      "gdsaigon1@gmail.com",
      "buucuctandinh@gmail.com",
      "bchccsg@hcmpost.vn",
      "bcbanco@hcmpost.vn",
      "ankhanh@hcmpost.vn",
      "bcvuonxoai@gmail.com",
      " buudienquan3@gmail.com",
      "bcbinhtrung@hcmpost.vn",
      "bcdakao2018@gmail.com",
      "bc.benthanh@hcmpost.vn",
      "bcnguyenvantroi@gmail.com",
      "bdandien@gmail.com",
      "bctanlap@gmail.com",
      "luuhiensh3t@gmail.com",
      "bc.lethihonggam@hcmpost.vn",
      "buucuctandinh@gmail.com",
      "gdsaigon1@gmail.com",
      "bckhlnamsaigon@hcmpost.vn",
      "bccangio@hcmpost.vn",
      "utmuoivothi@gmail.com",
      "bccanthanh@hcmpost.vn",
      "bchiepphuoc@hcmpost.vn",
      "bcthitrannhabe@hcmpost.vn",
      "bcphuockien@gmail.com",
      "bclevanluong@gmail.com nha",
      "nguyenkimnhattam1977@gmail.com",
      "ngakieu162@yahoo.com",
      "phuonganh2873@gmail.com",
      "thanhtuan1988.bt@gmail.com",
      "buudienngatuga@gmail.com",
      "bd.khlhm2019@gmail.com",
      "nguyenthithaottn1980@gmail.com",
      "bc.nguyenthikieu@hcmpost.vn",
      "buudienhocmon@gmail.com",
      "tanthoinhat729930@gmail.com",
      "buudienngatuga@gmail.com",
      "bcquangtrunghcm@gmail.com",
      "tanthoihiep@hcmpost.vn",
      "bchiepthanh@hcmpost.vn",
      "phuong.vanha@yahoo.com",
      "bcphanvanhon@gmail.com",
      "touyenvnpt@gmail.com",
      "huynhngan1968@gmail.com",
      "vantrang200777@gmail.com",
      "tamltm17011@gmail.com",
      "trungmytay33@gmail.com",
      "bcngababau@gmail.com",
      "daovnpt81@gmail.com",
      "huynhduongthanh11dkt@gmail.com",
      "nguyenthikimthi16051993@gmail.com",
      "jonivo771994@gmail.com",
      "huynhhongyen94@gmail.com",
      "bckhlphumyhung@hcmpost.vn",
      "quan4@hcmpost.vn",
      "bcquan7@hcmpost.vn",
      "bckhanhhoi@hcmpost.vn",
      "bc.tanphong@hcmpost.vn",
      "phumy@hcmpost.vn",
      "tanquydong@hcmpost.vn",
      "bc.tanthuan@hcmpost.vn",
      "himlam@hcmpost.vn",
      "bctanmy@hcmpost.vn",
      "bcvinhhoi@gmail.com",
      "khl.cholon1@hcmpost.vn",
      "lehoasen81@gmail.com",
      "bcquan11@gmail.com",
      "bcquan10@gmail.com",
      "thitam01961@gmail.com",
      "phuongttn@hcmpost.vn",
      "bchoahung@hcmpost.vn",
      "laclongquan743100@gmail.com",
      "suvanhanh@hcmpost.vn",
      "damsen@hcmpost.vn",
      "bcngoquyen@hcmpost.vn",
      "742000bahat@gmail.com",
      "bcpcd744910@gmail.com",
      "buucuckhlcuchi@gmail.com",
      "nguyenthinga01071992@gmail.com",
      "ntnoanh90@gmail.com",
      "phanthitrangdai947319@gmail.com",
      "hanhuyen180880@gmail.com",
      "thanhngan09039915@gmail.com",
      "mlinh6649@gmail.com",
      "bebeokkda@gmail.com",
      "huongthaopo@gmail.com",
      "ntchanhbctt@gmail.com",
      "tranthihongtuyen1984@gmail.com",
      "minhtrung120895@gmail.com",
      "huephuong28389@gmail.com",
      "thanhmai21121982@gmail.com",
      "lieu.thaimy@gmail.com",
      "phanpheo.ccc@gmail.com",
      "thovo1545@gmail.com",
      "sautran.vhxta@gmail.com",
    ];

    // for (const email of emails) {
    //   try {
    //     const user = await firebaseHelper.app.auth().getUserByEmail(email);
    //     if(user.uid){
    //       await firebaseHelper.app.
    //     }
    //   } catch (error) {
    //     console.log("ko delete dc", email)
    //   }
    // }

    res.sendStatus(200);
  }

  async checkUserNotExisted(req: Request, res: Response) {
    const codes = [
      "736114",
      "760130",
      "760000",
      "736090",
      "736300",
      "760400",
      "736100",
      "736000",
      "760310",
      "736600",
      "760320",
      "737300",
      "760717",
      "760820",
      "736923",
      "736919",
      "763430",
      "738015",
      "762800",
      "738100",
      "763200",
      "762300",
      "738000",
      "739500",
      "762000",
      "763710",
      "763700",
      "738300",
      "738800",
      "763310",
      "738400",
      "763100",
      "739400",
      "739401",
      "739300",
      "738601",
      "739000",
      "721344",
      "721400",
      "720300",
      "715100",
      "716040",
      "720400",
      "720100",
      "720700",
      "715000",
      "721000",
      "715300",
      "715963",
      "716323",
      "716300",
      "716200",
      "716500",
      "715401",
      "727025",
      "717066",
      "725060",
      "727010",
      "728100",
      "727729",
      "717000",
      "727000",
      "718500",
      "727300",
      "717400",
      "727700",
      "727400",
      "725600",
      "725000",
      "717244",
      "727900",
      "717344",
      "749575",
      "749000",
      "752800",
      "751500",
      "747400",
      "746000",
      "751000",
      "748000",
      "747160",
      "748020",
      "752702",
      "752710",
      "746868",
      "748010",
      "746768",
      "746446",
      "750100",
      "752428",
      "710235",
      "710234",
      "710400",
      "700000",
      "710880",
      "710236",
      "722200",
      "713100",
      "722100",
      "722000",
      "713200",
      "710700",
      "710100",
      "722300",
      "713000",
      "713110",
      "714100",
      "712163",
      "710548",
      "710229",
      "758409",
      "759000",
      "759600",
      "759010",
      "758500",
      "758000",
      "758100",
      "758118",
      "759300",
      "759500",
      "759400",
      "759200",
      "729732",
      "731071",
      "731500",
      "729450",
      "731000",
      "729930",
      "729700",
      "729110",
      "729400",
      "729430",
      "731200",
      "731722",
      "732110",
      "731900",
      "729160",
      "729540",
      "729033",
      "731100",
      "729213",
      "729800",
      "731701",
      "731624",
      "731300",
      "756036",
      "754000",
      "756100",
      "754100",
      "756600",
      "756110",
      "756700",
      "756000",
      "756923",
      "756336",
      "755071",
      "740165",
      "740030",
      "743800",
      "740500",
      "743000",
      "743500",
      "740200",
      "743100",
      "740310",
      "743010",
      "740100",
      "742000",
      "744910",
      "733038",
      "733600",
      "734631",
      "734200",
      "734900",
      "733000",
      "734800",
      "733800",
      "734300",
      "733530",
      "733701",
      "734901",
      "734400",
      "734001",
      "734500",
      "734700",
      "733300",
      "733400",
    ];

    const members = await MemberModel.find({
      username: { $in: [/pshop./, /Pshop./] },
      code: /7/,
      activated: true,
    });

    const memberCodes = members.map((m) => m.code);

    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];

      if (!memberCodes.includes(code)) {
        console.log("-------> code", code);
      }
      break;
    }

    res.sendStatus(200);
  }
}

export default new TestRoute().router;
