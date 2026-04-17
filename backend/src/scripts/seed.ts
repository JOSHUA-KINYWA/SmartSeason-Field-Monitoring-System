import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const users = [
  {
    email: 'admin@smartseason.com',
    password: 'Admin1234!',
    full_name: 'SmartSeason Admin',
    role: 'admin',
  },
  {
    email: 'agent@smartseason.com',
    password: 'Agent1234!',
    full_name: 'SmartSeason Agent',
    role: 'agent',
  },
];

async function seed() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        role: user.role,
      },
    });

    if (error) {
      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        console.log(`User already exists: ${user.email}`);
        continue;
      }
      console.error('Failed to create user:', user.email, error);
      process.exit(1);
    }

    console.log(`Created user ${user.email} with id ${data?.user?.id}`);
  }

  console.log('Seed complete.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
