import customerResolver from "../../src/graphql/modules/customer/customer.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CustomerModel } from "../../src/graphql/modules/customer/customer.model";
import { getAdminContext } from "../utils/context";

let customer: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCustomer", () => {
  it("shold return an array", async (done) => {
    let result = await customerResolver.Query.getAllCustomer({}, {}, context);

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

describe("# Test createCustomer", () => {
  it("shold return an array", async (done) => {
    let result: any = await customerResolver.Mutation.createCustomer(
      {},
      { data },
      context
    );
    result = result.toJSON();
    customer = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCustomer", () => {
  it("shold return an object", async (done) => {
    let result: any = await customerResolver.Query.getOneCustomer(
      {},
      { id: customer._id },
      context
    );

    console.log(customer);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCustomer", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerResolver.Mutation.updateCustomer(
      {},
      {
        id: customer._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    customer = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCustomer", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerResolver.Mutation.deleteOneCustomer(
      {},
      {
        id: customer._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(customer.id);
    done();
  });
});

describe("# Test deleteManyCustomer", () => {
  it("shold return an object", async (done) => {
    let records = await CustomerModel.create([
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

    let result: any = await customerResolver.Mutation.deleteManyCustomer(
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
