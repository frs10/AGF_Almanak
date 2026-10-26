-- Det Litterære Hjørne – migration
-- Kør i Supabase Dashboard → SQL Editor

-- 1. Enum for værk-typer
create type work_type as enum ('bog','digt','sang','essay','brev','andet');

-- 2. Værker
create table works (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  type          work_type not null,
  published_year int,
  link          text,
  paywall       boolean not null default false,
  shelf_mark    text,           -- opstillingsgruppe, fx '79.706'
  bibliotek_dk_url text,
  notes         text,
  created_at    timestamptz default now()
);

-- 3. Forfattere/redaktører (many-to-many mod eksisterende persons-tabel)
create table work_authors (
  work_id   uuid references works on delete cascade,
  person_id uuid references persons on delete restrict,
  role      text default 'forfatter',  -- 'forfatter' | 'redaktør'
  primary key (work_id, person_id)
);

-- 4. Optræden i podcasen
create table appearances (
  id           uuid primary key default gen_random_uuid(),
  work_id      uuid references works on delete cascade not null,
  episode_date date not null,           -- fælles nøgle med almanakkens datoer
  is_revisit   boolean not null default false,
  extra_info   text
);

-- Sæt is_revisit automatisk: true hvis der allerede findes en tidligere optræden
create or replace function set_is_revisit()
returns trigger language plpgsql as $$
begin
  new.is_revisit := exists (
    select 1 from appearances
    where work_id = new.work_id
      and episode_date < new.episode_date
  );
  return new;
end;
$$;

create trigger trg_set_is_revisit
before insert on appearances
for each row execute procedure set_is_revisit();

-- 5. Indexes
create index on works (type);
create index on appearances (episode_date);
create index on appearances (work_id);

-- 6. RLS – samme mønster som dates-tabellen
alter table works       enable row level security;
alter table work_authors enable row level security;
alter table appearances  enable row level security;

-- Offentlig læsning
create policy "Public read works"
  on works for select using (true);

create policy "Public read work_authors"
  on work_authors for select using (true);

create policy "Public read appearances"
  on appearances for select using (true);

-- Kun indloggede hosts må skrive
create policy "Hosts insert works"
  on works for insert
  with check (auth.role() = 'authenticated');

create policy "Hosts update works"
  on works for update
  using (auth.role() = 'authenticated');

create policy "Hosts delete works"
  on works for delete
  using (auth.role() = 'authenticated');

create policy "Hosts insert work_authors"
  on work_authors for insert
  with check (auth.role() = 'authenticated');

create policy "Hosts delete work_authors"
  on work_authors for delete
  using (auth.role() = 'authenticated');

create policy "Hosts insert appearances"
  on appearances for insert
  with check (auth.role() = 'authenticated');

create policy "Hosts update appearances"
  on appearances for update
  using (auth.role() = 'authenticated');

create policy "Hosts delete appearances"
  on appearances for delete
  using (auth.role() = 'authenticated');
