import regisServiceImportingLogResolver from "../../src/graphql/modules/regisServiceImportingLog/regisServiceImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { RegisServiceImportingLogModel } from "../../src/graphql/modules/regisServiceImportingLog/regisServiceImportingLog.model";
import { getAdminContext } from "../utils/context";

let regisServiceImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllRegisServiceImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await regisServiceImportingLogResolver.Query.getAllRegisServiceImportingLog({}, {}, context);

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

describe("# Test createRegisServiceImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await regisServiceImportingLogResolver.Mutation.createRegisServiceImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    regisServiceImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneRegisServiceImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await regisServiceImportingLogResolver.Query.getOneRegisServiceImportingLog(
      {},
      { id: regisServiceImportingLog._id },
      context
    );

    console.log(regisServiceImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateRegisServiceImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisServiceImportingLogResolver.Mutation.updateRegisServiceImportingLog(
      {},
      {
        id: regisServiceImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    regisServiceImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneRegisServiceImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisServiceImportingLogResolver.Mutation.deleteOneRegisServiceImportingLog(
      {},
      {
        id: regisServiceImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(regisServiceImportingLog.id);
    done();
  });
});

describe("# Test deleteManyRegisServiceImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await RegisServiceImportingLogModel.create([
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

    let result: any = await regisServiceImportingLogResolver.Mutation.deleteManyRegisServiceImportingLog(
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
