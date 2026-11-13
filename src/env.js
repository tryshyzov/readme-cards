// Loads settings from a .env file next to package.json, if there is one.
try { process.loadEnvFile(); } catch { /* no .env file */ }
