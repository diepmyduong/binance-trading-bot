import luckyWheelGiftResolver from "../../src/graphql/modules/luckyWheelGift/luckyWheelGift.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { LuckyWheelGiftModel } from "../../src/graphql/modules/luckyWheelGift/luckyWheelGift.model";
import { getAdminContext } from "../utils/context";

let luckyWheelGift: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllLuckyWheelGift", () => {
  it("shold return an array", async (done) => {
    let result = await luckyWheelGiftResolver.Query.getAllLuckyWheelGift({}, {}, context);

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

describe("# Test createLuckyWheelGift", () => {
  it("shold return an array", async (done) => {
    let result: any = await luckyWheelGiftResolver.Mutation.createLuckyWheelGift(
      {},
      { data },
      context
    );
    result = result.toJSON();
    luckyWheelGift = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneLuckyWheelGift", () => {
  it("shold return an object", async (done) => {
    let result: any = await luckyWheelGiftResolver.Query.getOneLuckyWheelGift(
      {},
      { id: luckyWheelGift._id },
      context
    );

    console.log(luckyWheelGift);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateLuckyWheelGift", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await luckyWheelGiftResolver.Mutation.updateLuckyWheelGift(
      {},
      {
        id: luckyWheelGift._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    luckyWheelGift = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneLuckyWheelGift", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await luckyWheelGiftResolver.Mutation.deleteOneLuckyWheelGift(
      {},
      {
        id: luckyWheelGift._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(luckyWheelGift.id);
    done();
  });
});

describe("# Test deleteManyLuckyWheelGift", () => {
  it("shold return an object", async (done) => {
    let records = await LuckyWheelGiftModel.create([
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

    let result: any = await luckyWheelGiftResolver.Mutation.deleteManyLuckyWheelGift(
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
