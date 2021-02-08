import productResolver from "../../src/graphql/modules/product/product.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ProductModel } from "../../src/graphql/modules/product/product.model";
import { getAdminContext } from "../utils/context";

let product: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllProduct", () => {
  it("shold return an array", async (done) => {
    let result = await productResolver.Query.getAllProduct({}, {}, context);

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

describe("# Test createProduct", () => {
  it("shold return an array", async (done) => {
    let result: any = await productResolver.Mutation.createProduct(
      {},
      { data },
      context
    );
    result = result.toJSON();
    product = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneProduct", () => {
  it("shold return an object", async (done) => {
    let result: any = await productResolver.Query.getOneProduct(
      {},
      { id: product._id },
      context
    );

    console.log(product);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateProduct", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productResolver.Mutation.updateProduct(
      {},
      {
        id: product._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    product = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneProduct", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productResolver.Mutation.deleteOneProduct(
      {},
      {
        id: product._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(product.id);
    done();
  });
});

describe("# Test deleteManyProduct", () => {
  it("shold return an object", async (done) => {
    let records = await ProductModel.create([
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

    let result: any = await productResolver.Mutation.deleteManyProduct(
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
