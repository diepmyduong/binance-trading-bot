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
    <div className="py-6 bg-white">
      <div className="">
        <TabButtonGroup>
          <TabButtonGroup.Tab label="Giao hàng">
            <div className="px-4 pt-6 text-sm">
              <Form initialData={initData}>
                <Field label="Tên người nhận" name="name">
                  <Input placeholder="Nhập tên người nhận" />
                </Field>
                <Field label="Số điện thoại" name="phone">
                  <Input type="number" placeholder="Nhập số điện thoại" />
                </Field>
                <Field label="Giao đến" name="address">
                  <Input placeholder="Nhập địa chỉ nhận hàng" />
                </Field>
              </Form>
            </div>
          </TabButtonGroup.Tab>
          <TabButtonGroup.Tab label="Lấy tại quán">
            <div className="px-4 pt-6 text-sm">
              <Form>
                <Field label="Tên người nhận" name="name">
                  <Input placeholder="Nhập tên người nhận" />
                </Field>
                <Field label="Số điện thoại" name="phone">
                  <Input type="number" placeholder="Nhập số điện thoại" />
                </Field>
              </Form>
              <div className="font-bold">Quán chi nhánh 1</div>
              <div className="flex items-start justify-between">
                <p className="">110 Nguyễn Văn Linh, F. Tân Thuận Tây, Quận 7, Hồ Chí Minh</p>
                <Button text="Đổi chi nhánh" textPrimary className="px-0 py-0 min-w-max text-sm" />
              </div>
              <div className="flex items-center justify-between pt-6">
                <p className="">Chọn thời gian lấy:</p>
                <Select
                  options={times.map((item) => ({ value: item, label: item }))}
                  className="w-28"
                />
              </div>
            </div>
          </TabButtonGroup.Tab>
        </TabButtonGroup>
      </div>
    </div>
  );
}
