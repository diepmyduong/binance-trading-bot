import customerAddressResolver from "../../src/graphql/modules/customerAddress/customerAddress.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CustomerAddressModel } from "../../src/graphql/modules/customerAddress/customerAddress.model";
import { getAdminContext } from "../utils/context";

let customerAddress: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCustomerAddress", () => {
  it("shold return an array", async (done) => {
    let result = await customerAddressResolver.Query.getAllCustomerAddress({}, {}, context);

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

describe("# Test createCustomerAddress", () => {
  it("shold return an array", async (done) => {
    let result: any = await customerAddressResolver.Mutation.createCustomerAddress(
      {},
      { data },
      context
    );
    result = result.toJSON();
    customerAddress = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCustomerAddress", () => {
  it("shold return an object", async (done) => {
    let result: any = await customerAddressResolver.Query.getOneCustomerAddress(
      {},
      { id: customerAddress._id },
      context
    );

    console.log(customerAddress);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCustomerAddress", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerAddressResolver.Mutation.updateCustomerAddress(
      {},
      {
        id: customerAddress._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    customerAddress = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCustomerAddress", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerAddressResolver.Mutation.deleteOneCustomerAddress(
      {},
      {
        id: customerAddress._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(customerAddress.id);
    done();
  });
});

describe("# Test deleteManyCustomerAddress", () => {
  it("shold return an object", async (done) => {
    let records = await CustomerAddressModel.create([
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

    let result: any = await customerAddressResolver.Mutation.deleteManyCustomerAddress(
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
