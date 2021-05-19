const { take } = require('lodash');
const { CrossSaleModel } = require('../../dist/graphql/modules/crossSale/crossSale.model');

(async function() {
  const crossSales = await CrossSaleModel.aggregate([
    { 
      $lookup: { 
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    { $project: { _id: 1, productName: '$product.name'} }
  ]);
  console.log(`Fix ${crossSales.length} sản phẩm`);
  console.log('sample', take(crossSales, 10));
  const bulk = CrossSaleModel.collection.initializeUnorderedBulkOp();
  for (const p of crossSales) {
    bulk.find({ _id: p._id }).updateOne({ $set: { productName: p.productName } });
  }
  if (bulk.length > 0) {
    await bulk.execute();
  }
  console.log('DONE');
  process.exit();

})();