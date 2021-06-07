import { useState } from "react";
import { Card } from "../../../../components/shared/utilities/card/card";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { User, UserService, USER_ROLES, USER_STATUS } from "../../../../lib/repo/user.repo";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { FormValidator } from "../../../shared/utilities/form/form-validator";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function UserPage(props) {
  const [openChangePasswordUser, setOpenChangePasswordUser] = useState<User>(null);
  const { activeUser, blockUser } = useAuth();

  const toast = useToast();
  return (
    <Card className="max-w-6xl">
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
            label="Tài khoản"
            render={(item: User) => (
              <DataTable.CellText
                value={item.name}
                subText={item.code}
                avatar={item.profilePicture}
              />
            )}
          />
          <DataTable.Column
            label="Email"
            render={(item: User) => <DataTable.CellText value={item.email} />}
          />
          <DataTable.Column
            width={150}
            center
            label="Điện thoại"
            render={(item: User) => <DataTable.CellText value={item.phone} />}
          />
          <DataTable.Column
            center
            label="Ngày tạo"
            render={(item: User) => <DataTable.CellDate value={item.createdAt} />}
          />
          <DataTable.Column
            center
            orderBy="role"
            label="Vai trò"
            render={(item: User) => <DataTable.CellStatus value={item.role} options={USER_ROLES} />}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: User) => (
              <DataTable.CellStatus isLabel={false} value={item.status} options={USER_STATUS} />
            )}
          />
          <DataTable.Column
            right
            render={(item: User) => (
              <>
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
                <DataTable.CellButton
                  value={item}
                  moreItems={[
                    {
                      text: "Cập nhật mật khẩu",
                      onClick: () => {
                        setOpenChangePasswordUser(item);
                      },
                    },
                    {
                      text: "Kích hoạt tài khoản",
                      disabled: item.status == "ACTIVE",
                      refreshAfterTask: true,
                      onClick: async () => {
                        await activeUser(item.id)
                          .then((res) => {
                            toast.success("Đã kích hoạt tài khoản thành công");
                          })
                          .catch((err) => {
                            toast.error("Kích hoạt tài khoản thất bại. " + err.message);
                          });
                      },
                    },
                    {
                      text: "Khóa tài khoản",
                      disabled: item.status == "BLOCKED" || item.status == "INACTIVE",
                      refreshAfterTask: true,
                      onClick: async () => {
                        await blockUser(item.id)
                          .then((res) => toast.success("Đã khóa tài khoản thành công"))
                          .catch((err) => {
                            toast.error("Khóa tài khoản thất bại. " + err.message);
                          });
                      },
                    },
                  ]}
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
                  label="Tên đăng nhập"
                  name="username"
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
                <Field label="Tên nhân viên" name="name" cols={6} required>
                  <Input />
                </Field>
                <Field label="Mã nhân viên" name="code" cols={6} required>
                  <Input />
                </Field>
                <Field
                  label="Email"
                  name="email"
                  cols={6}
                  required
                  readonly={formItem?.id}
                  validate={FormValidator.instance.email().build()}
                >
                  <Input type="email" />
                </Field>
                <Field
                  label="Số điện thoại"
                  name="phone"
                  cols={6}
                  required
                  validate={FormValidator.instance.phoneNumber().build()}
                >
                  <Input />
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
