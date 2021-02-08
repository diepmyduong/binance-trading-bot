import categoryResolver from "../../src/graphql/modules/category/category.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CategoryModel } from "../../src/graphql/modules/category/category.model";
import { getAdminContext } from "../utils/context";

let category: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCategory", () => {
  it("shold return an array", async (done) => {
    let result = await categoryResolver.Query.getAllCategory({}, {}, context);

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

describe("# Test createCategory", () => {
  it("shold return an array", async (done) => {
    let result: any = await categoryResolver.Mutation.createCategory(
      {},
      { data },
      context
    );
    result = result.toJSON();
    category = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCategory", () => {
  it("shold return an object", async (done) => {
    let result: any = await categoryResolver.Query.getOneCategory(
      {},
      { id: category._id },
      context
    );

    console.log(category);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCategory", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await categoryResolver.Mutation.updateCategory(
      {},
      {
        id: category._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    category = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCategory", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await categoryResolver.Mutation.deleteOneCategory(
      {},
      {
        id: category._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(category.id);
    done();
  });
});

describe("# Test deleteManyCategory", () => {
  it("shold return an object", async (done) => {
    let records = await CategoryModel.create([
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

    let result: any = await categoryResolver.Mutation.deleteManyCategory(
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
