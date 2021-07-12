const { compact } = require('lodash');
const { OrderModel } = require('../../dist/graphql/modules/order/order.model');

(async function() {
  const orders = await OrderModel.find({}, '_id buyerAddress buyerProvince buyerDistrict buyerWard');
  console.log('Điều chỉnh ', orders.length, 'Đơn hàng');
  const bulk = OrderModel.collection.initializeUnorderedBulkOp();
  for (const o of orders) {
    const buyerFullAddress = compact([o.buyerAddress, o.buyerWard, o.buyerDistrict, o.buyerProvince]).join(', ');
    bulk.find({ _id: o._id }).update({ $set: { buyerFullAddress  }});
  }
  if (bulk.length > 0) {
    console.log('Đang cập nhật');
    await bulk.execute();
  }
  console.log("DONE");
  process.exit();

})();