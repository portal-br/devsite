import type { ConfigType } from '@plone/registry';
import projectPackageJson from '../../package.json';

export default function install(config: ConfigType) {
  config.settings.isMultilingual = false;
  config.settings.supportedLanguages = ['pt-br'];
  config.settings.defaultLanguage = 'pt-br';
  config.settings.projecName = projectPackageJson.name;
  config.settings.projecVersion = projectPackageJson.version;
  config.settings.image_crop_aspect_ratios = [
    {
      label: '16:9',
      ratio: 16 / 9,
    },
    {
      label: '4:3',
      ratio: 4 / 3,
    },
    {
      label: '1:1',
      ratio: 1,
    },
  ];

  config.settings.slate.toolbarButtons.push('code');

  return config;
}
