import { RiHome3Line, RiPhoneLine } from "react-icons/ri";
import { getAddressText } from "../../../lib/helpers/get-address-text";
import { CustomerService, Customer } from "../../../lib/repo/customer.repo";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import { Staff } from "../../../lib/repo/staff.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Field } from "../../shared/utilities/form/field";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { DataTable } from "../../shared/utilities/table/data-table";

export function CustomersPage(props: ReactProps) {
  return (
    <>
      <DataTable<Customer> crudService={CustomerService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Khách hàng" subtitle="Khách hàng hệ thống" />
          <DataTable.Buttons>
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white w-12 h-12"
            />
            {/* <DataTable.Button primary isAddButton className="bg-gradient h-12" /> */}
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search className="h-12" />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Khách hàng"
            render={(item: Customer) => (
              <DataTable.CellText
                avatar={item.avatar}
                value={`${item.name}`}
                subText={item.facebookName ? `Tên Facebook: ${item.facebookName}` : ""}
              />
            )}
          />
          <DataTable.Column
            center
            label="Mã khách hàng"
            render={(item: Customer) => <DataTable.CellText value={`「${item.code}」`} />}
          />
          <DataTable.Column
            label="Liên hệ"
            render={(item: Customer) => (
              <DataTable.CellText
                value={
                  <>
                    {item.phone && (
                      <div className="flex">
                        <i className="text-lg mt-1 mr-1">
                          <RiPhoneLine />
                        </i>
                        {item.phone}
                      </div>
                    )}
                    {item.address && (
                      <div className="flex">
                        <i className="text-lg mt-1 mr-1">
                          <RiHome3Line />
                        </i>
                        {getAddressText(item)}
                      </div>
                    )}
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: Staff) => (
              <>
                {/* <DataTable.CellButton value={item} isEditButton /> */}
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        {/* <DataTable.Form
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
        </DataTable.Form> */}
        <DataTable.Pagination />
      </DataTable>
    </>
  );
}
