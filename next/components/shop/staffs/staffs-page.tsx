import { useState } from "react";
import { RiHome3Line, RiLock2Line, RiPhoneLine } from "react-icons/ri";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import { Staff, StaffService, STAFF_SCOPES } from "../../../lib/repo/staff.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { DataTable } from "../../shared/utilities/table/data-table";

export function StaffsPage(props: ReactProps) {
  const [openUpdateStaffPassword, setOpenUpdateStaffPassword] = useState<Staff>(null);
  const toast = useToast();

  return (
    <>
      <DataTable<Staff> crudService={StaffService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Nhân viên" subtitle="Nhân viên hệ thống" />
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
            label="Nhân viên"
            render={(item: Staff) => <DataTable.CellText avatar={item.avatar} value={item.name} />}
          />
          <DataTable.Column
            label="Liên hệ"
            render={(item: Staff) => (
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
                        {item.address}
                      </div>
                    )}
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Trực thuộc"
            render={(item: Staff) => <DataTable.CellText value={item.branch.name} />}
          />
          <DataTable.Column
            right
            render={(item: Staff) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiLock2Line />}
                  tooltip="Đổi mật khẩu"
                  onClick={() => {
                    setOpenUpdateStaffPassword(item);
                  }}
                />
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
                <Field name="username" label="Tên đăng nhập" cols={formItem?.id ? 12 : 6} required>
                  <Input />
                </Field>
                {!formItem?.id && (
                  <Field name="password" label="Mật khẩu" cols={6} required>
                    <Input type="password" />
                  </Field>
                )}
                <Field name="name" label="Tên nhân viên" cols={12} required>
                  <Input />
                </Field>
                <Field name="branchId" label="Chi nhánh trực thuộc" cols={12} required>
                  <Select optionsPromise={() => ShopBranchService.getAllOptionsPromise()} />
                </Field>
                <Field name="phone" label="Số điện thoại" cols={6}>
                  <Input />
                </Field>
                <Field name="address" label="Địa chỉ" cols={6}>
                  <Input />
                </Field>
                <Field name="avatar" label="Avatar" cols={12}>
                  <ImageInput avatar />
                </Field>
                <Field name="scopes" label="Quyền hạn" cols={12}>
                  <Select multi options={STAFF_SCOPES} />
                </Field>
              </>
            )}
          </DataTable.Consumer>
        </DataTable.Form>
        <DataTable.Pagination />
      </DataTable>
      <Form
        dialog
        title="Đổi mật khẩu nhân viên"
        isOpen={!!openUpdateStaffPassword}
        onClose={() => setOpenUpdateStaffPassword(null)}
        onSubmit={async (data) => {
          await StaffService.updateStaffPassword(openUpdateStaffPassword.id, data.password)
            .then((res) => {
              toast.success("Đổi mật khẩu nhân viên thành công");
              setOpenUpdateStaffPassword(null);
            })
            .catch((err) => {
              toast.error("Đổi mật khẩu nhân viên thất bại. " + err.message);
            });
        }}
      >
        <Field label="Tên nhân viên" readonly>
          <Input value={openUpdateStaffPassword?.name} />
        </Field>
        <Field name="password" label="Mật khẩu mới" required>
          <Input type="password" />
        </Field>
        <Field
          name="retypePassword"
          label="Nhập lại mật khẩu mới"
          required
          validate={async (value, data) =>
            value != data.password ? "Mật khẩu nhập lại không đúng" : ""
          }
        >
          <Input type="password" />
        </Field>
        <Form.Footer>
          <Form.ButtonGroup submitText="Đổi mật khẩu" />
        </Form.Footer>
      </Form>
    </>
  );
}
