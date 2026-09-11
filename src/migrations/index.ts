import * as migration_20260421_181402 from './20260421_181402';
import * as migration_20260910_195910_gallery from './20260910_195910_gallery';
import * as migration_20260911_143829_stripe_billing from './20260911_143829_stripe_billing';
import * as migration_20260911_151533_service_links from './20260911_151533_service_links';

export const migrations = [
  {
    up: migration_20260421_181402.up,
    down: migration_20260421_181402.down,
    name: '20260421_181402',
  },
  {
    up: migration_20260910_195910_gallery.up,
    down: migration_20260910_195910_gallery.down,
    name: '20260910_195910_gallery',
  },
  {
    up: migration_20260911_143829_stripe_billing.up,
    down: migration_20260911_143829_stripe_billing.down,
    name: '20260911_143829_stripe_billing',
  },
  {
    up: migration_20260911_151533_service_links.up,
    down: migration_20260911_151533_service_links.down,
    name: '20260911_151533_service_links'
  },
];
