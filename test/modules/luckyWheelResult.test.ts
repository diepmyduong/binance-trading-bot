import luckyWheelResultResolver from "../../src/graphql/modules/luckyWheelResult/luckyWheelResult.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { LuckyWheelResultModel } from "../../src/graphql/modules/luckyWheelResult/luckyWheelResult.model";
import { getAdminContext } from "../utils/context";

let luckyWheelResult: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllLuckyWheelResult", () => {
  it("shold return an array", async (done) => {
    let result = await luckyWheelResultResolver.Query.getAllLuckyWheelResult({}, {}, context);

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

describe("# Test createLuckyWheelResult", () => {
  it("shold return an array", async (done) => {
    let result: any = await luckyWheelResultResolver.Mutation.createLuckyWheelResult(
      {},
      { data },
      context
    );
    result = result.toJSON();
    luckyWheelResult = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneLuckyWheelResult", () => {
  it("shold return an object", async (done) => {
    let result: any = await luckyWheelResultResolver.Query.getOneLuckyWheelResult(
      {},
      { id: luckyWheelResult._id },
      context
    );

    console.log(luckyWheelResult);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateLuckyWheelResult", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await luckyWheelResultResolver.Mutation.updateLuckyWheelResult(
      {},
      {
        id: luckyWheelResult._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    luckyWheelResult = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneLuckyWheelResult", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await luckyWheelResultResolver.Mutation.deleteOneLuckyWheelResult(
      {},
      {
        id: luckyWheelResult._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(luckyWheelResult.id);
    done();
  });
});

describe("# Test deleteManyLuckyWheelResult", () => {
  it("shold return an object", async (done) => {
    let records = await LuckyWheelResultModel.create([
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

    let result: any = await luckyWheelResultResolver.Mutation.deleteManyLuckyWheelResult(
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
