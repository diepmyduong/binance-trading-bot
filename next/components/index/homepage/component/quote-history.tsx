import { useEffect, useState } from "react";
import { HiArrowNarrowRight, HiOutlineChevronDown } from "react-icons/hi";

import { NumberPipe } from "../../../../lib/pipes/number";
import { Accordion } from "../../../shared/utilities/accordion/accordion";
import { Button } from "../../../shared/utilities/form/button";
import { Label } from "../../../shared/utilities/form/label";
import { TabGroup } from "../../../shared/utilities/tab/tab-group";
import { WIP } from "../../../shared/utilities/wip";

export function QuoteHistory() {
  return (
    <div className="w-full bg-white">
      <div className="flex w-full flex-col items-center justify-center pt-4 md:pt-16 ">
        <div className="">
          <Label text="Lịch sử báo giá" className="uppercase text-sm font-bold md:text-xl" />
        </div>
        <div className="w-full pt-2 md:pt-6">
          <TabGroup bodyClassName="mt-2">
            <TabGroup.Tab label="Báo giá của tôi (32)">
              <QuoteHistoryinMonth />
            </TabGroup.Tab>
            <TabGroup.Tab label="Tất cả báo giá (523)">
              <WIP />
            </TabGroup.Tab>
          </TabGroup>
        </div>
      </div>
    </div>
  );
}
export function QuoteHistoryinMonth() {
  const [data, setData] = useState(Data);
  useEffect(() => {
    setData([...Data]);
  }, []);
  return (
    <div className="w-full flex-col flex items-center justify-center px-4">
      <div className="md:w-4/5 pt-4 w-full flex flex-col items-center justify-center text-primary">
        {data.map((item, ind) => {
          let firstChild = ind == 0;
          return (
            <div
              className={`w-full  shadow-md   border-purple-400  ${
                !firstChild ? " border " : " border-l border-t border-r"
              }`}
            >
              <div
                className="w-full sticky top-12 flex items-center p-4 px-4 bg-primary-light cursor-pointer z-100"
                onClick={() => {
                  data[ind].opened = !data[ind].opened;
                  setData([...data]);
                }}
              >
                <div className="uppercase text-sm font-bold">Tháng {item.month}</div>
                <i
                  className={` ml-2 transition-all duration-300 transform ${
                    item.opened && " rotate-180 "
                  }`}
                >
                  <HiOutlineChevronDown />
                </i>
              </div>
              <Accordion isOpen={item.opened}>
                <div className=" flex flex-col items-center bg-white z-10">
                  {item.data.map((subItem, index) => {
                    let lastChild = item.data.length - 1 == index;
                    return (
                      <div className="w-full px-4 hover:bg-purple-50">
                        <div
                          key={index}
                          className={` flex items-center py-2  ${
                            !lastChild && " border-b border-purple-200 "
                          }`}
                        >
                          <div className="md:w-16 md:h-16 p-2 bg-primary flex flex-col items-center justify-center rounded-lg text-sm md:text-xl text-white">
                            <div className="">Ngày</div>
                            <div className="font-bold">{subItem.date}</div>
                          </div>
                          <div className="flex flex-1 flex-col md:flex-row md:items-center items-start md:justify-between px-2 text-sm">
                            <div className="text-gray-600">{subItem.title}</div>
                            <div className="font-bold text-accent mx-2">
                              {NumberPipe(subItem.price)}đ
                            </div>
                            <i className="text-2xl text-gray-500 ml-2 hidden md:block cursor-pointer">
                              <HiArrowNarrowRight />
                            </i>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Accordion>
            </div>
          );
        })}
      </div>
      <div className="w-full flex items-center justify-center py-6">
        <Button text="Xem thêm" textAccent small />
      </div>
    </div>
  );
}

const Data = [
  {
    month: "5/2021",
    opened: true,
    data: [
      {
        date: 29,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 30,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 26,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 24,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 21,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
    ],
  },
  {
    month: "4/2021",
    opened: true,
    data: [
      {
        date: 29,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 30,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 26,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 24,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
      {
        date: 21,
        title: "VIFA GU 2021 - Triển lãm phong cách nội thất Việt Nam",
        price: 22520000,
      },
    ],
  },
];
