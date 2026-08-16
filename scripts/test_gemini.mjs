import fs from 'fs';
import path from 'path';

function loadEnvVars() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !key.startsWith('#')) {
          env[key] = value;
        }
      }
    });
  }
  return env;
}

async function checkModels() {
  const env = loadEnvVars();
  const apiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();

  console.log('--- LISTING AVAILABLE GEMINI MODELS ---');
  console.log('API Key configured:', Boolean(apiKey));
  console.log('Key prefix:', apiKey ? apiKey.slice(0, 10) + '...' : 'NONE');

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    console.log('ListModels HTTP Status:', res.status);
    const body = await res.text();
    console.log('ListModels Response:', body.slice(0, 1000));
  } catch (err) {
    console.error('ListModels Fetch Error:', err);
  }
}

checkModels();
