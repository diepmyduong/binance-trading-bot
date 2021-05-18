var crypto = require('crypto');
var RSAXML = require('rsa-xml');
const NodeRSA = require('node-rsa');
var getPem = require('rsa-pem-from-mod-exp');

const body = {
  "Data": "{\"Id\":\"00000000-0000-0000-0000-000000000000\",\"ItemCode\":null,\"CustomerId\":null,\"CustomerCode\":null,\"OrderCode\":null,\"OrderStatusId\":0,\"ShippingStatusId\":0,\"PaymentStatusId\":0,\"ServiceId\":null,\"ServiceName\":null,\"SenderFullname\":null,\"SenderAddress\":null,\"SenderTel\":null,\"ReceiverFullname\":null,\"ReceiverAddress\":null,\"ReceiverTel\":null,\"SenderProvinceId\":null,\"SenderDistrictId\":null,\"ReceiverProvinceId\":null,\"ReceiverDistrictId\":null,\"ShipperTel\":null,\"OrderAmount\":null,\"CodAmount\":0.0,\"TotalFreightExcludeVat\":0.0,\"TotalFreightIncludeVat\":0.0,\"VatFreight\":0.0,\"ShippingFreight\":0.0,\"VasFreight\":0.0,\"CodFreight\":0.0,\"FuelFreight\":null,\"RegionFreight\":null,\"TotalFreightExcludeVatEvaluation\":0.0,\"TotalFreightIncludeVatEvaluation\":0.0,\"VatFreightEvaluation\":0.0,\"ShippingFreightEvaluation\":0.0,\"VasFreightEvaluation\":0.0,\"CodFreightEvaluation\":0.0,\"FuelFreightEvaluation\":null,\"RegionFreightEvaluation\":null,\"PackageContent\":null,\"PickupType\":null,\"IsPackageViewable\":null,\"Weight\":0.0,\"WeightConvert\":0.0,\"Width\":0.0,\"Length\":0.0,\"Height\":0.0,\"ValueAddedServiceList\":null,\"Opt\":null,\"AcceptancePoscode\":null,\"DestinationPoscode\":null,\"DeliveryID\":0,\"ToPOSCode\":null,\"CauseCode\":null,\"DeliveryTimes\":0,\"DeliveryNote\":null,\"CauseName\":null,\"InputTime\":null,\"IsDeliverable\":false,\"IsReturn\":false,\"SolutionName\":null,\"SolutionCode\":null,\"DeliveryTime\":null,\"BccpCreateTime\":null,\"BccpLastUpdateTime\":null,\"PaypostTracedate\":null,\"PaypostTransferDate\":null,\"PaypostStatus\":0,\"CancelTime\":null,\"CancelNotes\":null,\"CancelStatus\":null,\"CancelStatusDesc\":null,\"SendingTime\":null,\"VendorId\":0,\"CreateTime\":\"0001-01-01T00:00:00\",\"LastUpdateTime\":null,\"SenderWardId\":null,\"ReceiverWardId\":null,\"IsReceiverPayFreight\":null,\"DeliveryDateEvaluation\":null,\"WidthEvaluation\":null,\"LengthEvaluation\":null,\"HeightEvaluation\":null,\"WeightEvaluation\":null,\"ServiceDisplayName\":null,\"CustomerNote\":null,\"CodAmountEvaluation\":null,\"OrderAmountEvaluation\":null,\"OriginalCodAmountEvaluation\":null,\"OldCustomerCode\":null,\"OldAcceptancePoscode\":null,\"OldToPOSCode\":null,\"OldReceiverTel\":null,\"BatchCode\":null,\"CodAmountNotForBatch\":null,\"SenderAddressType\":null,\"ReceiverAddressType\":null,\"AdditionalDatas\":null,\"SoLanIn\":null}",
  "SendDate": "2021-05-17T21:40:09",
  "SignData": "R2fBbeZnWUSJ1LYRwZ7x/A4vq/N2pP8TcuK2TPmag41E4kEpyXk/cJKiTyghjfdIhV30h8JI2WYTNYm/T9IwK8ei94bGjCSuhYQSRJuZhZx2batoamMz/thTP9ApT7xCxlmHl+dYD4GFAo/iLNUXl8yWHR3XrBhUqmVSOjjII3Hyuo5cMcUUVRRy36pPDT6qko3fBrQt+tRKYQlCMfBRrudcj4sRVm9NOBDl6G6nxy75P7im9oNWHG8UJVN6+Gsec0ZvNXaLTyaQP7ETdxVrJb6X5n9oN5OohdJvcHCu+3Yntg+O8UfxSEda2xTasgPGdLOTz9DtEAiorGzFx8YPWQ=="
}

