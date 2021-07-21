import { useState, useEffect } from "react";
import { CgRadioChecked } from "react-icons/cg";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";
import { Spinner } from "../../shared/utilities/spinner";
import formatDate from "date-fns/format";
import { Form } from "../../shared/utilities/form/form";
import { Field } from "../../shared/utilities/form/field";
import { Textarea } from "../../shared/utilities/form/textarea";
import { useOrderDetailContext } from "./providers/order-detail-provider";
import { OrderStatus } from "./components/order-status";
import { useShopContext } from "../../../lib/providers/shop-provider";
import BreadCrumbs from "../../shared/utilities/breadcrumbs/breadcrumbs";
import { Select } from "../../shared/utilities/form/select";
import { Radio } from "../../shared/utilities/form/radio";
import { useToast } from "../../../lib/providers/toast-provider";
import { HiCheckCircle, HiOutlinePhone } from "react-icons/hi";
import { RatingOrder } from "./components/rating-order";
import { OrderLog } from "../../../lib/repo/order.repo";
import { FaCheckCircle, FaDotCircle } from "react-icons/fa";

interface ItemStatusOrderProps {
  status?: OrderLog;
  text?: string;
  actived?: boolean;
}

function ItemStatusOrder({ status, text, actived, ...props }: ItemStatusOrderProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      {actived ? (
        <i
          className={`text-xl ${
            text == "Đã hủy" || text == "Thất bại" ? "text-gray-400" : "text-danger"
          }`}
        >
          <FaCheckCircle />
        </i>
      ) : (
        <i className="text-xl text-gray-300">
          <FaDotCircle />
        </i>
      )}
      <div className={`py-1 ${actived && "font-semibold"}`}>{text}</div>
      {status && (
        <div className="text-sm text-gray-300">{`${new Date(
          status.createdAt
        ).getHours()}:${new Date(status.createdAt).getMinutes()}`}</div>
      )}
    </div>
  );
}

function StatusOrder(props) {
  const { order } = useOrderDetailContext();
  const [pending, setPending] = useState<OrderLog>();
  const [shipping, setShipping] = useState<OrderLog>();
  const [finished, setFinished] = useState<OrderLog>();
  const [failure, setFailure] = useState<OrderLog>();
  const [canceled, setCanceled] = useState<OrderLog>();
  useEffect(() => {
    if (order.logs) {
      order.logs.forEach((item) => {
        switch (item.statusText) {
          case "Chờ duyệt":
            setPending(item);
            break;
          case "Đang giao":
            setShipping(item);
            break;
          case "Hoàn thành":
            setFinished(item);
            break;
          case "Đã huỷ":
            setCanceled(item);
            break;
          case "Thất bại":
            setFailure(item);
            break;
        }
      });
    }
  }, [order.logs]);
  console.log("canceled", canceled);
  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-center items-end text-base">
        <div className="text-gray-500">Mã đơn hàng:</div>
        <div className="ml-1 font-bold">{order.code}</div>
      </div>
      <div className="w-full mx-auto flex items-start justify-between text-base mt-4">
        <ItemStatusOrder
          status={pending}
          actived={order.status == "PENDING" || order.status == "CONFIRMED"}
          text="Đã đặt"
        />
        <div className="border-b-2 border-gray-400 flex-1 pt-2"></div>
        {!canceled ? (
          <>
            <ItemStatusOrder
              status={shipping}
              actived={order.status == "DELIVERING"}
              text="Đang giao"
            />
            <div className="border-b-2 border-gray-400 flex-1 pt-2"></div>
            {order.status != "FAILURE" ? (
              <ItemStatusOrder
                status={finished}
                actived={order.status == "COMPLETED"}
                text="Hoàn thành"
              />
            ) : (
              <ItemStatusOrder
                status={failure}
                actived={order.status == "FAILURE"}
                text="Thất bại"
              />
            )}
          </>
        ) : (
          <ItemStatusOrder status={canceled} actived={order.status == "CANCELED"} text="Đã hủy" />
        )}
      </div>
    </div>
  );
}

