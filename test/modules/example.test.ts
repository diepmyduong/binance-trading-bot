import exampleResolver from "../../src/graphql/modules/example/example.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ExampleModel } from "../../src/graphql/modules/example/example.model";
import { getAdminContext } from "../utils/context";

let example: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllExample", () => {
  it("shold return an array", async (done) => {
    let result = await exampleResolver.Query.getAllExample({}, {}, context);

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

describe("# Test createExample", () => {
  it("shold return an array", async (done) => {
    let result: any = await exampleResolver.Mutation.createExample({}, { data }, context);
    result = result.toJSON();
    example = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneExample", () => {
  it("shold return an object", async (done) => {
    let result: any = await exampleResolver.Query.getOneExample({}, { id: example._id }, context);

    console.log(example);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateExample", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await exampleResolver.Mutation.updateExample(
      {},
      {
        id: example._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    example = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneExample", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await exampleResolver.Mutation.deleteOneExample(
      {},
      {
        id: example._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(example.id);
    done();
  });
});

describe("# Test deleteManyExample", () => {
  it("shold return an object", async (done) => {
    let records = await ExampleModel.create([
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

    let result: any = await exampleResolver.Mutation.deleteManyExample(
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
