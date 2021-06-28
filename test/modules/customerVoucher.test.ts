import customerVoucherResolver from "../../src/graphql/modules/customerVoucher/customerVoucher.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CustomerVoucherModel } from "../../src/graphql/modules/customerVoucher/customerVoucher.model";
import { getAdminContext } from "../utils/context";

let customerVoucher: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCustomerVoucher", () => {
  it("shold return an array", async (done) => {
    let result = await customerVoucherResolver.Query.getAllCustomerVoucher({}, {}, context);

    expect(result).to.be.an("object");
    expect(result.data).to.be.an("array");
    expect(result.total).to.be.a("number");
    expect(result.pagination).to.be.an("object");
    expect(result.pagination.limit).to.be.a("number");
    expect(result.pagination.offset).to.be.a("number");
    expect(result.pagination.page).to.be.a("number");
    done();
  });
});

describe("# Test createCustomerVoucher", () => {
  it("shold return an array", async (done) => {
    let result: any = await customerVoucherResolver.Mutation.createCustomerVoucher(
      {},
      { data },
      context
    );
    result = result.toJSON();
    customerVoucher = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCustomerVoucher", () => {
  it("shold return an object", async (done) => {
    let result: any = await customerVoucherResolver.Query.getOneCustomerVoucher(
      {},
      { id: customerVoucher._id },
      context
    );

    console.log(customerVoucher);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCustomerVoucher", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerVoucherResolver.Mutation.updateCustomerVoucher(
      {},
      {
        id: customerVoucher._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    customerVoucher = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCustomerVoucher", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerVoucherResolver.Mutation.deleteOneCustomerVoucher(
      {},
      {
        id: customerVoucher._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(customerVoucher.id);
    done();
  });
});

describe("# Test deleteManyCustomerVoucher", () => {
  it("shold return an object", async (done) => {
    let records = await CustomerVoucherModel.create([
      {
        name: faker.name.title(),
      },
      {
        name: faker.name.title(),
      },
      {
        name: faker.name.title(),
      },
    ]);

    let ids = records.map((r) => r.get("id"));

    let result: any = await customerVoucherResolver.Mutation.deleteManyCustomerVoucher(
      {},
      {
        ids: ids,
      },
      context
    );

    expect(result).to.be.a("number");
    expect(result).to.equal(records.length);
    done();
  });
});