export function OrderDetailPage(props) {
  const {
    order,
    status,
    cancelOrder,
    setLoading,
    loading,
    isInterval,
    tags,
    addTags,
    commentOrder,
    reOrderClick,
  } = useOrderDetailContext();
  const [showComment, setShowComment] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const { shopCode, shop } = useShopContext();
  const [rating, setRating] = useState(5);
  const toast = useToast();
  return (
    <div className="bg-white min-h-screen">
      <BreadCrumbs
        breadcrumbs={[
          { label: "Trang chủ", href: `/${shopCode}` },
          { label: "Lịch sử đơn hàng", href: `/order` },
          { label: "Chi tiết đơn hàng" },
        ]}
        className="p-4"
      />
      {status && order ? (
        <>
          {/* {isInterval ? (
            <>{<OrderStatus status={status} order={order} />}</>
          ) : ( */}
          <div className="text-gray-800 text-sm sm:text-lg">
            <div className="w-full px-4">
              <StatusOrder></StatusOrder>
              {order.cancelReason && (
                <div className="p-4 text-gray-500 bg-gray-50 my-2">
                  Lý do hủy: {order.cancelReason}
                </div>
              )}

              <div className="flex items-center my-2">
                <i className="text-danger text-xl ">
                  <CgRadioChecked />
                </i>
                <div className="sm:text-base py-2 sm:py-4 flex flex-col space-y-1 ml-2">
                  <p className="text-gray-500">
                    {order.pickupMethod === "DELIVERY" ? "Gửi từ" : "Lấy tại"}
                  </p>

                  <p className="">
                    <span className="font-bold pr-1">
                      {order.seller.shopName}-{order.shopBranch.name}
                    </span>
                    ({order.shopBranch.phone})
                  </p>
                  <p className="">
                    {order.shopBranch.address}, {order.shopBranch.ward}, {order.shopBranch.district}
                    , {order.shopBranch.province}
                  </p>
                  {order.pickupMethod !== "DELIVERY" && (
                    <p>Lấy vào lúc: {formatDate(new Date(order.pickupTime), "dd-MM-yyyy HH:mm")}</p>
                  )}
                </div>
              </div>
              <div className="w-full px-6 flex items-center">
                <hr className="flex-1 pt-2" />
                {order.pickupMethod === "DELIVERY" && (
                  <div className="text-sm pb-2 ml-2 font-semibold">{`${order.shipDistance} km`}</div>
                )}
              </div>
              <div className="flex items-center">
                <i className="text-primary text-xl ">
                  <CgRadioChecked />
                </i>
                <div className="sm:text-base pb-2 sm:pb-4 flex flex-col space-y-1 ml-2">
                  <p className="text-gray-500">
                    {order.pickupMethod === "DELIVERY" ? "Gửi đến" : "Người lấy"}
                  </p>
                  <p className="">
                    <span className="font-bold">{order.buyerName}</span> ({order.buyerPhone})
                  </p>
                  <p className="">{order.buyerFullAddress}</p>
                </div>
              </div>
            </div>
            <div className="mt-1 bg-white">
              <p className="font-bold px-4 py-2"></p>
              <div className="">
                {order.items.map((item, index) => {
                  const last = order.items.length - 1 == index;
                  return (
                    <div
                      className={`flex px-4 items-start border-gray-300 py-3 ${
                        !last && "border-b"
                      }`}
                      key={index}
                    >
                      <div className="font-bold text-primary flex items-center">
                        <div className="min-w-4 text-center">{item.qty}</div>
                        <div className="px-1">X</div>
                      </div>
                      <div className="flex-1 flex flex-col text-gray-700">
                        <div className="font-semibold">{item.productName}</div>
                        {!!item.toppings.length && (
                          <div>{item.toppings.map((topping) => topping.optionName).join(", ")}</div>
                        )}
                        {item.note && <div>Ghi chú: {item.note}</div>}
                      </div>
                      <div className="font-bold">{NumberPipe(item.amount, true)}</div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-6 border-b border-gray-300">
                {order.note && (
                  <div className="">
                    Ghi chú đơn hàng: <span className="">{order.note}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="">
                    Tạm tính: <span className="font-bold">{order.itemCount} món</span>
                  </div>
                  <div className="">{NumberPipe(order.subtotal, true)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">
                    Phí áp dụng: <span className="font-bold">{order.shipDistance} km</span>
                  </div>
                  <div className="">{NumberPipe(order.shipfee, true)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">
                    Khuyến mãi: <span className="font-bold">{order.discountDetail}</span>
                  </div>
                  <div className="text-danger">
                    {order.discount > 0
                      ? NumberPipe(-order.discount, true)
                      : NumberPipe(order.discount, true)}
                  </div>
                </div>
              </div>
              <div className="px-4 py-6 flex items-center justify-between">
                <div className="">Tổng cộng:</div>
                <div className="font-bold text-primary">{NumberPipe(order.amount, true)}</div>
              </div>
              <div className="p-2 sticky bottom-0 w-full bg-white">
                {order.status === "COMPLETED" && (
                  <Button
                    text="Bình luận đơn hàng này"
                    primary
                    className="rounded-sm bg-gradient w-full"
                    onClick={() => {
                      setLoading(true);
                      setShowComment(true);
                    }}
                  />
                )}
                {order.status !== "PENDING" &&
                  order.status !== "DELIVERING" &&
                  order.status !== "COMFIRMED" && (
                    <Button
                      text="Đặt lại"
                      outline
                      asyncLoading={loading}
                      className="w-full my-2 rounded-sm "
                      onClick={() => reOrderClick()}
                    />
                  )}

                {order.status === "PENDING" && (
                  <div className="flex flex-wrap-reverse items-center justify-center mt-2 gap-2">
                    <Button
                      text="Hủy đơn"
                      outline
                      primary
                      asyncLoading={loading}
                      className="rounded-sm w-full"
                      onClick={() => {
                        setLoading(true);
                        setShowCancel(true);
                      }}
                    />
                    <Button
                      text="Gọi nhà hàng"
                      primary
                      href={`tel:${order.shopBranch.phone}`}
                      className="rounded-sm bg-gradient w-full"
                      icon={<HiOutlinePhone />}
                    />
                  </div>
                )}
                {order.status === "CONFIRMED" && (
                  <Button
                    text="Gọi nhà hàng"
                    primary
                    className="rounded-sm bg-gradient w-full"
                    href={`tel:${order.shopBranch.phone}`}
                  />
                )}
                {order.status === "DELIVERING" && (
                  <div className="flex flex-wrap-reverse items-center justify-center mt-2 gap-2">
                    {order.shipMethod === "AHAMOVE" && (
                      <Button
                        text="Xem trên Ahamove"
                        outline
                        className="rounded-sm w-full"
                        href={order.ahamoveTrackingLink}
                      />
                    )}
                    <Button
                      text={"Tài xế: " + order.driverName || "Gọi tài xế"}
                      primary
                      className="rounded-sm bg-gradient w-full"
                      iconPosition="end"
                      href={`tel:${order.driverPhone}`}
                      icon={<HiOutlinePhone />}
                    />
                  </div>
                )}
                <Form
                  title="Lý do hủy"
                  dialog
                  isOpen={showCancel}
                  onClose={() => setShowCancel(false)}
                  onSubmit={(data) => {
                    cancelOrder(order.id, data.note);
                    setShowCancel(false);
                  }}
                >
                  <Field name="note">
                    <Textarea />
                  </Field>
                  <div className="flex justify-end">
                    <Button submit text="Xác nhận" large primary />
                  </div>
                </Form>
                <Form
                  title="Bình luận đơn hàng này"
                  slideFromBottom="none"
                  dialog
                  isOpen={showComment}
                  onClose={() => setShowComment(false)}
                  onSubmit={(data) => {
                    commentOrder({ rating, message: data.message });
                    setShowComment(false);
                  }}
                >
                  <div className="flex flex-wrap gap-2 my-2">
                    {shop?.config.tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`px-2 py-1 border rounded-full cursor-pointer hover:border-accent duration-200 transition-all ${
                          tags.findIndex((t) => t.name === tag.name) !== -1
                            ? "bg-primary-light border-primary"
                            : ""
                        }`}
                        onClick={() => addTags(tag)}
                      >
                        {tag.icon} {tag.name}
                      </div>
                    ))}
                  </div>
                  <RatingOrder
                    className="p-2 my-2 border rounded-full"
                    voted={rating}
                    onChange={(val) => {
                      setRating(val);
                    }}
                  />
                  <Field name="message" label="Nội dung bình luận" cols={12} required>
                    <Textarea />
                  </Field>
                  <div className="flex justify-end">
                    <Button submit text="Xác nhận" large primary />
                  </div>
                </Form>
              </div>
            </div>
          </div>
          {/* )} */}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
