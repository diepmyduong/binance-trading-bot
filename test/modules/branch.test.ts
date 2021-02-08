import branchResolver from "../../src/graphql/modules/branch/branch.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { BranchModel } from "../../src/graphql/modules/branch/branch.model";
import { getAdminContext } from "../utils/context";

let branch: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllBranch", () => {
  it("shold return an array", async (done) => {
    let result = await branchResolver.Query.getAllBranch({}, {}, context);

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

describe("# Test createBranch", () => {
  it("shold return an array", async (done) => {
    let result: any = await branchResolver.Mutation.createBranch(
      {},
      { data },
      context
    );
    result = result.toJSON();
    branch = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneBranch", () => {
  it("shold return an object", async (done) => {
    let result: any = await branchResolver.Query.getOneBranch(
      {},
      { id: branch._id },
      context
    );

    console.log(branch);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateBranch", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await branchResolver.Mutation.updateBranch(
      {},
      {
        id: branch._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    branch = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneBranch", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await branchResolver.Mutation.deleteOneBranch(
      {},
      {
        id: branch._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(branch.id);
    done();
  });
});

describe("# Test deleteManyBranch", () => {
  it("shold return an object", async (done) => {
    let records = await BranchModel.create([
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

    let result: any = await branchResolver.Mutation.deleteManyBranch(
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
