# Roadmap

https://httpie.io/app

SHADCDN UI https://ui.shadcn.com/docs/installation/next

NOTIFICATIONS https://www.npmjs.com/package/sonner

SUPABASE UI https://supabase.com/ui/docs/nextjs/password-based-auth

## TO GO LIVE WITH LOGIN

- make password reset work

- profile page - add navigaion and footer

! Client side Supabase should less access - read only. Server side should have more access.

## Supabase Production Checklist

https://supabase.com/docs/guides/deployment/going-into-prod#auth-rate-limits

LOGIN AUTH:

done: https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

- how does password reset work?
- create plan for login features to be added, profile flow after sign up

# Database Options

https://pocketbase.io/

## VENUE PAGES - with all events at that venue !!!

https://www.sandiegohousemusic.com/venues/orlando

https://www.sandiegohousemusic.com/venues/orlando/venue-name

- query events from supabase

# Itegrations

- Stub Hub API https://developer.stubhub.com/api-reference/catalog https://developer.stubhub.com/docs/authentication/application-only-authentication-flow

- Ticketmaster API
  - watiting on response from Ticketmaster

## Next.js 15 Upgrade

- app router - rename folder structure
- refactor getserver side props

## Ticketmaster to do

- figure out why link does not work ??
- check API and see how you can get more data or events
- make Ticket Master API work for STATE and for EVENT DATA (to be used on event overlay)
- [x] add fallback image

# Other stuff

- pagination for events pages
- remove twitch from navigation
- add dj misha somewhere - do like an google ad, inbetween events

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
  - [x] at build time - build from local JSON file
  - inserts only new ones from the EDM TRAIN API, when feteched from top artists page
  - populates from last.fm with bio data on each artist
  - populates from last.fm with TAGS data on each artist
  - table for artist TAGS - shoued it be a table or an array in the artist table?

## Ready for Dev

- [] ARTIST PAGES: social media icons

- [x] get the all events data at build time, rathar than the static JSON object file?

- [] bug: artists page uses different layout so there is no context for the location

## Database

- all artits table to include slug
- [x] table for locations
- [x] table for venues!
- [x]table for events
  - [x] populate with each new events call from EDM TRAIN API

### SEO

- SEO: Homepage - Title and Description - need keyword research
- Better SEO on Artist Pages - need keyword research

## Ideas

- Event pages

  - improved sorting - how? need examples

- Ability to Submit Events - they become featured, need login for this

- NEED TABLE FOR SUBMITTED EVENTS

- homepage - what else can we add on homepage to expland it and make it more useful

- context - what else can we put there to keep

## 2025 Completed

## Database

- [x] need to set up email SMTP for
- [x] PROFILE PAGE - with user info
- [x] SIGN UP -> CONFIRM LINK -> PROFILE PAGE
- [x] Can select default location from dropdown
- [x] Homepage - LOGGED IN EXPERIENCE - if logged in shows default location button
- [x] need login page icon. sign up page icon
- [x] table for locations
- [x] table for venues!
- [x] table for events
- [x] populate with each new events call from EDM TRAIN API
- [x] better layout - better how? improved cards

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
- [x] redirect on sign up to profile page
