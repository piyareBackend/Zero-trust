import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.zerotrust.tools',
  appName: 'Zero Trust',
  webDir: '../dist',
  bundledWebRuntime: false,
  server: process.env.ZT_APP_SERVER_URL ? { url: process.env.ZT_APP_SERVER_URL, cleartext: false } : undefined
};
export default config;
