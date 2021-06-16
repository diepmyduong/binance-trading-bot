import collaboratorCampaignResolver from "../../src/graphql/modules/collaboratorCampaign/collaboratorCampaign.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CollaboratorCampaignModel } from "../../src/graphql/modules/collaboratorCampaign/collaboratorCampaign.model";
import { getAdminContext } from "../utils/context";

let collaboratorCampaign: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCollaboratorCampaign", () => {
  it("shold return an array", async (done) => {
    let result = await collaboratorCampaignResolver.Query.getAllCollaboratorCampaign({}, {}, context);

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

describe("# Test createCollaboratorCampaign", () => {
  it("shold return an array", async (done) => {
    let result: any = await collaboratorCampaignResolver.Mutation.createCollaboratorCampaign(
      {},
      { data },
      context
    );
    result = result.toJSON();
    collaboratorCampaign = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCollaboratorCampaign", () => {
  it("shold return an object", async (done) => {
    let result: any = await collaboratorCampaignResolver.Query.getOneCollaboratorCampaign(
      {},
      { id: collaboratorCampaign._id },
      context
    );

    console.log(collaboratorCampaign);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCollaboratorCampaign", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorCampaignResolver.Mutation.updateCollaboratorCampaign(
      {},
      {
        id: collaboratorCampaign._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    collaboratorCampaign = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCollaboratorCampaign", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await collaboratorCampaignResolver.Mutation.deleteOneCollaboratorCampaign(
      {},
      {
        id: collaboratorCampaign._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(collaboratorCampaign.id);
    done();
  });
});

describe("# Test deleteManyCollaboratorCampaign", () => {
  it("shold return an object", async (done) => {
    let records = await CollaboratorCampaignModel.create([
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

    let result: any = await collaboratorCampaignResolver.Mutation.deleteManyCollaboratorCampaign(
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
