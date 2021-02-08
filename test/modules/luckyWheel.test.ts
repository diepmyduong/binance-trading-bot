import luckyWheelResolver from "../../src/graphql/modules/luckyWheel/luckyWheel.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { LuckyWheelModel } from "../../src/graphql/modules/luckyWheel/luckyWheel.model";
import { getAdminContext } from "../utils/context";

let luckyWheel: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllLuckyWheel", () => {
  it("shold return an array", async (done) => {
    let result = await luckyWheelResolver.Query.getAllLuckyWheel({}, {}, context);

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

describe("# Test createLuckyWheel", () => {
  it("shold return an array", async (done) => {
    let result: any = await luckyWheelResolver.Mutation.createLuckyWheel(
      {},
      { data },
      context
    );
    result = result.toJSON();
    luckyWheel = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneLuckyWheel", () => {
  it("shold return an object", async (done) => {
    let result: any = await luckyWheelResolver.Query.getOneLuckyWheel(
      {},
      { id: luckyWheel._id },
      context
    );

    console.log(luckyWheel);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateLuckyWheel", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await luckyWheelResolver.Mutation.updateLuckyWheel(
      {},
      {
        id: luckyWheel._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    luckyWheel = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneLuckyWheel", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await luckyWheelResolver.Mutation.deleteOneLuckyWheel(
      {},
      {
        id: luckyWheel._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(luckyWheel.id);
    done();
  });
});

describe("# Test deleteManyLuckyWheel", () => {
  it("shold return an object", async (done) => {
    let records = await LuckyWheelModel.create([
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

    let result: any = await luckyWheelResolver.Mutation.deleteManyLuckyWheel(
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
