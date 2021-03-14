// const fs = require('fs');
// const path = require('path');
const grpc = require('@grpc/grpc-js');
const get = require('lodash.get');
const isEqual = require('lodash.isequal');
const GrpcError = require('grpc-errors');

const load = require('./load');

module.exports = {
  create
}

function create(services, fileDescriptorSet) {
  const bindings = [];
  const packageDefinition = load(fileDescriptorSet);
  for (const service of services) {
    const binding = {
      service: service.name,
      implementations: {}
    };
    const serviceDefinition = get(packageDefinition, binding.service);
    if (serviceDefinition.service) {
      for (const key in serviceDefinition.service) {
        const method = serviceDefinition.service[key];
        const mapped = service.mappings[method.originalName];
        if (!mapped) {
          continue;
        }
        binding.implementations[method.originalName] = async function (call) {
          // TODO(dio-wartek): Create a map for error.
          for (const entry of mapped) {
            if (isEqual(call.request, entry.request)) {
              return entry.response;
            }
          }

          throw new GrpcError.InvalidArgumentError('no mmapped response');
        }
      }
    }
    if (Object.keys(binding.implementations).length > 0) {
      bindings.push(binding);
    }
  }
  return bindings;
}
