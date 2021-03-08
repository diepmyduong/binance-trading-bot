import storeHouseCommissionLogResolver from "../../src/graphql/modules/storeHouseCommissionLog/storeHouseCommissionLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { StoreHouseCommissionLogModel } from "../../src/graphql/modules/storeHouseCommissionLog/storeHouseCommissionLog.model";
import { getAdminContext } from "../utils/context";

let storeHouseCommissionLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllStoreHouseCommissionLog", () => {
  it("shold return an array", async (done) => {
    let result = await storeHouseCommissionLogResolver.Query.getAllStoreHouseCommissionLog({}, {}, context);

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

describe("# Test createStoreHouseCommissionLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await storeHouseCommissionLogResolver.Mutation.createStoreHouseCommissionLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    storeHouseCommissionLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneStoreHouseCommissionLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await storeHouseCommissionLogResolver.Query.getOneStoreHouseCommissionLog(
      {},
      { id: storeHouseCommissionLog._id },
      context
    );

    console.log(storeHouseCommissionLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateStoreHouseCommissionLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await storeHouseCommissionLogResolver.Mutation.updateStoreHouseCommissionLog(
      {},
      {
        id: storeHouseCommissionLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    storeHouseCommissionLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneStoreHouseCommissionLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await storeHouseCommissionLogResolver.Mutation.deleteOneStoreHouseCommissionLog(
      {},
      {
        id: storeHouseCommissionLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(storeHouseCommissionLog.id);
    done();
  });
});

describe("# Test deleteManyStoreHouseCommissionLog", () => {
  it("shold return an object", async (done) => {
    let records = await StoreHouseCommissionLogModel.create([
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

    let result: any = await storeHouseCommissionLogResolver.Mutation.deleteManyStoreHouseCommissionLog(
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
