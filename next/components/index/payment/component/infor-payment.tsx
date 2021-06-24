import { useEffect, useState } from "react";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { TabButtonGroup } from "../../../shared/utilities/tab-button-group/tab-button-group";

export function InforPayment() {
  const initData = {
    name: "Nguyễn Văn A",
    phone: "0869698360",
    address: "749 Nguyễn Văn Linh Quận 7 TPHCM ",
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [times, setTimes] = useState([]);
  const generateTime = () => {
    var today = new Date();
    var time = today.getHours();
    var halfHours = ["00", "30"];
    var timess = [];
    for (var i = time; i < 24; i++) {
      for (var j = 0; j < 2; j++) {
        timess.push(i + ":" + halfHours[j]);
      }
    }
    setTimes(timess);
  };
  useEffect(() => {
    generateTime();
  }, []);
  return (
    <div className="pt-4 bg-white">
      <div className="">
        <TabCustom
          tab={["Giao hàng", "Lấy tại quán"]}
          onChange={(index) => {
            setSelectedIndex(index);
          }}
        />
        <div className="px-4 pt-6 text-sm">
          <Form initialData={initData}>
            <Field label="Tên người nhận" name="name">
              <Input placeholder="Nhập tên người nhận" />
            </Field>
            <Field label="Số điện thoại" name="phone">
              <Input type="number" placeholder="Nhập số điện thoại" />
            </Field>

            {selectedIndex == 0 ? (
              <Field label="Giao đến" name="address">
                <Input type="text" placeholder="Nhập Địa chỉ giao đến" />
              </Field>
            ) : (
              <div className="pb-4">
                <div className="font-bold">Quán chi nhánh 1</div>
                <div className="flex items-start justify-between">
                  <p className="">110 Nguyễn Văn Linh, F. Tân Thuận Tây, Quận 7, Hồ Chí Minh</p>
                  <Button
                    text="Đổi chi nhánh"
                    textPrimary
                    className="px-0 py-0 min-w-max text-sm"
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <p className="">Chọn thời gian lấy:</p>
                  <Select
                    options={times.map((item) => ({ value: item, label: item }))}
                    className="w-28"
                  />
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
interface PropType extends ReactProps {
  onChange: (number) => void;
  tab: string[];
}
const TabCustom = ({ onChange, tab }: PropType) => {
  const [selected, setSelected] = useState(0);
  const handleClick = (index) => {
    setSelected(index);
    onChange(index);
  };
  return (
    <div className="relative flex items-center justify-center">
      {tab.map((item, index) => {
        const selectedIndex = index == selected;
        const last = index == tab.length - 1;
        const first = index == 0;
        return (
          <div
            className={`w-32 text-sm cursor-pointer flex justify-center items-center py-1 px-1 rounded border border-gray-400 
            ${last && "rounded-l-none border-l-0 "}
            ${first && "rounded-r-none border-r-0 "}  
            ${selectedIndex ? " text-white bg-primary " : "text-gray-500"}
            `}
            key={index}
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
