import { useState } from "react";
import { RiBillLine, RiMoneyDollarCircleLine, RiPhoneLine, RiUser5Line } from "react-icons/ri";
import { NumberPipe } from "../../../lib/pipes/number";
import {
  Collaborator,
  CollaboratorService,
  COLLABORATOR_STATUS,
} from "../../../lib/repo/collaborator.repo";
import { OrdersDialog } from "../../shared/shop-layout/orders-dialog";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Field } from "../../shared/utilities/form/field";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { DataTable } from "../../shared/utilities/table/data-table";
import { CollaboratorCommissionDialog } from "./components/collaborator-commission-dialog copy";
import { CollaboratorCustomerDialog } from "./components/collaborator-customer-dialog";

export function CollaboratorsPage(props: ReactProps) {
  const [openCollaboratorCustomers, setOpenCollaboratorCustomers] = useState<string>("");
  const [openCollaboratorOrders, setOpenCollaboratorOrders] = useState<string>("");
  const [openCollaboratorCommissions, setOpenCollaboratorCommissions] = useState("");

  return (
    <>
      <DataTable<Collaborator> crudService={CollaboratorService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle
            title="Cộng tác viên"
            subtitle="Những khách hàng đăng ký làm cộng tác viên"
          />
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
          <DataTable.Filter>
            <Field name="status" noError>
              <Select
                className="h-12 inline-grid"
                autosize
                clearable
                placeholder="Tất cả trạng thái"
                options={COLLABORATOR_STATUS}
              />
            </Field>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Cộng tác viên"
            render={(item: Collaborator) => (
              <DataTable.CellText
                value={item.name}
                className="font-semibold"
                subTextClassName="flex"
                subText={
                  <>
                    <i className="mt-1 mr-1">
                      <RiPhoneLine />
                    </i>
                    {item.phone}
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            label="Mã"
            render={(item: Collaborator) => (
              <DataTable.CellText value={item.code} className="font-semibold" />
            )}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: Collaborator) => (
              <DataTable.CellStatus value={item.status} options={COLLABORATOR_STATUS} />
            )}
          />
          <DataTable.Column
            label="Đơn hàng"
            render={(item: Collaborator) => (
              <DataTable.CellText
                value={
                  <>
                    <div className="flex whitespace-nowrap">
                      <span className="w-32">Lượt bấm:</span>
                      <span className="font-semibold">{NumberPipe(item.clickCount)}</span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-32">Lượt thích:</span>
                      <span className="font-semibold">{NumberPipe(item.likeCount)}</span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-32">Lượt chia sẻ:</span>
                      <span className="font-semibold">{NumberPipe(item.shareCount)}</span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-32">Lượt bình luận:</span>
                      <span className="font-semibold">{NumberPipe(item.commentCount)}</span>
                    </div>
                    <div className="flex whitespace-nowrap">
                      <span className="w-32">Lượt tương tác:</span>
                      <span className="font-semibold">{NumberPipe(item.engagementCount)}</span>
                    </div>
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: Collaborator) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiMoneyDollarCircleLine />}
                  tooltip="Lịch sử hoa hồng"
                  onClick={() => {
                    setOpenCollaboratorCommissions(item.customerId);
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiUser5Line />}
                  tooltip="Khách hàng giới thiệu"
                  onClick={() => {
                    setOpenCollaboratorCustomers(item.customerId);
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiBillLine />}
                  tooltip="Đơn hàng giới thiệu"
                  onClick={() => {
                    setOpenCollaboratorOrders(item.id);
                  }}
                />
                <DataTable.CellButton value={item} isEditButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Consumer>
          {({ formItem }) => (
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
              <Field name="name" label="Tên cộng tác viên" cols={6} required>
                <Input />
              </Field>
              <Field name="phone" label="Số điện thoại" cols={6} required>
                <Input />
              </Field>
              {formItem?.id && (
                <>
                  <Field name="code" label="Mã cộng tác viên" cols={6} readonly>
                    <Input />
                  </Field>
                  <Field name="status" label="Trạng thái" cols={6}>
                    <Select options={COLLABORATOR_STATUS} />
                  </Field>
                </>
              )}
            </DataTable.Form>
          )}
        </DataTable.Consumer>
        <DataTable.Pagination />
      </DataTable>
      <CollaboratorCommissionDialog
        isOpen={!!openCollaboratorCommissions}
        onClose={() => setOpenCollaboratorCommissions("")}
        filter={openCollaboratorCommissions ? { customerId: openCollaboratorCommissions } : null}
      />
      <CollaboratorCustomerDialog
        isOpen={!!openCollaboratorCustomers}
        onClose={() => setOpenCollaboratorCustomers("")}
        collaboratorId={openCollaboratorCustomers}
      />
      <OrdersDialog
        isOpen={!!openCollaboratorOrders}
        onClose={() => setOpenCollaboratorOrders("")}
        filter={openCollaboratorOrders ? { collaboratorId: openCollaboratorOrders } : null}
      />
    </>
  );
}
