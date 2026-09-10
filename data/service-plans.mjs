export const SERVICE_PLANS = {
  free: {
    id: 'free', name: 'Free', price: 0,
    description: 'Local-first tools with no subscription required.',
    features: ['Core browser tools', 'Local processing where supported', 'No account required for public tools']
  },
  pro: {
    id: 'pro', name: 'Pro', price: null,
    description: 'Account-backed premium capabilities with server-verified entitlements.',
    features: ['Pro-only services', 'Higher usage limits', 'Account sync and history for supported services', 'Priority features as they are introduced']
  }
};
export const PRO_ONLY_ACTIONS = new Set(['cloud-process','batch-cloud','sync-history','priority-export']);
