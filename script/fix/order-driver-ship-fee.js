const { compact } = require('lodash');
const { OrderModel } = require('../../dist/graphql/modules/order/order.model');

(async function() {
  const orders = await OrderModel.find({ shipMethod: "DRIVER"}, '_id shipfee');
  console.log('Điều chỉnh ', orders.length, 'Đơn hàng');
  const bulk = OrderModel.collection.initializeUnorderedBulkOp();
  for (const o of orders) {
    bulk.find({ _id: o._id }).update({ $set: { 'deliveryInfo.partnerFee': o.shipfee  }});
  }
  if (bulk.length > 0) {
    console.log('Đang cập nhật');
    await bulk.execute();
  }
  console.log("DONE");
  process.exit();

})();