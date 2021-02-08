import customerPointLogResolver from "../../src/graphql/modules/customerPointLog/customerPointLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CustomerPointLogModel } from "../../src/graphql/modules/customerPointLog/customerPointLog.model";
import { getAdminContext } from "../utils/context";

let customerPointLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCustomerPointLog", () => {
  it("shold return an array", async (done) => {
    let result = await customerPointLogResolver.Query.getAllCustomerPointLog({}, {}, context);

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

describe("# Test createCustomerPointLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await customerPointLogResolver.Mutation.createCustomerPointLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    customerPointLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCustomerPointLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await customerPointLogResolver.Query.getOneCustomerPointLog(
      {},
      { id: customerPointLog._id },
      context
    );

    console.log(customerPointLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCustomerPointLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerPointLogResolver.Mutation.updateCustomerPointLog(
      {},
      {
        id: customerPointLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    customerPointLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCustomerPointLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await customerPointLogResolver.Mutation.deleteOneCustomerPointLog(
      {},
      {
        id: customerPointLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(customerPointLog.id);
    done();
  });
});

describe("# Test deleteManyCustomerPointLog", () => {
  it("shold return an object", async (done) => {
    let records = await CustomerPointLogModel.create([
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

    let result: any = await customerPointLogResolver.Mutation.deleteManyCustomerPointLog(
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
