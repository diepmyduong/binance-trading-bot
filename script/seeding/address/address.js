const { AddressModel } = require('../dist/graphql/modules/address/address.model');
const data = require('./address.json');
let addressAr = [];

async function run() {
  for (let province of data) {
    addressAr.push(
      new AddressModel({
        province: province.pn,
        provinceId: province.pid
      })
    );
    console.log(province.pn)
    for (let district of province.ds) {
      addressAr.push(
        new AddressModel({
          province: province.pn,
          provinceId: province.pid,
          district: district.dn,
          districtId: district.did,
        })
      );
      console.log(district.dn)
      for (let ward of district.ws) {
        addressAr.push(
          new AddressModel({
            province: province.pn,
            provinceId: province.pid,
            district: district.dn,
            districtId: district.did,
            ward: ward.wn,
            wardId: ward.wid,
          })
        );
        console.log(ward.wn)
      }
    }
  }
  console.log('insterting', addressAr.length)
  let insert = await AddressModel.insertMany(addressAr).catch(error => console.log(error));
  console.log('done: ', insert.length);
}
run();
