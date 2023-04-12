create table 
generations (
    id uuid primary key,
    feature_description text,
    logs text,
    logs_raw text
)

-- create a publication
create publication supabase_realtime;

-- add a table to the publication
alter publication supabase_realtime add table generations;