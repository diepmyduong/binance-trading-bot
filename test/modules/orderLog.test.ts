import orderLogResolver from "../../src/graphql/modules/orderLog/orderLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { OrderLogModel } from "../../src/graphql/modules/orderLog/orderLog.model";
import { getAdminContext } from "../utils/context";

let orderLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllOrderLog", () => {
  it("shold return an array", async (done) => {
    let result = await orderLogResolver.Query.getAllOrderLog({}, {}, context);

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

describe("# Test createOrderLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await orderLogResolver.Mutation.createOrderLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    orderLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneOrderLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await orderLogResolver.Query.getOneOrderLog(
      {},
      { id: orderLog._id },
      context
    );

    console.log(orderLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateOrderLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await orderLogResolver.Mutation.updateOrderLog(
      {},
      {
        id: orderLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    orderLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneOrderLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await orderLogResolver.Mutation.deleteOneOrderLog(
      {},
      {
        id: orderLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(orderLog.id);
    done();
  });
});

describe("# Test deleteManyOrderLog", () => {
  it("shold return an object", async (done) => {
    let records = await OrderLogModel.create([
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

    let result: any = await orderLogResolver.Mutation.deleteManyOrderLog(
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
