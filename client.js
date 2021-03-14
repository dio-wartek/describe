const get = require('lodash.get');
const fs = require('fs');
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

function createClient({
  fileDescriptorSet
}, address) {
  const descriptorSetBuffer = fs.readFileSync(fileDescriptorSet);
  const packageDefinition = grpc.loadPackageDefinition(
    protoLoader.loadFileDescriptorSetFromBuffer(descriptorSetBuffer));
  const examples = get(packageDefinition, 'wartek.guru.example.v1.Examples');
  return new examples(address, grpc.credentials.createInsecure());
}

const client = createClient({ fileDescriptorSet: 'image.bin' }, '0.0.0.0:50051');

client.createExample({ name: 'ok' }, (err, res) => {
  console.log(err, res);
});
