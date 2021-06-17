import shopBranchResolver from "../../src/graphql/modules/shopBranch/shopBranch.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ShopBranchModel } from "../../src/graphql/modules/shopBranch/shopBranch.model";
import { getAdminContext } from "../utils/context";

let shopBranch: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllShopBranch", () => {
  it("shold return an array", async (done) => {
    let result = await shopBranchResolver.Query.getAllShopBranch({}, {}, context);

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

describe("# Test createShopBranch", () => {
  it("shold return an array", async (done) => {
    let result: any = await shopBranchResolver.Mutation.createShopBranch(
      {},
      { data },
      context
    );
    result = result.toJSON();
    shopBranch = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneShopBranch", () => {
  it("shold return an object", async (done) => {
    let result: any = await shopBranchResolver.Query.getOneShopBranch(
      {},
      { id: shopBranch._id },
      context
    );

    console.log(shopBranch);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateShopBranch", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopBranchResolver.Mutation.updateShopBranch(
      {},
      {
        id: shopBranch._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    shopBranch = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneShopBranch", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopBranchResolver.Mutation.deleteOneShopBranch(
      {},
      {
        id: shopBranch._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(shopBranch.id);
    done();
  });
});

describe("# Test deleteManyShopBranch", () => {
  it("shold return an object", async (done) => {
    let records = await ShopBranchModel.create([
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

    let result: any = await shopBranchResolver.Mutation.deleteManyShopBranch(
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
