import memberResolver from "../../src/graphql/modules/member/member.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { MemberModel } from "../../src/graphql/modules/member/member.model";
import { getAdminContext } from "../utils/context";

let member: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllMember", () => {
  it("shold return an array", async (done) => {
    let result = await memberResolver.Query.getAllMember({}, {}, context);

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

describe("# Test createMember", () => {
  it("shold return an array", async (done) => {
    let result: any = await memberResolver.Mutation.createMember(
      {},
      { data },
      context
    );
    result = result.toJSON();
    member = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneMember", () => {
  it("shold return an object", async (done) => {
    let result: any = await memberResolver.Query.getOneMember(
      {},
      { id: member._id },
      context
    );

    console.log(member);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateMember", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await memberResolver.Mutation.updateMember(
      {},
      {
        id: member._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    member = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneMember", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await memberResolver.Mutation.deleteOneMember(
      {},
      {
        id: member._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(member.id);
    done();
  });
});

describe("# Test deleteManyMember", () => {
  it("shold return an object", async (done) => {
    let records = await MemberModel.create([
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

    let result: any = await memberResolver.Mutation.deleteManyMember(
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
