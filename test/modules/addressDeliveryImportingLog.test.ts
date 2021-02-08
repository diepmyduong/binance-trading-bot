import addressDeliveryImportingLogResolver from "../../src/graphql/modules/addressDeliveryImportingLog/addressDeliveryImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { AddressDeliveryImportingLogModel } from "../../src/graphql/modules/addressDeliveryImportingLog/addressDeliveryImportingLog.model";
import { getAdminContext } from "../utils/context";

let addressDeliveryImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllAddressDeliveryImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await addressDeliveryImportingLogResolver.Query.getAllAddressDeliveryImportingLog({}, {}, context);

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

describe("# Test createAddressDeliveryImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await addressDeliveryImportingLogResolver.Mutation.createAddressDeliveryImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    addressDeliveryImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneAddressDeliveryImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await addressDeliveryImportingLogResolver.Query.getOneAddressDeliveryImportingLog(
      {},
      { id: addressDeliveryImportingLog._id },
      context
    );

    console.log(addressDeliveryImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateAddressDeliveryImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressDeliveryImportingLogResolver.Mutation.updateAddressDeliveryImportingLog(
      {},
      {
        id: addressDeliveryImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    addressDeliveryImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneAddressDeliveryImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressDeliveryImportingLogResolver.Mutation.deleteOneAddressDeliveryImportingLog(
      {},
      {
        id: addressDeliveryImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(addressDeliveryImportingLog.id);
    done();
  });
});

describe("# Test deleteManyAddressDeliveryImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await AddressDeliveryImportingLogModel.create([
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

    let result: any = await addressDeliveryImportingLogResolver.Mutation.deleteManyAddressDeliveryImportingLog(
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
