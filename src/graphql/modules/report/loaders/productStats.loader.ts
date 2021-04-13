import { OrderLogModel } from "../../orderLog/orderLog.model";
import DataLoader from "dataloader";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../../helpers";
import { OrderItemModel } from "../../orderItem/orderItem.model";


export class ProductStats {
  customersCount: number = 0;

  totalQty: number = 0;
  pendingQtyCount: number = 0;
  confirmedQtyCount: number = 0;
  deliveringQtyCount: number = 0;
  completedQtyCount: number = 0;
  failureQtyCount: number = 0;
  canceledQtyCount: number = 0;
  
  orderCount: number = 0;
  pendingCount: number = 0;
  confirmedCount: number = 0;
  deliveringCount: number = 0;
  completedCount: number = 0;
  failureCount: number = 0;
  canceledCount: number = 0;
  
  totalAmount: number = 0;
  pendingAmount: number = 0;
  confirmedAmount: number = 0;
  deliveringAmount: number = 0;
  completedAmount: number = 0;
  failureAmount: number = 0;
  canceledAmount: number = 0;
  
  static loaders: { [x: string]: DataLoader<string, ProductStats> } = {};

  static getLoader(args: any) {
    const { fromDate, toDate , sellerId} = args;

    const loaderId = fromDate + toDate;

    const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

    if (!this.loaders[loaderId]) {
      this.loaders[loaderId] = new DataLoader<string, ProductStats>(
        async (ids) => {
          const objectIds = ids.map(Types.ObjectId);
                    
          const $match: any = {};
          const match2 : any= {
            
          }

          if ($gte) {
            set($match, "createdAt.$gte", $gte);
          }
      
          if ($lte) {
            set($match, "createdAt.$lte", $lte);
          }

          set($match, "productId.$in", objectIds);
          
          console.log("sellerId",sellerId);

          if(sellerId){
            set(match2, "sellerId", sellerId);
          }

          // console.log('$match',$match)
          console.log('match2',match2)

          return await OrderItemModel.aggregate([
            {
              $match
            },
            {
                $lookup:{
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order'},
            {
                $project:{
                    _id:1,
                    status: 1,
                    productId: 1,
                    productName:1,
                    basePrice: 1,
                    orderId : 1,
                    sellerId:"$order.sellerId",
                    amount:1,
                    qty: 1,
                }
            },
            {
              $match:{
               ...match2
              }
            },
            {
                $group:{
                    _id: {productId: "$productId", productName: "$productName" , basePrice:"$basePrice"},
                    totalQty: { $sum: "$qty" },
                    pendingQtyCount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, "$qty", 0] } },
                    confirmedQtyCount: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, "$qty", 0] } },
                    deliveringQtyCount: { $sum: { $cond: [{ $eq: ["$status", "DELIVERING"] }, "$qty", 0] } },
                    completedQtyCount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$qty", 0] } },
                    failureQtyCount: { $sum: { $cond: [{ $eq: ["$status", "FAILURE"] }, "$qty", 0] } },
                    canceledQtyCount: { $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, "$qty", 0] } },
                    
                    orderCount: { $sum: 1 },
                    pendingCount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } },
                    confirmedCount: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] } },
                    deliveringCount: { $sum: { $cond: [{ $eq: ["$status", "DELIVERING"] }, 1, 0] } },
                    completedCount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
                    failureCount: { $sum: { $cond: [{ $eq: ["$status", "FAILURE"] }, 1, 0] } },
                    canceledCount: { $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, 1, 0] } },
                    
                    totalAmount: { $sum: "$amount" },
                    pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, "$amount", 0] } },
                    confirmedAmount: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, "$amount", 0] } },
                    deliveringAmount: { $sum: { $cond: [{ $eq: ["$status", "DELIVERING"] }, "$amount", 0] } },
                    completedAmount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", 0] } },
                    failureAmount: { $sum: { $cond: [{ $eq: ["$status", "FAILURE"] }, "$amount", 0] } },
                    canceledAmount: { $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, "$amount", 0] } }
                }
            },
            {
                $project:{
                    _id: "$_id.productId",
                    productName: "$_id.productName",
                    basePrice: "$_id.basePrice",
                    
                    totalQty: 1,
                    pendingQtyCount:1,
                    confirmedQtyCount:1,
                    deliveringQtyCount:1,
                    completedQtyCount:1,
                    failureQtyCount:1,
                    canceledQtyCount:1,
                    
                    orderCount: 1,
                    pendingCount:1,
                    confirmedCount:1,
                    deliveringCount:1,
                    completedCount:1,
                    failureCount:1,
                    canceledCount:1,
                    
                    totalAmount:1,
                    pendingAmount:1,
                    confirmedAmount:1,
                    deliveringAmount:1,
                    completedAmount:1,
                    failureAmount: 1,
                    canceledAmount:1,
                }
            }
          ]).then((list) => {
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) =>
              get(listKeyBy, id, new ProductStats())
            );
          });
        },
        { cache: false } // Bỏ cache
      );
    }
    return this.loaders[loaderId];
  }
}