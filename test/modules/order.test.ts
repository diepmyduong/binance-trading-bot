import orderResolver from "../../src/graphql/modules/order/order.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { OrderModel } from "../../src/graphql/modules/order/order.model";
import { getAdminContext } from "../utils/context";

let order: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllOrder", () => {
  it("shold return an array", async (done) => {
    let result = await orderResolver.Query.getAllOrder({}, {}, context);

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

describe("# Test createOrder", () => {
  it("shold return an array", async (done) => {
    let result: any = await orderResolver.Mutation.createOrder(
      {},
      { data },
      context
    );
    result = result.toJSON();
    order = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneOrder", () => {
  it("shold return an object", async (done) => {
    let result: any = await orderResolver.Query.getOneOrder(
      {},
      { id: order._id },
      context
    );

    console.log(order);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateOrder", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await orderResolver.Mutation.updateOrder(
      {},
      {
        id: order._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    order = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneOrder", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await orderResolver.Mutation.deleteOneOrder(
      {},
      {
        id: order._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(order.id);
    done();
  });
});

describe("# Test deleteManyOrder", () => {
  it("shold return an object", async (done) => {
    let records = await OrderModel.create([
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

    let result: any = await orderResolver.Mutation.deleteManyOrder(
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
