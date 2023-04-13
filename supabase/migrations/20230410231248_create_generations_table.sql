create table
generations (
    id uuid primary key,
    feature_description text,
    logs text,
    logs_raw text
);

-- add a table to the publication
alter publication supabase_realtime add table generations;