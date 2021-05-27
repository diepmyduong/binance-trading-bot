import shopConfigResolver from "../../src/graphql/modules/shopConfig/shopConfig.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ShopConfigModel } from "../../src/graphql/modules/shopConfig/shopConfig.model";
import { getAdminContext } from "../utils/context";

let shopConfig: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllShopConfig", () => {
  it("shold return an array", async (done) => {
    let result = await shopConfigResolver.Query.getAllShopConfig({}, {}, context);

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

describe("# Test createShopConfig", () => {
  it("shold return an array", async (done) => {
    let result: any = await shopConfigResolver.Mutation.createShopConfig(
      {},
      { data },
      context
    );
    result = result.toJSON();
    shopConfig = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneShopConfig", () => {
  it("shold return an object", async (done) => {
    let result: any = await shopConfigResolver.Query.getOneShopConfig(
      {},
      { id: shopConfig._id },
      context
    );

    console.log(shopConfig);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateShopConfig", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopConfigResolver.Mutation.updateShopConfig(
      {},
      {
        id: shopConfig._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    shopConfig = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneShopConfig", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopConfigResolver.Mutation.deleteOneShopConfig(
      {},
      {
        id: shopConfig._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(shopConfig.id);
    done();
  });
});

describe("# Test deleteManyShopConfig", () => {
  it("shold return an object", async (done) => {
    let records = await ShopConfigModel.create([
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

    let result: any = await shopConfigResolver.Mutation.deleteManyShopConfig(
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
