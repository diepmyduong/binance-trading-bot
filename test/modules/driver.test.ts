import driverResolver from "../../src/graphql/modules/driver/driver.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { DriverModel } from "../../src/graphql/modules/driver/driver.model";
import { getAdminContext } from "../utils/context";

let driver: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllDriver", () => {
  it("shold return an array", async (done) => {
    let result = await driverResolver.Query.getAllDriver({}, {}, context);

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

describe("# Test createDriver", () => {
  it("shold return an array", async (done) => {
    let result: any = await driverResolver.Mutation.createDriver(
      {},
      { data },
      context
    );
    result = result.toJSON();
    driver = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneDriver", () => {
  it("shold return an object", async (done) => {
    let result: any = await driverResolver.Query.getOneDriver(
      {},
      { id: driver._id },
      context
    );

    console.log(driver);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateDriver", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await driverResolver.Mutation.updateDriver(
      {},
      {
        id: driver._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    driver = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneDriver", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await driverResolver.Mutation.deleteOneDriver(
      {},
      {
        id: driver._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(driver.id);
    done();
  });
});

describe("# Test deleteManyDriver", () => {
  it("shold return an object", async (done) => {
    let records = await DriverModel.create([
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

    let result: any = await driverResolver.Mutation.deleteManyDriver(
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
