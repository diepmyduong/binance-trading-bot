import BaseError from "../base/error";

export const queryErrorNotFound = new BaseError("query-error", "Không tìm thấy dữ liệu", 404);
