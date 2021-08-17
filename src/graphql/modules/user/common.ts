import { validateJSON } from "../../../helpers/validateJSON";

export function validatePassword(password: string) {
  validateJSON(password, {
    type: "string",
    minLength: 6,
    errorMessage: "mật khẩu phải có ít nhất 6 ký tự",
  });
}

export function validateEmail(email: string) {
  validateJSON(email, {
    type: "string",
    format: "email",
    errorMessage: "email không đúng định dạng",
  });
}
