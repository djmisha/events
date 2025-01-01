revoke delete on table "public"."event_artists" from "anon";

revoke insert on table "public"."event_artists" from "anon";

revoke references on table "public"."event_artists" from "anon";

revoke select on table "public"."event_artists" from "anon";

revoke trigger on table "public"."event_artists" from "anon";

revoke truncate on table "public"."event_artists" from "anon";

revoke update on table "public"."event_artists" from "anon";

revoke delete on table "public"."event_artists" from "authenticated";

revoke insert on table "public"."event_artists" from "authenticated";

revoke references on table "public"."event_artists" from "authenticated";

revoke select on table "public"."event_artists" from "authenticated";

revoke trigger on table "public"."event_artists" from "authenticated";

revoke truncate on table "public"."event_artists" from "authenticated";

revoke update on table "public"."event_artists" from "authenticated";

revoke delete on table "public"."event_artists" from "service_role";

revoke insert on table "public"."event_artists" from "service_role";

revoke references on table "public"."event_artists" from "service_role";

revoke select on table "public"."event_artists" from "service_role";

revoke trigger on table "public"."event_artists" from "service_role";

revoke truncate on table "public"."event_artists" from "service_role";

revoke update on table "public"."event_artists" from "service_role";

revoke delete on table "public"."events" from "anon";

revoke insert on table "public"."events" from "anon";

revoke references on table "public"."events" from "anon";

revoke select on table "public"."events" from "anon";

revoke trigger on table "public"."events" from "anon";

revoke truncate on table "public"."events" from "anon";

revoke update on table "public"."events" from "anon";

revoke delete on table "public"."events" from "authenticated";

revoke insert on table "public"."events" from "authenticated";

revoke references on table "public"."events" from "authenticated";

revoke select on table "public"."events" from "authenticated";

revoke trigger on table "public"."events" from "authenticated";

revoke truncate on table "public"."events" from "authenticated";

revoke update on table "public"."events" from "authenticated";

revoke delete on table "public"."events" from "service_role";

revoke insert on table "public"."events" from "service_role";

revoke references on table "public"."events" from "service_role";

revoke select on table "public"."events" from "service_role";

revoke trigger on table "public"."events" from "service_role";

revoke truncate on table "public"."events" from "service_role";

revoke update on table "public"."events" from "service_role";

revoke delete on table "public"."locations" from "anon";

revoke insert on table "public"."locations" from "anon";

revoke references on table "public"."locations" from "anon";

revoke select on table "public"."locations" from "anon";

revoke trigger on table "public"."locations" from "anon";

revoke truncate on table "public"."locations" from "anon";

revoke update on table "public"."locations" from "anon";

revoke delete on table "public"."locations" from "authenticated";

revoke insert on table "public"."locations" from "authenticated";

revoke references on table "public"."locations" from "authenticated";

revoke select on table "public"."locations" from "authenticated";

revoke trigger on table "public"."locations" from "authenticated";

revoke truncate on table "public"."locations" from "authenticated";

revoke update on table "public"."locations" from "authenticated";

revoke delete on table "public"."locations" from "service_role";

revoke insert on table "public"."locations" from "service_role";

revoke references on table "public"."locations" from "service_role";

revoke select on table "public"."locations" from "service_role";

revoke trigger on table "public"."locations" from "service_role";

revoke truncate on table "public"."locations" from "service_role";

revoke update on table "public"."locations" from "service_role";

revoke delete on table "public"."venues" from "anon";

revoke insert on table "public"."venues" from "anon";

revoke references on table "public"."venues" from "anon";

revoke select on table "public"."venues" from "anon";

revoke trigger on table "public"."venues" from "anon";

revoke truncate on table "public"."venues" from "anon";

revoke update on table "public"."venues" from "anon";

revoke delete on table "public"."venues" from "authenticated";

revoke insert on table "public"."venues" from "authenticated";

revoke references on table "public"."venues" from "authenticated";

revoke select on table "public"."venues" from "authenticated";

revoke trigger on table "public"."venues" from "authenticated";

revoke truncate on table "public"."venues" from "authenticated";

