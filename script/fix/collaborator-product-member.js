const { CollaboratorProductModel } = require('../../dist/graphql/modules/collaboratorProduct/collaboratorProduct.model');
const { SettingHelper } = require('../../dist/graphql/modules/setting/setting.helper');

(async function() {
  const products = await CollaboratorProductModel.aggregate([
    { $match: { memberId: { $exists: false }}},
    { $lookup: { 
      from: 'collaborators',
      localField: 'collaboratorId',
      foreignField: '_id',
      as: 'member'
    }},{ $unwind: '$member'},
    { $project: { _id: 1, memberId: "$member._id" }}
  ]);
  console.log(`Fix ${products.length} sản phẩm`);
  const bulk = CollaboratorProductModel.collection.initializeUnorderedBulkOp();
  for (const p of products) {
    console.log('p', p._id, p.memberId);
    bulk.find({ _id: p._id }).updateOne({ $set: { memberId: p.memberId } });
  }
  if (bulk.length > 0) {
    await bulk.execute();
  }
  console.log('DONE');
  process.exit();

})();