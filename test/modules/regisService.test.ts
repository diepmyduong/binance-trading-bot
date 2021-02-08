import regisServiceResolver from "../../src/graphql/modules/regisService/regisService.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { RegisServiceModel } from "../../src/graphql/modules/regisService/regisService.model";
import { getAdminContext } from "../utils/context";

let regisService: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllRegisService", () => {
  it("shold return an array", async (done) => {
    let result = await regisServiceResolver.Query.getAllRegisService({}, {}, context);

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

describe("# Test createRegisService", () => {
  it("shold return an array", async (done) => {
    let result: any = await regisServiceResolver.Mutation.createRegisService(
      {},
      { data },
      context
    );
    result = result.toJSON();
    regisService = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneRegisService", () => {
  it("shold return an object", async (done) => {
    let result: any = await regisServiceResolver.Query.getOneRegisService(
      {},
      { id: regisService._id },
      context
    );

    console.log(regisService);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateRegisService", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisServiceResolver.Mutation.updateRegisService(
      {},
      {
        id: regisService._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    regisService = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneRegisService", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisServiceResolver.Mutation.deleteOneRegisService(
      {},
      {
        id: regisService._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(regisService.id);
    done();
  });
});

describe("# Test deleteManyRegisService", () => {
  it("shold return an object", async (done) => {
    let records = await RegisServiceModel.create([
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

    let result: any = await regisServiceResolver.Mutation.deleteManyRegisService(
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
