const { CollaboratorProductModel } = require('../../dist/graphql/modules/collaboratorProduct/collaboratorProduct.model');
const { SettingHelper } = require('../../dist/graphql/modules/setting/setting.helper');

(async function() {
  const products = await CollaboratorProductModel.find({});
  console.log(`Fix ${products.length} sản phẩm`);
  const bulk = CollaboratorProductModel.collection.initializeUnorderedBulkOp();
  const webDomain = await SettingHelper.load("WEBAPP_DOMAIN");
  console.log('Tên miền', webDomain);
  for (const p of products) {
    bulk.find({ _id: p._id }).updateOne({ $set: { shortUrl: `${webDomain}/san-pham/${p.shortCode}`} })
  }
  if (bulk.length > 0) {
    await bulk.execute();
  }
  console.log('DONE');
  process.exit();

})();