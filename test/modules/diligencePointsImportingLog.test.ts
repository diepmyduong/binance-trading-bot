import diligencePointsImportingLogResolver from "../../src/graphql/modules/diligencePointsImportingLog/diligencePointsImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { DiligencePointsImportingLogModel } from "../../src/graphql/modules/diligencePointsImportingLog/diligencePointsImportingLog.model";
import { getAdminContext } from "../utils/context";

let diligencePointsImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllDiligencePointsImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await diligencePointsImportingLogResolver.Query.getAllDiligencePointsImportingLog({}, {}, context);

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

describe("# Test createDiligencePointsImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await diligencePointsImportingLogResolver.Mutation.createDiligencePointsImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    diligencePointsImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneDiligencePointsImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await diligencePointsImportingLogResolver.Query.getOneDiligencePointsImportingLog(
      {},
      { id: diligencePointsImportingLog._id },
      context
    );

    console.log(diligencePointsImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateDiligencePointsImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await diligencePointsImportingLogResolver.Mutation.updateDiligencePointsImportingLog(
      {},
      {
        id: diligencePointsImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    diligencePointsImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneDiligencePointsImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await diligencePointsImportingLogResolver.Mutation.deleteOneDiligencePointsImportingLog(
      {},
      {
        id: diligencePointsImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(diligencePointsImportingLog.id);
    done();
  });
});

describe("# Test deleteManyDiligencePointsImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await DiligencePointsImportingLogModel.create([
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

    let result: any = await diligencePointsImportingLogResolver.Mutation.deleteManyDiligencePointsImportingLog(
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
