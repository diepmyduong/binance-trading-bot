import productLabelResolver from "../../src/graphql/modules/productLabel/productLabel.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ProductLabelModel } from "../../src/graphql/modules/productLabel/productLabel.model";
import { getAdminContext } from "../utils/context";

let productLabel: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllProductLabel", () => {
  it("shold return an array", async (done) => {
    let result = await productLabelResolver.Query.getAllProductLabel({}, {}, context);

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

describe("# Test createProductLabel", () => {
  it("shold return an array", async (done) => {
    let result: any = await productLabelResolver.Mutation.createProductLabel(
      {},
      { data },
      context
    );
    result = result.toJSON();
    productLabel = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneProductLabel", () => {
  it("shold return an object", async (done) => {
    let result: any = await productLabelResolver.Query.getOneProductLabel(
      {},
      { id: productLabel._id },
      context
    );

    console.log(productLabel);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateProductLabel", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productLabelResolver.Mutation.updateProductLabel(
      {},
      {
        id: productLabel._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    productLabel = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneProductLabel", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productLabelResolver.Mutation.deleteOneProductLabel(
      {},
      {
        id: productLabel._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(productLabel.id);
    done();
  });
});

describe("# Test deleteManyProductLabel", () => {
  it("shold return an object", async (done) => {
    let records = await ProductLabelModel.create([
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

    let result: any = await productLabelResolver.Mutation.deleteManyProductLabel(
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
