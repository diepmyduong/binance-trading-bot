import { truncate } from "fs";
import { RiCheckDoubleFill, RiCloseFill } from "react-icons/ri";
import { useAdminLayoutContext } from "../../../../layouts/admin-layout/providers/admin-layout-provider";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  ShopRegistration,
  ShopRegistrationService,
  SHOP_REGISTRATION_STATUS,
} from "../../../../lib/repo/shop-registration.repo";
import { Card } from "../../../shared/utilities/card/card";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function RegistrationsPage(props) {
  const { checkPendingRegistrations } = useAdminLayoutContext();

  const toast = useToast();
  const alert = useAlert();
  return (
    <Card>
      <DataTable<ShopRegistration>
        crudService={ShopRegistrationService}
        selection="single"
        order={{ createdAt: -1 }}
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Cửa hàng"
            render={(item: ShopRegistration) => (
              <DataTable.CellText value={item.shopName} subText={item.shopCode} />
            )}
          />
          <DataTable.Column
            label="Người đại diện"
            render={(item: ShopRegistration) => (
              <DataTable.CellText value={item.name} subText={item.phone} />
            )}
          />
          <DataTable.Column
            label="Email đăng ký"
            render={(item: ShopRegistration) => <DataTable.CellText value={item.email} />}
          />
          <DataTable.Column
            center
            orderBy="status"
            label="Trạng thái"
            render={(item: ShopRegistration) => (
              <DataTable.CellStatus value={item.status} options={SHOP_REGISTRATION_STATUS} />
            )}
          />
          <DataTable.Column
            center
            label="Thởi gian đăng ký"
            render={(item: ShopRegistration) => (
              <DataTable.CellDate format="dd-MM-yyyy HH:mm" value={item.createdAt} />
            )}
          />
          <DataTable.Column
            right
            render={(item: ShopRegistration) => (
              <DataTable.Consumer>
                {({ loadAll }) => (
                  <>
                    <DataTable.CellButton
                      hoverSuccess
                      value={item}
                      tooltip="Duyệt đăng ký"
                      icon={<RiCheckDoubleFill />}
                      disabled={item.status != "PENDING"}
                      style={{ opacity: item.status != "PENDING" ? 0 : 1 }}
                      onClick={async () => {
                        await alert.question(
                          "Duyệt đăng ký này",
                          `Đăng ký cửa hàng "${item.shopName}" sẽ được duyệt.`,
                          "Duyệt đăng ký",
                          async () =>
                            ShopRegistrationService.approveShopRegis(item.id, true)
                              .then(async (res) => {
                                toast.success("Duyệt đăng ký thành công");
                                await loadAll(true);
                                await checkPendingRegistrations();
                                return true;
                              })
                              .catch((err) => {
                                console.error(err);
                                toast.error("Duyệt đăng ký thất bại. " + err.message);
                                return false;
                              })
                        );
                      }}
                    />
                    <DataTable.CellButton
                      hoverDanger
                      value={item}
                      tooltip="Từ chối đăng ký"
                      refreshAfterTask
                      icon={<RiCloseFill />}
                      disabled={item.status != "PENDING"}
                      style={{ opacity: item.status != "PENDING" ? 0 : 1 }}
                      onClick={async () => {
                        await alert.danger(
                          "Từ chối đăng ký này",
                          `Đăng ký cửa hàng "${item.shopName}" sẽ bị từ chối.`,
                          "Từ chối đăng ký",
                          async () =>
                            ShopRegistrationService.approveShopRegis(item.id, false)
                              .then(async (res) => {
                                toast.success("Từ chối đăng ký thành công");
                                await loadAll(true);
                                await checkPendingRegistrations();
                                return true;
                              })
                              .catch((err) => {
                                console.error(err);
                                toast.error("Từ chối đăng ký thất bại. " + err.message);
                                return false;
                              })
                        );
                      }}
                    />
                  </>
                )}
              </DataTable.Consumer>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
      </DataTable>
    </Card>
  );
}
