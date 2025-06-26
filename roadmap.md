# 🎯 Core Product Goals

## 🌐 Login & User Authentication

- [x] Set up sign up → confirm email → redirect to profile
- [x] Show default location if logged in
- [x] Add login and sign up icons
- [x] Profile page with user info
- [ ] Make password reset work
- [ ] Add navigation and footer to profile page

**Security Note:**

- Client-side Supabase should have limited (read-only) access
- Server-side Supabase should handle sensitive access

### ✅ Supabase Production Checklist

https://supabase.com/docs/guides/deployment/going-into-prod#auth-rate-limits

---

# 🔧 In Progress / Working

## 🎟 Event Pages

- [ ] Implement pagination (21 results/page, scroll to top on page change)
- [ ] Maintain filter behavior — hide pagination on filter, resume on clear
- [ ] Remove Twitch from navigation
- [ ] Add DJ Misha promo block (like a Google Ad) between events

## 🎤 Artists

- [x] Table for all artists
- [x] Populate from local JSON → EDM Train → Last.fm
- [ ] Add social media icons to artist pages
- [ ] Bug: artists page layout lacks location context
- [ ] Decide: artist tags as array or separate table

---

# 📊 Database

### Tables

- [x] Locations
- [x] Venues
- [x] Events
- [x] Artists
- [ ] Add slug field to artists
- [ ] Table for submitted events

### Features

- [x] Default location dropdown in profile
- [x] Populate events from EDM Train API
- [x] SMTP Email setup
- [x] Add homepage experience for logged-in users

---

# 🚀 Ready for Dev

- [ ] Artist pages: social media icons
- [ ] Fix artist layout bug (location context missing)

---

# 🔁 Integrations

## StubHub

- https://developer.stubhub.com/docs/authentication/application-only-authentication-flow

## Ticketmaster

- Waiting on response
- [ ] Fix broken link
- [ ] Expand data (for event overlay, state-level filtering)
- [x] Add fallback image

---

# 🛠 Next.js 15 Upgrade

- [ ] Rename folder structure to use app router
- [ ] Refactor getServerSideProps

---

# 💡 Feature Ideas & Monetization

## Event Experience

- [ ] Improved event sorting (define how)
- [ ] Submit events (login required) → featured

## Monetization

- [ ] Ticket links for affiliate revenue
- [ ] Ads on artist pages
- [ ] Elegant homepage/event page ads
- [ ] Improve ad placement quality

## Homepage Improvements

- [ ] Simplified layout
- [ ] Expand with useful widgets and data
- [ ] Add context for visited cities
- [ ] Add section for top/random artists

---

# 📈 SEO

### General

- [ ] Optimize titles + descriptions (keyword research needed)
- [ ] Cross-link: events ↔ artists ↔ venues ↔ locations
- [ ] Artist links from event cards
- [ ] Better SEO for artist pages
- [x] City page SEO improvements
- [x] Add artist pages to XML sitemap

---

# ✅ Completed

## ✅ 2025

- [x] Profile/login/signup flow
- [x] Logged-in homepage experience
- [x] Database: events, venues, locations
- [x] Homepage: top artists section, search header
- [x] Refreshed event card layout

## ✅ 2024

- [x] Google ad approval
- [x] Remove auto ads
- [x] Improved SEO for city pages
- [x] Top artists stored for homepage
- [x] Context setup for locations and top artists
- [x] Locator bug fix
- [x] Refreshed homepage images

## ✅ 2023 Q4

- [x] Remove dead CSS/code
- [x] Homepage: cities & states section
- [x] Artists in search input
- [x] Individual artist pages complete
- [x] Desktop artist styling fixes
- [x] Top artist page restored
- [x] Artist data from Last.fm added
- [x] Sign-up redirect to profile

---

# 🧪 Styling (Backlog)

- [ ] Improve top & bottom navbars
- [ ] Set site-wide padding
- [ ] Improve color scheme
- [ ] Update event card design
- [ ] Spinner → Skeleton loader
- [x] Center spinner

---

# 🔗 Key Resources

- App: https://httpie.io/app
- ShadCN UI: https://ui.shadcn.com/docs/installation/next
- Notifications: https://www.npmjs.com/package/sonner
- Supabase UI: https://supabase.com/ui/docs/nextjs/password-based-auth
