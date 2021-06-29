import React, { useEffect, useState } from "react";
import Menu from "./menu";
import SwitchTabs from "../../../../shared/utilities/tab/switch-tabs";
import { Category } from "../../../../../lib/repo/category.repo";
interface Propstype extends ReactProps {
  cats: Category[];
}
const Menus = ({ cats, ...props }: Propstype) => {
  const food = [
    {
      title: "Combo",
      list: [
        {
          img:
            "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
          name: "Combo Phúc",
          price: 119000,
          sold: 300,
          code: "BNJ432",
          des: "Cơm + trứng + canh",
        },
        {
          img:
            "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
          name: "Combo Lộc",
          price: 119000,
          code: "BNJ432",
          sold: 300,
          des: "Cơm + trứng + canh",
        },
        {
          img:
            "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
          name: "Combo Thọ",
          price: 119000,
          code: "BNJ432",
          sold: 300,
          des: "Cơm + trứng + canh",
        },
        {
          img:
            "https://product.hstatic.net/200000043306/product/combo-tho_75f95928d32648438ac8927bdbdcb06e_grande.png",
          name: "Combo Phúc Lộc Thọ",
          price: 119000,
          code: "BNJ432",
          sold: 300,
          des: "Cơm + trứng + canh",
        },
      ],
    },
    {
      title: "Món Chính",
      list: [
        {
          name: "Cơm Sườn",
          sold: 300,
          code: "BNJ432",
          des: "Cơm + trứng + canh",
          price: 49000,
          img:
            "https://product.hstatic.net/200000043306/product/com-suon_709a902dc1a74a91bd6a087d9b1d599f_grande.png",
        },
        {
          name: "Cơm Ba Rọi",
          sold: 300,
          code: "BNJ432",
          des: "Cơm + trứng + canh",
          price: 49000,
          img:
            "https://product.hstatic.net/200000043306/product/com-suon_709a902dc1a74a91bd6a087d9b1d599f_grande.png",
        },
        {
          name: "Cơm Đùi Gà Nướng Ngũ Vị",
          sold: 300,
          code: "BNJ432",
          des: "Cơm + trứng + canh",
          price: 49000,
          img:
            "https://product.hstatic.net/200000043306/product/com-suon_709a902dc1a74a91bd6a087d9b1d599f_grande.png",
        },
      ],
    },
    {
      title: "Ăn Kèm",
      list: [
        {
          name: "Bì Thịt",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 10000,
          img:
            "https://product.hstatic.net/200000043306/product/bi-thit_435695cc48a949e28a6517191b1c1ef6_grande.png",
        },
        {
          name: "Chả Hấp",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 5000,
          img:
            "https://product.hstatic.net/200000043306/product/ch-fina__74404bb9ae5d4f4b8b793b68110e9f22_grande.png",
        },
        {
          name: "Cơm Thêm",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 49000,
          img:
            "https://product.hstatic.net/200000043306/product/com-them_1abe487dabde4f59bafdc059f9cb0f93_grande_4a293745d8b04657838c143cf18fa4ff_grande.png",
        },
        {
          name: "Ốp La",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 10000,
          img:
            "https://product.hstatic.net/200000043306/product/opla-final_4483e50cf245479888616417dbcc1ed2_grande.png",
        },
      ],
    },
    {
      title: "Canh phần",
      list: [
        {
          name: "Canh rong biển thịt bầm",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/crb-final_e9a087f8ff574c7e98bae5ee7b5be5aa_grande.png",
        },
      ],
    },
    {
      title: "Giải khát",
      list: [
        {
          name: "Tắt xí muội",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/tac-xi-muoi-phuc-loc-tho_b65e3d56cc744dfa9f289ba990c686a3_grande.png",
        },
        {
          name: "Sâm bí đao hạt chia",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/sbd-final_eddf2183c8be41aeb6b28aac9feb00fa_grande.png",
        },
        {
          name: "Coca-cola Tươi",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/coca-cola_4bbc85aac1c54c1ea38d06a2330ac259_grande.png",
        },
      ],
    },
    {
      title: "Cơm phần",
      list: [
        {
          name: "Cơm Cá kho tớp mỡ",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/ca_com_kho_top_mo_837f7121aed046c68e897d874c29bf85_grande.png",
        },
        {
          name: "Cơm chả cá sốt mắm tỏi",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/cha_ca_sot_mam_ca_084883e883ce43ec97c461efb04b3dbf_grande.png",
        },
        {
          name: "Chả cá kho gừng",
          sold: 300,
          code: "BNJ432",
          des: "",
          price: 15000,
          img:
            "https://product.hstatic.net/200000043306/product/com_ga_kho_gung_71fc28c8cafd421c92e41299834ddcf4_grande.png",
        },
      ],
    },
  ];
  const [isViewing, setIsViewing] = useState(0);
  const [isClickView, setIsClickView] = useState(false);
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom / 2 <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  function menuScrollEvent() {
    let scrollCheckInterval = null;
    let menus = document.getElementsByClassName("menu");
    if (!isClickView && menus && menus.length > 0) {
      scrollCheckInterval = setInterval(() => {
        for (let index = 0; index < menus.length; index++) {
          let position = isInViewport(menus[index]);
          if (position) {
            setTimeout(() => {
              setIsViewing(index);
              clearInterval(scrollCheckInterval);
            }, 300);
            break;
          }
        }
      }, 300);
    }
  }
  useEffect(() => {
    document.addEventListener("scroll", menuScrollEvent, {
      passive: true,
    });
    return () => {
      document.removeEventListener("scroll", menuScrollEvent);
    };
  }, []);
  const handleChange = async (index: number) => {
    console.log(index);
    setIsClickView(true);
    setIsViewing(index);
    setTimeout(() => {
      document.getElementsByClassName("menu-container")[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }, 400);
    setTimeout(() => {
      setIsClickView(false);
    }, 300);
  };

  return (
    <>
      <SwitchTabs
        chevron
        value={isViewing}
        className=" sticky top-14 bg-white z-20 shadow-sm"
        native
        options={[
          ...cats.map((item, index) => {
            return { value: index, label: item.name };
          }),
        ]}
        onChange={(val) => handleChange(val)}
      />
      <div className="flex flex-col gap-2 bg-gray-200">
        {cats.map((item: Category, index: number) => (
          <Menu list={item.products} title={item.name} key={index} />
        ))}
      </div>
    </>
  );
};

export default Menus;
