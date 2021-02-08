import cumulativePointLogResolver from "../../src/graphql/modules/cumulativePointLog/cumulativePointLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CumulativePointLogModel } from "../../src/graphql/modules/cumulativePointLog/cumulativePointLog.model";
import { getAdminContext } from "../utils/context";

let cumulativePointLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCumulativePointLog", () => {
  it("shold return an array", async (done) => {
    let result = await cumulativePointLogResolver.Query.getAllCumulativePointLog({}, {}, context);

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

describe("# Test createCumulativePointLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await cumulativePointLogResolver.Mutation.createCumulativePointLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    cumulativePointLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCumulativePointLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await cumulativePointLogResolver.Query.getOneCumulativePointLog(
      {},
      { id: cumulativePointLog._id },
      context
    );

    console.log(cumulativePointLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCumulativePointLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await cumulativePointLogResolver.Mutation.updateCumulativePointLog(
      {},
      {
        id: cumulativePointLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    cumulativePointLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCumulativePointLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await cumulativePointLogResolver.Mutation.deleteOneCumulativePointLog(
      {},
      {
        id: cumulativePointLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(cumulativePointLog.id);
    done();
  });
});

describe("# Test deleteManyCumulativePointLog", () => {
  it("shold return an object", async (done) => {
    let records = await CumulativePointLogModel.create([
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

    let result: any = await cumulativePointLogResolver.Mutation.deleteManyCumulativePointLog(
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
