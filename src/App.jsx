import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, generateJoinCode, generateId } from './lib/supabase';
import {
  ROLES, PHASES, BILATERAL_DYADS, COST_POOL_ITEMS,
  MONITORING_MECHANISMS, CURVEBALL_EVENTS, DEBRIEF_QUESTIONS,
  PREP_QUESTIONS, FIVE_YEAR_MILESTONES
} from './data/gameData';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  forest:  '#1a3a2a',
  leaf:    '#2d6a4f',
  sage:    '#52b788',
  mist:    '#d8f3dc',
  cream:   '#fefae0',
  amber:   '#b7791f',
  ember:   '#7b2d00',
  ink:     '#1a1a1a',
  stone:   '#6b7280',
  fog:     '#f3f4f6',
  white:   '#ffffff',
  danger:  '#dc2626',
  warning: '#d97706',
  info:    '#2563eb',
};

const css = {
  app: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    minHeight: '100vh',
    background: T.fog,
    color: T.ink,
  },
  card: {
    background: T.white,
    borderRadius: 12,
    border: `1px solid #e5e7eb`,
    padding: '20px 24px',
    marginBottom: 16,
  },
  btn: (variant = 'primary') => ({
    padding: '9px 18px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
    transition: 'all 0.15s',
    ...(variant === 'primary' && { background: T.leaf, color: T.white }),
    ...(variant === 'secondary' && { background: T.fog, color: T.ink, border: `1px solid #d1d5db` }),
    ...(variant === 'danger' && { background: T.danger, color: T.white }),
    ...(variant === 'ghost' && { background: 'transparent', color: T.leaf, border: `1px solid ${T.leaf}` }),
    ...(variant === 'forest' && { background: T.forest, color: T.white }),
  }),
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 13,
    fontFamily: 'Georgia, serif',
    resize: 'vertical',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: T.stone,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 6,
  },
  h1: { fontSize: 28, fontWeight: 700, margin: 0, color: T.forest },
  h2: { fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: T.forest },
  h3: { fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: T.ink },
  tag: (color, bg) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color: color,
    fontFamily: 'Georgia, serif',
  }),
};

