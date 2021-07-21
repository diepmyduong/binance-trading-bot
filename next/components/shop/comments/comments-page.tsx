import { RiChatCheckLine, RiChatDeleteLine, RiStarFill } from "react-icons/ri";
import { useToast } from "../../../lib/providers/toast-provider";
import {
  ShopComment,
  ShopCommentService,
  SHOP_COMMENT_STATUS,
} from "../../../lib/repo/shop-comment.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Field } from "../../shared/utilities/form/field";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { Textarea } from "../../shared/utilities/form/textarea";
import { DataTable } from "../../shared/utilities/table/data-table";

export function CommentsPage(props: ReactProps) {
  const toast = useToast();
  return (
    <>
      <DataTable<ShopComment> crudService={ShopCommentService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Bình luận" subtitle="Xét duyệt các bình luận của cửa hàng" />
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
                options={SHOP_COMMENT_STATUS}
              />
            </Field>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Nhân viên"
            render={(item: ShopComment) => (
              <DataTable.CellText
                value={
                  <div>
                    <div className="font-semibold text-gray-700 flex">
                      {item.ownerName}{" "}
                      {Array.from(item.rating).map(() => (
                        <i className="text-yellow-400 text-xl">
                          <RiStarFill />
                        </i>
                      ))}
                    </div>
                    <p className="text-gray-600">{item.message}</p>
                  </div>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Điểm"
            render={(item: ShopComment) => (
              <DataTable.CellText value={[...Array(item.rating)].map((x) => "⭐").join("")} />
            )}
          />
          <DataTable.Column
            center
            label="Loại bình luận"
            render={(item: ShopComment) => (
              <DataTable.CellText value={item.customerId ? "Khách hàng" : "Cửa hàng"} />
            )}
          />
          <DataTable.Column
            center
            label="Trạng thái"
            render={(item: ShopComment) => (
              <DataTable.CellStatus value={item.status} options={SHOP_COMMENT_STATUS} />
            )}
          />
          <DataTable.Column
            right
            render={(item: ShopComment) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiChatCheckLine />}
                  tooltip="Công khai bình luận"
                  disabled={item.status == "PUBLIC"}
                  refreshAfterTask
                  onClick={async () => {
                    await ShopCommentService.update({ id: item.id, data: { status: "PUBLIC" } })
                      .then((res) => {
                        toast.success("Công khai bình luận thành công");
                      })
                      .catch((err) => {
                        toast.error("Công khai bình luận thất bại", err.message);
                      });
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiChatDeleteLine />}
                  tooltip="Ẩn bình luận"
                  disabled={item.status == "HIDDEN"}
                  refreshAfterTask
                  onClick={async () => {
                    await ShopCommentService.update({ id: item.id, data: { status: "HIDDEN" } })
                      .then((res) => {
                        toast.success("Ẩn bình luận thành công");
                      })
                      .catch((err) => {
                        toast.error("Ẩn bình luận thất bại", err.message);
                      });
                  }}
                />
                <DataTable.CellButton value={item} isEditButton disabled={!item.customerId} />
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
          beforeSubmit={(data) => ({ ...data, status: "PUBLIC" })}
        >
          <Field name="ownerName" label="Tên người bình luận" cols={7} required>
            <Input />
          </Field>
          <Field name="rating" label="Đánh giá" cols={5} required>
            <Select
              options={[1, 2, 3, 4, 5].map((star) => ({
                value: star,
                label: [...Array(star)].map((x) => "⭐").join(""),
              }))}
              defaultValue={5}
            />
          </Field>
          <Field name="message" label="Nội dung bình luận" cols={12} required>
            <Textarea />
          </Field>
        </DataTable.Form>
        <DataTable.Pagination />
      </DataTable>
    </>
  );
}
