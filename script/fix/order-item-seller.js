const { OrderItemModel } = require('../../dist/graphql/modules/orderItem/orderItem.model');
const { OrderModel } = require('../../dist/graphql/modules/order/order.model');

(async function() {
  const orders = await OrderModel.find({}, '_id status finishedAt sellerId buyerId');
  console.log('Điều chỉnh ', orders.length, 'Đơn hàng');
  const bulk = OrderItemModel.collection.initializeUnorderedBulkOp();
  for (const o of orders) {
    bulk.find({ orderId: o._id }).update({ $set: { sellerId: o.sellerId, buyerId: o.buyerId  }});
  }
  if (bulk.length > 0) {
    console.log('Đang cập nhật');
    await bulk.execute();
  }
  console.log("DONE");
  process.exit();

})();