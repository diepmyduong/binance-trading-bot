var { Ahamove } = require('../dist/helpers/ahamove/ahamove');

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhaGEiLCJ0eXAiOiJ1c2VyIiwiY2lkIjoiODQ5MTY5NjgyNjMiLCJzdGF0dXMiOiJPTkxJTkUiLCJlb2MiOm51bGwsIm5vYyI6IlNNTyAtIE1DT00iLCJhY2NvdW50X3N0YXR1cyI6IkFDVElWQVRFRCIsImV4cCI6MTYyNDk1NjY3OSwicGFydG5lciI6IjNtbWFya2V0aW5nIn0.BZCiNR8AgzmQUftxGBL7e79AKrEUEGK_zh3Yk3tr_2E";

(async () => {
  const client = new Ahamove();
  console.log(await client.estimatedFee({
      "token": token,
      "order_time": parseInt((Date.now() / 1000).toFixed(0)),
      "path": [
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
      ],
      "service_id": "SGN-BIKE",
      "requests": [],
      "images": [],
      "promo_code": "KHUYENMAI",
      "remarks": "Call me when arrived",
      "payment_method": "CASH",
      "items": [
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
      ]
  }));
})();