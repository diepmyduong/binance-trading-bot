import { divide } from "lodash";
import Link from "next/link";
import { FaBasketballBall, FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
  const iconSocial = [
    { icon: <FaFacebookSquare />, title: "Facebook" },
    { icon: <FaInstagram />, title: "Instagram" },
    { icon: <FaTwitter />, title: "Twitter" },
    { icon: <FaBasketballBall />, title: "Basketball Ball" },
  ];

  return (
    <footer className={` w-full  min-h-2xs bg-white text-gray-600`}>
      <div className="main-container md:h-60 pt-10 flex flex-col md:flex-row items-start justify-between">
        <div className="flex flex-col items-start w-full md:w-4/12 ">
          <button className="flex items-start md:ml-0">
            <Link href="/">
              <img src="/assets/img/logo.png" className="h-8 p-1" />
            </Link>
          </button>
          <div className="flex items-start justify-center text-xl  pt-3">
            {iconSocial.map((item) => {
              return (
                <i key={item.title} className="mx-2">
                  {item.icon}
                </i>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 w-full md:w-8/12 items-start py-2 text-sm ">
          {menuFooter.map((item) => {
            return (
              <div className="mx-8 pt-4 md:pt-0 flex flex-col" key={item.title}>
                <h1 className="pb-3 font-semibold ">{item.title}</h1>
                {item.submenu.map((subitem) => {
                  return (
                    <Link href={subitem.link} key={subitem.subtitle}>
                      <div className="py-1 text-xs cursor-pointer">{subitem.subtitle}</div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-ellipsis-3 px-2 pt-3">
          Chúng tôi là một “đạo quân” quả cảm với những “chiến binh” mang trong mình những giá trị
          chính trực, tử tế và tích cực. Chúng tôi phối hợp ăn ý trong suốt quá trình từ gặp gỡ đối
          tác, đánh giá phân tích, đưa ra ý tưởng đến hiện thực hoá các bản đề xuất với sự cam kết
          chất lượng cao nhất. Tại 3M Shop, mọi vị trí đều làm việc và cống hiến với tinh thần: Mình
          là một phần quan trọng của dự án, bất kỳ dự án nào khi đã được khách hàng tin tưởng chọn
          3M Shop thực hiện đều là dự án của chính 3M Shop, đều đòi hỏi sự toàn tâm, toàn lực để
          mang đến thành công chung
        </div>
      </div>
    </footer>
  );
}
const menuFooter = [
  {
    title: "Home",
    submenu: [
      { subtitle: "3M Shop", link: "/" },
      { subtitle: "Sản phẩm", link: "/" },
      { subtitle: "Thống kê", link: "/" },
      { subtitle: "Tài khoản", link: "/" },
    ],
  },
  {
    title: "Sản phẩm",
    submenu: [
      { subtitle: "Đia điểm", link: "/" },
      { subtitle: "Sản xuất", link: "/" },
      { subtitle: "Dịch vụ", link: "/" },
      { subtitle: "Hạng mục khác", link: "/" },
    ],
  },
  {
    title: "Thống kê",
    submenu: [
      { subtitle: "Thống kê 2021", link: "/" },
      { subtitle: "Thống kê 2020", link: "/" },
      { subtitle: "Thống kê 2019", link: "/" },
    ],
  },
  {
    title: "Tài khoản",
    submenu: [
      { subtitle: "Đăng nhập", link: "/" },
      { subtitle: "Đăng xuất", link: "/" },
      { subtitle: "Quên mật khẩu", link: "/" },
    ],
  },
];
