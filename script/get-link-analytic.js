const { CollaboratorModel } = require('../dist/graphql/modules/collaborator/collaborator.model');
const { FacebookHelper } = require('../dist/helpers/facebook.helper');
(async function() {
  const collaborators = await CollaboratorModel.find({}).limit(50).exec();
  console.log(`Có ${collaborators.length} cộng tác viên`);
  const urls = collaborators.map(c => c.shortUrl);
  const token = "EAAAAZAw4FxQIBANt1IgZBbV2vNocX3xFxZBVkV3sYxDFSlmYvqNZC3xFCPKsgRoZBGP8n44btPQf9YTF8LK9L66e6slXSmxRVsa3aL0kQ2daE0DeIryPtRZAclpI81TYXBxZB3OoHuJhZAkhg6rohD3f9ZADXokaMHGhM2rfGDItnf0QbwZBJrf7OhxEsGrx4VA30ZD";
  const result = await FacebookHelper.batchEngagement(urls, token);
  console.log('result', result);
})();