import { useState } from "react";
import { convertViToEn } from "../../../lib/helpers/convert-vi-to-en";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopBranch } from "../../../lib/repo/shop-branch.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { AddressGroup } from "../../shared/utilities/address-group";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Spinner } from "../../shared/utilities/spinner";
import { BranchItem } from "./components/branch-item";
import { BranchesContext, BranchesProvider } from "./providers/branches-provider";

export function BranchesPage(props: ReactProps) {
  const [openBranch, setOpenBranch] = useState<ShopBranch>(undefined);
  const toast = useToast();
  const alert = useAlert();

  return (
    <BranchesProvider>
      <div className="flex justify-between items-center pb-6 pt-4 border-b border-gray-300 bg-gray-100 sticky top-0 z-10 transition-all">
        <ShopPageTitle title="Chi nhánh" subtitle="Quản lý các chi nhánh" />
        <Button
          primary
          className="bg-gradient h-12"
          text="Thêm chi nhánh"
          onClick={() => setOpenBranch(null)}
        />
      </div>
      <BranchesContext.Consumer>
        {({ branches, onCreateOrUpdateBranch, onRemoveBranch, onToggleBranch }) => (
          <>
            {!branches ? (
              <Spinner />
            ) : (
              <div className="flex flex-col gap-y-2 mt-4">
                {branches.map((branch) => (
                  <BranchItem
                    key={branch.id}
                    branch={branch}
                    onClick={() => {
                      setOpenBranch(branch);
                    }}
                    onDeleteClick={async () => {
                      if (
                        !(await alert.danger(
                          `Xoá chi nhánh ${branch.name}`,
                          "Bạn có chắc chắn muốn xoá chi nhánh này không?"
                        ))
                      )
                        return;
                      await onRemoveBranch(branch);
                    }}
                    onToggleClick={() => {
                      onToggleBranch(branch);
                    }}
                  />
                ))}
              </div>
            )}

            <Form
              grid
              dialog
              extraDialogClass="bg-transparent"
              extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
              extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
              width="650px"
              initialData={openBranch}
              title={`${openBranch ? "Chỉnh sửa" : "Thêm"} chi nhánh`}
              isOpen={openBranch !== undefined}
              onClose={() => setOpenBranch(undefined)}
              onSubmit={async (data) => {
                let newData = {} as Partial<ShopBranch>;
                if (openBranch) {
                  newData = { ...data };
                } else {
                  const {
                    name,
                    address,
                    provinceId,
                    wardId,
                    districtId,
                    email,
                    phone,
                    coverImage,
                  } = data;
                  newData = {
                    code: convertViToEn(name).replaceAll(" ", ""),
                    name,
                    address,
                    provinceId,
                    wardId,
                    districtId,
                    email,
                    phone,
                    coverImage,
                    isOpen: true,
                    location: {
                      type: "Point",
                      coordinates: [106.6968302, 10.7797855],
                    },
                  };
                }
                await onCreateOrUpdateBranch(newData);
              }}
            >
              <Field name="name" label="Tên chi nhánh" cols={12} required>
                <Input />
              </Field>
              <Field name="phone" label="Số điện thoại" cols={12} required>
                <Input />
              </Field>
              <AddressGroup provinceCols={12} districtCols={12} wardCols={12} required />
              <Field name="address" label="Địa chỉ (Số nhà, Đường)" cols={12} required>
                <Input />
              </Field>
              <Field name="email" label="Email" cols={12}>
                <Input type="email" />
              </Field>
              <Field
                name="coverImage"
                label="Ảnh bìa chi nhánh"
                description="Tỉ lệ 16:9. Dùng ảnh cửa hàng nếu không có"
                cols={12}
              >
                <ImageInput ratio169 cover largeImage />
              </Field>
              <Form.Footer>
                <Form.ButtonGroup
                  className="justify-center"
                  cancelText=""
                  submitProps={{ className: "bg-gradient h-14 w-64" }}
                />
              </Form.Footer>
            </Form>
          </>
        )}
      </BranchesContext.Consumer>
    </BranchesProvider>
  );
}
