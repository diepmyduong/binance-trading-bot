import { HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";
import { TabGroup } from "../../shared/utilities/tab/tab-group";
import { Billed } from "./component/billed";

export function OrderPage() {
  const status = ["Đang làm món", "Đang giao", "Đã giao", "Đã hủy"];
  return (
    <div className="w-full">
      <TabGroup>
        <TabGroup.Tab label="Đang làm món">
          {dataBill.map((item, index) => {
            return <Billed item={item} index={index} status="Đang làm món" />;
          })}
        </TabGroup.Tab>
        <TabGroup.Tab label="Đang giao">
          {dataBill.map((item, index) => {
            return <Billed item={item} index={index} status="Đang giao" />;
          })}
        </TabGroup.Tab>
        <TabGroup.Tab label="Đã giao">
          {dataBill.map((item, index) => {
            return <Billed item={item} index={index} status="Đã giao" />;
          })}
        </TabGroup.Tab>
        <TabGroup.Tab label="Đã hủy">
          {dataBill.map((item, index) => {
            return <Billed item={item} index={index} status="Đã hủy" />;
          })}
        </TabGroup.Tab>
      </TabGroup>
    </div>
  );
}
const dataBill = [
  {
    title: "Cộng rau má",
    address: "Tạ Quang Bửu",
    price: 114000,
    count: 3,
  },
  {
    title: "Trà Phúc Long",
    address: "AOE Mall",
    price: 114000,
    count: 3,
  },
  {
    title: "Bắp rang bơ",
    address: "CGV",
    price: 114000,
    count: 3,
  },
  {
    title: "Cộng rau má",
    address: "Tạ Quang Bửu",
    price: 114000,
    count: 3,
  },
  {
    title: "Trà Phúc Long",
    address: "AOE Mall",
    price: 114000,
    count: 3,
  },
  {
    title: "Bắp rang bơ",
    address: "CGV",
    price: 114000,
    count: 3,
  },
  {
    title: "Cộng rau má",
    address: "Tạ Quang Bửu",
    price: 114000,
    count: 3,
  },
  {
    title: "Trà Phúc Long",
    address: "AOE Mall",
    price: 114000,
    count: 3,
  },
  {
    title: "Bắp rang bơ",
    address: "CGV",
    price: 114000,
    count: 3,
  },
  {
    title: "Cộng rau má",
    address: "Tạ Quang Bửu",
    price: 114000,
    count: 3,
  },
  {
    title: "Trà Phúc Long",
    address: "AOE Mall",
    price: 114000,
    count: 3,
  },
  {
    title: "Bắp rang bơ",
    address: "CGV",
    price: 114000,
    count: 3,
  },
];
