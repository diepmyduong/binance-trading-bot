import { HiChevronRight } from "react-icons/hi";
import { NumberPipe } from "../../../lib/pipes/number";
import { Button } from "../../shared/utilities/form/button";
import { Billed } from "./component/billed";

export function OrderPage() {
  return (
    <div className="w-full">
      {dataBill.map((item, index) => {
        return <Billed item={item} index={index} />;
      })}
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