const publicKey = `1f+tcjKxQuW4Tht+BOvCo2IJP3POSOA1SaqN6EfWQbSOa81zw8urjytsEtVPwzjgY548X2wmJYZt86WNXGt8x7SVglP5NRprn6PK2jF50Zful/05T8FBsYDcWmdDzOAuwwg97hhQ2X9Q/xkbKWOUZZJPY4py0LB8ZaBK06t/2Vk=`;
const publicKey2 = "3G3hLSrPwF4FBBA/0yEZkNwX2++SSCIaGKeb8TBb6loc3NRSvo0oDR0dO7c6bk/CgizQ7ZT0d/rlZunV4UbP2gzVl3p6VN2ykoDhnmdGClk1+js6EqWIWztZrcF2mAq0s3OHIH4tLnLIGWbMws1nQNRUoJDwfGVSZcLzFnWRWb21kYjpSbu44Y2IiQX6y3n2YR9VPyxI9VMYkrTvdzN/cTFyRhrPaH15pXzkQ8zQl561mSYGcucJl56GX9hRaho5zuNSNWq+oVXdIBE6UOVVX4TXJJJw+iKlLYO/2OryJ3fNLKWajBaYGzxZ6QLjpfr/HYtAPGLARLtDtean7JjE5Q==";

const publicKey3 = `<RSAKeyValue><Modulus>1f+tcjKxQuW4Tht+BOvCo2IJP3POSOA1SaqN6EfWQbSOa81zw8urjytsEtVPwzjgY548X2wmJYZt86WNXGt8x7SVglP5NRprn6PK2jF50Zful/05T8FBsYDcWmdDzOAuwwg97hhQ2X9Q/xkbKWOUZZJPY4py0LB8ZaBK06t/2Vk=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>`

const publicKey4 = `<RSAKeyValue><Modulus>3G3hLSrPwF4FBBA/0yEZkNwX2++SSCIaGKeb8TBb6loc3NRSvo0oDR0dO7c6bk/CgizQ7ZT0d/rlZunV4UbP2gzVl3p6VN2ykoDhnmdGClk1+js6EqWIWztZrcF2mAq0s3OHIH4tLnLIGWbMws1nQNRUoJDwfGVSZcLzFnWRWb21kYjpSbu44Y2IiQX6y3n2YR9VPyxI9VMYkrTvdzN/cTFyRhrPaH15pXzkQ8zQl561mSYGcucJl56GX9hRaho5zuNSNWq+oVXdIBE6UOVVX4TXJJJw+iKlLYO/2OryJ3fNLKWajBaYGzxZ6QLjpfr/HYtAPGLARLtDtean7JjE5Q==</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>`;

const publicKey5 = `<RSAKeyValue><Modulus>1f+tcjKxQuW4Tht+BOvCo2IJP3POSOA1SaqN6EfWQb
SOa81zw8urjytsEtVPwzjgY548X2wmJYZt86WNXGt8x7SVglP5NRprn6PK2jF50Zfu
l/05T8FBsYDcWmdDzOAuwwg97hhQ2X9Q/xkbKWOUZZJPY4py0LB8ZaBK06t/2
Vk=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>`;

const publicKey6 = `<RSAKeyValue><Modulus>3G3hLSrPwF4FBBA/0yEZkNwX2++SSCIaGKeb8TBb6
loc3NRSvo0oDR0dO7c6bk/CgizQ7ZT0d/rlZunV4UbP2gzVl3p6VN2ykoDhnmdGClk
1+js6EqWIWztZrcF2mAq0s3OHIH4tLnLIGWbMws1nQNRUoJDwfGVSZcLzFnWR
Wb21kYjpSbu44Y2IiQX6y3n2YR9VPyxI9VMYkrTvdzN/cTFyRhrPaH15pXzkQ8zQ
l561mSYGcucJl56GX9hRaho5zuNSNWq+oVXdIBE6UOVVX4TXJJJw+iKlLYO/2O
ryJ3fNLKWajBaYGzxZ6QLjpfr/HYtAPGLARLtDtean7JjE5Q==</Modulus><Expon
ent>AQAB</Exponent></RSAKeyValue>`;

