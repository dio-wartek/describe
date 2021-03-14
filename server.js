const path = require('path');
const fromData = require('./bindings');
const GrpcServer = require('./');
const data = require('./data.json');

const server = new GrpcServer();

const bindings = fromData.create(
  data.bindings,
  'image.bin'
);

server.use({
  fileDescriptorSet: 'image.bin',
  bindings,
}).start('0.0.0.0:50051', () => { });
