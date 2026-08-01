import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const envPath = resolve(projectRoot, 'apps/web/.env.local');
const devDir = resolve(projectRoot, '.dev');
const credentialsPath = resolve(devDir, 'test-credentials.local.json');

// Parse .env.local safely
try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valParts] = trimmed.split('=');
    if (key && valParts.length > 0) {
      process.env[key.trim()] = valParts.join('=').trim();
    }
  });
} catch (err) {
  console.error('Failed to load apps/web/.env.local. Ensure it exists.');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ADMIN_KEY;

if (!url || !serviceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function generateSecurePassword() {
  return 'Dev!' + crypto.randomBytes(8).toString('hex') + '9Z#';
}

async function upsertUser(email) {
  const password = generateSecurePassword();
  
  // Try to find user in user list
  let page = 1;
  let existingUser = null;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    existingUser = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existingUser || data.users.length < 100) break;
    page++;
  }

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: { email_verified: true },
    });
    if (error) throw error;
    return { email, password, id: data.user.id, action: 'updated' };
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { email_verified: true },
    });
    if (error) throw error;
    return { email, password, id: data.user.id, action: 'created' };
  }
}

async function run() {
  try {
    mkdirSync(devDir, { recursive: true });

    console.log('Bootstrapping DEV confirmed users...');
    const platformAdmin = await upsertUser('platform.admin.dev@example.com');
    const tenantAdmin = await upsertUser('tenant.admin.dev@example.com');

    const credentials = {
      timestamp: new Date().toISOString(),
      projectUrl: url,
      platformAdmin: {
        email: platformAdmin.email,
        password: platformAdmin.password,
        userId: platformAdmin.id,
      },
      tenantAdmin: {
        email: tenantAdmin.email,
        password: tenantAdmin.password,
        userId: tenantAdmin.id,
      },
    };

    writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2), 'utf8');

    console.log('--------------------------------------------------');
    console.log('DEV Users Successfully Bootstrapped!');
    console.log('Platform Admin:', platformAdmin.email, '| Password:', platformAdmin.password);
    console.log('Tenant Admin:  ', tenantAdmin.email, '| Password:', tenantAdmin.password);
    console.log('Credentials saved exclusively to:', credentialsPath);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('Failed to bootstrap DEV users:', error.message || error);
    process.exit(1);
  }
}

run();
