import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist', 'index.js');

// Import the compiled server
const serverModule = await import(distPath);
const app = serverModule.default || serverModule;

export default app;
