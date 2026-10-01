# Farm Field Log

A simple digital field journal for farmers. Sign in, then record what happened in the field — *"Scouted Field 12"*, *"Sprayed the north 80"*, *"Changed oil on the tractor"* — with a category, date/time, notes, and an optional GPS location. Entries show up in an activity feed, newest first, and can be filtered by category. If you add a Mapbox token, entries with a location also appear on a map.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Vercel · Mapbox (optional)

---

## 1. Install

You need [Node.js](https://nodejs.org) 20.9 or newer.

```bash
git clone <your-repo-url> farm-field-log
cd farm-field-log
npm install
```

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and click **New project**.
2. Pick a name (e.g. `farm-field-log`), set a database password (save it somewhere), choose a region near you, and click **Create new project**. It takes a minute or two to start.

## 3. Create the database table

The app stores entries in one table, `field_logs`. The SQL that creates it — including the **Row Level Security** policies that keep each user's data private — is in [`supabase/migrations/20261001000000_create_field_logs.sql`](supabase/migrations/20261001000000_create_field_logs.sql).

1. In your Supabase project, open **SQL Editor** (left sidebar).
2. Click **New query**, paste in the whole contents of that file, and click **Run**.
3. Open **Table Editor** — you should see an empty `field_logs` table.

> Using the Supabase CLI instead? `supabase link --project-ref <your-ref>` then `supabase db push` applies the same migration.

## 4. Set environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Required | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → **Connect** button (top of the dashboard), or **Project Settings → Data API**. Looks like `https://abcd1234.supabase.co`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → **Project Settings → API Keys**. Use the **publishable** key (`sb_publishable_…`) or the legacy **anon** key — either works. |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | No | See [step 6](#6-optional-turn-on-the-map-with-mapbox). |

These keys are safe to expose in the browser — that's what `NEXT_PUBLIC_` means. Your data is protected by Row Level Security in the database, not by hiding the key. **Never** put the `service_role` / secret key in this app.

`.env.local` is git-ignored. Don't commit real keys.

## 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Create an account**, and add your first entry.

**About confirmation emails:** new Supabase projects require users to confirm their email address. For a quick workshop you can turn this off in **Authentication → Sign In / Providers → Email → Confirm email**. If you leave it on, the email link brings users back to `/auth/confirm` in this app, which signs them in.

If you forget to set the environment variables, the app shows a setup screen telling you exactly which ones are missing. If you forget to run the SQL, the dashboard tells you the `field_logs` table wasn't found.

## 6. Optional: turn on the map with Mapbox

The map is an extra feature that switches on when a Mapbox token is present. Without one, the app works exactly the same — the **Map** link just doesn't appear.

1. Create a free account at [mapbox.com](https://www.mapbox.com/).
2. Go to [Access tokens](https://account.mapbox.com/access-tokens/) and copy your **Default public token** (starts with `pk.`).
3. Add it to `.env.local`:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your-token
   ```
4. Restart `npm run dev`. A **Map** link appears in the header, showing every entry that has a location.

Tip: use **Use Current Location** when creating an entry (or type a latitude/longitude) so it shows up on the map. Browsers only allow location access on `https://` sites or `localhost`.

## 7. Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and **Import** the repository. Vercel detects Next.js automatically — leave the build settings as they are.
3. Before clicking **Deploy**, open **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | same as in `.env.local` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same as in `.env.local` |
   | `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | optional — your Mapbox token |

4. Click **Deploy**. You'll get a URL like `https://farm-field-log.vercel.app`.
5. **Tell Supabase about your production URL** so sign-up emails link to the right place. In Supabase → **Authentication → URL Configuration**:
   - set **Site URL** to your Vercel URL, e.g. `https://farm-field-log.vercel.app`
   - under **Redirect URLs**, add `https://farm-field-log.vercel.app/**` (and `http://localhost:3000/**` so local development keeps working)

> `NEXT_PUBLIC_*` variables are built into the app when it's compiled. If you add or change one in Vercel (for example, adding the Mapbox token later), go to **Deployments** and **Redeploy** for it to take effect.

---

## How the code is organized

```
app/
  login/page.tsx           Sign in / sign up page
  auth/actions.ts          signIn, signUp, signOut (Server Actions)
  auth/confirm/route.ts    Handles the link in the confirmation email
  logs/page.tsx            Dashboard: feed + category filter
  logs/new/page.tsx        New entry form
  logs/[id]/edit/page.tsx  Edit entry form
  logs/actions.ts          Create / update / delete (Server Actions)
  logs/map/page.tsx        Map page (optional, Mapbox)
components/                UI pieces (LogForm, LogCard, CategoryFilter, …)
components/map/            Mapbox map component (optional feature)
lib/
  field-logs.ts            Supabase read queries for field_logs
  categories.ts            Categories and the FieldLog type
  mapbox.ts                Mapbox on/off switch
  supabase/server.ts       Supabase client for server code
  supabase/proxy.ts        Session refresh + route protection
  supabase/config.ts       Reads and checks the Supabase env vars
proxy.ts                   Next.js proxy (runs before each request)
supabase/migrations/       SQL for the field_logs table + RLS policies
```

**Where the security lives:** `proxy.ts` keeps signed-out visitors away from `/logs` pages, but the real protection is Row Level Security in the database. Every query runs as the signed-in user, and the policies only allow reading and changing rows where `user_id = auth.uid()`. That's why the queries in `lib/field-logs.ts` don't filter by user at all.

## Scripts

```bash
npm run dev        # start the dev server
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
```

## Optional: run Supabase locally

With [Docker](https://www.docker.com/) and the [Supabase CLI](https://supabase.com/docs/guides/local-development) installed, `supabase start` runs a local Supabase with the migration already applied. It prints a local API URL and publishable key to put in `.env.local`. Email confirmation is off locally.
