import { defineConfig } from "vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import { cloudflare } from "@cloudflare/vite-plugin";

// we can use env vars in the config file too
import { ENV } from 'varlock/env';

// Should log the redacted value
console.log('logging config in vite config:', ENV.SENSITIVE_ITEM);

export default defineConfig({
  plugins: [
    varlockVitePlugin(),
    cloudflare(),
  ],
});