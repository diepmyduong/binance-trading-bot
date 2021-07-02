import { useEffect, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ProductTopping, ToppingOption } from "../../../../lib/repo/product-topping.repo";
import { DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Form, FormConsumer } from "../../../shared/utilities/form/form";
import { DataTable } from "../../../shared/utilities/table/data-table";
import cloneDeep from "lodash/cloneDeep";
import { Field } from "../../../shared/utilities/form/field";
import { Input } from "../../../shared/utilities/form/input";
import { Switch } from "../../../shared/utilities/form/switch";
import { Label } from "../../../shared/utilities/form/label";
import { Button } from "../../../shared/utilities/form/button";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import isEqual from "lodash/isEqual";

export function ProductToppingTableForm() {
  const toast = useToast();
  return (
    <DataTable.Consumer>
      {({ formItem }) => (
        <>
          <DataTable.Form
            extraDialogClass="bg-transparent"
            extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300"
            extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
            saveButtonGroupProps={{
              className: "justify-center",
              submitProps: { className: "bg-gradient h-14 w-64" },
              cancelText: "",
              submitText: `${formItem?.id ? "Chỉnh sửa" : "Thêm"} món`,
            }}
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
                if (formItem?.id) {
                  toast.info("Cần phải tạo ít nhất một lựa chọn");
                  return false;
                }
              }
              return true;
            }}
            beforeSubmit={(data) => {
              const { name, min, max, required, options } = data;
              return formItem?.id
                ? {
                    name,
                    min,
                    max,
                    required,
                    options: options.map((x) => ({ name: x.name, price: x.price })),
                  }
                : { name };
            }}
          >
            <FormConsumer>
              {({ data, setData }) => (
                <ProductToppingFields
                  productTopping={formItem}
                  onChange={(productTopping) => setData({ ...data, ...productTopping })}
                />
              )}
            </FormConsumer>
          </DataTable.Form>
        </>
      )}
    </DataTable.Consumer>
  );
}

export function ProductToppingFields({
  productTopping,
  onChange,
  hasDescription = false,
  ...props
}: DialogPropsType & {
  productTopping: ProductTopping;
  onChange: (productTopping: ProductTopping) => any;
  hasDescription?: boolean;
}) {
  const [toppingOptions, setToppingOptions] = useState<ToppingOption[]>(null);
  const [name, setName] = useState("");
  const [min, setMin] = useState<number>(null);
  const [max, setMax] = useState<number>(null);
  const [required, setRequired] = useState<boolean>(false);
  const [loadDone, setLoadDone] = useState(false);

  useEffect(() => {
    if (productTopping) {
      setLoadDone(false);
      setToppingOptions(cloneDeep(productTopping.options));
      setName(productTopping.name);
      setMin(productTopping.min);
      setMax(productTopping.max);
      setRequired(productTopping.required);
      setLoadDone(true);
    }
  }, [productTopping]);

  useEffect(() => {
    if (productTopping && loadDone) {
      const newProductTopping = {
        ...productTopping,
        name,
        min,
        max,
        required,
        options: toppingOptions,
      };
      if (!isEqual(productTopping, newProductTopping)) onChange(newProductTopping);
    }
  }, [toppingOptions, name, min, max, required]);

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
        description={
          hasDescription &&
          "Đặt tên cụ thể để có thể nhận biết các mẫu topping cùng loại. Ví dụ: Size Trà sữa và Size Sữa tươi"
        }
        label="Tên topping"
        cols={12}
        required
      >
        <Input value={name} onChange={setName} />
      </Field>
      {productTopping?.id && (
        <>
          <Field
            label="Chọn tối thiểu"
            tooltip="Nhập 0 để không bắt buộc"
            cols={4}
            constraints={{ min: 0 }}
          >
            <Input number suffix="lựa chọn" value={min} onChange={(val, min) => setMin(min)} />
          </Field>
          <Field
            label="Chọn tối đa"
            tooltip="Nhập 0 để không giới hạn"
            cols={4}
            constraints={{ min: 0 }}
          >
            <Input number suffix="lựa chọn" value={max} onChange={(val, max) => setMax(max)} />
          </Field>
          <Field label=" " cols={4}>
            <Switch
              placeholder="Bắt buộc"
              value={required}
              onChange={(required) => setRequired(required)}
            />
          </Field>
          <div className="col-span-12 mb-3">
            <Label text="Danh sách lựa chọn" />
            <div className="border-vertical-group rounded">
              {toppingOptions?.map((option, index) => (
                <div
                  key={index}
                  className="relative flex items-center rounded border border-gray-400 group hover:border-primary focus-within:border-primary"
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
                    className="w-48 ml-auto text-danger border-0 no-focus pr-3"
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
                className="w-full bg-white"
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
          </div>
        </>
      )}
    </>
  );
}
