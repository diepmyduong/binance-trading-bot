import addressDeliveryResolver from "../../src/graphql/modules/addressDelivery/addressDelivery.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { AddressDeliveryModel } from "../../src/graphql/modules/addressDelivery/addressDelivery.model";
import { getAdminContext } from "../utils/context";

let addressDelivery: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllAddressDelivery", () => {
  it("shold return an array", async (done) => {
    let result = await addressDeliveryResolver.Query.getAllAddressDelivery({}, {}, context);

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

describe("# Test createAddressDelivery", () => {
  it("shold return an array", async (done) => {
    let result: any = await addressDeliveryResolver.Mutation.createAddressDelivery(
      {},
      { data },
      context
    );
    result = result.toJSON();
    addressDelivery = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneAddressDelivery", () => {
  it("shold return an object", async (done) => {
    let result: any = await addressDeliveryResolver.Query.getOneAddressDelivery(
      {},
      { id: addressDelivery._id },
      context
    );

    console.log(addressDelivery);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateAddressDelivery", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressDeliveryResolver.Mutation.updateAddressDelivery(
      {},
      {
        id: addressDelivery._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    addressDelivery = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneAddressDelivery", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await addressDeliveryResolver.Mutation.deleteOneAddressDelivery(
      {},
      {
        id: addressDelivery._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(addressDelivery.id);
    done();
  });
});

describe("# Test deleteManyAddressDelivery", () => {
  it("shold return an object", async (done) => {
    let records = await AddressDeliveryModel.create([
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

    let result: any = await addressDeliveryResolver.Mutation.deleteManyAddressDelivery(
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
