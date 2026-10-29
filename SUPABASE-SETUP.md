# MineForge test database — free Supabase setup

This is optional. Without the environment variables below, MineForge continues to use temporary in-memory demo data. With them, demo server configurations are stored in a Supabase database.

**This is still only a demo. It does not run Minecraft servers.**

## 1. Create a free Supabase project

1. Open https://supabase.com/dashboard and sign in.
2. Choose **New project**.
3. Name it `mineforge-test`.
4. Choose a strong database password and save it somewhere private. MineForge does not need that database password for this setup.
5. Select the Free plan and create the project.
6. Wait for the project to finish provisioning.

The free plan has usage limits and projects may pause after a week of inactivity. Check the current terms before relying on it for anything important.

## 2. Create the table

In the Supabase project, open **SQL Editor**, create a new query, paste the following SQL, then click **Run**:

```sql
create table if not exists public.mineforge_servers (
  id text primary key,
  name text not null,
  edition text not null check (edition in ('Java', 'Bedrock')),
  software text not null check (software in ('Vanilla', 'Paper', 'Fabric', 'Forge', 'Bedrock')),
  status text not null default 'stopped',
  created_at timestamptz not null default now()
);

alter table public.mineforge_servers enable row level security;
```

Do not create public read/write policies for this table. The backend will access it using a secret key stored only in Render.

## 3. Add the connection to Render

1. Open https://dashboard.render.com/.
2. Open your MineForge test API service.
3. Open **Environment**.
4. Add these two environment variables:

   - `SUPABASE_URL`: the Project URL from Supabase (usually `https://PROJECTREF.supabase.co`).
   - `SUPABASE_SECRET_KEY`: the project's **secret key** from Supabase **Settings → API Keys**.

5. Save the changes. Render should redeploy the service.

**Security:** never add the Supabase secret key to `index.html`, GitHub, screenshots, or chat. Keep it only in Render's Environment settings. If you accidentally expose it, rotate the key immediately.

## 4. Verify

Open your Render URL plus `/health`. Once the database is configured, the JSON should include:

```json
{
  "ok": true,
  "service": "mineforge-test-backend",
  "mode": "demo-persistent-database",
  "databaseEnabled": true
}
```

Then use MineForge → My Servers to create a test server. Refresh the page or wait for a redeploy and check the list again.

If `databaseEnabled` is false, one or both Render environment variables are missing or empty. If it is true but database operations fail, verify that the SQL table exists and the secret key is correct.

## Limits

- This database stores demo configuration only, not Minecraft worlds or server files.
- Start/stop controls change a simulated status only.
- There are not yet user accounts or per-user access controls. Do not store private or sensitive information.
- Supabase Free is for testing, not a production guarantee; projects can pause after inactivity and usage quotas apply.
