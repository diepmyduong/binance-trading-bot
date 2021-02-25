import collaboratorImportingLogResolver from "../../src/graphql/modules/collaboratorImportingLog/collaboratorImportingLog.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CollaboratorImportingLogModel } from "../../src/graphql/modules/collaboratorImportingLog/collaboratorImportingLog.model";
import { getAdminContext } from "../utils/context";

let collaboratorImportingLog: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCollaboratorImportingLog", () => {
  it("shold return an array", async (done) => {
    let result = await collaboratorImportingLogResolver.Query.getAllCollaboratorImportingLog({}, {}, context);

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

describe("# Test createCollaboratorImportingLog", () => {
  it("shold return an array", async (done) => {
    let result: any = await collaboratorImportingLogResolver.Mutation.createCollaboratorImportingLog(
      {},
      { data },
      context
    );
    result = result.toJSON();
    collaboratorImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCollaboratorImportingLog", () => {
  it("shold return an object", async (done) => {
    let result: any = await collaboratorImportingLogResolver.Query.getOneCollaboratorImportingLog(
      {},
      { id: collaboratorImportingLog._id },
      context
    );

    console.log(collaboratorImportingLog);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCollaboratorImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorImportingLogResolver.Mutation.updateCollaboratorImportingLog(
      {},
      {
        id: collaboratorImportingLog._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    collaboratorImportingLog = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCollaboratorImportingLog", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorImportingLogResolver.Mutation.deleteOneCollaboratorImportingLog(
      {},
      {
        id: collaboratorImportingLog._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(collaboratorImportingLog.id);
    done();
  });
});

describe("# Test deleteManyCollaboratorImportingLog", () => {
  it("shold return an object", async (done) => {
    let records = await CollaboratorImportingLogModel.create([
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

    let result: any = await collaboratorImportingLogResolver.Mutation.deleteManyCollaboratorImportingLog(
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
