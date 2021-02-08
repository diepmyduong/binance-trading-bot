import positionResolver from "../../src/graphql/modules/position/position.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { PositionModel } from "../../src/graphql/modules/position/position.model";
import { getAdminContext } from "../utils/context";

let position: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllPosition", () => {
  it("shold return an array", async (done) => {
    let result = await positionResolver.Query.getAllPosition({}, {}, context);

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

describe("# Test createPosition", () => {
  it("shold return an array", async (done) => {
    let result: any = await positionResolver.Mutation.createPosition(
      {},
      { data },
      context
    );
    result = result.toJSON();
    position = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOnePosition", () => {
  it("shold return an object", async (done) => {
    let result: any = await positionResolver.Query.getOnePosition(
      {},
      { id: position._id },
      context
    );

    console.log(position);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updatePosition", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await positionResolver.Mutation.updatePosition(
      {},
      {
        id: position._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    position = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOnePosition", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await positionResolver.Mutation.deleteOnePosition(
      {},
      {
        id: position._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(position.id);
    done();
  });
});

describe("# Test deleteManyPosition", () => {
  it("shold return an object", async (done) => {
    let records = await PositionModel.create([
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

    let result: any = await positionResolver.Mutation.deleteManyPosition(
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
