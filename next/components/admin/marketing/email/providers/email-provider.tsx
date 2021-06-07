import { createContext, useContext, useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { Email, EmailService } from "../../../../../lib/repo/email.repo";
export const EmailContext = createContext<{
  [x: string]: any;
  emails?: Email[];
  email?: Email;
  loadEmails?: () => Promise<Email[]>;
  selectEmail?: (emailId: string) => Promise<Email>;
  updateEmail?: (data: Email) => Promise<Email>;
  createEmail?: () => Promise<Email>;
  duplicate?: (email: Email) => Promise<Email>;
  deleteEmail?: (id: string) => Promise<Email>;
}>({});

export function EmailProvider(props) {
  let [emails, setEmails] = useState<Email[]>([]);
  let [email, setEmail] = useState<Email>();
  const loadEmails = () => {
    return EmailService.getAll({ query: { limit: 100 } }).then((res) => {
      setEmails(JSON.parse(JSON.stringify(res.data)));
      return res.data;
    });
  };
  const selectEmail = (emailId: string) => {
    return EmailService.getOne({ id: emailId }).then((res) => {
      setEmail({ ...email });
      setTimeout(() => {
        setEmail(cloneDeep(res));
      });
      return res;
    });
  };
  const updateEmail = (data: Email) => {
    return EmailService.update({ id: email.id, data }).then((res) => {
      const index = emails.findIndex((e) => e.id == res.id);
      emails[index] = cloneDeep(res);
      setEmails([...emails]);
      selectEmail(res.id);
      return res;
    });
  };
  const createEmail = () => {
    return EmailService.create({
      data: { name: "Mẫu Email", subject: "Tiêu đề...", html: "<h1>Nội dung...</h1>", design: {} },
    }).then((res) => {
      emails.push(cloneDeep(res));
      setEmails([...emails]);
      selectEmail(res.id);
      return res;
    });
  };
  const duplicate = (email: Email) => {
    return EmailService.create({
      data: {
        name: email.name + " Copy",
        subject: email.subject,
        html: email.html,
        design: email.design || "",
      },
    }).then((res) => {
      emails.push(cloneDeep(res));
      setEmails([...emails]);
      selectEmail(res.id);
      return res;
    });
  };
  const deleteEmail = (id: string) => {
    return EmailService.delete({ id }).then((res) => {
      loadEmails().then((res) => {
        if (res.length > 0) selectEmail(res[0].id);
      });
      return res;
    });
  };
  useEffect(() => {
    loadEmails().then((res) => {
      if (res.length > 0) selectEmail(res[0].id);
    });
  }, []);
  return (
    <EmailContext.Provider
      value={{
        emails,
        email,
        loadEmails,
        selectEmail,
        updateEmail,
        createEmail,
        duplicate,
        deleteEmail,
      }}
    >
      {props.children}
    </EmailContext.Provider>
  );
}

export const useEmailContext = () => useContext(EmailContext);
