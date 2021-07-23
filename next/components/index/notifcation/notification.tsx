import { Spinner } from "../../shared/utilities/spinner";
import { useNotificationContext } from "./provider/notification-provider";
import { NotFound } from "../../shared/utilities/not-found";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { NotificationService } from "../../../lib/repo/notification.repo";

function ItemNotification(props) {
  const [color, setColor] = useState("");
  const { shopCode } = useShopContext();
  const router = useRouter();
  useEffect(() => {
    switch (props.item?.order.status) {
      case "PENDING":
        setColor("text-warning");
        break;
      case "CONFIRMED":
        setColor("text-info");
        break;
      case "DELIVERING":
        setColor("text-info");
        break;
      case "COMPLETED":
        setColor("text-success");
        break;
      case "FAILURE":
        setColor("text-danger");
        break;
      case "CANCELED":
        setColor("text-danger");
        break;
    }
  }, [props.item]);
  return (
    <div
      className="p-4 border-b border-gray-300 cursor-pointer"
      onClick={() => {
        if (props.item.order) router.push(`/${shopCode}/order/${props.item.order.code}`);
      }}
    >
      <div className="flex items-center">
        <div className="font-semibold">{props.item.title}</div>
        <div className="ml-2 text-sm text-gray-500">
          {format(new Date(props.item.createdAt), "HH:mm - dd/MM/yyy")}
        </div>
      </div>
      <div className={`${color}`}>{props.item.body}</div>
    </div>
  );
}

export function NotificationPage() {
  const { items, loadAll } = useNotificationContext();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loadMoreData = () => {
    loadAll({ page: page });
  };
  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement.scrollHeight
    ) {
      setPage(page + 1);
    } else {
    }
  };
  useEffect(() => {
    loadMoreData();
  }, [page]);
  useEffect(() => {
    if (items?.length > 0) {
      items.forEach((item) => notifications.push(item));
      setNotifications([...notifications]);
    }
  }, [items]);
  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    console.log("Start scroll");
    return () => window.removeEventListener("scroll", loadMore);
  }, []);

  if (!items) return <Spinner />;
  return (
    <div className="w-full bg-white relative min-h-screen">
      {items.length == 0 ? (
        <NotFound text="Không có thông báo nào" />
      ) : (
        notifications.map((item, index) => {
          return <ItemNotification key={index} item={item}></ItemNotification>;
        })
      )}
      {loading && <Spinner />}
    </div>
  );
}