const test = `<RSAKeyValue><Modulus>51l+rhtsFd/CsNoE9Uoduj+KEjwAvafTfb57vev+wovQn7hUDkw9BmUL97RH/sh/nuSvBIwDdeUVSg2Ciz8lNLrf4Y5e2b55KMePsGyHWoZmxinGPS7ur4KJHOfeBa+GxdC8/4pWBJ6E+pBj3dCbPDPKYVz7DQMHdXcQZ4Bq4v8=</Modulus><Exponent>AQAB</Exponent><P>+QvGlLMxjvLhrEf/ZoMuVIAGNq1xzaJmpfBka4t3lcDYGlhQR59vsYaNDl3U43iUYgrXkCmlUgEpyApTKNa/tQ==</P><Q>7c843Eetk3JjxAQD1JPh4C1N6Crx+dX5cIy5gldcd789XzrESgSP8DX7ySjnOeWflDvirGHzaSWvfVi3J5vAYw==</Q><DP>ORDasu4QmAnNbjWdLzc14YToZ5T8s7rXvIRF7mKpxzXGDttXoeHFrS8AmV8kze6uSXzkghMY356GnWDIR15V1Q==</DP><DQ>HyT/dmHwypm1lStNcR64+0oTpO9S53xtgZ78gKR+WLR0Di+9G1CDpVr8kbjIp516C8jYA+mEHmYwGINw4UAVrw==</DQ><InverseQ>RUz0T08x6Rhx8SdLCgPUsMzrJoojB6CNdv2JNpsZ7cgsY508DB00wodBQkzotHbtAXSkUl7gtAr4LiEz5NENzg==</InverseQ><D>IVeOFin16rR20DB+V3BTls89JxdGZLmmatsZkAvONHFHDhstjhP3FZAEPgeu+pgggHYP3UAP6EgC80sS0zO0uOhtPb349e9+6Zxe22aietY1ZlYPOm5v/XlNGfXNed/n8TaBYDpwbvSUL4Oc5xRNyagSlx2/F7Xw4pdBl4poKgU=</D></RSAKeyValue>`;

(async function() {
  const stringToSign = body.Data + body.SendDate;
  // console.log('stringToSign', stringToSign);
  const byteToSign = Buffer.from(stringToSign, 'utf-8');
  const byteAfterHash = hashSHA256(byteToSign);
  const signatureByte = Buffer.from(body.SignData, 'base64');
  // console.log('signatureByte', signatureByte);
  const pem = getPem(publicKey2, 'AQAB');
  console.log('pem', pem);
  const key = new NodeRSA(pem);
  // const decrypt = key.decrypt(body.SignData);
  const decryptPublic = key.decryptPublic(body.SignData, 'base64');
  // const signatureByteAfterDecrypt = decryptSHA256v3(body.SignData, test);
  console.log("byteAfterHash", byteAfterHash);
  // console.log("signatureByteAfterDecrypt", decrypt);
  console.log("signatureByteAfterDecrypt", decryptPublic);
  console.log(decryptPublic == byteAfterHash);

  const test = crypto.verify(
    "sha256",
    Buffer.from(stringToSign, 'utf-8'),
    {
      key: pem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(body.SignData, 'base64')
  )
  console.log('test', test);
})();

function stringToUint(string) {
    var string = btoa(unescape(encodeURIComponent(string))),
        charList = string.split(''),
        uintArray = [];
    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
}

function stringToUnit2(string) {
  return new TextEncoder('utf-8').encode(string);
}

function hashSHA256(bytes) {
  const hash = crypto.createHash("sha256");
  return hash.update(bytes).digest('base64');
}

function decryptSHA256(bytes, key) {
  const hash = crypto.createHmac('sha256', key);
  return hash.update(bytes).digest('base64');
}

// function _base64ToArrayBuffer(base64) {
//   var binary_string = Buffer.from(base64, 'base64').toString();
//   var len = binary_string.length;
//   var bytes = new Uint8Array(len);
//   for (var i = 0; i < len; i++) {
//       bytes[i] = binary_string.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

function decryptSHA256v2(data, key) {
  const decryptedData = crypto.privateDecrypt(
    {
      key: key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    data
  )
  return decryptedData.toString();
}

function decryptSHA256v3(data, key) {
  var rsa = new RSAXML();
  console.log('key', key);
  rsa.importKey(key);
  var decrypted = rsa.decrypt(data);
  return decrypted;
}
