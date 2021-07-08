import { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { convertViToEn } from "../../../lib/helpers/convert-vi-to-en";
import { getAddressText } from "../../../lib/helpers/get-address-text";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { HereMapService } from "../../../lib/repo/map.repo";
import { ShopBranch } from "../../../lib/repo/shop-branch.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { AddressGroup } from "../../shared/utilities/form/address-group";
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
      <BranchesContext.Consumer>
        {({ branches, onCreateOrUpdateBranch, onRemoveBranch, onToggleBranch, loadBranches }) => (
          <>
            <div className="flex items-center pb-6 pt-4 border-b border-gray-300 bg-gray-100 sticky top-0 z-10 transition-all">
              <ShopPageTitle title="Chi nhánh" subtitle="Quản lý các chi nhánh" />
              <Button
                outline
                className="px-0 w-12 h-12 bg-white mr-2 ml-auto"
                icon={<HiOutlineRefresh />}
                iconClassName="text-xl"
                onClick={() => loadBranches(true)}
              />
              <Button
                primary
                className="bg-gradient h-12"
                text="Thêm chi nhánh"
                onClick={() => setOpenBranch(null)}
              />
            </div>
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
              onSubmit={async (data, fullData) => {
                let fullAddress = {
                  ward: fullData.wardId?.label || openBranch.ward,
                  province: fullData.provinceId?.label || openBranch.province,
                  district: fullData.districtId?.label || openBranch.district,
                  address: data.address || openBranch.address,
                };
                let location = {
                  type: "Point",
                  coordinates: [106.6968302, 10.7797855],
                };
                if ((openBranch && !openBranch.location) || !openBranch) {
                  let res = await HereMapService.getCoordinatesFromAddress(
                    getAddressText(fullAddress)
                  );
                  if (res) {
                    location.coordinates = [res.position.lng, res.position.lat];
                  }
                }
                let newData = {} as Partial<ShopBranch>;
                if (openBranch) {
                  newData = {
                    id: openBranch.id,
                    ...data,
                    location: data.location || location,
                  };
                  console.log(newData);
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
                    name,
                    address,
                    provinceId,
                    wardId,
                    districtId,
                    email,
                    phone,
                    coverImage,
                    activated: true,
                    location,
                  };
                }
                await onCreateOrUpdateBranch(newData);
                setOpenBranch(undefined);
              }}
            >
              <Field name="name" label="Tên chi nhánh" cols={12} required>
                <Input />
              </Field>
              <Field name="phone" label="Số điện thoại" cols={12} required>
                <Input />
              </Field>
              <AddressGroup
                {...openBranch}
                provinceCols={12}
                districtCols={12}
                wardCols={12}
                addressCols={12}
                required
              />
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