// ─── PHASE BAR ────────────────────────────────────────────────────────────────
function PhaseBar({ currentPhase }) {
  const idx = PHASES.findIndex(p => p.id === currentPhase);
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {PHASES.map((p, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <div key={p.id} style={{
            flex: 1, padding: '8px 4px', textAlign: 'center',
            background: active ? T.leaf : done ? T.mist : T.white,
            color: active ? T.white : done ? T.leaf : T.stone,
            fontSize: 10, fontWeight: active ? 700 : 400,
            borderRight: i < PHASES.length - 1 ? '1px solid #e5e7eb' : 'none',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: 14, marginBottom: 2 }}>{p.icon}</div>
            <div style={{ lineHeight: 1.2 }}>{p.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ROLE BADGE ───────────────────────────────────────────────────────────────
function RoleBadge({ roleId, small }) {
  const role = ROLES[roleId];
  if (!role) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: role.bg, color: role.color,
      border: `1px solid ${role.border}`,
      borderRadius: 20, padding: small ? '2px 8px' : '4px 12px',
      fontSize: small ? 11 : 12, fontWeight: 600, fontFamily: 'Georgia, serif',
    }}>
      {role.icon} {role.name}
    </span>
  );
}

// ─── COST POOL DISPLAY ────────────────────────────────────────────────────────
function CostPoolBar({ allocation }) {
  const total = Object.values(allocation || {}).reduce((s, v) => s + (v || 0), 0);
  const roleColors = { XX: '#1a56db', YY: '#057a55', ZZ: '#b45309', AA: '#9f1239', GG: '#5b21b6', CC: '#0369a1' };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: T.stone }}>
        <span>Cost pool allocation</span>
        <span style={{ fontWeight: 700, color: total === 100 ? T.leaf : total > 100 ? T.danger : T.amber }}>
          {total}/100 points
        </span>
      </div>
      <div style={{ height: 20, borderRadius: 10, background: '#e5e7eb', overflow: 'hidden', display: 'flex' }}>
        {Object.entries(allocation || {}).map(([roleId, pts]) =>
          pts > 0 ? (
            <div key={roleId} style={{
              width: `${pts}%`, background: roleColors[roleId] || T.stone,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: T.white, fontWeight: 700, transition: 'width 0.3s',
            }}>{pts > 4 ? pts : ''}</div>
          ) : null
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        {Object.entries(allocation || {}).map(([roleId, pts]) => (
          <span key={roleId} style={{ fontSize: 11, color: T.stone }}>
            <span style={{ color: roleColors[roleId], fontWeight: 700 }}>{ROLES[roleId]?.icon}</span>
            {' '}{pts}pts
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT COMPONENT ───────────────────────────────────────────────────────────
function ChatPanel({ messages, onSend, channel, participantId, roleId, phase, canSend, placeholder }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  const send = () => {
    if (!text.trim() || !canSend) return;
    onSend(text.trim());
    setText('');
  };

  const myRole = ROLES[roleId];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 320 }}>
      <div style={{
        flex: 1, overflowY: 'auto', padding: 12, display: 'flex',
        flexDirection: 'column', gap: 10, background: '#fafafa',
        borderRadius: '8px 8px 0 0', border: '1px solid #e5e7eb', borderBottom: 'none',
      }}>
        {(!messages || messages.length === 0) && (
          <div style={{ textAlign: 'center', color: T.stone, padding: 30, fontSize: 13, fontStyle: 'italic' }}>
            No messages yet. {canSend ? 'Be the first to speak.' : 'This channel is not yet open.'}
          </div>
        )}
        {(messages || []).map((m, i) => {
          const isMe = m.sender_id === participantId;
          const mRole = ROLES[m.sender_role];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{mRole?.icon || '?'}</span>
              <div style={{ maxWidth: '75%' }}>
                {!isMe && <div style={{ fontSize: 10, color: T.stone, marginBottom: 2 }}>{mRole?.character || m.sender_name}</div>}
                <div style={{
                  padding: '8px 12px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                  background: isMe ? (myRole?.color || T.leaf) : T.white,
                  color: isMe ? T.white : T.ink,
                  border: isMe ? 'none' : '1px solid #e5e7eb',
                  borderBottomRightRadius: isMe ? 3 : 12,
                  borderBottomLeftRadius: isMe ? 12 : 3,
                }}>{m.is_system ? <em>{m.content}</em> : m.content}</div>
                <div style={{ fontSize: 10, color: T.stone, marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, padding: 10, background: T.white, border: '1px solid #e5e7eb', borderRadius: '0 0 8px 8px' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={canSend ? (placeholder || 'Type your message...') : 'Channel not yet open'}
          disabled={!canSend}
          style={{ ...css.textarea, minHeight: 42, maxHeight: 80, flex: 1, margin: 0 }}
        />
        <button onClick={send} disabled={!canSend || !text.trim()} style={{
          ...css.btn('primary'), alignSelf: 'flex-end', opacity: (!canSend || !text.trim()) ? 0.5 : 1,
        }}>Send</button>
      </div>
    </div>
  );
}

// ─── CURVEBALL BANNER ─────────────────────────────────────────────────────────
function CurveballBanner({ event, onAck, acknowledged }) {
  if (!event) return null;
  const cb = CURVEBALL_EVENTS.find(c => c.id === event);
  if (!cb) return null;
  return (
    <div style={{
      background: '#7f1d1d', color: T.white, borderRadius: 10, padding: '14px 18px',
      marginBottom: 16, border: '2px solid #ef4444',
      animation: 'pulse 2s infinite',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>⚡ CURVEBALL EVENT</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{cb.title}</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{cb.description}</div>
          <div style={{ fontSize: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 10px', fontStyle: 'italic' }}>
            {cb.instruction}
          </div>
        </div>
        {!acknowledged && (
          <button onClick={onAck} style={{ ...css.btn('secondary'), flexShrink: 0, background: T.white, color: '#7f1d1d' }}>
            Acknowledged
          </button>
        )}
        {acknowledged && <span style={{ fontSize: 12, opacity: 0.7, flexShrink: 0 }}>✓ Read</span>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function StudentView({ participant, group, session, groups }) {
  const [tab, setTab] = useState('role');
  const [messages, setMessages] = useState({});
  const [plan, setPlan] = useState(null);
  const [prepNotes, setPrepNotes] = useState(participant.prep_notes || {});
  const [vote, setVote] = useState(participant.final_vote || null);
  const [voteJustification, setVoteJustification] = useState(participant.vote_justification || '');
  const [curveballAck, setCurveballAck] = useState(false);
  const [scorecardRatings, setScorecardRatings] = useState({});
  const [activeChannel, setActiveChannel] = useState('group');
  const [scorecards, setScorecards] = useState(null);

  const role = ROLES[participant.role_id];
  const phase = session.phase;
  const phaseIdx = PHASES.findIndex(p => p.id === phase);

  // Reset curveball ack when new event arrives
  useEffect(() => {
    if (session.active_curveball) setCurveballAck(false);
  }, [session.active_curveball]);

  // Subscribe to messages
  useEffect(() => {
    if (!group) return;
    const loadMessages = async () => {
      const { data } = await supabase.from('messages')
        .select('*').eq('group_id', group.id).order('created_at');
      if (data) {
        const byChannel = {};
        data.forEach(m => {
          if (!byChannel[m.channel]) byChannel[m.channel] = [];
          byChannel[m.channel].push(m);
        });
        setMessages(byChannel);
      }
    };
    loadMessages();

    const sub = supabase.channel(`messages:${group.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${group.id}` },
        payload => {
          setMessages(prev => {
            const ch = payload.new.channel;
            return { ...prev, [ch]: [...(prev[ch] || []), payload.new] };
          });
        })
      .subscribe();
    return () => sub.unsubscribe();
  }, [group?.id]);

  // Load plan
  useEffect(() => {
    if (!group) return;
    const load = async () => {
      const { data } = await supabase.from('plans').select('*').eq('group_id', group.id).single();
      if (data) setPlan(data);
    };
    load();
    const sub = supabase.channel(`plan:${group.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plans', filter: `group_id=eq.${group.id}` },
        p => setPlan(p.new))
      .subscribe();
    return () => sub.unsubscribe();
  }, [group?.id]);

  // Load scorecards (debrief phase)
  useEffect(() => {
    if (phase !== 'debrief' || !group) return;
    const load = async () => {
      const { data } = await supabase.from('participants').select('*').eq('group_id', group.id);
      if (data) setScorecards(data);
    };
    load();
  }, [phase, group?.id]);

  const sendMessage = async (text) => {
    if (!participant || !group) return;
    await supabase.from('messages').insert({
      session_id: session.id,
      group_id: group.id,
      sender_id: participant.id,
      sender_role: participant.role_id,
      sender_name: participant.name,
      channel: activeChannel,
      content: text,
      phase,
    });
  };

  const savePrepNotes = async (key, value) => {
    const updated = { ...prepNotes, [key]: value };
    setPrepNotes(updated);
    await supabase.from('participants').update({ prep_notes: updated }).eq('id', participant.id);
  };

  const submitVote = async () => {
    if (!vote) return;
    await supabase.from('participants').update({ final_vote: vote, vote_justification: voteJustification }).eq('id', participant.id);
  };

  const updatePlanAllocation = async (roleId, pts) => {
    if (!plan) return;
    const updated = { ...plan.cost_allocation, [roleId]: parseInt(pts) || 0 };
    await supabase.from('plans').upsert({ group_id: group.id, session_id: session.id, cost_allocation: updated, updated_at: new Date().toISOString() });
  };

  // Which channels are available
  const availableChannels = () => {
    const channels = [];
    if (phaseIdx >= PHASES.findIndex(p => p.id === 'round3')) channels.push('group');
    if (phaseIdx >= PHASES.findIndex(p => p.id === 'round1')) channels.push('group'); // Round 1 uses group for opening statements
    if (phaseIdx >= PHASES.findIndex(p => p.id === 'round2')) {
      BILATERAL_DYADS.forEach(d => {
        if (d.roles.includes(participant.role_id)) channels.push(d.id);
      });
    }
    return [...new Set(channels)];
  };

  const tabs = [
    { id: 'role', label: 'My Role', show: true },
    { id: 'prep', label: 'Preparation', show: phaseIdx >= PHASES.findIndex(p => p.id === 'preparation') },
    { id: 'negotiate', label: 'Negotiate', show: phaseIdx >= PHASES.findIndex(p => p.id === 'round1') },
    { id: 'plan', label: '5-Year Plan', show: phaseIdx >= PHASES.findIndex(p => p.id === 'round4') },
    { id: 'debrief', label: 'Debrief', show: phase === 'debrief' },
  ].filter(t => t.show);

  if (!role) return <div style={css.card}><p>Waiting for role assignment...</p></div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      {/* Header */}
      <div style={{ ...css.card, background: role.bg, border: `1px solid ${role.border}`, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 40 }}>{role.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: role.color }}>{role.character}</div>
          <div style={{ fontSize: 13, color: T.stone }}>{role.name} · {role.subtitle}</div>
          <div style={{ fontSize: 12, color: T.stone, marginTop: 2 }}>{group?.name} · {session.name}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: T.stone }}>
          <div>{PHASES.find(p => p.id === phase)?.icon} {PHASES.find(p => p.id === phase)?.label}</div>
        </div>
      </div>

      {/* Curveball */}
      {session.active_curveball && (
        <CurveballBanner event={session.active_curveball} onAck={() => setCurveballAck(true)} acknowledged={curveballAck} />
      )}

      <PhaseBar currentPhase={phase} />

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid #e5e7eb' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: tab === t.id ? `2px solid ${role.color}` : '2px solid transparent',
            color: tab === t.id ? role.color : T.stone,
            fontWeight: tab === t.id ? 700 : 400, fontSize: 13, fontFamily: 'Georgia, serif',
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ROLE TAB */}
      {tab === 'role' && (
        <div>
          <div style={css.card}>
            <h3 style={css.h3}>Your character</h3>
            <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line', color: T.ink }}>
              {role.fullDesc}
            </div>
          </div>
          <div style={css.card}>
            <h3 style={css.h3}>Your negotiating points</h3>
            {role.negotiatingPoints.map((p, i) => (
              <div key={i} style={{ padding: '8px 12px', background: role.bg, borderRadius: 8, marginBottom: 8, fontSize: 13, color: role.color, borderLeft: `3px solid ${role.color}` }}>
                {i + 1}. {p}
              </div>
            ))}
          </div>
          {role.survivalThreshold && (
            <div style={{ ...css.card, background: '#fef2f2', border: '1px solid #fca5a5' }}>
              <div style={{ fontWeight: 700, color: T.danger, marginBottom: 4 }}>⚠ Survival threshold</div>
              <div style={{ fontSize: 13 }}>If your cost share exceeds <strong>{role.survivalThreshold} points</strong>, the plan is economically unworkable for your members. You have the right to declare this and refuse to sign.</div>
            </div>
          )}
        </div>
      )}

      {/* PREPARATION TAB */}
      {tab === 'prep' && (
        <div>
          <div style={{ ...css.card, background: '#fffbeb', border: '1px solid #fcd34d', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: T.amber, fontStyle: 'italic' }}>
              Your preparation notes are private. Only you and your professor can see them. Complete all sections before the negotiation begins.
            </div>
          </div>
          {PREP_QUESTIONS.map(q => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <label style={css.label}>{q.label}</label>
              <textarea
                value={prepNotes[q.id] || ''}
                onChange={e => savePrepNotes(q.id, e.target.value)}
                placeholder={q.placeholder}
                style={{ ...css.textarea, minHeight: 80 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* NEGOTIATE TAB */}
      {tab === 'negotiate' && (
        <div>
          {/* Channel selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {availableChannels().map(ch => {
              const dyad = BILATERAL_DYADS.find(d => d.id === ch);
              const label = ch === 'group' ? '🌐 Group chat' : `🔒 ${dyad?.label || ch}`;
              const isOpen = ch === 'group'
                ? phaseIdx >= PHASES.findIndex(p => p.id === 'round3')
                : phaseIdx >= PHASES.findIndex(p => p.id === 'round2');
              return (
                <button key={ch} onClick={() => isOpen && setActiveChannel(ch)} style={{
                  ...css.btn(activeChannel === ch ? 'primary' : 'secondary'),
                  fontSize: 12, opacity: isOpen ? 1 : 0.5, cursor: isOpen ? 'pointer' : 'not-allowed',
                }}>{label}</button>
              );
            })}
          </div>

          {/* Round 1 instruction */}
          {phase === 'round1' && (
            <div style={{ ...css.card, background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: T.info, marginBottom: 4 }}>Round 1 — Opening statements</div>
              <div style={{ fontSize: 13 }}>Post your opening position in the group chat. State clearly: what you are willing to do, what you need, and what you will not accept. No negotiating yet — this is your public declaration.</div>
            </div>
          )}
          {phase === 'round2' && (
            <div style={{ ...css.card, background: '#f0fdf4', border: '1px solid #86efac', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: T.leaf, marginBottom: 4 }}>Round 2 — Bilateral negotiations</div>
              <div style={{ fontSize: 13 }}>Use your private bilateral channels to negotiate with your key partners. Make offers, counter-offer, and build conditional deals. Everyone in the group can see the group chat but not your bilateral conversations.</div>
            </div>
          )}
          {phase === 'round3' && (
            <div style={{ ...css.card, background: '#faf5ff', border: '1px solid #c4b5fd', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: '#5b21b6', marginBottom: 4 }}>Round 3 — Coalition building</div>
              <div style={{ fontSize: 13 }}>The full group is now in the shared chat. Test whether your bilateral deals are compatible. Expose contradictions. Find where the plan holds and where it breaks.</div>
            </div>
          )}

          {/* Current channel info */}
          {activeChannel !== 'group' && (
            <div style={{ fontSize: 12, color: T.stone, marginBottom: 8, fontStyle: 'italic' }}>
              🔒 Private channel: {BILATERAL_DYADS.find(d => d.id === activeChannel)?.topic}
            </div>
          )}

          <ChatPanel
            messages={messages[activeChannel]}
            onSend={sendMessage}
            channel={activeChannel}
            participantId={participant.id}
            roleId={participant.role_id}
            phase={phase}
            canSend={
              (phase === 'round1' && activeChannel === 'group') ||
              (phase === 'round2' && activeChannel !== 'group') ||
              (['round3', 'round4'].includes(phase) && activeChannel === 'group')
            }
            placeholder={
              phase === 'round1' ? 'State your opening position...' :
              phase === 'round2' ? 'Make your offer or counter-proposal...' :
              'Build the coalition plan...'
            }
          />
        </div>
      )}

      {/* PLAN TAB */}
      {tab === 'plan' && (
        <div>
          {/* Cost pool */}
          <div style={css.card}>
            <h3 style={css.h3}>Cost pool allocation</h3>
            <div style={{ fontSize: 13, color: T.stone, marginBottom: 12 }}>
              Set your stakeholder's contribution. The total must reach exactly 100 points before the plan can be signed.
            </div>
            <CostPoolBar allocation={plan?.cost_allocation || {}} />
            <div style={{ marginTop: 16 }}>
              <label style={css.label}>{role.name} — your points contribution</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="range" min={0} max={60} step={1}
                  value={plan?.cost_allocation?.[participant.role_id] || 0}
                  onChange={e => updatePlanAllocation(participant.role_id, e.target.value)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 700, fontSize: 18, minWidth: 40, color: role.color }}>
                  {plan?.cost_allocation?.[participant.role_id] || 0}
                </span>
              </div>
              {COST_POOL_ITEMS.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: 12 }}>
                  <span style={{ color: T.ink }}>{item.label}</span>
                  <span style={{ color: T.stone, fontWeight: 600 }}>{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring mechanism */}
          <div style={css.card}>
            <h3 style={css.h3}>Monitoring mechanism</h3>
            <div style={{ fontSize: 13, color: T.stone, marginBottom: 12 }}>Which combination will your group adopt?</div>
            {MONITORING_MECHANISMS.map(m => {
              const selected = (plan?.monitoring_mechanisms || []).includes(m.id);
              return (
                <div key={m.id} onClick={async () => {
                  const current = plan?.monitoring_mechanisms || [];
                  const updated = selected ? current.filter(x => x !== m.id) : [...current, m.id];
                  await supabase.from('plans').upsert({ group_id: group.id, session_id: session.id, monitoring_mechanisms: updated, updated_at: new Date().toISOString() });
                }} style={{
                  ...css.card,
                  cursor: 'pointer', marginBottom: 8,
                  border: `2px solid ${selected ? T.leaf : '#e5e7eb'}`,
                  background: selected ? '#f0fdf4' : T.white,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.icon} {m.label} <span style={{ ...css.tag(T.stone, T.fog), marginLeft: 6 }}>{m.cost} pts</span></div>
                      <div style={{ fontSize: 12, color: T.stone, marginBottom: 4 }}>{m.desc}</div>
                      <div style={{ fontSize: 11, color: T.leaf }}>✓ {m.pros}</div>
                      <div style={{ fontSize: 11, color: T.danger }}>✗ {m.cons}</div>
                    </div>
                    {selected && <span style={{ color: T.leaf, fontSize: 20 }}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5-year milestones */}
          <div style={css.card}>
            <h3 style={css.h3}>5-year plan — your stakeholder's commitments</h3>
            {FIVE_YEAR_MILESTONES.map(yr => (
              <div key={yr.year} style={{ marginBottom: 14 }}>
                <label style={{ ...css.label, color: role.color }}>Year {yr.year}</label>
                <div style={{ fontSize: 11, color: T.stone, marginBottom: 4, fontStyle: 'italic' }}>{yr.hint}</div>
                <textarea
                  value={(plan?.milestones || {})[`${participant.role_id}_${yr.year}`] || ''}
                  onChange={async e => {
                    const key = `${participant.role_id}_${yr.year}`;
                    const updated = { ...(plan?.milestones || {}), [key]: e.target.value };
                    await supabase.from('plans').upsert({ group_id: group.id, session_id: session.id, milestones: updated, updated_at: new Date().toISOString() });
                  }}
                  placeholder={`What does ${role.name} commit to in Year ${yr.year}?`}
                  style={{ ...css.textarea, minHeight: 60 }}
                />
              </div>
            ))}
          </div>

          {/* Vote */}
          <div style={css.card}>
            <h3 style={css.h3}>Final vote</h3>
            <div style={{ fontSize: 13, color: T.stone, marginBottom: 12 }}>Before signing, each stakeholder must formally indicate their position.</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[['accept', '✓ Accept', T.leaf], ['accept_reservations', '~ Accept with reservations', T.amber], ['reject', '✗ Reject', T.danger]].map(([v, label, color]) => (
                <button key={v} onClick={() => setVote(v)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, border: `2px solid ${vote === v ? color : '#e5e7eb'}`,
                  background: vote === v ? `${color}22` : T.white, color: vote === v ? color : T.stone,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Georgia, serif',
                }}>{label}</button>
              ))}
            </div>
            <label style={css.label}>Justification</label>
            <textarea
              value={voteJustification}
              onChange={e => setVoteJustification(e.target.value)}
              placeholder="Explain your vote — what did you get, what did you give, and is it good enough?"
              style={{ ...css.textarea, minHeight: 80, marginBottom: 12 }}
            />
            <button onClick={submitVote} disabled={!vote} style={{ ...css.btn('primary'), opacity: vote ? 1 : 0.5 }}>
              Submit vote
            </button>
          </div>
        </div>
      )}

      {/* DEBRIEF TAB */}
      {tab === 'debrief' && (
        <div>
          {/* Scorecard reveal */}
          <div style={css.card}>
            <h3 style={css.h3}>Your scorecard</h3>
            {role.scorecard.map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span>{item.label}</span>
                  <span style={{ color: T.stone }}>{item.weight}%</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setScorecardRatings(prev => ({ ...prev, [i]: n }))} style={{
                      flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: (scorecardRatings[i] || 0) >= n ? role.color : '#e5e7eb',
                      color: (scorecardRatings[i] || 0) >= n ? T.white : T.stone, fontSize: 12,
                    }}>{n}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* All scorecards */}
          {scorecards && (
            <div style={css.card}>
              <h3 style={css.h3}>All votes revealed</h3>
              {scorecards.map(p => {
                const r = ROLES[p.role_id];
                return (
                  <div key={p.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 24 }}>{r?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{r?.character} <span style={{ ...css.tag(r?.color, r?.bg), marginLeft: 6 }}>{r?.name}</span></div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>
                        {p.final_vote === 'accept' && <span style={{ color: T.leaf, fontWeight: 600 }}>✓ Accept</span>}
                        {p.final_vote === 'accept_reservations' && <span style={{ color: T.amber, fontWeight: 600 }}>~ Accept with reservations</span>}
                        {p.final_vote === 'reject' && <span style={{ color: T.danger, fontWeight: 600 }}>✗ Reject</span>}
                        {!p.final_vote && <span style={{ color: T.stone }}>— not voted</span>}
                      </div>
                      {p.vote_justification && <div style={{ fontSize: 12, color: T.stone, marginTop: 4, fontStyle: 'italic' }}>{p.vote_justification}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Debrief questions */}
          {DEBRIEF_QUESTIONS.map((cat, ci) => (
            <div key={ci} style={css.card}>
              <h3 style={{ ...css.h3, color: T.forest }}>{cat.category}</h3>
              {cat.questions.map((q, qi) => (
                <div key={qi} style={{ padding: '10px 12px', background: T.mist, borderRadius: 8, marginBottom: 8, fontSize: 13, borderLeft: `3px solid ${T.sage}`, lineHeight: 1.6 }}>{q}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSOR VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function ProfessorView({ user, session, setSession }) {
  const [groups, setGroups] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [profTab, setProfTab] = useState('control');
  const [monitorGroup, setMonitorGroup] = useState(null);
  const [monitorChannel, setMonitorChannel] = useState('group');

  const phaseIdx = PHASES.findIndex(p => p.id === session.phase);

  useEffect(() => {
    loadAll();
    const subs = [
      supabase.channel(`prof:groups:${session.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'groups', filter: `session_id=eq.${session.id}` }, loadAll)
        .subscribe(),
      supabase.channel(`prof:participants:${session.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${session.id}` }, loadAll)
        .subscribe(),
      supabase.channel(`prof:messages:${session.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${session.id}` },
          p => setMessages(prev => [...prev, p.new]))
        .subscribe(),
      supabase.channel(`prof:plans:${session.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'plans', filter: `session_id=eq.${session.id}` }, loadAll)
        .subscribe(),
      supabase.channel(`prof:session:${session.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${session.id}` },
          p => setSession(p.new))
        .subscribe(),
    ];
    return () => subs.forEach(s => s.unsubscribe());
  }, [session.id]);

  const loadAll = async () => {
    const [g, p, pl, msg] = await Promise.all([
      supabase.from('groups').select('*').eq('session_id', session.id),
      supabase.from('participants').select('*').eq('session_id', session.id),
      supabase.from('plans').select('*').eq('session_id', session.id),
      supabase.from('messages').select('*').eq('session_id', session.id).order('created_at').limit(500),
    ]);
    if (g.data) setGroups(g.data);
    if (p.data) setParticipants(p.data);
    if (pl.data) setPlans(pl.data);
    if (msg.data) setMessages(msg.data);
  };

  const advancePhase = async () => {
    if (phaseIdx >= PHASES.length - 1) return;
    const next = PHASES[phaseIdx + 1];
    await supabase.from('sessions').update({ phase: next.id, phase_started_at: new Date().toISOString() }).eq('id', session.id);
    setSession(prev => ({ ...prev, phase: next.id }));
  };

  const reversePhase = async () => {
    if (phaseIdx <= 0) return;
    const prev = PHASES[phaseIdx - 1];
    await supabase.from('sessions').update({ phase: prev.id }).eq('id', session.id);
    setSession(s => ({ ...s, phase: prev.id }));
  };

  const injectCurveball = async (cbId) => {
    await supabase.from('sessions').update({
      active_curveball: cbId,
      curveball_used: [...(session.curveball_used || []), cbId],
    }).eq('id', session.id);
    setSession(s => ({ ...s, active_curveball: cbId }));
  };

  const clearCurveball = async () => {
    await supabase.from('sessions').update({ active_curveball: null }).eq('id', session.id);
    setSession(s => ({ ...s, active_curveball: null }));
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    await supabase.from('groups').insert({ session_id: session.id, name: newGroupName.trim() });
    setNewGroupName('');
  };

  const assignRole = async (participantId, roleId) => {
    await supabase.from('participants').update({ role_id: roleId }).eq('id', participantId);
  };

  const assignGroup = async (participantId, groupId) => {
    await supabase.from('participants').update({ group_id: groupId }).eq('id', participantId);
  };

  const profTabs = [
    { id: 'control', label: '🎛 Control' },
    { id: 'groups', label: '👥 Groups' },
    { id: 'monitor', label: '💬 Monitor' },
    { id: 'plans', label: '📊 Plans' },
    { id: 'debrief', label: '💡 Debrief' },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      {/* Header */}
      <div style={{ ...css.card, background: T.forest, color: T.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>🌿 {session.name}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>Join code: <strong style={{ fontSize: 18, letterSpacing: 2 }}>{session.join_code}</strong></div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, opacity: 0.8 }}>
          <div>{participants.length} students joined</div>
          <div>{groups.length} groups</div>
        </div>
      </div>

      <PhaseBar currentPhase={session.phase} />

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid #e5e7eb' }}>
        {profTabs.map(t => (
          <button key={t.id} onClick={() => setProfTab(t.id)} style={{
            padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: profTab === t.id ? `2px solid ${T.leaf}` : '2px solid transparent',
            color: profTab === t.id ? T.leaf : T.stone, fontWeight: profTab === t.id ? 700 : 400,
            fontSize: 13, fontFamily: 'Georgia, serif', marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* CONTROL TAB */}
      {profTab === 'control' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={css.card}>
              <h3 style={css.h3}>Phase control</h3>
              <div style={{ padding: '12px 16px', background: T.mist, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: T.stone }}>Current phase</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>
                  {PHASES.find(p => p.id === session.phase)?.icon} {PHASES.find(p => p.id === session.phase)?.label}
                </div>
                <div style={{ fontSize: 12, color: T.stone, marginTop: 4 }}>{PHASES.find(p => p.id === session.phase)?.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={reversePhase} disabled={phaseIdx <= 0} style={{ ...css.btn('secondary'), flex: 1, opacity: phaseIdx <= 0 ? 0.5 : 1 }}>← Back</button>
                <button onClick={advancePhase} disabled={phaseIdx >= PHASES.length - 1} style={{ ...css.btn('forest'), flex: 2, opacity: phaseIdx >= PHASES.length - 1 ? 0.5 : 1 }}>
                  Advance → {phaseIdx < PHASES.length - 1 ? PHASES[phaseIdx + 1]?.label : ''}
                </button>
              </div>
            </div>

            <div style={css.card}>
              <h3 style={css.h3}>Curveball events</h3>
              {session.active_curveball && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#fef2f2', borderRadius: 8, marginBottom: 10, fontSize: 12 }}>
                  <span style={{ color: T.danger, fontWeight: 600 }}>⚡ Active: {CURVEBALL_EVENTS.find(c => c.id === session.active_curveball)?.title}</span>
                  <button onClick={clearCurveball} style={{ ...css.btn('secondary'), fontSize: 11, padding: '3px 8px' }}>Clear</button>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CURVEBALL_EVENTS.map(cb => {
                  const used = (session.curveball_used || []).includes(cb.id);
                  return (
                    <button key={cb.id} onClick={() => !used && injectCurveball(cb.id)} disabled={used} style={{
                      ...css.btn(used ? 'secondary' : 'ghost'),
                      fontSize: 12, textAlign: 'left', opacity: used ? 0.5 : 1,
                      padding: '7px 10px',
                    }}>
                      ⚡ {cb.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Session stats */}
          <div style={{ ...css.card }}>
            <h3 style={css.h3}>Session overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                ['Students', participants.length],
                ['Groups', groups.length],
                ['Messages', messages.length],
                ['Plans submitted', plans.filter(p => p.submitted_at).length],
              ].map(([label, val]) => (
                <div key={label} style={{ background: T.fog, borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: T.forest }}>{val}</div>
                  <div style={{ fontSize: 11, color: T.stone }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GROUPS TAB */}
      {profTab === 'groups' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createGroup()}
              placeholder="Group name (e.g. Team Alpha)" style={{ ...css.input, flex: 1 }} />
            <button onClick={createGroup} style={css.btn('primary')}>+ Add group</button>
          </div>

          {groups.map(group => {
            const groupParticipants = participants.filter(p => p.group_id === group.id);
            const unassigned = participants.filter(p => !p.group_id);
            const assignedRoles = groupParticipants.map(p => p.role_id).filter(Boolean);
            return (
              <div key={group.id} style={css.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{group.name}</div>
                    <div style={{ fontSize: 12, color: T.stone }}>{groupParticipants.length} students · {assignedRoles.length}/6 roles assigned</div>
                  </div>
                  <span style={{ ...css.tag(T.leaf, T.mist) }}>{group.plan_status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {Object.values(ROLES).map(role => {
                    const assignedParticipant = groupParticipants.find(p => p.role_id === role.id);
                    return (
                      <div key={role.id} style={{ background: role.bg, border: `1px solid ${role.border}`, borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: role.color, marginBottom: 4 }}>{role.icon} {role.name}</div>
                        {assignedParticipant ? (
                          <div style={{ fontSize: 12, color: T.ink }}>{assignedParticipant.name}</div>
                        ) : (
                          <select onChange={async e => {
                            if (!e.target.value) return;
                            await assignGroup(e.target.value, group.id);
                            await assignRole(e.target.value, role.id);
                          }} style={{ ...css.input, padding: '3px 6px', fontSize: 11 }}>
                            <option value="">Assign student...</option>
                            {[...unassigned, ...groupParticipants.filter(p => !p.role_id)].map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Unassigned */}
          {participants.filter(p => !p.group_id).length > 0 && (
            <div style={css.card}>
              <h3 style={css.h3}>Unassigned students</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {participants.filter(p => !p.group_id).map(p => (
                  <span key={p.id} style={{ ...css.tag(T.stone, T.fog), fontSize: 12, padding: '4px 10px' }}>{p.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MONITOR TAB */}
      {profTab === 'monitor' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {groups.map(g => (
              <button key={g.id} onClick={() => setMonitorGroup(g)} style={{ ...css.btn(monitorGroup?.id === g.id ? 'primary' : 'secondary'), fontSize: 12 }}>
                {g.name}
              </button>
            ))}
          </div>
          {monitorGroup && (
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setMonitorChannel('group')} style={{ ...css.btn(monitorChannel === 'group' ? 'primary' : 'secondary'), fontSize: 11 }}>Group chat</button>
                {BILATERAL_DYADS.map(d => (
                  <button key={d.id} onClick={() => setMonitorChannel(d.id)} style={{ ...css.btn(monitorChannel === d.id ? 'primary' : 'secondary'), fontSize: 11 }}>
                    🔒 {d.roles.join('↔')}
                  </button>
                ))}
              </div>
              <div style={{ maxHeight: 500, overflowY: 'auto', ...css.card }}>
                {messages.filter(m => m.group_id === monitorGroup.id && m.channel === monitorChannel).map((m, i) => {
                  const r = ROLES[m.sender_role];
                  return (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 10 }}>
                      <span>{r?.icon || '?'}</span>
                      <div>
                        <div style={{ fontSize: 11, color: T.stone }}>{r?.character} · {new Date(m.created_at).toLocaleTimeString()}</div>
                        <div style={{ fontSize: 13 }}>{m.content}</div>
                      </div>
                    </div>
                  );
                })}
                {messages.filter(m => m.group_id === monitorGroup.id && m.channel === monitorChannel).length === 0 && (
                  <div style={{ color: T.stone, fontSize: 13, fontStyle: 'italic', textAlign: 'center', padding: 20 }}>No messages in this channel</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLANS TAB */}
      {profTab === 'plans' && (
        <div>
          {plans.map(plan => {
            const group = groups.find(g => g.id === plan.group_id);
            return (
              <div key={plan.id} style={css.card}>
                <h3 style={css.h3}>{group?.name}</h3>
                <CostPoolBar allocation={plan.cost_allocation} />
                <div style={{ marginTop: 12 }}>
                  <div style={css.label}>Monitoring mechanisms</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(plan.monitoring_mechanisms || []).map(m => {
                      const mech = MONITORING_MECHANISMS.find(x => x.id === m);
                      return mech ? <span key={m} style={{ ...css.tag(T.leaf, T.mist) }}>{mech.icon} {mech.label}</span> : null;
                    })}
                    {!(plan.monitoring_mechanisms?.length) && <span style={{ color: T.stone, fontSize: 12 }}>None selected</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DEBRIEF TAB */}
      {profTab === 'debrief' && (
        <div>
          <div style={{ ...css.card, background: T.mist, border: `1px solid ${T.sage}`, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: T.forest, marginBottom: 4 }}>Facilitator note</div>
            <div style={{ fontSize: 13 }}>After each group presents their plan, ask the class to vote on which plan is most credible — and why. Use the tension between NGOs and Farmers as your entry point into the structural unfairness of supply chains. Reveal scorecards simultaneously for maximum impact.</div>
          </div>
          {DEBRIEF_QUESTIONS.map((cat, ci) => (
            <div key={ci} style={css.card}>
              <h3 style={{ ...css.h3, color: T.forest }}>{cat.category}</h3>
              {cat.questions.map((q, qi) => (
                <div key={qi} style={{ padding: '10px 12px', background: T.mist, borderRadius: 8, marginBottom: 8, fontSize: 13, borderLeft: `3px solid ${T.sage}`, lineHeight: 1.6 }}>{q}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function AdminView({ user }) {
  const [professors, setProfessors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [newProf, setNewProf] = useState({ name: '', email: '', institution: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [p, s] = await Promise.all([
      supabase.from('users').select('*').eq('role', 'professor').order('created_at', { ascending: false }),
      supabase.from('sessions').select('*, groups(count), participants(count)').order('created_at', { ascending: false }),
    ]);
    if (p.data) setProfessors(p.data);
    if (s.data) setSessions(s.data);
  };

  const createProfessor = async () => {
    if (!newProf.email || !newProf.name || !newProf.password) return;
    setCreating(true); setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newProf.email, password: newProf.password,
      });
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Sign up failed — user not created.');
      await supabase.from('users').insert({
        id: data.user.id, role: 'professor', name: newProf.name,
        institution: newProf.institution, created_by: user.id,
      });
      setNewProf({ name: '', email: '', institution: '', password: '' });
      setError('');
      loadData();
    } catch (e) { setError(e.message); }
    setCreating(false);
  };

  const toggleProfActive = async (profId, active) => {
    await supabase.from('users').update({ active: !active }).eq('id', profId);
    loadData();
  };

  const adminTabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'professors', label: '👨‍🏫 Professors' },
    { id: 'sessions', label: '🎮 Sessions' },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <div style={{ ...css.card, background: T.forest, color: T.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>🌿 100 Points — Admin</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Palm Oil Sustainability Negotiation Game</div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, textAlign: 'right' }}>
          <div>{professors.length} professors</div>
          <div>{sessions.length} sessions total</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid #e5e7eb' }}>
        {adminTabs.map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
            padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: adminTab === t.id ? `2px solid ${T.leaf}` : '2px solid transparent',
            color: adminTab === t.id ? T.leaf : T.stone, fontWeight: adminTab === t.id ? 700 : 400,
            fontSize: 13, fontFamily: 'Georgia, serif', marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {adminTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              ['Professors', professors.length, professors.filter(p => p.active).length + ' active'],
              ['Sessions', sessions.length, sessions.filter(s => !['complete','setup'].includes(s.phase)).length + ' live'],
              ['Game version', '1.0', 'Palm oil module'],
            ].map(([label, val, sub]) => (
              <div key={label} style={{ ...css.card, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: T.forest }}>{val}</div>
                <div style={{ fontWeight: 600, color: T.ink }}>{label}</div>
                <div style={{ fontSize: 12, color: T.stone }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={css.card}>
            <h3 style={css.h3}>Recent sessions</h3>
            {sessions.slice(0, 8).map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span style={{ color: T.stone, marginLeft: 8, fontSize: 11 }}>{s.join_code}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ ...css.tag(T.leaf, T.mist), fontSize: 10 }}>{s.phase}</span>
                  <span style={{ fontSize: 11, color: T.stone }}>{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'professors' && (
        <div>
          <div style={css.card}>
            <h3 style={css.h3}>Create professor account</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label style={css.label}>Name</label><input value={newProf.name} onChange={e => setNewProf(p => ({...p, name: e.target.value}))} style={css.input} placeholder="Full name" /></div>
              <div><label style={css.label}>Email</label><input value={newProf.email} onChange={e => setNewProf(p => ({...p, email: e.target.value}))} style={css.input} type="email" placeholder="university@email.ac.uk" /></div>
              <div><label style={css.label}>Institution</label><input value={newProf.institution} onChange={e => setNewProf(p => ({...p, institution: e.target.value}))} style={css.input} placeholder="University name" /></div>
              <div><label style={css.label}>Temporary password</label><input value={newProf.password} onChange={e => setNewProf(p => ({...p, password: e.target.value}))} style={css.input} type="password" placeholder="Min 8 characters" /></div>
            </div>
            {error && <div style={{ color: T.danger, fontSize: 13, marginBottom: 8 }}>{error}</div>}
            <button onClick={createProfessor} disabled={creating} style={css.btn('primary')}>
              {creating ? 'Creating...' : 'Create account'}
            </button>
          </div>

          {professors.map(prof => (
            <div key={prof.id} style={{ ...css.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{prof.name}</div>
                <div style={{ fontSize: 12, color: T.stone }}>{prof.institution} · {new Date(prof.created_at).toLocaleDateString()}</div>
                <div style={{ fontSize: 11, color: T.stone, marginTop: 2 }}>
                  Sessions: {sessions.filter(s => s.professor_id === prof.id).length}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ ...css.tag(prof.active ? T.leaf : T.danger, prof.active ? T.mist : '#fef2f2') }}>
                  {prof.active ? 'Active' : 'Suspended'}
                </span>
                <button onClick={() => toggleProfActive(prof.id, prof.active)} style={{ ...css.btn('secondary'), fontSize: 12 }}>
                  {prof.active ? 'Suspend' : 'Restore'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {adminTab === 'sessions' && (
        <div>
          {sessions.map(s => (
            <div key={s.id} style={css.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: T.stone }}>Join code: <strong>{s.join_code}</strong> · {new Date(s.created_at).toLocaleDateString()}</div>
                  <div style={{ fontSize: 12, color: T.stone }}>Professor: {professors.find(p => p.id === s.professor_id)?.name || 'Unknown'}</div>
                </div>
                <span style={{ ...css.tag(T.leaf, T.mist) }}>{s.phase}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOIN PAGE (Students)
// ═══════════════════════════════════════════════════════════════════════════════

function JoinPage({ onJoin }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const join = async () => {
    if (!code.trim() || !name.trim()) return;
    setLoading(true); setError('');
    const { data: session, error: sessionError } = await supabase
      .from('sessions').select('*').eq('join_code', code.trim().toUpperCase()).single();
    if (sessionError || !session) { setError('Session not found. Check your join code.'); setLoading(false); return; }
    const id = generateId();
    const { data: participant, error: pError } = await supabase.from('participants').insert({
      id, session_id: session.id, name: name.trim(),
    }).select().single();
    if (pError) { setError('Could not join session. Try again.'); setLoading(false); return; }
    localStorage.setItem(`participant_${session.id}`, JSON.stringify({ id: participant.id, sessionId: session.id }));
    onJoin(participant, session);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.white, borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🌿</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: T.forest, marginBottom: 4 }}>100 Points</div>
          <div style={{ fontSize: 13, color: T.stone }}>Palm Oil Sustainability Negotiation Game</div>
        </div>
        <label style={css.label}>Session join code</label>
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && join()}
          placeholder="e.g. PALM42" maxLength={6}
          style={{ ...css.input, fontSize: 22, textAlign: 'center', letterSpacing: 4, marginBottom: 16, fontWeight: 700 }} />
        <label style={css.label}>Your name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && join()}
          placeholder="First and last name"
          style={{ ...css.input, marginBottom: 16 }} />
        {error && <div style={{ color: T.danger, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</div>}
        <button onClick={join} disabled={loading || !code || !name} style={{ ...css.btn('forest'), width: '100%', fontSize: 16, padding: '12px 0', opacity: (loading || !code || !name) ? 0.6 : 1 }}>
          {loading ? 'Joining...' : 'Join session'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/login" style={{ fontSize: 12, color: T.stone }}>Professor / Admin login →</a>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE (Professor + Admin)
// ═══════════════════════════════════════════════════════════════════════════════

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    setLoading(true); setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    if (!userData) { setError('Account not found.'); setLoading(false); return; }
    onLogin(userData);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.white, borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌿</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.forest }}>100 Points</div>
          <div style={{ fontSize: 12, color: T.stone, marginTop: 4 }}>Professor & Admin login</div>
        </div>
        <label style={css.label}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ ...css.input, marginBottom: 14 }} />
        <label style={css.label}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ ...css.input, marginBottom: 16 }} />
        {error && <div style={{ color: T.danger, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button onClick={login} disabled={loading} style={{ ...css.btn('forest'), width: '100%', padding: '11px 0', fontSize: 15 }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ fontSize: 12, color: T.stone }}>← Student join page</a>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSOR SESSION SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════

function ProfSessionSelector({ user, onSelect }) {
  const [sessions, setSessions] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadSessions(); }, []);

  const loadSessions = async () => {
    const { data } = await supabase.from('sessions').select('*').eq('professor_id', user.id).order('created_at', { ascending: false });
    if (data) setSessions(data);
  };

  const createSession = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    const code = generateJoinCode();
    const { data } = await supabase.from('sessions').insert({
      professor_id: user.id, name: newName.trim(), join_code: code,
    }).select().single();
    if (data) { setSessions(prev => [data, ...prev]); setNewName(''); }
    setLoading(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); window.location.reload(); };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <div style={{ ...css.card, background: T.forest, color: T.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>🌿 100 Points</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Welcome, {user.name} · {user.institution}</div>
        </div>
        <button onClick={signOut} style={{ ...css.btn('secondary'), fontSize: 12, background: 'transparent', color: T.white, border: '1px solid rgba(255,255,255,0.3)' }}>Sign out</button>
      </div>

      <div style={css.card}>
        <h3 style={css.h3}>Create new session</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createSession()}
            placeholder="Session name (e.g. MBA Cohort B — Autumn 2026)"
            style={{ ...css.input, flex: 1 }} />
          <button onClick={createSession} disabled={loading} style={css.btn('primary')}>
            {loading ? 'Creating...' : '+ Create'}
          </button>
        </div>
      </div>

      {sessions.map(s => (
        <div key={s.id} style={{ ...css.card, cursor: 'pointer' }} onClick={() => onSelect(s)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: T.stone, marginTop: 2 }}>
                Join code: <strong style={{ letterSpacing: 2 }}>{s.join_code}</strong> · {new Date(s.created_at).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ ...css.tag(T.leaf, T.mist) }}>{s.phase}</span>
              <span style={{ color: T.leaf, fontSize: 18 }}>→</span>
            </div>
          </div>
        </div>
      ))}

      {sessions.length === 0 && (
        <div style={{ ...css.card, textAlign: 'center', color: T.stone, fontStyle: 'italic', padding: 40 }}>
          No sessions yet. Create one above to get started.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [mode, setMode] = useState('loading'); // loading | join | login | student | professor | professor_session | admin
  const [authUser, setAuthUser] = useState(null);      // Professor/Admin user record
  const [participant, setParticipant] = useState(null); // Student participant record
  const [session, setSession] = useState(null);
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Determine mode from URL path
    const path = window.location.pathname;
    if (path === '/login') { setMode('login'); return; }

    // Check for existing auth session
    supabase.auth.getSession().then(async ({ data: { session: authSession } }) => {
      if (authSession) {
        const { data: userData } = await supabase.from('users').select('*').eq('id', authSession.user.id).single();
        if (userData) {
          setAuthUser(userData);
          setMode(userData.role === 'admin' ? 'admin' : 'professor_session');
          return;
        }
      }
      // Check for student session in localStorage
      // Look for any participant stored for a session
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('participant_')) {
          const stored = JSON.parse(localStorage.getItem(key));
          if (stored) {
            const { data: sess } = await supabase.from('sessions').select('*').eq('id', stored.sessionId).single();
            const { data: part } = await supabase.from('participants').select('*').eq('id', stored.id).single();
            if (sess && part) {
              setSession(sess);
              setParticipant(part);
              if (part.group_id) {
                const { data: grp } = await supabase.from('groups').select('*').eq('id', part.group_id).single();
                if (grp) setGroup(grp);
              }
              setMode('student');
              return;
            }
          }
        }
      }
      setMode('join');
    });

    // Subscribe to session changes if in student mode
  }, []);

  // Subscribe to session updates for students
  useEffect(() => {
    if (!session || mode !== 'student') return;
    const sub = supabase.channel(`session_update:${session.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${session.id}` },
        p => setSession(p.new))
      .subscribe();

    // Also subscribe to participant updates (role assignment etc)
    const pSub = supabase.channel(`participant_update:${participant?.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants', filter: `id=eq.${participant?.id}` },
        async p => {
          setParticipant(p.new);
          if (p.new.group_id && p.new.group_id !== group?.id) {
            const { data: grp } = await supabase.from('groups').select('*').eq('id', p.new.group_id).single();
            if (grp) setGroup(grp);
          }
        })
      .subscribe();

    return () => { sub.unsubscribe(); pSub.unsubscribe(); };
  }, [session?.id, mode]);

  if (mode === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.forest }}>
      <div style={{ color: T.white, fontSize: 32 }}>🌿</div>
    </div>
  );

  if (mode === 'join') return (
    <JoinPage onJoin={(part, sess) => { setParticipant(part); setSession(sess); setMode('student'); }} />
  );

  if (mode === 'login') return (
    <LoginPage onLogin={(userData) => {
      setAuthUser(userData);
      setMode(userData.role === 'admin' ? 'admin' : 'professor_session');
    }} />
  );

  if (mode === 'admin') return (
    <div style={css.app}><AdminView user={authUser} /></div>
  );

  if (mode === 'professor_session') return (
    <div style={css.app}>
      <ProfSessionSelector user={authUser} onSelect={(sess) => { setSession(sess); setMode('professor'); }} />
    </div>
  );

  if (mode === 'professor') return (
    <div style={css.app}>
      <ProfessorView user={authUser} session={session} setSession={setSession} />
    </div>
  );

  if (mode === 'student') {
    if (!session) return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
        <div style={{ fontSize: 16, color: T.stone }}>Waiting for session to begin...</div>
      </div>
    );
    if (!participant?.role_id) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: T.mist, gap: 16 }}>
        <div style={{ fontSize: 48 }}>🌿</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.forest }}>Welcome, {participant?.name}</div>
        <div style={{ fontSize: 14, color: T.stone }}>Your professor is setting up groups. You will be assigned a role shortly.</div>
        <div style={{ fontSize: 12, color: T.stone }}>Session: <strong>{session.name}</strong></div>
      </div>
    );
    return (
      <div style={css.app}>
        <StudentView
          participant={participant}
          group={group}
          session={session}
          groups={groups}
        />
      </div>
    );
  }

  return null;
}
