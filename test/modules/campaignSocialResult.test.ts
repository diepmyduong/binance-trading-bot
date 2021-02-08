import campaignSocialResultResolver from "../../src/graphql/modules/campaignSocialResult/campaignSocialResult.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CampaignSocialResultModel } from "../../src/graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { getAdminContext } from "../utils/context";

let campaignSocialResult: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCampaignSocialResult", () => {
  it("shold return an array", async (done) => {
    let result = await campaignSocialResultResolver.Query.getAllCampaignSocialResult({}, {}, context);

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

describe("# Test createCampaignSocialResult", () => {
  it("shold return an array", async (done) => {
    let result: any = await campaignSocialResultResolver.Mutation.createCampaignSocialResult(
      {},
      { data },
      context
    );
    result = result.toJSON();
    campaignSocialResult = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCampaignSocialResult", () => {
  it("shold return an object", async (done) => {
    let result: any = await campaignSocialResultResolver.Query.getOneCampaignSocialResult(
      {},
      { id: campaignSocialResult._id },
      context
    );

    console.log(campaignSocialResult);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCampaignSocialResult", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await campaignSocialResultResolver.Mutation.updateCampaignSocialResult(
      {},
      {
        id: campaignSocialResult._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    campaignSocialResult = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCampaignSocialResult", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await campaignSocialResultResolver.Mutation.deleteOneCampaignSocialResult(
      {},
      {
        id: campaignSocialResult._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(campaignSocialResult.id);
    done();
  });
});

describe("# Test deleteManyCampaignSocialResult", () => {
  it("shold return an object", async (done) => {
    let records = await CampaignSocialResultModel.create([
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

    let result: any = await campaignSocialResultResolver.Mutation.deleteManyCampaignSocialResult(
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
