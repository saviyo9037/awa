import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const env = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp(k + '=(.*)'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
};
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

async function testSubcat() {
  const { data: subcatData, error: subcatErr } = await supabase.from('subcategories').select('*');
  console.log('Subcategories table check:', subcatErr ? subcatErr.message : subcatData);
}
testSubcat();
