import commissionMobifoneLogResolver from "../../src/graphql/modules/commissionMobifoneLog/commissionMobifoneLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CommissionMobifoneLogModel } from "../../src/graphql/modules/commissionMobifoneLog/commissionMobifoneLog.model";
import { getAdminContext } from "../utils/context";

let commissionMobifoneLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCommissionMobifoneLog", () => {
  it("shold return an array", async (done) => {
    let result = await commissionMobifoneLogResolver.Query.getAllCommissionMobifoneLog({}, {}, context);

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

describe("# Test createCommissionMobifoneLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await commissionMobifoneLogResolver.Mutation.createCommissionMobifoneLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    commissionMobifoneLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCommissionMobifoneLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await commissionMobifoneLogResolver.Query.getOneCommissionMobifoneLog(
      {},
      { id: commissionMobifoneLog._id },
      context
    );

    console.log(commissionMobifoneLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCommissionMobifoneLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await commissionMobifoneLogResolver.Mutation.updateCommissionMobifoneLog(
      {},
      {
        id: commissionMobifoneLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    commissionMobifoneLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCommissionMobifoneLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await commissionMobifoneLogResolver.Mutation.deleteOneCommissionMobifoneLog(
      {},
      {
        id: commissionMobifoneLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(commissionMobifoneLog.id);
    done();
  });
});

describe("# Test deleteManyCommissionMobifoneLog", () => {
  it("shold return an object", async (done) => {
    let records = await CommissionMobifoneLogModel.create([
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

    let result: any = await commissionMobifoneLogResolver.Mutation.deleteManyCommissionMobifoneLog(
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
