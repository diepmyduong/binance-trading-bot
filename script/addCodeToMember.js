const { MemberModel } = require("../dist/graphql/modules/member/member.model");
const { memberService } = require("../dist/graphql/modules/member/member.service");


async function run() {
  const members = await MemberModel.find({ code: { $exists: false } });
  for (const m of members) {
    m.code = await memberService.generateCode();
    await m.save();
  }
  console.log("done");
  process.exit();
}

run();
