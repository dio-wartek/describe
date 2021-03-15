const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

function config(services) {
  const template = fs.readFileSync(path.join(__dirname, 'envoy.template.yaml'), 'utf-8');
  let object = yaml.parse(template);
  object
    .static_resources
    .listeners[0]
    .filter_chains[0]
    .filters[0].typed_config.http_filters[0].typed_config.services = services;
  return yaml.stringify(object);
}

const data = require(process.env.ENVOY_DATA || path.join(__dirname, 'data.json'));
const services = data.bindings.map((entry) => {
  return entry.name;
});

fs.writeFileSync(process.env.ENVOY_CONFIG || path.join(__dirname, 'etc', 'envoy', 'envoy.yaml'),
  config(services));
