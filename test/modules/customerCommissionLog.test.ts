import customerCommissionLogResolver from "../../src/graphql/modules/customerCommissionLog/customerCommissionLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CustomerCommissionLogModel } from "../../src/graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { getAdminContext } from "../utils/context";

let customerCommissionLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCustomerCommissionLog", () => {
  it("shold return an array", async (done) => {
    let result = await customerCommissionLogResolver.Query.getAllCustomerCommissionLog({}, {}, context);

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

describe("# Test createCustomerCommissionLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await customerCommissionLogResolver.Mutation.createCustomerCommissionLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    customerCommissionLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCustomerCommissionLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await customerCommissionLogResolver.Query.getOneCustomerCommissionLog(
      {},
      { id: customerCommissionLog._id },
      context
    );

    console.log(customerCommissionLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCustomerCommissionLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerCommissionLogResolver.Mutation.updateCustomerCommissionLog(
      {},
      {
        id: customerCommissionLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    customerCommissionLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCustomerCommissionLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerCommissionLogResolver.Mutation.deleteOneCustomerCommissionLog(
      {},
      {
        id: customerCommissionLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(customerCommissionLog.id);
    done();
  });
});

describe("# Test deleteManyCustomerCommissionLog", () => {
  it("shold return an object", async (done) => {
    let records = await CustomerCommissionLogModel.create([
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

    let result: any = await customerCommissionLogResolver.Mutation.deleteManyCustomerCommissionLog(
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
