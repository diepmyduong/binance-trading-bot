import { ExampleModel } from "../src/graphql/modules/example/example.model";
// import request from "request-promise";
// import { parse } from "json2csv";
// import fs from "fs";
// var faker = require("faker");
import faker from "faker";

let start = 1;
let end = 20;
let n = 1000;
faker.locale = "vi";

async function run() {
  await ExampleModel.deleteMany({});
  let arr = [];

  for (let i = 0; i < n; i++) {
    arr.push({
      name: faker.company.companyName(),
    });
  }

  console.log(arr);
  await ExampleModel.create(arr);
}

run();
