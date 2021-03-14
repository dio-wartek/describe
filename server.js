const { create } = require('./bindings');
const GrpcServer = require('./');

const server = new GrpcServer();

const bindings = create([
  {
    name: 'wartek.guru.example.v1.Examples',
    mappings: {
      createExample: [
        { request: { name: "ok" }, response: { message: "nok" } },
        { request: { name: "haha" }, response: { message: "hihi" } }
      ]
    }
  },
],
  'image.bin'
);

server.use({
  fileDescriptorSet: 'image.bin',
  bindings,
}).start('0.0.0.0:50051', () => { });
