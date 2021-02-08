import addressStorehouseImportingLogResolver from "../../src/graphql/modules/addressStorehouseImportingLog/addressStorehouseImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { AddressStorehouseImportingLogModel } from "../../src/graphql/modules/addressStorehouseImportingLog/addressStorehouseImportingLog.model";
import { getAdminContext } from "../utils/context";

let addressStorehouseImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllAddressStorehouseImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await addressStorehouseImportingLogResolver.Query.getAllAddressStorehouseImportingLog({}, {}, context);

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

describe("# Test createAddressStorehouseImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await addressStorehouseImportingLogResolver.Mutation.createAddressStorehouseImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    addressStorehouseImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneAddressStorehouseImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await addressStorehouseImportingLogResolver.Query.getOneAddressStorehouseImportingLog(
      {},
      { id: addressStorehouseImportingLog._id },
      context
    );

    console.log(addressStorehouseImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateAddressStorehouseImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressStorehouseImportingLogResolver.Mutation.updateAddressStorehouseImportingLog(
      {},
      {
        id: addressStorehouseImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    addressStorehouseImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneAddressStorehouseImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressStorehouseImportingLogResolver.Mutation.deleteOneAddressStorehouseImportingLog(
      {},
      {
        id: addressStorehouseImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(addressStorehouseImportingLog.id);
    done();
  });
});

describe("# Test deleteManyAddressStorehouseImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await AddressStorehouseImportingLogModel.create([
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

    let result: any = await addressStorehouseImportingLogResolver.Mutation.deleteManyAddressStorehouseImportingLog(
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
