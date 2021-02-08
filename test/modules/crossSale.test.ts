import crossSaleResolver from "../../src/graphql/modules/crossSale/crossSale.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { CrossSaleModel } from "../../src/graphql/modules/crossSale/crossSale.model";
import { getAdminContext } from "../utils/context";

let crossSale: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllCrossSale", () => {
  it("shold return an array", async (done) => {
    let result = await crossSaleResolver.Query.getAllCrossSale({}, {}, context);

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

describe("# Test createCrossSale", () => {
  it("shold return an array", async (done) => {
    let result: any = await crossSaleResolver.Mutation.createCrossSale(
      {},
      { data },
      context
    );
    result = result.toJSON();
    crossSale = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneCrossSale", () => {
  it("shold return an object", async (done) => {
    let result: any = await crossSaleResolver.Query.getOneCrossSale(
      {},
      { id: crossSale._id },
      context
    );

    console.log(crossSale);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateCrossSale", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await crossSaleResolver.Mutation.updateCrossSale(
      {},
      {
        id: crossSale._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    crossSale = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneCrossSale", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await crossSaleResolver.Mutation.deleteOneCrossSale(
      {},
      {
        id: crossSale._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(crossSale.id);
    done();
  });
});

describe("# Test deleteManyCrossSale", () => {
  it("shold return an object", async (done) => {
    let records = await CrossSaleModel.create([
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

    let result: any = await crossSaleResolver.Mutation.deleteManyCrossSale(
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
