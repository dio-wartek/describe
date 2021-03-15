const path = require('path');
const fromData = require('./bindings');
const GrpcServer = require('./');
const data = require('./data.json');

const server = new GrpcServer();
const fileDescriptorSet = path.join(__dirname, 'image.bin');

const bindings = fromData.create(
  data.bindings,
  fileDescriptorSet
);

server.use({
  fileDescriptorSet,
  bindings,
}).start('127.0.0.1:50051', () => { });
