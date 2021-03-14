const get = require('lodash.get');
const grpc = require("@grpc/grpc-js");

const load = require('./load');

module.exports = class GrpcServer {
  constructor() {
    this.server = new grpc.Server();
  }

  use({
    fileDescriptorSet,
    bindings
  }) {
    const packageDefinition = load(fileDescriptorSet);
    for (const binding of bindings) {
      const serviceDefinition = get(packageDefinition, binding.service);
      this.server.addService(serviceDefinition.service, wrap(binding.implementations));
    }
    return this;
  }

  start(address, cb) {
    this.server.bindAsync(address, grpc.credentials.createInsecure(), (err, portNumber) => {
      this.server.start();
      cb(err, portNumber)
    });
    return this;
  }
}

function wrap(implementations) {
  const wrapped = {};
  for (const name in implementations) {
    if (typeof implementations[name] !== 'function') {
      continue;
    }
    wrapped[name] = function (call, cb) {
      implementations[name](call)
        .then(function (returned) {
          cb(null, returned);
        })
        .catch(cb);
    }
  }
  return wrapped;
}
