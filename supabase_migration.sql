-- ============================================================
-- 100 POINTS: Palm Oil Sustainability Negotiation Game
-- Supabase SQL Migration — Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS (Admin + Professor accounts) ──────────────────────────────────────
create table if not exists users (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin', 'professor')),
  name        text not null,
  institution text,
  created_by  uuid references users(id),
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ─── SESSIONS (one per classroom run) ────────────────────────────────────────
create table if not exists sessions (
  id               uuid primary key default uuid_generate_v4(),
  professor_id     uuid not null references users(id) on delete cascade,
  name             text not null,
  join_code        text not null unique,
  commodity        text default 'palm oil',
  phase            text default 'setup' check (phase in (
                     'setup','briefing','preparation',
                     'round1','round2','round3','round4',
                     'debrief','complete'
                   )),
  phase_started_at timestamptz,
  phase_ends_at    timestamptz,
  active_curveball uuid,
  curveball_used   text[] default '{}',
  settings         jsonb default '{}',
  created_at       timestamptz default now()
);

-- ─── GROUPS (negotiation groups within a session) ─────────────────────────────
create table if not exists groups (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid not null references sessions(id) on delete cascade,
  name        text not null,
  plan_status text default 'drafting' check (plan_status in (
                'drafting','submitted','signed','broken_down'
              )),
  created_at  timestamptz default now()
);

-- ─── PARTICIPANTS (students — browser session only, no auth account) ──────────
create table if not exists participants (
  id                uuid primary key default uuid_generate_v4(),
  session_id        uuid not null references sessions(id) on delete cascade,
  group_id          uuid references groups(id) on delete set null,
  name              text not null,
  role_id           text check (role_id in ('XX','YY','ZZ','AA','GG','CC')),
  prep_notes        jsonb default '{}',
  scorecard_result  jsonb default '{}',
  final_vote        text check (final_vote in ('accept','accept_reservations','reject')),
  vote_justification text,
  online            boolean default false,
  last_seen         timestamptz default now(),
  created_at        timestamptz default now()
);

-- ─── MESSAGES (all chat — bilateral and group) ────────────────────────────────
create table if not exists messages (
  id           uuid primary key default uuid_generate_v4(),
  session_id   uuid not null references sessions(id) on delete cascade,
  group_id     uuid not null references groups(id) on delete cascade,
  sender_id    uuid not null references participants(id) on delete cascade,
  sender_role  text not null,
  sender_name  text not null,
  channel      text not null,  -- 'group' or dyad key e.g. 'XX_YY'
  content      text not null,
  phase        text not null,
  is_system    boolean default false,
  created_at   timestamptz default now()
);

-- ─── PLANS (one per group) ────────────────────────────────────────────────────
create table if not exists plans (
  id                    uuid primary key default uuid_generate_v4(),
  group_id              uuid not null unique references groups(id) on delete cascade,
  session_id            uuid not null references sessions(id) on delete cascade,
  cost_allocation       jsonb default '{"XX":0,"YY":0,"ZZ":0,"AA":0,"GG":0,"CC":0}',
  monitoring_mechanisms text[] default '{}',
  penalty_ladder        jsonb default '{}',
  milestones            jsonb default '{}',
  standard              text default 'RSPO',
  notes                 text,
  submitted_at          timestamptz,
  updated_at            timestamptz default now()
);

-- ─── CURVEBALL LOG (which events have been injected) ─────────────────────────
create table if not exists curveball_log (
  id           uuid primary key default uuid_generate_v4(),
  session_id   uuid not null references sessions(id) on delete cascade,
  curveball_id text not null,
  injected_at  timestamptz default now(),
  injected_by  uuid references users(id)
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

alter table users        enable row level security;
alter table sessions     enable row level security;
alter table groups       enable row level security;
alter table participants enable row level security;
alter table messages     enable row level security;
alter table plans        enable row level security;
alter table curveball_log enable row level security;

-- Users: admin sees all, professor sees own record
create policy "admin_all_users" on users
  for all using (
    exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy "professor_own_user" on users
  for select using (id = auth.uid());

-- Sessions: admin sees all, professor sees own
create policy "admin_all_sessions" on sessions
  for all using (
    exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy "professor_own_sessions" on sessions
  for all using (professor_id = auth.uid());

-- Public read for join (participants join by code)
create policy "public_read_session_by_code" on sessions
  for select using (true);

-- Groups: visible to session participants and professors
create policy "groups_visible" on groups
  for select using (true);

create policy "professor_manage_groups" on groups
  for all using (
    exists (
      select 1 from sessions s
      where s.id = groups.session_id
        and (s.professor_id = auth.uid()
             or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'))
    )
  );

-- Participants: open insert (students join), select visible to all in session
create policy "participants_insert" on participants
  for insert with check (true);

create policy "participants_select" on participants
  for select using (true);

create policy "participants_update_own" on participants
  for update using (true);

-- Messages: insert by anyone (participants send), select within session
create policy "messages_insert" on messages
  for insert with check (true);

create policy "messages_select" on messages
  for select using (true);

-- Plans: visible to all, managed by session participants
create policy "plans_select" on plans
  for select using (true);

create policy "plans_upsert" on plans
  for all using (true);

-- Curveball log
create policy "curveball_log_all" on curveball_log
  for all using (true);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
create index if not exists idx_sessions_join_code    on sessions(join_code);
create index if not exists idx_sessions_professor    on sessions(professor_id);
create index if not exists idx_groups_session        on groups(session_id);
create index if not exists idx_participants_session  on participants(session_id);
create index if not exists idx_participants_group    on participants(group_id);
create index if not exists idx_messages_group        on messages(group_id);
create index if not exists idx_messages_channel      on messages(channel);
create index if not exists idx_messages_created      on messages(created_at);
create index if not exists idx_plans_group           on plans(group_id);

-- ─── REALTIME ────────────────────────────────────────────────────────────────
-- Enable realtime for live chat and phase updates
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table plans;
alter publication supabase_realtime add table groups;
