import { useEffect, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";
import { DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { FormConsumer } from "../../../shared/utilities/form/form";
import { DataTable } from "../../../shared/utilities/table/data-table";
import cloneDeep from "lodash/cloneDeep";
import { Field } from "../../../shared/utilities/form/field";
import { Input } from "../../../shared/utilities/form/input";
import { Switch } from "../../../shared/utilities/form/switch";
import { Label } from "../../../shared/utilities/form/label";
import { Button } from "../../../shared/utilities/form/button";
import { RiAddLine, RiCloseLine } from "react-icons/ri";

export function ProductToppingTableForm() {
  const toast = useToast();
  return (
    <DataTable.Consumer>
      {({ formItem }) => (
        <>
          <DataTable.Form
            grid
            checkValidation={(data) => {
              if (data.options?.length) {
                for (let option of data.options) {
                  if (!option.name || option.price === null) {
                    toast.info("Cần nhập đầy đủ tên và giá lựa chọn");
                    return false;
                  }
                }
                return true;
              } else {
                toast.info("Cần phải tạo ít nhất một lựa chọn");
                return false;
              }
            }}
            beforeSubmit={(data) => {
              data.options.forEach((option) => delete option.__typename);
              return data;
            }}
          >
            <FormConsumer>
              {({ data, setData }) => (
                <ProductToppingFields data={data} setData={setData} productTopping={formItem} />
              )}
            </FormConsumer>
          </DataTable.Form>
        </>
      )}
    </DataTable.Consumer>
  );
}

function ProductToppingFields({
  productTopping,
  setData,
  data,
  ...props
}: DialogPropsType & { productTopping: ProductTopping; data: any; setData: (val) => any }) {
  const [toppingOptions, setToppingOptions] = useState<ToppingOption[]>(null);

  useEffect(() => {
    setToppingOptions(cloneDeep(productTopping?.options || []));
  }, [productTopping]);

  useEffect(() => {
    if (toppingOptions) {
      setData({ ...data, options: toppingOptions });
    }
  }, [toppingOptions]);

  const onOptionChange = (index, option) => {
    if (toppingOptions) {
      toppingOptions[index] = option;
      setToppingOptions([...toppingOptions]);
    }
  };

  const onRemoveOption = (index) => {
    if (toppingOptions) {
      toppingOptions.splice(index);
      setToppingOptions([...toppingOptions]);
    }
  };

  return (
    <>
      <Field
        name="name"
        description="Đặt tên cụ thể để có thể nhận biết các mẫu topping cùng loại. Ví dụ: Size Trà sữa và Size Sữa tươi"
        label="Tên topping"
        cols={12}
        required
      >
        <Input />
      </Field>
      {productTopping?.id && (
        <>
          <Field
            name="min"
            label="Chọn tối thiểu"
            tooltip="Nhập 0 để không bắt buộc"
            cols={4}
            constraints={{ min: 0 }}
          >
            <Input number suffix="lựa chọn" />
          </Field>
          <Field
            name="max"
            label="Chọn tối đa"
            tooltip="Nhập 0 để không giới hạn"
            cols={4}
            constraints={{ min: 0 }}
          >
            <Input number suffix="lựa chọn" />
          </Field>
          <Field name="required" label=" " cols={4}>
            <Switch placeholder="Bắt buộc" />
          </Field>
          <div className="col-span-12">
            <Label text="Danh sách lựa chọn" />
            {toppingOptions?.map((option, index) => (
              <div
                key={index}
                className="relative flex items-center rounded mb-1 border border-gray-400 pr-3 group hover:border-primary focus-within:border-primary"
              >
                <Input
                  placeholder="Tên lựa chọn"
                  id={`option-name-${index}`}
                  className="flex-1 border-0 no-focus"
                  value={option.name}
                  onChange={(name) => onOptionChange(index, { ...option, name })}
                />
                <Input
                  placeholder="Giá tiền"
                  className="w-32 ml-auto text-danger border-0 no-focus"
                  inputClassName="text-right font-semibold"
                  number
                  currency
                  value={option.price}
                  onChange={(val, price) => onOptionChange(index, { ...option, price })}
                />
                <Button
                  outline
                  unfocusable
                  className="px-0 w-6 h-6 rounded-full absolute -right-3 bg-white opacity-0 group-hover:opacity-100"
                  hoverDanger
                  icon={<RiCloseLine />}
                  iconClassName="text-sm"
                  onClick={() => onRemoveOption(index)}
                />
              </div>
            ))}
            <Button
              outline
              small
              className="rounded-full mt-1"
              icon={<RiAddLine />}
              text="Thêm lựa chọn"
              onClick={() => {
                setToppingOptions([...toppingOptions, { name: "", price: 0, isDefault: false }]);
                setTimeout(() => {
                  let input = document.getElementById(`option-name-${toppingOptions.length}`);
                  if (input) input.focus();
                });
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
