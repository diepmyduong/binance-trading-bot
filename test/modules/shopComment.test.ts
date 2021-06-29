import shopCommentResolver from "../../src/graphql/modules/shopComment/shopComment.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ShopCommentModel } from "../../src/graphql/modules/shopComment/shopComment.model";
import { getAdminContext } from "../utils/context";

let shopComment: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllShopComment", () => {
  it("shold return an array", async (done) => {
    let result = await shopCommentResolver.Query.getAllShopComment({}, {}, context);

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

describe("# Test createShopComment", () => {
  it("shold return an array", async (done) => {
    let result: any = await shopCommentResolver.Mutation.createShopComment(
      {},
      { data },
      context
    );
    result = result.toJSON();
    shopComment = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneShopComment", () => {
  it("shold return an object", async (done) => {
    let result: any = await shopCommentResolver.Query.getOneShopComment(
      {},
      { id: shopComment._id },
      context
    );

    console.log(shopComment);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateShopComment", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopCommentResolver.Mutation.updateShopComment(
      {},
      {
        id: shopComment._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    shopComment = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneShopComment", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await shopCommentResolver.Mutation.deleteOneShopComment(
      {},
      {
        id: shopComment._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(shopComment.id);
    done();
  });
});

describe("# Test deleteManyShopComment", () => {
  it("shold return an object", async (done) => {
    let records = await ShopCommentModel.create([
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

    let result: any = await shopCommentResolver.Mutation.deleteManyShopComment(
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
