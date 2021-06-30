var { Ahamove } = require('../dist/helpers/ahamove/ahamove');
var fs = require('fs');

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhaGEiLCJ0eXAiOiJ1c2VyIiwiY2lkIjoiODQ5MTY5NjgyNjMiLCJzdGF0dXMiOiJPTkxJTkUiLCJlb2MiOm51bGwsIm5vYyI6IlNNTyAtIE1DT00iLCJhY2NvdW50X3N0YXR1cyI6IkFDVElWQVRFRCIsImV4cCI6MTYyNDk1NjY3OSwicGFydG5lciI6IjNtbWFya2V0aW5nIn0.BZCiNR8AgzmQUftxGBL7e79AKrEUEGK_zh3Yk3tr_2E";

(async () => {
  const client = new Ahamove();
  const result = await client.fetchAllServices("10.7828887", "106.704898");
  result.filter(r => /\-(BIKE|EXPRESS)/.test(r._id)).forEach(service => console.log("ID", service._id, service.name_vi_vn));
  // await estimateFeeMutilService(client);
  // const writeStream = fs.createWriteStream("ahamove-service.json");
  // writeStream.write(Buffer.from(JSON.stringify(result, null, 2)));
  // writeStream.end();
})();

async function estimateFee(client) {
  console.log(await client.estimatedFee({
    "token": token,
    "order_time": parseInt((Date.now() / 1000).toFixed(0)),
    "path": JSON.stringify([
      {
        "address": "7 Hoàng Đức Tương, P4, Quận 11, Hồ Chí Minh",
        "short_address": "Quận 11",
        "name": "nmbmb",
        "remarks": "call me"
      },
      {
        "address": "18/2D Nguyễn Cửu Vân, P17, Quận Bình Thạnh, Hồ Chí Minh",
        "name": "Bao"
      }
    ]),
    "service_id": "SGN-BIKE",
    "requests": [],
    "images": [],
    "promo_code": "KHUYENMAI",
    "remarks": "Call me when arrived",
    "payment_method": "CASH",
    "items": JSON.stringify([
      {
        "_id": "TS",
        "num": 2,
        "name": "Sua tuoi",
        "price": 15000
      },
      {
        "_id": "ST",
        "num": 2,
        "name": "Sinh to lua mach",
        "price": 30000
      }
    ])
  }));
}
async function estimateFeeMutilService(client) {
  console.log(await client.estimatedFeeMutilService({
    "token": token,
    "order_time": parseInt((Date.now() / 1000).toFixed(0)),
    "path": [
      {"lat":10.7692105, "lng":106.6637935, "address":"725 Hẻm số 7 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Việt Nam", "short_address":"Quận 10", "name":"nmbmb", "remarks":"call me"}, 
      {"lat":10.7828887, "lng":106.704898, "address":"Miss Ao Dai Building, 21 Nguyễn Trung Ngạn, Bến Nghé, Quận 1, Hồ Chí Minh, Vietnam", "name":"Bao"},
    ],
    // "service_id": "SGN-BIKE",
    // "requests": [],
    // "images": [],
    // "promo_code": "KHUYENMAI",
    // "remarks": "Call me when arrived",
    "payment_method": "CASH",
    // "items": [
    //   {
    //     "_id": "TS",
    //     "num": 2,
    //     "name": "Sua tuoi",
    //     "price": 15000
    //   },
    //   {
    //     "_id": "ST",
    //     "num": 2,
    //     "name": "Sinh to lua mach",
    //     "price": 30000
    //   }
    // ]
  }, [{ "_id": "SGN-BIKE" }, { _id: "SGN-EXPRESS" }]));
}
