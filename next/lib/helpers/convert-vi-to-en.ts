export function convertViToEn(string): string {
  let obj = {
    Đ: "D",
    đ: "d",
    â: "a",
    ă: "a",
    ê: "e",
    ô: "o",
    ơ: "o",
    ư: "u",
    á: "a",
    à: "a",
    ạ: "a",
    ả: "a",
    ã: "a",
    ắ: "a",
    ằ: "a",
    ặ: "a",
    ẳ: "a",
    ẵ: "a",
    ấ: "a",
    ầ: "a",
    ậ: "a",
    ẩ: "a",
    ẫ: "a",
    é: "e",
    è: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ý: "y",
    ỳ: "y",
    ỵ: "y",
    ỷ: "y",
    ỹ: "y",
    ú: "u",
    ù: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ứ: "u",
    ừ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    í: "i",
    ì: "i",
    ị: "i",
    ỉ: "i",
    ĩ: "i",
    ó: "o",
    ò: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
  };

  string = string.trim();
  string = string.toLowerCase();

  let arr = string.split("");

  for (let i in arr) {
    if (obj[arr[i]]) {
      arr[i] = obj[arr[i]];
    }
  }

  return arr.join("");
}
