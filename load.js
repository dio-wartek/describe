const fs = require('fs');
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

module.exports = function load(fileDescriptorSet) {
  const descriptorSetBuffer = fs.readFileSync(fileDescriptorSet);
  return grpc.loadPackageDefinition(
    protoLoader.loadFileDescriptorSetFromBuffer(descriptorSetBuffer));
}
