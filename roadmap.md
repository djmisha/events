# Roadmap

## 2025 Ideas

- homepage simplified
- locations page - with city and states, removed from homepage
- venues pages - with all venues in a city
- artist directory with all artists
- artists page - adds new bio to db from last.fm

## HOW to MONITIZE

- links to buy tickets - integrations with ticket providers
- better ads on artist pages - remove auto ads?
- add on homepage (all adds eleganty)
- add on events pages (all adds eleganty)

### SEO Continued

- events pages - titles and descriptions - keyword optimization
- cross linking pages - between events, artists, locations, and venues
- link each artists from the events card. - link to artist page

## Working

- table for all artists
  - [x] create table to hold top aritst
  - at build time - fetch the data from Supabase artists table
    - need to write func to fetch all artists from endpoint - deploy the endpoint first
  - inserts only new ones from the EDM TRAIN API, when feteched from top artists page
  - populates from last.fm with bio data on each artist
  - populates from last.fm with TAGS data on each artist
  - table for artist TAGS - shoued it be a table or an array in the artist table?

## Ready for Dev

- [] ARTIST PAGES: social media icons

- [] get the all events data at build time, rathar than the static JSON object file?

- [] bug: artists page uses different layout so there is no context for the location

## Database

- table for locations
- table for venues!
- table for events
  - populate with all events from EDM TRAIN API?

### SEO

- SEO: Homepage - Title and Description - need keyword research
- Better SEO on Artist Pages - need keyword research

## Ideas

- Event pages

  - better layout - better how? improved cards
  - improved sorting - how? need examples

- \*\* Ability to Submit Events - they become featured, need login for thid

  - NEED TABLE FOR SUBMITTED EVENTS

- homepage - what else can we add on homepage to expland it and make it more useful

- context - what else can we put there to keep

## 2024 Completed

- [x] put Ads on artist pages - not showing
- [x] wont do: migrate the image node.js code into this repo
- [x] security: check supabase message for security issues
- [x] Better SEO on City Pages - need keyword research
- [x] if user visited a city, show that city on homepage and navigation, store all visited locations in context
- [x] hold top artists data so that it can be shown on the homepage
- [x] need to get ads approved by Google÷
- [x] put locations into a context, utilize context more
- [x] homepage: add section for top touring artists
- [x] homepage: Header with Search Section
- [x] homepage: your locaiton is... here are events in....
- [x] locator bug - returns a city that does not match an available city

### Homepage

- [x] refesh images March 29, 2024
- [x] locator.js - returns a city that does not match an available city

### Homepage

- [x] add section for cities & states
- [x] add artists to search input
- [] add section for top artists, or random artists?

### Artists Pages

- [x] finish individual artist pages
- [x] add artsts pages to XML sitemap
- [x] fix desktop styling for artist pages
- [x] bring back top artist page
- [x] add artist information from other api sources: https://www.last.fm/api#getting-started

## 2023 - Q4

### Styling

- [x] center spinner
- [] improve top navbar styling - how?
- [] improve bottom navbar styling - how?
- [] set padding site wide, rather than componenets
- [] improve color scheme
- [] improve event card design
- [] change spinner loader to skeleton loader

### General

- [x] remove all dead css files
- [x] remove all dead code from last cleanup
- [] change spinner loader to skeleton loader
- [] improve event card design
- [] context: put locations into, instead of passing down as props
- [] context: top artists data

## 2023 - Q3

### Homepage

- [x] add section for cities & states
- [x] add artists to search input

### Artists Pages

- [x] finish individual artist pages
- [x] add artsts pages to XML sitemap
- [x] fix desktop styling for artist pages
- [x] bring back top artist page
- [x] add artist information from other api sources: last.fm
