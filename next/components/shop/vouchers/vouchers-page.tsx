import format from "date-fns/format";
import { RiCalendarEventLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import {
  ShopVoucher,
  ShopVoucherService,
  SHOP_VOUCHER_TYPES,
} from "../../../lib/repo/shop-voucher.repo";
import { Staff } from "../../../lib/repo/staff.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { DataTable } from "../../shared/utilities/table/data-table";
import { VoucherForm } from "./components/voucher-form";

export function VouchersPage(props: ReactProps) {
  return (
    <>
      <DataTable<ShopVoucher>
        crudService={ShopVoucherService}
        order={{ createdAt: -1 }}
        fragment={ShopVoucherService.fullFragment}
      >
        <DataTable.Header>
          <ShopPageTitle title="Khuyến mãi" subtitle="Danh sách các mã khuyến mãi" />
          <DataTable.Buttons>
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white w-12 h-12"
            />
            <DataTable.Button primary isAddButton className="bg-gradient h-12" />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search className="h-12" />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Mã khuyến mãi"
            render={(item: ShopVoucher) => (
              <DataTable.CellText
                image={item.image}
                value={item.code}
                subText={format(new Date(item.createdAt), "dd-MM-yyyy")}
              />
            )}
          />
          <DataTable.Column
            label="Mô tả"
            render={(item: ShopVoucher) => <DataTable.CellText value={item.description} />}
          />
          <DataTable.Column
            center
            label="Loại"
            render={(item: ShopVoucher) => (
              <DataTable.CellStatus value={item.type} options={SHOP_VOUCHER_TYPES} />
            )}
          />
          <DataTable.Column
            center
            label="Ngày hoạt động"
            render={(item: ShopVoucher) => (
              <DataTable.CellText
                className="text-gray-500 text-sm"
                value={
                  <>
                    {item.startDate && (
                      <div className="flex">
                        <i className="mt-1 mr-1">
                          <RiCalendarEventLine />
                        </i>
                        Từ ngày {format(new Date(item.startDate), "dd-MM-yyyy")}
                      </div>
                    )}
                    {item.endDate && (
                      <div className="flex">
                        <i className="mt-1 mr-1">
                          <RiCalendarEventLine />
                        </i>
                        Đến ngày {format(new Date(item.endDate), "dd-MM-yyyy")}
                      </div>
                    )}
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Kích hoạt"
            render={(item: ShopVoucher) => (
              <DataTable.CellText
                value={
                  item.isActive ? (
                    <i className="text-success text-xl flex-center">
                      <RiCheckLine />
                    </i>
                  ) : (
                    <i className="text-gray-400 text-xl flex-center">
                      <RiCloseLine />
                    </i>
                  )
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: Staff) => (
              <>
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Consumer>
          {({ formItem }: { formItem: ShopVoucher }) => <VoucherForm voucher={formItem} />}
        </DataTable.Consumer>
        <DataTable.Pagination />
      </DataTable>
    </>
  );
}
