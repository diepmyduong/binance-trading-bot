import memberImportingLogResolver from "../../src/graphql/modules/memberImportingLog/memberImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { MemberImportingLogModel } from "../../src/graphql/modules/memberImportingLog/memberImportingLog.model";
import { getAdminContext } from "../utils/context";

let memberImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllMemberImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await memberImportingLogResolver.Query.getAllMemberImportingLog({}, {}, context);

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

describe("# Test createMemberImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await memberImportingLogResolver.Mutation.createMemberImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    memberImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneMemberImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await memberImportingLogResolver.Query.getOneMemberImportingLog(
      {},
      { id: memberImportingLog._id },
      context
    );

    console.log(memberImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateMemberImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await memberImportingLogResolver.Mutation.updateMemberImportingLog(
      {},
      {
        id: memberImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    memberImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneMemberImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await memberImportingLogResolver.Mutation.deleteOneMemberImportingLog(
      {},
      {
        id: memberImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(memberImportingLog.id);
    done();
  });
});

describe("# Test deleteManyMemberImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await MemberImportingLogModel.create([
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

    let result: any = await memberImportingLogResolver.Mutation.deleteManyMemberImportingLog(
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
