import orderItemResolver from "../../src/graphql/modules/orderItem/orderItem.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { OrderItemModel } from "../../src/graphql/modules/orderItem/orderItem.model";
import { getAdminContext } from "../utils/context";

let orderItem: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllOrderItem", () => {
  it("shold return an array", async (done) => {
    let result = await orderItemResolver.Query.getAllOrderItem({}, {}, context);

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

describe("# Test createOrderItem", () => {
  it("shold return an array", async (done) => {
    let result: any = await orderItemResolver.Mutation.createOrderItem(
      {},
      { data },
      context
    );
    result = result.toJSON();
    orderItem = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneOrderItem", () => {
  it("shold return an object", async (done) => {
    let result: any = await orderItemResolver.Query.getOneOrderItem(
      {},
      { id: orderItem._id },
      context
    );

    console.log(orderItem);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateOrderItem", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await orderItemResolver.Mutation.updateOrderItem(
      {},
      {
        id: orderItem._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    orderItem = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneOrderItem", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await orderItemResolver.Mutation.deleteOneOrderItem(
      {},
      {
        id: orderItem._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(orderItem.id);
    done();
  });
});

describe("# Test deleteManyOrderItem", () => {
  it("shold return an object", async (done) => {
    let records = await OrderItemModel.create([
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

    let result: any = await orderItemResolver.Mutation.deleteManyOrderItem(
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
