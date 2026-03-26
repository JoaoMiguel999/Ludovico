const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mdotysxiqvqjcegctqgc.supabase.co',
  'sb_publishable_aIO4kNqA3ndszT4zl7ZyGg_MKMa6Qkr'
);

module.exports = supabase;