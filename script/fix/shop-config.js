const { ShopConfigModel } = require('../../dist/graphql/modules/shopConfig/shopConfig.model');
const { MemberModel } = require('../../dist/graphql/modules/member/member.model');

(async function() {
  const members = await MemberModel.find({}, '_id');
  console.log(`Chủ shop: ${members.length}`);
  const bulk = ShopConfigModel.collection.initializeUnorderedBulkOp();
  for (const m of members) {
    bulk.find({ memberId: m._id }).upsert().update({ $setOnInsert: { 
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