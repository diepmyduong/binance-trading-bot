import diligencePointLogResolver from "../../src/graphql/modules/diligencePointLog/diligencePointLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { DiligencePointLogModel } from "../../src/graphql/modules/diligencePointLog/diligencePointLog.model";
import { getAdminContext } from "../utils/context";

let diligencePointLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllDiligencePointLog", () => {
  it("shold return an array", async (done) => {
    let result = await diligencePointLogResolver.Query.getAllDiligencePointLog({}, {}, context);

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

describe("# Test createDiligencePointLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await diligencePointLogResolver.Mutation.createDiligencePointLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    diligencePointLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneDiligencePointLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await diligencePointLogResolver.Query.getOneDiligencePointLog(
      {},
      { id: diligencePointLog._id },
      context
    );

    console.log(diligencePointLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateDiligencePointLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await diligencePointLogResolver.Mutation.updateDiligencePointLog(
      {},
      {
        id: diligencePointLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    diligencePointLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneDiligencePointLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await diligencePointLogResolver.Mutation.deleteOneDiligencePointLog(
      {},
      {
        id: diligencePointLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(diligencePointLog.id);
    done();
  });
});

describe("# Test deleteManyDiligencePointLog", () => {
  it("shold return an object", async (done) => {
    let records = await DiligencePointLogModel.create([
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

    let result: any = await diligencePointLogResolver.Mutation.deleteManyDiligencePointLog(
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
