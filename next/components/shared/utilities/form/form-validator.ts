type ConditionFunction = (data: any) => boolean;
export class FormValidator {
  static get instance() {
    return new FormValidator();
  }
  validators: ((value: any, data?: any) => Promise<string>)[] = [];

  build() {
    return async (value, data) => {
      for (const validate of this.validators) {
        const res = await validate(value, data);
        if (res) return res;
      }
    };
  }
  required(condition?: ConditionFunction) {
    this.validators.push(async (value: string, data: any) => {
      if (condition && !condition(data)) return;
      if (value) {
        if (Array.isArray(value) && !value.length) {
          return "Bắt buộc";
        }
      } else {
        if (typeof value == "number") {
          if (value === null || value === undefined) {
            return "Bắt buộc";
          }
        } else {
          return "Bắt buộc";
        }
      }
    });
    return this;
  }
  email(condition?: ConditionFunction) {
    this.validators.push(async (value: string, data: any) => {
      if (value == "") return;
      if (condition && !condition(data)) return;
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(value).toLowerCase())) {
        return "Sai định dạng.";
      }
    });
    return this;
  }
  phoneNumber(condition?: ConditionFunction) {
    this.validators.push(async (value: string, data: any) => {
      if (value == "") return;
      if (condition && !condition(data)) return;
      if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)) {
        return "Sai định dạng";
      }
    });
    return this;
  }
  slug(condition?: ConditionFunction) {
    this.validators.push(async (value: string, data: any) => {
      if (value == "") return;
      if (condition && !condition(data)) return;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return "Chỉ gồm ký tự thường, số và gạch ngang";
      }
    });
    return this;
  }
  key(condition?: ConditionFunction) {
    this.validators.push(async (value: string, data: any) => {
      if (value == "") return;
      if (condition && !condition(data)) return;
      if (!/^[a-zA-Z0-9]+(?:[-_a-zA-Z0-9]+)*$/.test(value)) {
        return "Chỉ gồm ký tự, số, gạch ngang hoặc gạch dưới";
      }
    });
    return this;
  }
}
