import { useState } from "react";
import { RiLock2Line } from "react-icons/ri";
import { Card } from "../../../../components/shared/utilities/card/card";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { User, UserService, USER_ROLES } from "../../../../lib/repo/user.repo";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function UserPage(props) {
  const [openChangePasswordUser, setOpenChangePasswordUser] = useState<User>(null);
  const { activeUser, blockUser } = useAuth();

  const toast = useToast();
  return (
    <Card>
      <DataTable<User> crudService={UserService} selection="single" order={{ createdAt: 1 }}>
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isAddButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter>
            <Field name="role" noError>
              <Select placeholder="Tất cả loại tài khoản" clearable options={USER_ROLES} autosize />
            </Field>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Email"
            render={(item: User) => <DataTable.CellText value={item.email} />}
          />
          <DataTable.Column
            center
            label="Họ tên"
            render={(item: User) => <DataTable.CellText value={item.name} />}
          />
          <DataTable.Column
            center
            orderBy="role"
            label="Vai trò"
            render={(item: User) => <DataTable.CellStatus value={item.role} options={USER_ROLES} />}
          />
          <DataTable.Column
            center
            label="Ngày tạo"
            render={(item: User) => <DataTable.CellDate value={item.createdAt} />}
          />
          <DataTable.Column
            right
            render={(item: User) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiLock2Line />}
                  tooltip="Đổi mật khẩu"
                  onClick={() => {
                    setOpenChangePasswordUser(item);
                  }}
                />
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton
                  hoverDanger
                  value={item}
                  isDeleteButton
                  disabled={item.email == "admin@gmail.com"}
                />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Consumer>
          {({ formItem }) => (
            <>
              <DataTable.Form grid>
                <Field
                  label="Email đăng nhập"
                  name="email"
                  cols={formItem?.id ? 12 : 6}
                  readonly={formItem?.id}
                  required
                >
                  <Input autoFocus />
                </Field>
                {!formItem?.id && (
                  <Field label="Mật khẩu" name="password" cols={6} required>
                    <Input type="password" />
                  </Field>
                )}
                <Field label="Họ tên" name="name" cols={6} required>
                  <Input />
                </Field>
                <Field label="Vai trò" name="role" cols={6} required>
                  <Select options={USER_ROLES} />
                </Field>
              </DataTable.Form>
              <Form
                title="Thay đổi mật khẩu"
                initialData={openChangePasswordUser}
                dialog
                isOpen={!!openChangePasswordUser}
                onClose={() => setOpenChangePasswordUser(null)}
                onSubmit={async (data) => {
                  try {
                    await UserService.updateUserPassword(openChangePasswordUser?.id, data.password);
                    setOpenChangePasswordUser(null);
                    toast.success("Thay đổi mật khẩu thành công.");
                  } catch (err) {
                    toast.error("Thay đổi mật khẩu thất bại. " + err.message);
                  }
                }}
              >
                <Field readonly label="Tài khoản">
                  <Input
                    value={`${openChangePasswordUser?.name} - ${openChangePasswordUser?.email}`}
                  />
                </Field>
                <Field required name="password" label="Mật khẩu mới">
                  <Input type="password" />
                </Field>
                <Form.Footer>
                  <Form.ButtonGroup />
                </Form.Footer>
              </Form>
            </>
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
