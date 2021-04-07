import { Job } from "agenda";
import { ObjectId } from "bson";
import { reverse, take } from "lodash";
import moment from "moment-timezone";
import { OrderModel, OrderStatus } from "../../graphql/modules/order/order.model";
import { Agenda } from "../agenda";

export class OrderJob {
  static jobName = "OrderJob";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    console.log("Execute Job " + OrderJob.jobName, moment().format());
    await doBusiness();
    return done();
  }
}

export default OrderJob;

const doBusiness = async () => {
  // xu ly don tre
  // await OrderModel.updateMany({
  //   status: { $nin: [OrderStatus.COMPLETED, OrderStatus.CANCELED, OrderStatus.FAILURE, OrderStatus.RETURNED] },
  //   createdAt: { $lt: moment().subtract(24, 'hour').toDate() }
  // }, { $set: { isLate: true }}).exec();

  const orders = await OrderModel.aggregate([
    { $match: { status: { $in: [OrderStatus.COMPLETED, OrderStatus.CANCELED, OrderStatus.FAILURE] } } },
    {
      $addFields: {
        isLate: {
          $cond: [
            { $gte: ["$createdAt", { $subtract: ["$finishedAt", 24 * 60 * 60000] }] }
            , false, true
          ]
        }
      }
    },
    { $match: { isLate: true } }
  ]);


  const notDoneOrders = await OrderModel.aggregate([
  { $match: { status: { $nin: [OrderStatus.COMPLETED, OrderStatus.CANCELED, OrderStatus.FAILURE] } } },
  {
    $addFields: {
      isLate: {
        $cond: [
          { $gte: ["$createdAt", { $subtract: ["$$NOW", 24 * 60 * 60000] }] }
          , false, true
        ]
      }
    }
  },
  { $match: { isLate: true }}]);

  // console.log('order', orders.length, take(reverse(orders), 10).map(o => ({
  //   id: o._id,
  //   code: o.code,
  //   status: o.status,
  //   createdAt: o.createdAt,
  //   finishedAt: o.finishedAt,
  //   isLate: o.isLate
  // })));
  const doneIds = orders.map(({ _id }) => new ObjectId(_id) );
  const notDoneIds = notDoneOrders.map(({ _id }) => new ObjectId(_id));
  const ids = [...doneIds,...notDoneIds];
  // const testorders = await OrderModel.find({ _id: { $in: ids } });
  // console.log('testorders',testorders);
  await OrderModel.updateMany({ _id: { $in: ids } }, { isLate: true }, { new: true });
};

doBusiness();