import chatBotResolver from "../../src/graphql/modules/chatBot/chatBot.resolver";
import { expect } from "chai";
import { ROLES } from "../../src/constants/role.const";
import faker from "faker";
import { ChatBotModel } from "../../src/graphql/modules/chatBot/chatBot.model";
import { getAdminContext } from "../utils/context";

let chatBot: any = {};
let data = {
  name: faker.name.jobTitle(),
};
let context = getAdminContext();

describe("# Test getAllChatBot", () => {
  it("shold return an array", async (done) => {
    let result = await chatBotResolver.Query.getAllChatBot({}, {}, context);

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

describe("# Test createChatBot", () => {
  it("shold return an array", async (done) => {
    let result: any = await chatBotResolver.Mutation.createChatBot(
      {},
      { data },
      context
    );
    result = result.toJSON();
    chatBot = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test getOneChatBot", () => {
  it("shold return an object", async (done) => {
    let result: any = await chatBotResolver.Query.getOneChatBot(
      {},
      { id: chatBot._id },
      context
    );

    console.log(chatBot);
    console.log(result);

    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test updateChatBot", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await chatBotResolver.Mutation.updateChatBot(
      {},
      {
        id: chatBot._id,
        data: data,
      },
      context
    );
    result = result.toJSON();
    chatBot = result;

    expect(result).to.be.an("object");
    expect(result.name).to.equal(data.name);
    done();
  });
});

describe("# Test deleteOneChatBot", () => {
  it("shold return an object", async (done) => {
    data.name = faker.name.title();
    let result: any = await chatBotResolver.Mutation.deleteOneChatBot(
      {},
      {
        id: chatBot._id,
      },
      context
    );
    result = result.toJSON();

    expect(result).to.be.an("object");
    expect(result.id).to.equal(chatBot.id);
    done();
  });
});

describe("# Test deleteManyChatBot", () => {
  it("shold return an object", async (done) => {
    let records = await ChatBotModel.create([
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

    let result: any = await chatBotResolver.Mutation.deleteManyChatBot(
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
