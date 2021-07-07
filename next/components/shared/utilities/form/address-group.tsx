import { useEffect, useState } from "react";
import { AddressService } from "../../../../lib/repo/address.repo";
import { Field } from "./field";
import { Input } from "./input";
import { Select } from "./select";

interface PropsType extends ReactProps {
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  provinceCols?: Cols;
  districtCols?: Cols;
  wardCols?: Cols;
  addressCols?: Cols;
  required?: boolean;
}

export function AddressGroup({ required = false, ...props }: PropsType) {
  const [provinceId, setProvinceId] = useState(props.provinceId || "");
  const [districtId, setDistrictId] = useState(props.districtId || "");
  const [wardId, setWardId] = useState(props.wardId || "");
  const [districtOptions, setDistrictOptions] = useState<Option[]>();
  const [wardOptions, setWardOptions] = useState<Option[]>();
  useEffect(() => {
    if (districtOptions) {
      setDistrictId("");
      setWardId("");
    }
    if (provinceId) {
      AddressService.getDistricts(provinceId).then((res) =>
        setDistrictOptions(res.map((x) => ({ value: x.id, label: x.district })))
      );
    } else {
      setDistrictOptions([]);
    }
  }, [provinceId]);
  useEffect(() => {
    if (wardOptions) {
      setWardId("");
    }
    if (districtId) {
      AddressService.getWards(districtId).then((res) =>
        setWardOptions(res.map((x) => ({ value: x.id, label: x.ward })))
      );
    } else {
      setWardOptions([]);
    }
  }, [districtId]);

  return (
    <>
      <Field label="Tỉnh/Thành" name="provinceId" cols={props.provinceCols} required={required}>
        <Select
          optionsPromise={() =>
            AddressService.getProvinces().then((res) =>
              res.map((x) => ({ value: x.id, label: x.province }))
            )
          }
          value={provinceId}
          onChange={(val, option) => {
            setProvinceId(val);
          }}
        ></Select>
      </Field>
      <Field label="Quận/Huyện" name="districtId" cols={props.districtCols} required={required}>
        <Select
          readonly={!provinceId}
          options={districtOptions}
          value={districtId}
          onChange={(val) => {
            setDistrictId(val);
          }}
        ></Select>
      </Field>
      <Field label="Phường/Xã" name="wardId" cols={props.wardCols} required={required}>
        <Select readonly={!districtId} value={wardId} options={wardOptions}></Select>
      </Field>
      <Field
        label="Địa chỉ (Số nhà, Đường)"
        name="address"
        required={required}
        cols={props.addressCols}
      >
        <Input />
      </Field>
    </>
  );
}
