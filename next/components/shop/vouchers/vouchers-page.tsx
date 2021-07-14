import format from "date-fns/format";
import {
  RiCalendarEventLine,
  RiCheckLine,
  RiCloseLine,
  RiHome3Line,
  RiPhoneLine,
} from "react-icons/ri";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import {
  ShopVoucher,
  ShopVoucherService,
  SHOP_VOUCHER_TYPES,
} from "../../../lib/repo/shop-voucher.repo";
import { Staff, STAFF_SCOPES } from "../../../lib/repo/staff.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Checkbox } from "../../shared/utilities/form/checkbox";
import { DatePicker } from "../../shared/utilities/form/date";
import { Field } from "../../shared/utilities/form/field";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { Switch } from "../../shared/utilities/form/switch";
import { DataTable } from "../../shared/utilities/table/data-table";

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
        <DataTable.Form
          extraDialogClass="bg-transparent"
          extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
          extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
          saveButtonGroupProps={{
            className: "justify-center",
            submitProps: { className: "bg-gradient h-14 w-64" },
            cancelText: "",
          }}
          grid
        >
          <DataTable.Consumer>
            {({ formItem }) => (
              <>
                <Field
                  name="code"
                  label="Mã khuyến mãi"
                  cols={6}
                  required
                  readonly={!!formItem?.id}
                >
                  <Input />
                </Field>
                <Field
                  name="type"
                  label="Loại khuyến mãi"
                  cols={6}
                  required
                  readonly={!!formItem?.id}
                >
                  <Select options={SHOP_VOUCHER_TYPES} />
                </Field>
                <Field name="description" label="Mô tả" cols={12} required>
                  <Input />
                </Field>
                {formItem?.id && (
                  <>
                    <Field name="startDate" label="Ngày bắt đầu" cols={6}>
                      <DatePicker />
                    </Field>
                    <Field name="endDate" label="Ngày kết thúc" cols={6}>
                      <DatePicker />
                    </Field>
                    <Field name="isPrivate" label="" cols={6}>
                      <Checkbox placeholder="Mã riêng tư" />
                    </Field>
                    <Field name="isActive" label="" cols={6}>
                      <Switch placeholder="Kích hoạt" />
                    </Field>
                  </>
                )}
              </>
            )}
          </DataTable.Consumer>
        </DataTable.Form>
        <DataTable.Pagination />
      </DataTable>
    </>
  );
}
