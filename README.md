# 100 Points — Palm Oil Sustainability Negotiation Game

A multi-party negotiation simulation for university classrooms.  
Developed at Durham University Business School.

---

## What this is

Students are assigned stakeholder roles in a palm oil supply chain sustainability negotiation.  
Six roles. One cost pool of 100 points. Four negotiation rounds.  
The plan cannot be signed until all 100 points are allocated and a monitoring mechanism agreed.

**Roles:**
- Company XX (Multinational buyer — Diana Cross)
- Mills YY (Regional mill owner — Hassan Yusof)
- Farmers ZZ Cooperative (Smallholder representative — Siti Rahman)
- NGOs & Coalition AA (Campaign director — James Okafor)
- Government GG (Minister of Plantation Industries — Dato' Ibrahim Razak)
- Certification Body CC (Head of Standards — Dr. Elena Vasquez)

**Three-tier access:**
- Admin (you) — full platform oversight, professor management, analytics
- Professor — classroom control, group setup, phase advancement, curveball injection
- Student — role card, preparation worksheet, bilateral chats, cost pool allocation, voting

---

## Quick start (local development)

```bash
# 1. Clone / download the project
cd 100-points-palm-oil-game

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Run the database migration
# Go to https://app.supabase.com → your project → SQL editor
# Paste and run the contents of supabase_migration.sql

# 5. Start the development server
npm run dev
```

---

## Deployment to Vercel (recommended)

1. Push this project to a GitHub repository
2. Go to https://vercel.com and import the repository
3. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Deploy — your app is live at `your-app.vercel.app`
5. Optional: add a custom domain in Vercel settings

---

## First-time setup

1. Navigate to `/login`
2. The first account registered is automatically made Admin  
   (Bootstrap: create your admin account directly in Supabase Auth, then add a record to the `users` table with `role = 'admin'`)
3. From the Admin dashboard, create professor accounts
4. Professors receive login credentials and can create sessions immediately

---

## How a session runs

**Before class:**
- Professor creates a session → gets a 6-character join code (e.g. PALM42)
- Creates groups (e.g. Team Alpha, Team Beta)
- Can pre-assign roles or do it live

**In class:**
1. Students go to the app URL, enter the join code and their name — no signup
2. Professor assigns roles from the Groups tab
3. Professor advances through phases using the Control panel:
   - Briefing → students read their full role cards
   - Preparation → private prep worksheets (professor can monitor)
   - Round 1 Opening → group chat opens, students post opening positions
   - Round 2 Bilateral → private bilateral channels unlock (by permitted dyad)
   - Round 3 Coalition → group chat is the primary space
   - Round 4 Final Plan → cost pool allocation, monitoring selection, voting
   - Debrief → scorecards revealed, discussion questions displayed
4. Professor can inject curveball events at any point during Rounds 2–3

**The 9 permitted bilateral dyads (based on real supply chain relationships):**
- Company XX ↔ Mills YY
- Company XX ↔ NGOs AA  
- Company XX ↔ Certification CC
- Mills YY ↔ Farmers ZZ
- Mills YY ↔ Certification CC
- Farmers ZZ ↔ Government GG
- NGOs AA ↔ Certification CC
- NGOs AA ↔ Government GG
- Government GG ↔ Mills YY

**Blocked dyads (not realistic in real supply chains):**
- Company XX ↔ Farmers ZZ (too many intermediary layers)
- Mills YY ↔ NGOs AA (NGOs target brands, not anonymous mills)
- Farmers ZZ ↔ NGOs AA (needs mediation)

---

## The 6 curveball events

Injected by professor during Round 2 or 3. Students see a red alert banner simultaneously.

1. EU Deforestation Regulation timeline accelerated (9 months, not 14)
2. Competitor mill offers farmers full market rate — no sustainability strings
3. Greenpeace releases satellite images of new clearing
4. Drought cuts smallholder yields 30% this season
5. Audit fraud discovered in rival certification scheme
6. Election threat: populist leader threatens to exit RSPO

---

## The cost pool (100 points, must fully allocate)

| Item | Points |
|------|--------|
| Certification fees | 18 |
| Farmer training & extension | 15 |
| Yield loss compensation | 22 |
| Traceability infrastructure | 12 |
| Independent monitoring | 13 |
| Price premium to farmers | 20 |
| **Total** | **100** |

---

## Supabase tiers

- **Free tier**: 500MB DB, 200 concurrent realtime connections  
  Handles ~10 simultaneous classrooms of 30 students
- **Pro ($25/month)**: 500 concurrent connections  
  Handles ~50 simultaneous classrooms

---

## Academic context

This game is based on original research in sustainable supply chain management.  
The theoretical framework covers:
- Multi-party negotiation theory (Lax & Sebenius, Raiffa)
- Integrative vs. distributive negotiation (Fisher, Ury & Patton)
- Power asymmetry in supply chains (Cox)
- Commitment credibility (Schelling)
- Principal-agent problems (Jensen & Meckling)
- Commons governance (Ostrom — Nobel Prize 2009)
- Stakeholder theory (Freeman)
- Institutional legitimacy (DiMaggio & Powell)

The game is designed so students discover these frameworks through experience before they name them.

---

## Related materials

- Full screenplay: *100 Points* — a feature film script based on the same scenario
- Academic paper: forthcoming, Journal of Supply Chain Management

Durham University Business School  
Centre for Operations & Supply Chain Research
