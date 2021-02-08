import eVoucherItemResolver from "../../src/graphql/modules/eVoucherItem/eVoucherItem.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { EVoucherItemModel } from "../../src/graphql/modules/eVoucherItem/eVoucherItem.model";
import { getAdminContext } from "../utils/context";

let eVoucherItem: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllEVoucherItem", () => {
  it("shold return an array", async (done) => {
    let result = await eVoucherItemResolver.Query.getAllEVoucherItem({}, {}, context);

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

describe("# Test createEVoucherItem", () => {
  it("shold return an array", async (done) => {
    let result: any = await eVoucherItemResolver.Mutation.createEVoucherItem(
      {},
      { data },
      context
    );
    result = result.toJSON();
    eVoucherItem = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneEVoucherItem", () => {
  it("shold return an object", async (done) => {
    let result: any = await eVoucherItemResolver.Query.getOneEVoucherItem(
      {},
      { id: eVoucherItem._id },
      context
    );

    console.log(eVoucherItem);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateEVoucherItem", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await eVoucherItemResolver.Mutation.updateEVoucherItem(
      {},
      {
        id: eVoucherItem._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    eVoucherItem = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneEVoucherItem", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await eVoucherItemResolver.Mutation.deleteOneEVoucherItem(
      {},
      {
        id: eVoucherItem._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(eVoucherItem.id);
    done();
  });
});

describe("# Test deleteManyEVoucherItem", () => {
  it("shold return an object", async (done) => {
    let records = await EVoucherItemModel.create([
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

    let result: any = await eVoucherItemResolver.Mutation.deleteManyEVoucherItem(
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
