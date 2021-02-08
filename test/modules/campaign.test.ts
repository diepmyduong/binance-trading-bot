import campaignResolver from "../../src/graphql/modules/campaign/campaign.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CampaignModel } from "../../src/graphql/modules/campaign/campaign.model";
import { getAdminContext } from "../utils/context";

let campaign: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCampaign", () => {
  it("shold return an array", async (done) => {
    let result = await campaignResolver.Query.getAllCampaign({}, {}, context);

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

describe("# Test createCampaign", () => {
  it("shold return an array", async (done) => {
    let result: any = await campaignResolver.Mutation.createCampaign(
      {},
      { data },
      context
    );
    result = result.toJSON();
    campaign = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCampaign", () => {
  it("shold return an object", async (done) => {
    let result: any = await campaignResolver.Query.getOneCampaign(
      {},
      { id: campaign._id },
      context
    );

    console.log(campaign);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCampaign", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await campaignResolver.Mutation.updateCampaign(
      {},
      {
        id: campaign._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    campaign = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCampaign", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await campaignResolver.Mutation.deleteOneCampaign(
      {},
      {
        id: campaign._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(campaign.id);
    done();
  });
});

describe("# Test deleteManyCampaign", () => {
  it("shold return an object", async (done) => {
    let records = await CampaignModel.create([
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

    let result: any = await campaignResolver.Mutation.deleteManyCampaign(
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
