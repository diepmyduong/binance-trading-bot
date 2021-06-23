const { ShopConfigModel } = require('../../dist/graphql/modules/shopConfig/shopConfig.model');

(async function() {
  const configs = await ShopConfigModel.find({ shipDefaultDistance: { $exists: false }}, '_id');
  console.log('Điều chỉnh ', configs.length, 'Cửa hàng');
  const bulk = ShopConfigModel.collection.initializeUnorderedBulkOp();
  for (const o of configs) {
    bulk.find({ _id: o._id }).update({ $set: { 
      shipPreparationTime: "30 phút",
      shipDefaultDistance: 2,
      shipDefaultFee: 15000,
      shipNextFee: 5000,
      shipOneKmFee: 0,
      shipUseOneKmFee: true,
      shipNote: "",
    }});
  }
  if (bulk.length > 0) {
    console.log('Đang cập nhật');
    await bulk.execute();
  }
  console.log("DONE");
  process.exit();

})();