revoke update on table "public"."venues" from "authenticated";

revoke delete on table "public"."venues" from "service_role";

revoke insert on table "public"."venues" from "service_role";

revoke references on table "public"."venues" from "service_role";

revoke select on table "public"."venues" from "service_role";

revoke trigger on table "public"."venues" from "service_role";

revoke truncate on table "public"."venues" from "service_role";

revoke update on table "public"."venues" from "service_role";

alter table "public"."event_artists" drop constraint "fk_event";

alter table "public"."events" drop constraint "fk_location";

alter table "public"."events" drop constraint "fk_venue";

alter table "public"."venues" drop constraint "fk_location";

alter table "public"."event_artists" drop constraint "event_artists_pkey";

alter table "public"."events" drop constraint "events_pkey";

alter table "public"."locations" drop constraint "locations_pkey";

alter table "public"."venues" drop constraint "venues_pkey";

drop index if exists "public"."event_artists_pkey";

drop index if exists "public"."events_pkey";

drop index if exists "public"."locations_pkey";

drop index if exists "public"."venues_pkey";

drop table "public"."event_artists";

drop table "public"."events";

drop table "public"."locations";

drop table "public"."venues";

create table "public"."artists" (
    "id" bigint generated by default as identity not null,
    "name" text,
    "slug" text,
    "bio" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."artists" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text,
    "location_id" numeric
);


alter table "public"."profiles" enable row level security;

create table "public"."topartists" (
    "id" integer generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text,
    "count" numeric,
    "locations" smallint
);


alter table "public"."topartists" enable row level security;

CREATE UNIQUE INDEX artists_pkey ON public.artists USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX topartists_pkey ON public.topartists USING btree (id);

alter table "public"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."topartists" add constraint "topartists_pkey" PRIMARY KEY using index "topartists_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

grant delete on table "public"."artists" to "anon";

grant insert on table "public"."artists" to "anon";

grant references on table "public"."artists" to "anon";

grant select on table "public"."artists" to "anon";

grant trigger on table "public"."artists" to "anon";

grant truncate on table "public"."artists" to "anon";

grant update on table "public"."artists" to "anon";

grant delete on table "public"."artists" to "authenticated";

grant insert on table "public"."artists" to "authenticated";

grant references on table "public"."artists" to "authenticated";

grant select on table "public"."artists" to "authenticated";

grant trigger on table "public"."artists" to "authenticated";

grant truncate on table "public"."artists" to "authenticated";

grant update on table "public"."artists" to "authenticated";

grant delete on table "public"."artists" to "service_role";

grant insert on table "public"."artists" to "service_role";

grant references on table "public"."artists" to "service_role";

grant select on table "public"."artists" to "service_role";

grant trigger on table "public"."artists" to "service_role";

grant truncate on table "public"."artists" to "service_role";

grant update on table "public"."artists" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."topartists" to "anon";

grant insert on table "public"."topartists" to "anon";

grant references on table "public"."topartists" to "anon";

grant select on table "public"."topartists" to "anon";

grant trigger on table "public"."topartists" to "anon";

grant truncate on table "public"."topartists" to "anon";

grant update on table "public"."topartists" to "anon";

grant delete on table "public"."topartists" to "authenticated";

grant insert on table "public"."topartists" to "authenticated";

grant references on table "public"."topartists" to "authenticated";

grant select on table "public"."topartists" to "authenticated";

grant trigger on table "public"."topartists" to "authenticated";

grant truncate on table "public"."topartists" to "authenticated";

grant update on table "public"."topartists" to "authenticated";

grant delete on table "public"."topartists" to "service_role";

grant insert on table "public"."topartists" to "service_role";

grant references on table "public"."topartists" to "service_role";

grant select on table "public"."topartists" to "service_role";

grant trigger on table "public"."topartists" to "service_role";

grant truncate on table "public"."topartists" to "service_role";

grant update on table "public"."topartists" to "service_role";

create policy "Allow all access to anon"
on "public"."artists"
as permissive
for all
to anon
using (true)
with check (true);


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Allow all access to anon"
on "public"."topartists"
as permissive
for all
to anon
using (true)
with check (true);



