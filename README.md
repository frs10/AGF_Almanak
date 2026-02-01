# AGF Almanak

Fodboldhistorie dag for dag - en webapplikation til at udforske og administrere historiske AGF-begivenheder.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Supabase** (Database + Auth)
- **Tailwind CSS**
- **Vercel** (Deploy)

## Kom i gang

### 1. Installer dependencies

```bash
npm install
```

### 2. Konfigurer miljøvariabler

Opret en `.env.local` fil baseret på `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Udfyld med dine Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=din-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-supabase-anon-key
```

### 3. Supabase opsætning

Sørg for at din Supabase database har tabellen `dates` med følgende struktur:

```sql
create table dates (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  title text not null,
  description text not null,
  persons text[] default '{}',
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users(id)
);

-- Enable RLS
alter table dates enable row level security;

-- Policy: Alle kan læse
create policy "Anyone can read dates" on dates for select using (true);

-- Policy: Kun ejeren kan opdatere
create policy "Users can update own dates" on dates for update using (auth.uid() = created_by);

-- Policy: Kun ejeren kan slette
create policy "Users can delete own dates" on dates for delete using (auth.uid() = created_by);

-- Policy: Authenticated users kan indsætte
create policy "Authenticated users can insert" on dates for insert with check (auth.uid() = created_by);
```

### 4. Start udviklingsserver

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) i din browser.

## Sider

- `/` - Offentlig tidslinje med alle begivenheder
- `/login` - Admin login
- `/admin` - Administrer begivenheder (kræver login)

## Features

### Offentlig side
- Tidslinje-visning af alle begivenheder
- "Hvad skete i dag?" filter (viser begivenheder fra samme dag/måned historisk)
- Månedsfiltrering
- Søgning i titler, beskrivelser og personer
- Responsivt design med AGF farver

### Admin
- Email/password login via Supabase Auth
- Tilføj nye begivenheder med dato, titel, beskrivelse og personer
- Rediger egne begivenheder
- Slet egne begivenheder

## Deploy til Vercel

1. Push til GitHub
2. Importer projektet i Vercel
3. Tilføj miljøvariabler i Vercel dashboard
4. Deploy!

## Farver

- AGF Marineblå: `#1a2d5a`
- AGF Marineblå Dark: `#0f1d3d`
- AGF Marineblå Light: `#2a4a8a`
