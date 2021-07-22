import { createContext, useContext, useEffect, useState } from "react";
import { PaginationQueryProps, usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";
import { Notification, NotificationService } from "../../../../lib/repo/notification.repo";

export const NotificationContext = createContext<
  PaginationQueryProps<Notification> &
    Partial<{ Notifications: Notification[]; statusNotification: Option[] }>
>({});

export function NotificationProvider(props) {
  const [notifications, setNotifications] = useState<Notification[]>();
  const paginationQueryContext = usePaginationQuery(NotificationService, null, {
    order: { _id: -1 },
    page: 1,
  });

  return (
    <NotificationContext.Provider value={{ ...paginationQueryContext }}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);
