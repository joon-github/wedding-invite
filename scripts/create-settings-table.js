const fs = require("fs");
const { Client } = require("pg");

const lines = fs.readFileSync(".env.local", "utf8").split("\n");
const env = {};
for (const line of lines) {
  const m = line.match(/^([^=]+)="(.*)"$/);
  if (m) env[m[1]] = m[2];
}

async function run() {
  const client = new Client({ connectionString: env.POSTGRES_URL });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.site_settings (
      key text PRIMARY KEY,
      value jsonb NOT NULL DEFAULT 'true',
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  console.log("site_settings table created");

  const defaults = [
    { key: "show_guestbook", value: true },
    { key: "show_photo_upload", value: true },
    { key: "show_quiz", value: true },
  ];

  for (const d of defaults) {
    await client.query(
      `INSERT INTO public.site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
      [d.key, JSON.stringify(d.value)]
    );
  }
  console.log("Default settings seeded");

  await client.end();
}

run().catch((e) => console.error(e.message));
