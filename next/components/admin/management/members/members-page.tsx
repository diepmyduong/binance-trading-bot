import { useState } from "react";
import { RiCheckFill, RiCloseLine, RiLock2Line } from "react-icons/ri";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Member, MemberService } from "../../../../lib/repo/member.repo";
import { Card } from "../../../shared/utilities/card/card";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { FormValidator } from "../../../shared/utilities/form/form-validator";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Input } from "../../../shared/utilities/form/input";
import { Switch } from "../../../shared/utilities/form/switch";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function MembersPage(props) {
  const [openChangePasswordMember, setOpenChangePasswordMember] = useState<Member>(null);

  const toast = useToast();
  return (
    <Card>
      <DataTable<Member> crudService={MemberService} selection="single" order={{ createdAt: -1 }}>
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
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Cửa hàng"
            render={(item: Member) => (
              <DataTable.CellText image={item.shopLogo} value={item.shopName} subText={item.code} />
            )}
          />
          <DataTable.Column
            label="Người đại diện"
            render={(item: Member) => <DataTable.CellText value={item.name} subText={item.phone} />}
          />
          <DataTable.Column
            label="Email đăng nhập"
            render={(item: Member) => <DataTable.CellText value={item.username} />}
          />
          <DataTable.Column
            center
            orderBy="role"
            label="Trạng thái"
            render={(item: Member) => (
              <DataTable.CellStatus
                options={[
                  { value: true, label: "Hoạt động", color: "success" },
                  { value: false, label: "Đóng cửa", color: "bluegray" },
                ]}
                value={item.activated}
              />
            )}
          />
          <DataTable.Column
            center
            label="Ngày tạo"
            render={(item: Member) => <DataTable.CellDate value={item.createdAt} />}
          />
          <DataTable.Column
            right
            render={(item: Member) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiLock2Line />}
                  tooltip="Đổi mật khẩu"
                  onClick={() => {
                    setOpenChangePasswordMember(item);
                  }}
                />
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
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
                  name="username"
                  cols={formItem?.id ? 12 : 6}
                  readonly={formItem?.id}
                  required
                  validate={FormValidator.instance.email().build()}
                >
                  <Input autoFocus />
                </Field>
                {!formItem?.id && (
                  <Field label="Mật khẩu" name="password" cols={6} required>
                    <Input type="password" />
                  </Field>
                )}
                <Field
                  label="Mã cửa hàng"
                  name="code"
                  cols={7}
                  required
                  validate={async (value) =>
                    !/^[a-zA-Z0-9]+(?:[_a-zA-Z0-9]+)*$/.test(value)
                      ? "Chỉ gồm chữ, số và dấu gạch dưới"
                      : ""
                  }
                  readonly={formItem?.id}
                >
                  <Input placeholder="Chỉ gồm chữ, số và dấu gạch dưới" />
                </Field>
                <Field label="Trạng thái" name="activated" cols={5}>
                  <Switch
                    placeholder="Hoạt động"
                    value={formItem?.id ? formItem?.activated : true}
                  />
                </Field>
                <Field label="Tên cửa hàng" name="shopName" cols={12} required>
                  <Input />
                </Field>
                <Field label="Logo cửa hàng" name="shopLogo" cols={12}>
                  <ImageInput />
                </Field>
                <Field label="Họ tên người đại diện" name="name" cols={6} required>
                  <Input />
                </Field>
                <Field label="Số điện thoại" name="phone" cols={6} required>
                  <Input />
                </Field>
              </DataTable.Form>
              <Form
                title="Thay đổi mật khẩu cửa hàng"
                initialData={openChangePasswordMember}
                dialog
                isOpen={!!openChangePasswordMember}
                onClose={() => setOpenChangePasswordMember(null)}
                onSubmit={async (data) => {
                  try {
                    await MemberService.updateMemberPassword(
                      openChangePasswordMember?.id,
                      data.password
                    );
                    setOpenChangePasswordMember(null);
                    toast.success("Thay đổi mật khẩu thành công.");
                  } catch (err) {
                    toast.error("Thay đổi mật khẩu thất bại. " + err.message);
                  }
                }}
              >
                <Field readonly label="Cửa hàng">
                  <Input value={openChangePasswordMember?.shopName} />
                </Field>
                <Field readonly label="Email">
                  <Input value={openChangePasswordMember?.username} />
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
