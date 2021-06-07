import { BaseModel, CrudRepository } from "./crud.repo";

export type Email = BaseModel & {
  name?: string; // Tên mẫu email
  type?: string; // Loại email
  subject?: string; // Tiêu đề email
  text?: string; // Nội dung text
  html?: string; // Nội dung html
  context?: EmailContext[]; // Dữ liệu context
  design?: any;
};

export type EmailContext = {
  name?: string; // Mã context
  description?: string; // Mô tả
};

export class EmailRepository extends CrudRepository<Email> {
  apiName: string = "Email";
  displayName: string = "email";
  shortFragment: string = "id name type subject text html context { name description } design";
  fullFragment: string = "id name type subject text html context { name description } design";

  async sendTestEmails(emails: string[]) {
    return await this.mutate({
      mutation: `sendTestEmails(emails: $emails)`,
      variablesParams: `($emails: [String]!)`,
      options: { variables: { emails } },
    }).then((res) => {
      this.handleError(res);
      return res.data.g0;
    });
  }
}

export const EmailService = new EmailRepository();
