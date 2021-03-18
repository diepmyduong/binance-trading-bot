import collaboratorProductResolver from "../../src/graphql/modules/collaboratorProduct/collaboratorProduct.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CollaboratorProductModel } from "../../src/graphql/modules/collaboratorProduct/collaboratorProduct.model";
import { getAdminContext } from "../utils/context";

let collaboratorProduct: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCollaboratorProduct", () => {
  it("shold return an array", async (done) => {
    let result = await collaboratorProductResolver.Query.getAllCollaboratorProduct({}, {}, context);

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

describe("# Test createCollaboratorProduct", () => {
  it("shold return an array", async (done) => {
    let result: any = await collaboratorProductResolver.Mutation.createCollaboratorProduct(
      {},
      { data },
      context
    );
    result = result.toJSON();
    collaboratorProduct = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCollaboratorProduct", () => {
  it("shold return an object", async (done) => {
    let result: any = await collaboratorProductResolver.Query.getOneCollaboratorProduct(
      {},
      { id: collaboratorProduct._id },
      context
    );

    console.log(collaboratorProduct);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCollaboratorProduct", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorProductResolver.Mutation.updateCollaboratorProduct(
      {},
      {
        id: collaboratorProduct._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    collaboratorProduct = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCollaboratorProduct", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorProductResolver.Mutation.deleteOneCollaboratorProduct(
      {},
      {
        id: collaboratorProduct._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(collaboratorProduct.id);
    done();
  });
});

describe("# Test deleteManyCollaboratorProduct", () => {
  it("shold return an object", async (done) => {
    let records = await CollaboratorProductModel.create([
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

    let result: any = await collaboratorProductResolver.Mutation.deleteManyCollaboratorProduct(
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
