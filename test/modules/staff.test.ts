import staffResolver from "../../src/graphql/modules/staff/staff.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { StaffModel } from "../../src/graphql/modules/staff/staff.model";
import { getAdminContext } from "../utils/context";

let staff: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllStaff", () => {
  it("shold return an array", async (done) => {
    let result = await staffResolver.Query.getAllStaff({}, {}, context);

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

describe("# Test createStaff", () => {
  it("shold return an array", async (done) => {
    let result: any = await staffResolver.Mutation.createStaff(
      {},
      { data },
      context
    );
    result = result.toJSON();
    staff = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneStaff", () => {
  it("shold return an object", async (done) => {
    let result: any = await staffResolver.Query.getOneStaff(
      {},
      { id: staff._id },
      context
    );

    console.log(staff);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateStaff", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await staffResolver.Mutation.updateStaff(
      {},
      {
        id: staff._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    staff = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneStaff", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await staffResolver.Mutation.deleteOneStaff(
      {},
      {
        id: staff._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(staff.id);
    done();
  });
});

describe("# Test deleteManyStaff", () => {
  it("shold return an object", async (done) => {
    let records = await StaffModel.create([
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

    let result: any = await staffResolver.Mutation.deleteManyStaff(
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
