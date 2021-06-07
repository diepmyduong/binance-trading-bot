import bannerResolver from "../../src/graphql/modules/banner/banner.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { BannerModel } from "../../src/graphql/modules/banner/banner.model";
import { getAdminContext } from "../utils/context";

let banner: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllBanner", () => {
  it("shold return an array", async (done) => {
    let result = await bannerResolver.Query.getAllBanner({}, {}, context);

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

describe("# Test createBanner", () => {
  it("shold return an array", async (done) => {
    let result: any = await bannerResolver.Mutation.createBanner(
      {},
      { data },
      context
    );
    result = result.toJSON();
    banner = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneBanner", () => {
  it("shold return an object", async (done) => {
    let result: any = await bannerResolver.Query.getOneBanner(
      {},
      { id: banner._id },
      context
    );

    console.log(banner);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateBanner", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await bannerResolver.Mutation.updateBanner(
      {},
      {
        id: banner._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    banner = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneBanner", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await bannerResolver.Mutation.deleteOneBanner(
      {},
      {
        id: banner._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(banner.id);
    done();
  });
});

describe("# Test deleteManyBanner", () => {
  it("shold return an object", async (done) => {
    let records = await BannerModel.create([
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

    let result: any = await bannerResolver.Mutation.deleteManyBanner(
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
