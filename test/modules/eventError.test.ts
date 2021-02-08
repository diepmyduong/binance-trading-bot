import eventErrorResolver from "../../src/graphql/modules/eventError/eventError.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { EventErrorModel } from "../../src/graphql/modules/eventError/eventError.model";
import { getAdminContext } from "../utils/context";

let eventError: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllEventError", () => {
  it("shold return an array", async (done) => {
    let result = await eventErrorResolver.Query.getAllEventError({}, {}, context);

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

// describe("# Test createEventError", () => {
//   it("shold return an array", async (done) => {
//     let result: any = await eventErrorResolver.Mutation.createEventError(
//       {},
//       { data },
//       context
//     );
//     result = result.toJSON();
//     eventError = result;

//     expect(result).to.be.an("object");
//     expect(result.name).to.equal(data.name);
//     done();
//   });
// });

// describe("# Test getOneEventError", () => {
//   it("shold return an object", async (done) => {
//     let result: any = await eventErrorResolver.Query.getOneEventError(
//       {},
//       { id: eventError._id },
//       context
//     );

//     console.log(eventError);
//     console.log(result);

//     result = result.toJSON();

//     expect(result).to.be.an("object");
//     expect(result.name).to.equal(data.name);
//     done();
//   });
// });

// describe("# Test updateEventError", () => {
//   it("shold return an object", async (done) => {
//     data.name = faker.name.title();
//     let result: any = await eventErrorResolver.Mutation.updateEventError(
//       {},
//       {
//         id: eventError._id,
//         data: data,
//       },
//       context
//     );
//     result = result.toJSON();
//     eventError = result;

//     expect(result).to.be.an("object");
//     expect(result.name).to.equal(data.name);
//     done();
//   });
// });

// describe("# Test deleteOneEventError", () => {
//   it("shold return an object", async (done) => {
//     data.name = faker.name.title();
//     let result: any = await eventErrorResolver.Mutation.deleteOneEventError(
//       {},
//       {
//         id: eventError._id,
//       },
//       context
//     );
//     result = result.toJSON();

//     expect(result).to.be.an("object");
//     expect(result.id).to.equal(eventError.id);
//     done();
//   });
// });

// describe("# Test deleteManyEventError", () => {
//   it("shold return an object", async (done) => {
//     let records = await EventErrorModel.create([
//       {
//         name: faker.name.title(),
//       },
//       {
//         name: faker.name.title(),
//       },
//       {
//         name: faker.name.title(),
//       },
//     ]);

//     let ids = records.map((r) => r.get("id"));

//     let result: any = await eventErrorResolver.Mutation.deleteManyEventError(
//       {},
//       {
//         ids: ids,
//       },
//       context
//     );

//     expect(result).to.be.a("number");
//     expect(result).to.equal(records.length);
//     done();
//   });
// });
