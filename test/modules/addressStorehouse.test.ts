import addressStorehouseResolver from "../../src/graphql/modules/addressStorehouse/addressStorehouse.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { AddressStorehouseModel } from "../../src/graphql/modules/addressStorehouse/addressStorehouse.model";
import { getAdminContext } from "../utils/context";

let addressStorehouse: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllAddressStorehouse", () => {
  it("shold return an array", async (done) => {
    let result = await addressStorehouseResolver.Query.getAllAddressStorehouse({}, {}, context);

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

describe("# Test createAddressStorehouse", () => {
  it("shold return an array", async (done) => {
    let result: any = await addressStorehouseResolver.Mutation.createAddressStorehouse(
      {},
      { data },
      context
    );
    result = result.toJSON();
    addressStorehouse = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneAddressStorehouse", () => {
  it("shold return an object", async (done) => {
    let result: any = await addressStorehouseResolver.Query.getOneAddressStorehouse(
      {},
      { id: addressStorehouse._id },
      context
    );

    console.log(addressStorehouse);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateAddressStorehouse", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressStorehouseResolver.Mutation.updateAddressStorehouse(
      {},
      {
        id: addressStorehouse._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    addressStorehouse = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneAddressStorehouse", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressStorehouseResolver.Mutation.deleteOneAddressStorehouse(
      {},
      {
        id: addressStorehouse._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(addressStorehouse.id);
    done();
  });
});

describe("# Test deleteManyAddressStorehouse", () => {
  it("shold return an object", async (done) => {
    let records = await AddressStorehouseModel.create([
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

    let result: any = await addressStorehouseResolver.Mutation.deleteManyAddressStorehouse(
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
