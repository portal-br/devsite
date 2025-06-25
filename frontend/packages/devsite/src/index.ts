import type { ConfigType } from '@plone/registry';

import installBlocks from './config/blocks';
import installSettings from './config/settings';
import installSlots from './config/slots';

export function applyConfig(config: ConfigType) {
  installSettings(config);
  installBlocks(config);
  installSlots(config);

  return config;
}

export default applyConfig;
