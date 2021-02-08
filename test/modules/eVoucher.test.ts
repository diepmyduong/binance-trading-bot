import eVoucherResolver from "../../src/graphql/modules/eVoucher/eVoucher.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { EVoucherModel } from "../../src/graphql/modules/eVoucher/eVoucher.model";
import { getAdminContext } from "../utils/context";

let eVoucher: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllEVoucher", () => {
  it("shold return an array", async (done) => {
    let result = await eVoucherResolver.Query.getAllEVoucher({}, {}, context);

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

describe("# Test createEVoucher", () => {
  it("shold return an array", async (done) => {
    let result: any = await eVoucherResolver.Mutation.createEVoucher(
      {},
      { data },
      context
    );
    result = result.toJSON();
    eVoucher = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneEVoucher", () => {
  it("shold return an object", async (done) => {
    let result: any = await eVoucherResolver.Query.getOneEVoucher(
      {},
      { id: eVoucher._id },
      context
    );

    console.log(eVoucher);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateEVoucher", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await eVoucherResolver.Mutation.updateEVoucher(
      {},
      {
        id: eVoucher._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    eVoucher = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneEVoucher", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await eVoucherResolver.Mutation.deleteOneEVoucher(
      {},
      {
        id: eVoucher._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(eVoucher.id);
    done();
  });
});

describe("# Test deleteManyEVoucher", () => {
  it("shold return an object", async (done) => {
    let records = await EVoucherModel.create([
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

    let result: any = await eVoucherResolver.Mutation.deleteManyEVoucher(
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
