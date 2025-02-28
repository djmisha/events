-- Function to count venues by location_id
create or replace function get_venue_count_by_location(location_id_param text)
returns integer as $$
declare
  venue_count integer;
begin
  select count(*) into venue_count 
  from venues 
  where location_id = location_id_param;
  
  return venue_count;
end;
$$ language plpgsql;
