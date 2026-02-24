import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Use the environment variable if available, otherwise fallback to the provided key
  // This ensures the app works in deployments (like Netlify) where env vars might not be set in the dashboard
  const apiKey = env.GEMINI_API_KEY || env.API_KEY || 'AIzaSyAmdrkHDts6JCluVD7Q-OnDaEdl7q-ouG0';

  return {
    define: {
      // Stringify the API key to inject it into the code during build
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      host: true
    }
  };
});