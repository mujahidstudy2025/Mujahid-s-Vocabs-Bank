import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    define: {
      // Stringify the API key to inject it into the code during build
      // Use fallback empty string to prevent "undefined" being injected which can cause runtime errors
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
    server: {
      host: true
    }
  };
});