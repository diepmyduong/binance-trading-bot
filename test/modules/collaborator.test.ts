import collaboratorResolver from "../../src/graphql/modules/collaborator/collaborator.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CollaboratorModel } from "../../src/graphql/modules/collaborator/collaborator.model";
import { getAdminContext } from "../utils/context";

let collaborator: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCollaborator", () => {
  it("shold return an array", async (done) => {
    let result = await collaboratorResolver.Query.getAllCollaborator({}, {}, context);

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

describe("# Test createCollaborator", () => {
  it("shold return an array", async (done) => {
    let result: any = await collaboratorResolver.Mutation.createCollaborator(
      {},
      { data },
      context
    );
    result = result.toJSON();
    collaborator = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCollaborator", () => {
  it("shold return an object", async (done) => {
    let result: any = await collaboratorResolver.Query.getOneCollaborator(
      {},
      { id: collaborator._id },
      context
    );

    console.log(collaborator);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCollaborator", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorResolver.Mutation.updateCollaborator(
      {},
      {
        id: collaborator._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    collaborator = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCollaborator", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorResolver.Mutation.deleteOneCollaborator(
      {},
      {
        id: collaborator._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(collaborator.id);
    done();
  });
});

describe("# Test deleteManyCollaborator", () => {
  it("shold return an object", async (done) => {
    let records = await CollaboratorModel.create([
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

    let result: any = await collaboratorResolver.Mutation.deleteManyCollaborator(
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
