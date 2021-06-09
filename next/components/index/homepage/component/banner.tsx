import { HiChartPie, HiOutlineChevronRight, HiOutlinePlusSm, HiShoppingBag } from "react-icons/hi";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { PictureHomePage } from "../../../../lib/svg";
import { Button } from "../../../shared/utilities/form/button";
import { Img } from "../../../shared/utilities/img";

export function Banner() {
  // const { user } = useAuth();
  return (
    <>
      <div
        className=" w-full relative bg-accent-light text-gray-700 hidden md:block"
        style={{ height: "calc(100vh - 40vh)" }}
      >
        <div className="main-container h-full flex items-center justify-start">
          <div className="flex flex-col text-white ">
            <div className="max-w-xs flex items-center justify-between cursor-pointer bg-primary rounded p-2">
              <div className="flex items-center">
                <Img src="/assets/default/avatar.png" avatar className="w-14" />
                <div className="flex flex-col px-3">
                  <div className="font-bold text-lg">Ninh</div>
                  <div className="text-sm">ID: 123</div>
                </div>
              </div>
              <i className="text-xl">
                <HiOutlineChevronRight />
              </i>
            </div>
            <div className="pt-6 space-x-6">
              <Button
                text="Sản phẩm"
                icon={<HiShoppingBag />}
                textAccent
                outline
                className="bg-white"
              />
              <Button
                text="Thống kê"
                icon={<HiChartPie />}
                textAccent
                outline
                className="bg-white"
              />
              <Button text="Tạo báo giá" icon={<HiOutlinePlusSm />} accent />
            </div>
          </div>
          <div className="w-2/5 hidden lg:block absolute right-10 -bottom-1">
            <PictureHomePage />
          </div>
        </div>
      </div>
      <div className="w-full py-5 px-4 block md:hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full flex flex-col items-center justify-items-center text-white ">
            <div className="w-full max-w-xs flex items-center justify-center cursor-pointer bg-primary rounded p-2">
              <Img src="/assets/default/avatar.png" avatar className="w-14" />
              <div className="flex flex-col px-3">
                <div className="font-bold text-lg">Ninh</div>
                <div className="text-sm">ID: 123123</div>
              </div>
              <i className="text-xl">
                <HiOutlineChevronRight />
              </i>
            </div>
            <div className="pt-5 space-x-6 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <Button
                  icon={<HiShoppingBag />}
                  textAccent
                  outline
                  className="bg-white w-16 h-16 rounded-full text-4xl"
                />
                <p className="text-sm text-gray-700">Sản phẩm</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Button
                  icon={<HiChartPie />}
                  textAccent
                  outline
                  className="bg-white w-16 h-16 rounded-full text-4xl"
                />
                <p className="text-sm text-gray-700">Thống kê</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Button
                  icon={<HiOutlinePlusSm />}
                  accent
                  className=" w-16 h-16 rounded-full text-4xl"
                />{" "}
                <p className="text-sm text-gray-700">Sản phẩm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
