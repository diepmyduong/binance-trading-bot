import format from "date-fns/format";
import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";
import {
  RiAddFill,
  RiCheckFill,
  RiCloseFill,
  RiCloseLine,
  RiDeleteBin2Line,
  RiDeleteBin6Line,
  RiEdit2Line,
} from "react-icons/ri";
import { usePaginationQuery } from "../../../../lib/hooks/usePaginationQuery";
import { NumberPipe } from "../../../../lib/pipes/number";
import { useAlert } from "../../../../lib/providers/alert-provider";
import {
  CustomerGroup,
  CustomerGroupResource,
  CustomerGroupService,
} from "../../../../lib/repo/customer-group.repo";
import { CustomerService } from "../../../../lib/repo/customer.repo";
import { DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { NotFound } from "../../../shared/utilities/not-found";
import { Spinner } from "../../../shared/utilities/spinner";
import { ConditionItemDialog, OPERATOR_ICONS, SELECT_OPERATORS } from "./condition-item-dialog";

interface PropsType extends ReactProps {
  customerGroup: CustomerGroup;
  onCustomerGroupChange: (group: CustomerGroup) => any;
  onCustomerGroupUpdate: () => any;
}
export function CustomerGroups({
  customerGroup,
  onCustomerGroupChange,
  onCustomerGroupUpdate,
  ...props
}: PropsType) {
  const { items, loadAll, create, update, deleteOne } = usePaginationQuery(CustomerGroupService);
  const [total, setTotal] = useState(-1);
  const [openCustomerGroup, setOpenCustomerGroup] = useState(undefined);
  const [customerGroupResources, setCustomerGroupResources] = useState<CustomerGroupResource[]>();
  const alert = useAlert();

  const createOrUpdateCustomerGroup = (id: string, data: any) => {
    return id
      ? update(id, data).then((res) => {
          onCustomerGroupUpdate();
          return res;
        })
      : create(data).then((res) => {
          setTimeout(() => {
            const newGroup = items.find((x) => x.id == res.id);
            if (newGroup) onCustomerGroupChange(newGroup);
          });
          return res;
        });
  };

  useEffect(() => {
    loadAll({ limit: 0 });
    CustomerService.getAll({
      query: { limit: 1 },
    }).then((res) => {
      setTotal(res.total);
    });
    CustomerGroupService.getCustomerGroupResource().then((res) => {
      setCustomerGroupResources(res);
      console.log(res);
    });
  }, []);

  if (!items) return <Spinner />;
  return (
    <>
      <div className="border border-gray-300 rounded flex flex-col">
        <div className="bg-gray-50 h-16 flex items-center p-3 border-b border-gray-300 rounded-t">
          <h6 className="font-bold text-gray-600 uppercase">Nhóm khách hàng</h6>
          <Button
            primary
            className="ml-auto px-0 w-12 h-12"
            iconClassName="text-2xl"
            icon={<RiAddFill />}
            tooltip="Thêm nhóm khách hàng"
            onClick={() => {
              setOpenCustomerGroup(null);
            }}
          />
        </div>
        <div className="bg-white flex-1 w-full p-2 flex flex-col gap-y-3">
          {[
            {
              id: null,
              name: "Tất cả",
              summary: total,
            } as CustomerGroup,
            ...items,
          ].map((item) => (
            <div
              className={`p-2 border ${
                (item.id == null && !customerGroup) || item.id == customerGroup?.id
                  ? "bg-primary-light border-primary"
                  : "border-gray-200 hover:border-primary"
              } group flex items-center cursor-pointer transition-colors`}
              onClick={() => {
                onCustomerGroupChange(item.id ? item : null);
              }}
            >
              <div className="flex flex-col flex-1">
                <span
                  className={`font-semibold ${
                    (item.id == null && !customerGroup) || item.id == customerGroup?.id
                      ? "text-primary"
                      : "text-gray-700 group-hover:text-primary"
                  }`}
                >
                  {item.name}
                </span>
                {item.summary >= 0 && (
                  <span className="text-sm text-gray-600">
                    {NumberPipe(item.summary)} khách hàng
                  </span>
                )}
              </div>
              {item.id && (
                <div className="flex ml-auto">
                  <Button
                    className="px-0 w-9"
                    icon={<RiEdit2Line />}
                    tooltip="Chỉnh sửa"
                    onClick={() => {
                      setOpenCustomerGroup(item);
                    }}
                  />
                  <Button
                    hoverDanger
                    className="px-0 w-9"
                    icon={<RiDeleteBin6Line />}
                    tooltip="Xoá"
                    onClick={async () => {
                      await alert.danger(
                        "Xoá nhóm khách hàng",
                        `Nhóm khách hàng "${item.name}" sẽ bị xoá.`,
                        "Xoá nhóm khách hàng",
                        async () => {
                          return deleteOne(item.id)
                            .then((res) => {
                              onCustomerGroupChange(null);
                              return true;
                            })
                            .catch((err) => false);
                        }
                      );
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <CustomerGroupForm
        isOpen={openCustomerGroup !== undefined}
        onClose={() => {
          setOpenCustomerGroup(undefined);
        }}
        customerGroup={openCustomerGroup}
        createOrUpdate={createOrUpdateCustomerGroup}
        customerGroupResources={customerGroupResources}
      />
    </>
  );
}

function CustomerGroupForm({
  customerGroup,
  createOrUpdate,
  customerGroupResources,
  ...props
}: DialogPropsType & {
  customerGroup: CustomerGroup;
  customerGroupResources: CustomerGroupResource[];
  createOrUpdate: (id: string, data: any) => Promise<CustomerGroup>;
}) {
  const [condition, setCondition] = useState<Condition>();
  useEffect(() => {
    if (customerGroup) {
      setCondition(cloneDeep(customerGroup.filter));
    } else {
      setCondition({
        type: "group",
        logical: "$or",
        conditions: [],
      });
    }
  }, [customerGroup]);

  return (
    <>
      <Form
        {...props}
        dialog
        title={`${customerGroup ? "Chỉnh sửa" : "Tạo"} nhóm khách hàng`}
        initialData={customerGroup}
        onSubmit={async (data) => {
          await createOrUpdate(customerGroup?.id, { name: data.name, filter: condition });
          props.onClose();
        }}
        width="1080px"
      >
        <Field name="name" label="Tên nhóm khách hàng" required>
          <Input autoFocus />
        </Field>
        <Label text="Điều kiện nhóm khách hàng" />
        <ConditionGroup
          customerGroupResources={customerGroupResources}
          condition={condition}
          onConditionChange={() => {
            setCondition({ ...condition });
          }}
        />
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
    </>
  );
}

export interface ResourceOptions {
  periodType?: "ALL" | "D" | "W" | "M";
  period?: number;
  transactionType?: string;
  productIds?: string[];
  productGroupIds?: string[];
}

export interface Condition extends ReactProps {
  type?: "group" | "item";
  logical?: "$or" | "$nor" | "$and";
  comparison?: string;
  conditions?: Condition[];
  display?: string;
  resource?: string;
  value?: any;
  resourceOpts?: ResourceOptions;
}

interface ConditionGroupPropsType extends ReactProps {
  customerGroupResources: CustomerGroupResource[];
  condition: Condition;
  onConditionChange: () => any;
  onConditionRemove?: () => any;
}
function ConditionGroup({
  customerGroupResources,
  condition,
  onConditionChange,
  onConditionRemove,
}: ConditionGroupPropsType) {
  const [selectedCondition, setSelectedCondition] = useState<Condition>(null);
  if (!condition || condition.type != "group") return <NotFound text="Chưa có điều kiện" />;
  if (!condition.conditions) condition.conditions = [];

  const removeCondition = (index) => {
    condition.conditions.splice(index, 1);
    onConditionChange();
  };

  return (
    <div className="border-dashed shadow-sm border border-gray-400 p-2 my-6 relative hover:border-primary">
      <div className="border-group rounded absolute -top-4 left-4">
        {CONDITION_LOGICAL_OPTIONS.map((option) => (
          <Button
            key={option.value}
            outline
            small
            tooltip={option.label}
            placement="top"
            className={`px-1 text-xs ${
              condition.logical == option.value
                ? "bg-primary border-primary text-white hover-white"
                : "bg-white"
            }`}
            text={option.value.replace("$", "").toUpperCase()}
            onClick={() => {
              condition.logical = option.value;
              onConditionChange();
            }}
          />
        ))}
      </div>
      {onConditionRemove && (
        <div className="absolute -top-4 right-4">
          <Button
            outline
            small
            tooltip="Xoá nhóm điều kiện"
            placement="top"
            icon={<RiCloseLine />}
            className={`h-9 w-9 px-0 text-xs bg-white rounded-full`}
            onClick={() => {
              onConditionRemove();
            }}
          />
        </div>
      )}
      <div className="p-2">
        {condition.conditions.length == 0 ? (
          <NotFound className="p-3" text="Chưa có điều kiện" />
        ) : (
          condition.conditions.map((item, index) => (
            <div key={index}>
              {item.type == "group" ? (
                <ConditionGroup
                  customerGroupResources={customerGroupResources}
                  condition={item}
                  onConditionChange={onConditionChange}
                  onConditionRemove={() => removeCondition(index)}
                />
              ) : (
                <ConditionItem
                  customerGroupResources={customerGroupResources}
                  condition={item}
                  onConditionChange={(data) => {
                    condition.conditions[index] = data;
                    onConditionChange();
                  }}
                  onConditionRemove={() => removeCondition(index)}
                />
              )}
            </div>
          ))
        )}
      </div>
      <ConditionItemDialog
        isOpen={!!selectedCondition}
        onClose={() => setSelectedCondition(null)}
        condition={selectedCondition}
        customerGroupResources={customerGroupResources}
        onConditionChange={(data) => {
          console.log(condition);
          condition.conditions.push(data);
          onConditionChange();
        }}
      />
      <div className="absolute -bottom-4 left-4">
        <Button
          className="mr-2 bg-white"
          small
          outline
          text="Thêm điều kiện"
          onClick={() => {
            setSelectedCondition({
              resource: "",
            });
          }}
        />
        <Button
          className="bg-white"
          small
          outline
          text="Thêm nhóm điều kiện"
          onClick={() => {
            condition.conditions.push({
              type: "group",
              logical: "$or",
              conditions: [],
            });
            onConditionChange();
          }}
        />
      </div>
    </div>
  );
}

interface ConditionItemPropsType extends ReactProps {
  customerGroupResources: CustomerGroupResource[];
  condition: Condition;
  onConditionChange: (data) => any;
  onConditionRemove?: () => any;
}
function ConditionItem({
  customerGroupResources,
  condition,
  onConditionChange,
  onConditionRemove,
}: ConditionItemPropsType) {
  const [selectedCondition, setSelectedCondition] = useState<Condition>(null);
  const [resource, setResource] = useState<CustomerGroupResource>();

  useEffect(() => {
    if (customerGroupResources) {
      setResource(customerGroupResources.find((x) => x.id == condition.resource));
    }
  }, [customerGroupResources]);

  if (!customerGroupResources || !resource) return null;
  return (
    <div
      className="flex justify-between items-center my-4 rounded border border-l-0 cursor-pointer group border-gray-400 hover:border-primary"
      onClick={() => {
        setSelectedCondition(condition);
      }}
    >
      <div className="min-h-10 flex items-center p-3 pl-5 border-l-8 border-gray-400 group-hover:border-primary font-semibold text-gray-600 group-hover:text-gray-800">
        <span>{resource?.name}</span>
        {resource.type == "text" && (
          <>
            <span className="px-1 underline">bắt đầu hoặc chứa cụm từ</span>
            <span>{condition.value}</span>
          </>
        )}
        {resource.type == "number" && (
          <>
            <i className="px-2 text-gray-500 text-sm">{OPERATOR_ICONS[condition.comparison]}</i>
            <span>{NumberPipe(condition.value)}</span>
          </>
        )}
        {(resource.type == "select" || resource.type == "ref-multi") && (
          <>
            <span className="px-1 underline">
              {SELECT_OPERATORS.find((x) => x.value == condition.comparison)?.label}
            </span>
            <span>{condition.display}</span>
          </>
        )}
        {resource.type == "boolean" && (
          <>
            {condition.value ? (
              <span className="text-success font-semibold flex items-center gap-x-0.5 underline pl-3">
                <i>
                  <RiCheckFill />
                </i>
                Bật
              </span>
            ) : (
              <span className="text-warning font-semibold flex items-center gap-x-0.5 underline pl-3">
                <RiCloseFill />
                <i></i>Tắt
              </span>
            )}
          </>
        )}
        {resource.type == "date" && (
          <>
            <span className="px-1 underline">vào</span>
            <span>
              {condition.resourceOpts.periodType == "D"
                ? condition.resourceOpts.period + " ngày sau"
                : format(new Date(condition.value), "dd-MM-yyyy")}
            </span>
          </>
        )}
        {resource.type == "address" && (
          <>
            <span className="px-1 underline">thuộc</span>
            <span>{condition.display}</span>
          </>
        )}
      </div>
      <div>
        <Button
          icon={<RiDeleteBin2Line />}
          tooltip="Xoá điều kiện"
          placement="top"
          onClick={(e) => {
            e.stopPropagation();
            onConditionRemove();
          }}
        />
      </div>
      <ConditionItemDialog
        customerGroupResources={customerGroupResources}
        condition={selectedCondition}
        isOpen={!!selectedCondition}
        onClose={() => setSelectedCondition(null)}
        onConditionChange={(data) => {
          onConditionChange({ ...condition, ...data });
        }}
      />
    </div>
  );
}

export const CONDITION_LOGICALS = {
  $or: "Thoả 1 trong các điều kiện sau",
  $and: "Thoả tất cả điều kiện sau",
  $nor: "Không thoả 1 trong các điều kiện sau",
};
export const CONDITION_LOGICAL_OPTIONS: Option[] = Object.keys(CONDITION_LOGICALS).map((k) => ({
  label: CONDITION_LOGICALS[k],
  value: k,
}));
