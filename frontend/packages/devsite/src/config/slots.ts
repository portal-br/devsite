import { LeadImageSlot } from '../components/LeadImageSlot/LeadImageSlot';
import { ContentTypeCondition } from '@plone/volto/helpers/Slots';
import type { ConfigType } from '@plone/registry';

export default function install(config: ConfigType) {
  config.registerSlotComponent({
    slot: 'aboveContent',
    name: 'LeadImageSlot',
    component: LeadImageSlot,
    predicates: [ContentTypeCondition(['Post'])],
  });
  return config;
}
