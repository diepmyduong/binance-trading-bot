import productImportingLogResolver from "../../src/graphql/modules/productImportingLog/productImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ProductImportingLogModel } from "../../src/graphql/modules/productImportingLog/productImportingLog.model";
import { getAdminContext } from "../utils/context";

let productImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllProductImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await productImportingLogResolver.Query.getAllProductImportingLog({}, {}, context);

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

describe("# Test createProductImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await productImportingLogResolver.Mutation.createProductImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    productImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneProductImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await productImportingLogResolver.Query.getOneProductImportingLog(
      {},
      { id: productImportingLog._id },
      context
    );

    console.log(productImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateProductImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productImportingLogResolver.Mutation.updateProductImportingLog(
      {},
      {
        id: productImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    productImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneProductImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await productImportingLogResolver.Mutation.deleteOneProductImportingLog(
      {},
      {
        id: productImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(productImportingLog.id);
    done();
  });
});

describe("# Test deleteManyProductImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await ProductImportingLogModel.create([
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

    let result: any = await productImportingLogResolver.Mutation.deleteManyProductImportingLog(
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
