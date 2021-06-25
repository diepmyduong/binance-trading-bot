import shopVoucherResolver from "../../src/graphql/modules/shopVoucher/shopVoucher.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ShopVoucherModel } from "../../src/graphql/modules/shopVoucher/shopVoucher.model";
import { getAdminContext } from "../utils/context";

let shopVoucher: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllShopVoucher", () => {
  it("shold return an array", async (done) => {
    let result = await shopVoucherResolver.Query.getAllShopVoucher({}, {}, context);

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

describe("# Test createShopVoucher", () => {
  it("shold return an array", async (done) => {
    let result: any = await shopVoucherResolver.Mutation.createShopVoucher(
      {},
      { data },
      context
    );
    result = result.toJSON();
    shopVoucher = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneShopVoucher", () => {
  it("shold return an object", async (done) => {
    let result: any = await shopVoucherResolver.Query.getOneShopVoucher(
      {},
      { id: shopVoucher._id },
      context
    );

    console.log(shopVoucher);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateShopVoucher", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopVoucherResolver.Mutation.updateShopVoucher(
      {},
      {
        id: shopVoucher._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    shopVoucher = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneShopVoucher", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopVoucherResolver.Mutation.deleteOneShopVoucher(
      {},
      {
        id: shopVoucher._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(shopVoucher.id);
    done();
  });
});

describe("# Test deleteManyShopVoucher", () => {
  it("shold return an object", async (done) => {
    let records = await ShopVoucherModel.create([
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

    let result: any = await shopVoucherResolver.Mutation.deleteManyShopVoucher(
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
