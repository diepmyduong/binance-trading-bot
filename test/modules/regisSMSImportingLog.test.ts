import regisSMSImportingLogResolver from "../../src/graphql/modules/regisSMSImportingLog/regisSMSImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { RegisSMSImportingLogModel } from "../../src/graphql/modules/regisSMSImportingLog/regisSMSImportingLog.model";
import { getAdminContext } from "../utils/context";

let regisSMSImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllRegisSMSImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await regisSMSImportingLogResolver.Query.getAllRegisSMSImportingLog({}, {}, context);

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

describe("# Test createRegisSMSImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await regisSMSImportingLogResolver.Mutation.createRegisSMSImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    regisSMSImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneRegisSMSImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await regisSMSImportingLogResolver.Query.getOneRegisSMSImportingLog(
      {},
      { id: regisSMSImportingLog._id },
      context
    );

    console.log(regisSMSImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateRegisSMSImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisSMSImportingLogResolver.Mutation.updateRegisSMSImportingLog(
      {},
      {
        id: regisSMSImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    regisSMSImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneRegisSMSImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisSMSImportingLogResolver.Mutation.deleteOneRegisSMSImportingLog(
      {},
      {
        id: regisSMSImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(regisSMSImportingLog.id);
    done();
  });
});

describe("# Test deleteManyRegisSMSImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await RegisSMSImportingLogModel.create([
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

    let result: any = await regisSMSImportingLogResolver.Mutation.deleteManyRegisSMSImportingLog(
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
