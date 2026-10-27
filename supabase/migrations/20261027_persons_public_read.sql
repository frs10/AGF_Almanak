-- Allow public read on persons table (needed for work_authors join in Det Litterære Hjørne)
create policy "Public read persons"
  on persons for select using (true);
