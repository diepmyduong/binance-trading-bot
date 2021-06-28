import React, { useEffect, useState } from "react";
import { HiDocumentDuplicate, HiOutlineMail, HiPlus, HiTrash } from "react-icons/hi";
import { useAlert } from "../../../../../lib/providers/alert-provider";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Email, EmailType } from "../../../../../lib/repo/email.repo";
import { Button } from "../../../../shared/utilities/form/button";
import { Spinner } from "../../../../shared/utilities/spinner";
import { useEmailContext } from "../providers/email-provider";
import { FormEmail } from "./form-email";

export function ListEmailPage(props) {
  const {
    emails,
    selectEmail,
    email,
    updateEmail,
    duplicate,
    deleteEmail,
    createEmail,
  } = useEmailContext();
  const toast = useToast();
  const alert = useAlert();
  let [listEmailDefault, setListEmailDefault] = useState([]);
  let [listEmailCustom, setListEmailCustom] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const cloneData = () => {
    if (!email) return null;
    return {
      name: email.name,
      subject: email.subject,
      html: email.html,
      design: email.design,
    };
  };

  let [data, setData] = useState(cloneData());
  useEffect(() => {
    setData(cloneData());
  }, [email]);
  useEffect(() => {
    if (emails) {
      listEmailCustom = emails.filter((e) => e.type == EmailType.CUSTOM);
      listEmailDefault = emails.filter((e) => e.type != EmailType.CUSTOM);
      setListEmailCustom(listEmailCustom);
      setListEmailDefault(listEmailDefault);
    }
  }, [emails]);
  const handleCreateMail = () => {
    createEmail()
      .then((res) => {
        toast.success("Tạo mail mẫu thành công");
      })
      .catch((err) => {
        toast.error("Lỗi tạo mail mẫu. ");
      });
  };
  const handleDeleteMail = async (idMail) => {
    const confirm = await alert.question("Xác nhận xóa", "Bạn có chắc chắn xóa Email mẫu này?");
    if (confirm) {
      deleteEmail(idMail)
        .then((res) => {
          toast.success("Xóa email mẫu thành công");
          if (emails.length > 0) setSelectedEmail(emails[0].id);
        })
        .catch((err) => {
          toast.error("Xóa email mẫu bị lỗi");
        });
    }
  };
  const handleDuplicateMail = async (email: Email) => {
    console.log("email", email);
    const confirm = await alert.question(
      "Xác nhận nhân bản Email",
      "Bạn có chắc chắn muốn nhân bản Email mẫu này?"
    );
    if (confirm) {
      duplicate(email)
        .then((res) => {
          toast.success("Nhân bản mail thành công");
        })
        .catch((err) => {
          toast.error("Nhân bản mail bị lỗi");
        });
    }
  };
  if (!emails) return <Spinner />;
  console.log(listEmailDefault);
  return (
    <>
      <div className="grid grid-cols-3 w-full h-full" style={{ height: "calc(100vh - 105px)" }}>
        <div className="relative">
          <div
            className="flex flex-col w-full h-full relative space-y-2 py-4 v-scrollbar overflow-auto col-span-1 border-r-2 "
            style={{ height: "calc(100vh - 130px)" }}
          >
            <div className="text-sm px-4  font-semibold text-gray-600">Email Mặc Định</div>
            <div className=" ">
              {listEmailDefault.length > 0 ? (
                listEmailDefault.map((item, index) => (
                  <div
                    key={index}
                    className={
                      " py-2 px-6 cursor-pointer  flex flex-row justify-between items-center group " +
                      (selectedEmail && item.id == selectedEmail
                        ? " bg-accent text-white "
                        : "text-gray-600 hover:bg-yellow-100 ")
                    }
                    onClick={() => {
                      setSelectedEmail(item.id);
                      selectEmail(item.id);
                    }}
                  >
                    <i className="text-lg">
                      <HiOutlineMail />
                    </i>
                    <div className="flex-1 text-ellipsis px-2 text-sm ">{item.name}</div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-100 space-x-2">
                      <i
                        className=" hover:text-primary text-lg"
                        onClick={() => {
                          handleDuplicateMail(item);
                        }}
                      >
                        <HiDocumentDuplicate />
                      </i>
                      <i
                        className=" hover:text-primary text-lg"
                        onClick={() => {
                          handleDeleteMail(item.id);
                        }}
                      >
                        <HiTrash />
                      </i>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 px-6 text-sm">Danh sách trống</div>
              )}
            </div>
            <div className="text-sm px-4 font-semibold text-gray-600">Email Tùy Chỉnh</div>
            <div className="">
              {listEmailCustom.length > 0 ? (
                listEmailCustom.map((item, index) => {
                  let actived = selectedEmail && item.id == selectedEmail;
                  return (
                    <div
                      key={index}
                      className={
                        " py-2 px-6 cursor-pointer  flex flex-row justify-between items-center group " +
                        (selectedEmail && item.id == selectedEmail
                          ? " bg-accent text-white "
                          : "text-gray-600 hover:bg-yellow-100 ")
                      }
                      onClick={() => {
                        setSelectedEmail(item.id);
                        selectEmail(item.id);
                      }}
                    >
                      <i className="text-lg">
                        <HiOutlineMail />
                      </i>
                      <div className="flex-1 text-ellipsis px-2 text-sm ">{item.name}</div>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-100 space-x-2">
                        <i
                          className=" hover:text-primary text-lg"
                          onClick={() => {
                            handleDuplicateMail(item);
                          }}
                        >
                          <HiDocumentDuplicate />
                        </i>
                        <i
                          className=" hover:text-primary text-lg"
                          onClick={() => {
                            handleDeleteMail(item.id);
                          }}
                        >
                          <HiTrash />
                        </i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 px-6 text-sm">Danh sách trống</div>
              )}
            </div>
          </div>
          <div className="absolute w-full bottom-0 bg-white ">
            <Button
              text="Thêm Email Tùy Chỉnh"
              outline
              className="w-full"
              icon={<HiPlus />}
              onClick={handleCreateMail}
            />
          </div>
        </div>
        {data && (
          <div className="w-full h-full col-span-2 ">
            <FormEmail dataEmail={data} onCancle={() => setData(null)} unSelect={() => {}} />
          </div>
        )}
      </div>
    </>
  );
}
