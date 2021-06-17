import productToppingResolver from "../../src/graphql/modules/productTopping/productTopping.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ProductToppingModel } from "../../src/graphql/modules/productTopping/productTopping.model";
import { getAdminContext } from "../utils/context";

let productTopping: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllProductTopping", () => {
  it("shold return an array", async (done) => {
    let result = await productToppingResolver.Query.getAllProductTopping({}, {}, context);

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

describe("# Test createProductTopping", () => {
  it("shold return an array", async (done) => {
    let result: any = await productToppingResolver.Mutation.createProductTopping(
      {},
      { data },
      context
    );
    result = result.toJSON();
    productTopping = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneProductTopping", () => {
  it("shold return an object", async (done) => {
    let result: any = await productToppingResolver.Query.getOneProductTopping(
      {},
      { id: productTopping._id },
      context
    );

    console.log(productTopping);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateProductTopping", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productToppingResolver.Mutation.updateProductTopping(
      {},
      {
        id: productTopping._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    productTopping = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneProductTopping", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productToppingResolver.Mutation.deleteOneProductTopping(
      {},
      {
        id: productTopping._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(productTopping.id);
    done();
  });
});

describe("# Test deleteManyProductTopping", () => {
  it("shold return an object", async (done) => {
    let records = await ProductToppingModel.create([
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

    let result: any = await productToppingResolver.Mutation.deleteManyProductTopping(
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
