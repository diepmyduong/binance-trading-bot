import regisSMSResolver from "../../src/graphql/modules/regisSMS/regisSMS.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { RegisSMSModel } from "../../src/graphql/modules/regisSMS/regisSMS.model";
import { getAdminContext } from "../utils/context";

let regisSMS: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllRegisSMS", () => {
  it("shold return an array", async (done) => {
    let result = await regisSMSResolver.Query.getAllRegisSMS({}, {}, context);

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

describe("# Test createRegisSMS", () => {
  it("shold return an array", async (done) => {
    let result: any = await regisSMSResolver.Mutation.createRegisSMS(
      {},
      { data },
      context
    );
    result = result.toJSON();
    regisSMS = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneRegisSMS", () => {
  it("shold return an object", async (done) => {
    let result: any = await regisSMSResolver.Query.getOneRegisSMS(
      {},
      { id: regisSMS._id },
      context
    );

    console.log(regisSMS);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateRegisSMS", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisSMSResolver.Mutation.updateRegisSMS(
      {},
      {
        id: regisSMS._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    regisSMS = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneRegisSMS", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await regisSMSResolver.Mutation.deleteOneRegisSMS(
      {},
      {
        id: regisSMS._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(regisSMS.id);
    done();
  });
});

describe("# Test deleteManyRegisSMS", () => {
  it("shold return an object", async (done) => {
    let records = await RegisSMSModel.create([
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

    let result: any = await regisSMSResolver.Mutation.deleteManyRegisSMS(
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
