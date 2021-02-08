import commissionLogResolver from "../../src/graphql/modules/commissionLog/commissionLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CommissionLogModel } from "../../src/graphql/modules/commissionLog/commissionLog.model";
import { getAdminContext } from "../utils/context";

let commissionLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCommissionLog", () => {
  it("shold return an array", async (done) => {
    let result = await commissionLogResolver.Query.getAllCommissionLog({}, {}, context);

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

describe("# Test createCommissionLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await commissionLogResolver.Mutation.createCommissionLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    commissionLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCommissionLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await commissionLogResolver.Query.getOneCommissionLog(
      {},
      { id: commissionLog._id },
      context
    );

    console.log(commissionLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCommissionLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await commissionLogResolver.Mutation.updateCommissionLog(
      {},
      {
        id: commissionLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    commissionLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCommissionLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await commissionLogResolver.Mutation.deleteOneCommissionLog(
      {},
      {
        id: commissionLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(commissionLog.id);
    done();
  });
});

describe("# Test deleteManyCommissionLog", () => {
  it("shold return an object", async (done) => {
    let records = await CommissionLogModel.create([
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

    let result: any = await commissionLogResolver.Mutation.deleteManyCommissionLog(
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
