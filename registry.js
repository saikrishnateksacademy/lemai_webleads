import lemaiDefinition from "./sites/lemai/definition.js";
import infozitDefinition from "./sites/infozit/definition.js";
import futuregenDefinition from "./sites/futuregen/definition.js";

const registry = new Map();

function register(definition) {
  if (!definition?.siteKey) {
    throw new Error(`[Registry] Site definition is missing 'siteKey'`);
  }
  if (registry.has(definition.siteKey)) {
    throw new Error(`[Registry] Site '${definition.siteKey}' is already registered`);
  }
  registry.set(definition.siteKey, definition);
}

//   Register all sites   
register(lemaiDefinition);
register(infozitDefinition);
register(futuregenDefinition);


export const getStrategy = (siteKey) => registry.get(siteKey);

export const getAllSiteKeys = () => [...registry.keys()];

export const getAllStrategies = () => [...registry.values()];

export const isRegisteredSite = (siteKey) => registry.has(siteKey);

export default registry;
