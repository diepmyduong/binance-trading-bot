import eVoucherImportingLogResolver from "../../src/graphql/modules/eVoucherImportingLog/eVoucherImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { EVoucherImportingLogModel } from "../../src/graphql/modules/eVoucherImportingLog/eVoucherImportingLog.model";
import { getAdminContext } from "../utils/context";

let eVoucherImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllEVoucherImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await eVoucherImportingLogResolver.Query.getAllEVoucherImportingLog({}, {}, context);

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

describe("# Test createEVoucherImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await eVoucherImportingLogResolver.Mutation.createEVoucherImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    eVoucherImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneEVoucherImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await eVoucherImportingLogResolver.Query.getOneEVoucherImportingLog(
      {},
      { id: eVoucherImportingLog._id },
      context
    );

    console.log(eVoucherImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateEVoucherImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await eVoucherImportingLogResolver.Mutation.updateEVoucherImportingLog(
      {},
      {
        id: eVoucherImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    eVoucherImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneEVoucherImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await eVoucherImportingLogResolver.Mutation.deleteOneEVoucherImportingLog(
      {},
      {
        id: eVoucherImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(eVoucherImportingLog.id);
    done();
  });
});

describe("# Test deleteManyEVoucherImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await EVoucherImportingLogModel.create([
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

    let result: any = await eVoucherImportingLogResolver.Mutation.deleteManyEVoucherImportingLog(
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
