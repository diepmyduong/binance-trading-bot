import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";

import {
  FaEquals,
  FaGreaterThan,
  FaGreaterThanEqual,
  FaLessThan,
  FaLessThanEqual,
  FaNotEqual,
} from "react-icons/fa";
import { useToast } from "../../../../lib/providers/toast-provider";
import { AddressService } from "../../../../lib/repo/address.repo";
import { CrudRepository } from "../../../../lib/repo/crud.repo";
import { CustomerGroupResource } from "../../../../lib/repo/customer-group.repo";
import { DatePicker } from "../../../shared/utilities/form/date";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormPropsType } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";
import { Condition } from "./customer-groups";

interface PropsType extends FormPropsType {
  customerGroupResources: CustomerGroupResource[];
  condition?: Condition;
  onConditionChange?: (data: any) => any;
}
export function ConditionItemDialog({
  customerGroupResources,
  onConditionChange,
  ...props
}: PropsType) {
  const [condition, setCondition] = useState<Condition>();
  const [selectedResource, setSelectedResource] = useState<CustomerGroupResource>(null);
  let [display, setDisplay] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (customerGroupResources) {
      if (props.condition) {
        setCondition(cloneDeep(props.condition));
        setDisplay(props.condition.display);
        setSelectedResource(
          customerGroupResources.find((x) => x.id == props.condition.resource) ||
            customerGroupResources[0]
        );
      } else {
        setCondition({});
        setDisplay("");
        setSelectedResource(customerGroupResources[0]);
      }
    }
  }, [props.condition, customerGroupResources]);

  useEffect(() => {
    if (selectedResource) {
      console.log(selectedResource);
      if (selectedResource.id == props.condition?.resource) {
        setCondition(cloneDeep(props.condition));
      } else {
        let value, resourceOpts, comparison;
        switch (selectedResource.type) {
          case "text":
          case "select":
          case "ref-multi": {
            value = "";
            comparison = SELECT_OPERATORS[0].value;
            break;
          }
          case "number": {
            value = 0;
            comparison = NUMBER_OPERATORS[0].value;
            break;
          }
          case "date": {
            value = null;
            resourceOpts = { periodType: "ALL", period: null };
            break;
          }
          case "boolean": {
            value = true;
            break;
          }
          case "address": {
            value = {
              provinceId: "",
              districtId: "",
              wardId: "",
            };
            break;
          }
        }
        setCondition({
          ...condition,
          resource: selectedResource.id,
          value,
          resourceOpts,
          comparison,
        });
      }
    } else {
      setSelectedResource(customerGroupResources[0]);
    }
  }, [selectedResource]);

  useEffect(() => {
    if (!condition?.resource) {
      setSelectedResource({ ...customerGroupResources[0] });
    }
  }, [condition]);

  const [districtOptions, setDistrictOptions] = useState<Option[]>();
  const [wardOptions, setWardOptions] = useState<Option[]>();

  useEffect(() => {
    if (condition?.value?.provinceId != props.condition?.value?.provinceId) {
      setCondition({
        ...condition,
        value: { ...condition.value, districtId: "", district: "", wardId: "", ward: "" },
      });
    }
    if (condition?.value?.provinceId) {
      AddressService.getDistricts(condition.value.provinceId).then((res) => {
        setDistrictOptions(res.map((x) => ({ value: x.id, label: x.district })));
      });
    } else {
      setDistrictOptions([]);
      setWardOptions([]);
    }
  }, [condition?.value?.provinceId]);

  useEffect(() => {
    if (condition?.value?.districtId != props.condition?.value?.districtId) {
      setCondition({ ...condition, value: { ...condition.value, wardId: "", ward: "" } });
    }
    if (condition?.value?.districtId) {
      AddressService.getWards(condition?.value?.districtId).then((res) => {
        setWardOptions(res.map((x) => ({ value: x.id, label: x.ward })));
      });
    } else {
      setWardOptions([]);
    }
  }, [condition?.value?.districtId]);

  if (!customerGroupResources || !selectedResource || !condition) return null;
  return (
    <Form
      {...props}
      dialog
      disableDialogCloseAlert
      title={props.condition ? "Chỉnh sửa điều kiện" : "Thêm điều kiện"}
      width="920px"
      initialData={condition}
      onSubmit={(data, fullData) => {
        if (!selectedResource) {
          toast.info("Bắt buộc chọn điều kiện");
          return;
        }
        switch (selectedResource.type) {
          case "text": {
            if (!condition.value) {
              toast.info("Bắt buộc nhập ký tự hoặc cụm từ");
              return;
            }
            display = "";
            break;
          }
          case "number":
          case "select":
          case "ref-multi": {
            if (!condition.comparison) {
              toast.info("Bắt buộc nhập so sánh");
              return;
            }
            if (!condition.value) {
              toast.info(`Bắt buộc ${selectedResource.type == "number" ? "nhập" : "chọn"} giá trị`);
              return;
            }
            break;
          }
          case "date": {
            if (!condition.resourceOpts.periodType) {
              toast.info("Bắt buộc chọn loại ngày");
              return;
            }
            if (!condition.value) {
              toast.info("Bắt buộc nhập ngày");
              return;
            }
            display = "";
            break;
          }
          case "address": {
            if (!condition.value.provinceId) {
              toast.info("Bắt buộc phải có ít nhất Tỉnh/Thành");
              return;
            }
            console.log([condition.value.ward, condition.value.district, condition.value.province]);
            display = [condition.value.ward, condition.value.district, condition.value.province]
              .filter(Boolean)
              .join(", ");
            break;
          }
        }
        console.log({
          ...data,
          ...condition,
          display,
        });
        onConditionChange({
          ...data,
          ...condition,
          display,
        });
        props.onClose();
      }}
    >
      {condition && selectedResource && (
        <>
          <div className="flex flex-wrap">
            <Field className="w-80 mr-2" label="Loại điều kiện" required>
              <Select
                options={customerGroupResources.map((x) => ({ value: x.id, label: x.name }))}
                value={condition.resource}
                onChange={(val) =>
                  setSelectedResource(customerGroupResources.find((x) => x.id == val))
                }
              />
            </Field>
            {selectedResource.type == "text" && (
              <>
                <Field label=" ">
                  <div className="h-10 flex items-center mr-2 text-gray-700">Bắt đầu hoặc chứa</div>
                </Field>
                <Field className="w-72 mr-2" label="Cụm từ" required>
                  <Input
                    value={condition.value}
                    onChange={(value) =>
                      setCondition({ ...condition, comparison: "$regex", value })
                    }
                  />
                </Field>
              </>
            )}
            {selectedResource.type == "number" && (
              <>
                <Field className="w-56 mr-2" label="So sánh">
                  <Select
                    options={NUMBER_OPERATORS}
                    value={condition.comparison}
                    onChange={(comparison) => setCondition({ ...condition, comparison })}
                  />
                </Field>
                <Field className="w-72 mr-2" label="Giá trị" required>
                  <Input
                    number
                    value={condition.value}
                    onChange={(value, extraVal) => setCondition({ ...condition, value: extraVal })}
                  />
                </Field>
              </>
            )}
            {selectedResource.type == "select" && (
              <>
                <Field className="w-56 mr-2" label="So sánh">
                  <Select
                    options={SELECT_OPERATORS}
                    value={condition.comparison}
                    onChange={(comparison) => setCondition({ ...condition, comparison })}
                  />
                </Field>
                <Field className="w-72 mr-2" label="Giá trị" required>
                  <Select
                    options={selectedResource.meta.options.map((x) => ({
                      value: x.id,
                      label: x.name,
                    }))}
                    value={condition.value}
                    onChange={(value, extraVal) => {
                      setCondition({ ...condition, value });
                      setDisplay(extraVal.label);
                    }}
                  />
                </Field>
              </>
            )}
            {selectedResource.type == "boolean" && (
              <>
                <Field className="w-56 mr-2" label="Trạng thái" required>
                  <Switch
                    value={condition.value}
                    onChange={(value) => setCondition({ ...condition, value })}
                  />
                </Field>
              </>
            )}
            {selectedResource.type == "date" && condition.resourceOpts && (
              <>
                <Field className="w-40 mr-2" label=" ">
                  <Select
                    value={condition.resourceOpts.periodType == "ALL" ? "static" : "dynamic"}
                    onChange={(val) => {
                      setCondition({
                        ...condition,
                        resourceOpts: {
                          ...condition.resourceOpts,
                          periodType: val == "static" ? "ALL" : "D",
                        },
                      });
                    }}
                    options={DATE_OPTIONS}
                  />
                </Field>
                {condition.resourceOpts.periodType == "ALL" ? (
                  <Field className="w-56" label="Giá trị">
                    <DatePicker
                      value={condition.value}
                      onChange={(value, extraVal) => setCondition({ ...condition, value })}
                    />
                  </Field>
                ) : (
                  <Field className="w-72" name="datePeriod" label="Giá trị">
                    <Input
                      value={condition.resourceOpts.period}
                      onChange={(extraVal) => {
                        setCondition({
                          ...condition,
                          resourceOpts: { ...condition.resourceOpts, period: extraVal },
                        });
                      }}
                      number
                      suffix="ngày"
                    />
                  </Field>
                )}
              </>
            )}
            {selectedResource.type == "ref-multi" && (
              <>
                <Field className="w-56 mr-2" label="So sánh">
                  <Select
                    options={SELECT_OPERATORS}
                    value={condition.comparison}
                    onChange={(comparison) => setCondition({ ...condition, comparison })}
                  />
                </Field>
                <Field className="w-72 mr-2" label="Giá trị" required>
                  <Select
                    optionsPromise={() =>
                      (({}[selectedResource.meta.ref] as CrudRepository<any>).getAllOptionsPromise({
                        fragment: `${selectedResource.meta.id} ${selectedResource.meta.name}`,
                        parseOption: (data) => ({
                          value: data[selectedResource.meta.id],
                          label: data[selectedResource.meta.name],
                        }),
                      }))
                    }
                    value={condition.value}
                    onChange={(value, extraVal) => {
                      setCondition({ ...condition, value });
                      setDisplay(extraVal.label);
                    }}
                  />
                </Field>
              </>
            )}
            {selectedResource.type == "address" && (
              <>
                <Field className="flex-1 mr-2" label="Tỉnh/Thành" required>
                  <Select
                    optionsPromise={() =>
                      AddressService.getProvinces().then((res) =>
                        res.map((x) => ({ value: x.id, label: x.province }))
                      )
                    }
                    value={condition.value?.provinceId}
                    onChange={(val, extraVal) => {
                      setCondition({
                        ...condition,
                        value: { ...condition.value, provinceId: val, province: extraVal?.label },
                      });
                    }}
                  ></Select>
                </Field>
                <Field className="flex-1 mr-2" label="Quận/Huyện">
                  <Select
                    readonly={!condition.value?.provinceId}
                    options={districtOptions}
                    value={condition.value?.districtId}
                    onChange={(val, extraVal) => {
                      setCondition({
                        ...condition,
                        value: { ...condition.value, districtId: val, district: extraVal?.label },
                      });
                    }}
                  ></Select>
                </Field>
                <Field className="flex-1" label="Phường/Xã">
                  <Select
                    readonly={!condition.value?.districtId}
                    options={wardOptions}
                    value={condition.value?.wardId}
                    onChange={(val, extraVal) => {
                      setCondition({
                        ...condition,
                        value: { ...condition.value, wardId: val, ward: extraVal?.label },
                      });
                    }}
                  ></Select>
                </Field>
              </>
            )}
          </div>
        </>
      )}
      <Form.Footer>
        <Form.ButtonGroup preventDefaultSubmit />
      </Form.Footer>
    </Form>
  );
}

export const OPERATOR_ICONS = {
  $eq: <FaEquals />,
  $ne: <FaNotEqual />,
  $lt: <FaLessThan />,
  $lte: <FaLessThanEqual />,
  $gt: <FaGreaterThan />,
  $gte: <FaGreaterThanEqual />,
};

export const NUMBER_OPERATORS: Option[] = [
  { value: "$lt", label: "< (Nhỏ hơn)" },
  { value: "$lte", label: "≤ (Nhỏ hơn hoặc bằng)" },
  { value: "$gt", label: "> (Lớn hơn)" },
  { value: "$gte", label: "≥ (Lớn hơn hoặc bằng)" },
  { value: "$eq", label: "= (Bằng)" },
  { value: "$ne", label: "≠ (Khác)" },
];

export const SELECT_OPERATORS: Option[] = [
  { value: "$eq", label: "Là" },
  { value: "$ne", label: "Không là" },
];

export const DATE_OPTIONS: Option[] = [
  { value: "static", label: "Ngày cố định" },
  { value: "dynamic", label: "Ngày động" },
];

export const PERIOD_OPTIONS: Option[] = [
  { value: "D", label: "Ngày" },
  { value: "W", label: "Tuần" },
  { value: "M", label: "Tháng" },
];
