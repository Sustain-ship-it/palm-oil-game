// ─── ROLES ────────────────────────────────────────────────────────────────────
export const ROLES = {
  XX: {
    id: 'XX',
    name: 'Company XX',
    subtitle: 'Chief Sustainability Officer',
    character: 'Diana Cross',
    color: '#1a56db',
    bg: '#ebf5ff',
    border: '#93c5fd',
    icon: '🏢',
    shortDesc: 'A multibillion multinational company with a highly valued brand.',
    fullDesc: `You are Diana Cross, Chief Sustainability Officer of Company XX — a global consumer goods multinational. Your brand is one of the most recognised in the world. In March this year, your company made a public commitment to achieve 100% deforestation-free palm oil sourcing within 5 years.

Your CFO has given you a cost ceiling: you cannot commit more than 40 points from the cost pool without board approval. You have come to this negotiation with authority to go to 40 — and a private understanding that you might be able to call him during the day if circumstances demand it.

You need a plan that satisfies:
• Your investors, who want ESG credibility
• The NGO coalition, who are threatening a press campaign
• Your CFO, who does not want to pay more than necessary
• Your legal team, who need the commitment to be defensible

You are buying from Mills YY at 12% below market rate. You know this is not sustainable — for them or for the plan. The question is when you acknowledge it.`,
    negotiatingPoints: [
      'Your opening cost commitment (30–40 points). Where do you start?',
      'Price correction to Mills YY: will you commit to full market rate?',
      'Which monitoring mechanism can you accept — and what is your red line?',
      'What do you need from James (NGO) to justify going higher on cost?',
      'What is your walk-away — the point at which you sign without NGO endorsement?',
    ],
    scorecard: [
      { label: 'Cost share kept below 42 points', weight: 30 },
      { label: 'NGO endorsement secured', weight: 25 },
      { label: 'Supplier lock-in (long-term contract)', weight: 20 },
      { label: 'Credible monitoring mechanism agreed', weight: 15 },
      { label: '5-year timeline achieved', weight: 10 },
    ],
    survivalThreshold: null,
    bilateralPartners: ['YY', 'AA', 'CC'],
  },
  YY: {
    id: 'YY',
    name: 'Mills YY',
    subtitle: 'Managing Director',
    character: 'Hassan Yusof',
    color: '#057a55',
    bg: '#f0fdf4',
    border: '#86efac',
    icon: '🏭',
    shortDesc: 'Third-generation mill owner. Knows every farmer by name.',
    fullDesc: `You are Hassan Yusof, Managing Director of Mills YY — a regional palm oil processing mill in Sabah, Malaysia that your grandfather founded. Company XX is one of your largest buyers, but they have been paying you 12% below market rate for four years.

Your current margin is 4% — in a good year. You are the intermediary between Company XX and 400+ smallholder farmers who depend on your mill as their only buyer.

During lunch you receive a call: a competitor mill has approached two of your largest farmer suppliers. They are offering full market rate with no sustainability requirements. You have until 5pm.

You need:
• Company XX to correct the price to full market rate immediately
• A long-term purchase contract before you invest in certification
• Support covering the certification costs for farmers (you can absorb some, not all)
• Government backing so your operating licence is secure

You cannot cover yield loss compensation from your margin. If forced to, you will lose the mill.`,
    negotiatingPoints: [
      'What price correction do you need from Company XX — and by when?',
      'How much of certification costs can you absorb (max 16 points)?',
      'What do you promise Siti (Farmers ZZ) about training and premiums?',
      'How do you handle the competitor offer — do you reveal it? When?',
      'What long-term contract terms do you need before you invest?',
    ],
    scorecard: [
      { label: 'Price corrected to full market rate', weight: 30 },
      { label: 'Long-term contract secured', weight: 25 },
      { label: 'Cost share below 20 points', weight: 20 },
      { label: 'Farmers covered by training programme', weight: 15 },
      { label: 'Audit burden manageable', weight: 10 },
    ],
    survivalThreshold: null,
    bilateralPartners: ['XX', 'ZZ', 'CC'],
  },
  ZZ: {
    id: 'ZZ',
    name: 'Farmers ZZ',
    subtitle: 'Cooperative Representative',
    character: 'Siti Rahman',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fcd34d',
    icon: '🌴',
    shortDesc: '4,200 smallholder farming families. Cannot afford to lose.',
    fullDesc: `You are Siti Rahman, representative of the Sabah Smallholder Cooperative — 4,200 farming families who have grown palm oil for generations. You travelled two days to be here. You speak Malay, Dusun, and English. You choose which one to use carefully.

Your cooperative's numbers: average farm 3.7 hectares. Average annual income from palm oil: 11,000 ringgit. Average household expenditure: 14,000 ringgit. You are already spending more than you earn.

You have a survival threshold: if your cooperative's cost share exceeds 15 points, the plan is economically unworkable for your members. You will say so. You will leave.

The central question you asked at 9am — and will ask again and again until someone answers it — is: who pays for the yield loss in Year Two? Sustainable farming practices reduce yields by 10–20% during the transition. Your families cannot absorb that. Someone else must.

Names you carry: Amirah Binti Kassim, 51. Zulkifli Bin Hamid, 63. Nor Hayati Binti Abdul Rahman, 29. You may read these names aloud when the room needs to hear them.`,
    negotiatingPoints: [
      'What yield loss compensation do you need — and who must pay it?',
      'What training support and in what language?',
      'What premium per tonne makes the switch economically viable?',
      'What is your survival threshold — when do you stand up and leave?',
      'What does a grace period on compliance look like for your farmers?',
    ],
    scorecard: [
      { label: 'Yield loss fully compensated', weight: 35 },
      { label: 'Cost share at or below 0 points', weight: 30 },
      { label: 'Price premium guaranteed quarterly', weight: 20 },
      { label: 'Land tenure and survival threshold protected', weight: 15 },
    ],
    survivalThreshold: 15,
    bilateralPartners: ['YY', 'GG'],
  },
  AA: {
    id: 'AA',
    name: 'NGOs & Coalition AA',
    subtitle: 'Campaign Director',
    character: 'James Okafor',
    color: '#9f1239',
    bg: '#fff1f2',
    border: '#fda4af',
    icon: '📣',
    shortDesc: 'Press conference at 6pm. Whether or not this plan is signed.',
    fullDesc: `You are James Okafor, Campaign Director of an international environmental coalition. You have a press conference booked for 6pm tonight. You will hold it regardless of what happens in this room — unless you have something better to announce.

Your phone, face-up on the table, shows a countdown all day. You don't mention it. You don't need to.

You have 37,000 people on a mailing list. Company XX's competitors have already made more progress. You have documented evidence of deforestation in their supply chain and you will publish it.

What you want:
• NDPE-plus standard (stronger than RSPO alone)
• Binding penalties — not voluntary commitments
• Independent monitoring — not mill-hub alone (conflict of interest)
• Public reporting with real data

What you might trade:
• Joint press announcement (worth 50m in brand value to Company XX)
• 18-month monitoring silence during implementation
• Conditional endorsement that becomes unconditional at Year Three

Your fear: accepting a good press release instead of a good plan, and not noticing the difference.`,
    negotiatingPoints: [
      'What standard will you accept — RSPO, NDPE, or NDPE-plus?',
      'What monitoring mechanism will you publicly endorse?',
      'What do you trade for the joint announcement?',
      'What are your material breach conditions?',
      'At what point does the press conference become the better outcome?',
    ],
    scorecard: [
      { label: 'NDPE-plus standard agreed (not just RSPO)', weight: 30 },
      { label: 'Independent monitoring chosen', weight: 25 },
      { label: 'Binding penalties agreed', weight: 25 },
      { label: 'Public reporting committed', weight: 20 },
    ],
    survivalThreshold: null,
    bilateralPartners: ['XX', 'CC'],
  },
  GG: {
    id: 'GG',
    name: 'Government GG',
    subtitle: 'Minister of Plantation Industries',
    character: "Dato' Ibrahim Razak",
    color: '#5b21b6',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    icon: '🏛️',
    shortDesc: 'Palm oil is a national industry. Farmers are voters.',
    fullDesc: `You are Dato' Ibrahim Razak, Minister of Plantation Industries. Palm oil is one of your country's most important exports and a major source of rural employment. 600,000 smallholder farming families depend on this industry. They are also voters.

You have attended this meeting as an observer — or so your office told the press. In practice, you cannot afford for this plan to fail, and you know it.

What you have told the room: the government cannot make direct financial contributions to a commercial supply chain arrangement. Your farmers bear none of the cost. That is a condition.

What you have not told the room: you have a rural development fund with uncommitted budget. You have a political distinction between large plantation holders and independent smallholders — a distinction that might allow a targeted smallholder subsidy without you being seen to subsidise multinationals.

You also hunted in a forest near your family estate as a boy. It no longer exists. You have not resolved how you feel about that.`,
    negotiatingPoints: [
      'What regulatory tools will you offer (export licensing, tax breaks)?',
      'Is there budget in the rural development fund — and on what conditions?',
      'How do you protect your political position while offering something real?',
      'What is the difference, in your mind, between large plantation holders and independent smallholders?',
      'What do you need from Company XX and the NGOs in return for your contribution?',
    ],
    scorecard: [
      { label: 'Farmer livelihoods protected', weight: 35 },
      { label: 'Sovereignty over land policy maintained', weight: 25 },
      { label: 'No direct cash commitments required', weight: 20 },
      { label: 'Export volumes maintained', weight: 20 },
    ],
    survivalThreshold: null,
    bilateralPartners: ['ZZ', 'AA'],
  },
  CC: {
    id: 'CC',
    name: 'Certification Body CC',
    subtitle: 'Head of Standards',
    character: 'Dr. Elena Vasquez',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#7dd3fc',
    icon: '✅',
    shortDesc: 'She helped write the original RSPO principles in 2004.',
    fullDesc: `You are Dr. Elena Vasquez, Head of Standards at an international certification body. You helped write the original RSPO Principles and Criteria in 2004. You have watched them be diluted, argued over, and gamed for twenty years. You still believe in standards. Barely.

You carry a colour-coded binder. You write in the margins of every document. You are the most technically knowledgeable person in the room, and the one with the least formal power. Your certification body depends on buyer demand to be relevant.

What you bring:
• A group certification scheme that could cut per-farmer costs by 30%
• Technical assistance (training materials, field support) at cost
• The credibility that NGO endorsement requires

What you need:
• Company XX to make certification a contractual condition of purchase (creates guaranteed demand)
• Government support to make certification a licensing condition long-term
• NGO buy-in so your standard is seen as credible

Your clause: You have been thinking all day about one sentence. A clause that could be inserted into the plan document — quiet, technical, easy to miss — that would require a mandatory independent audit if any Year Three milestone is missed by more than 15%. You will write it in the margin of your copy during the document drafting phase.`,
    negotiatingPoints: [
      'Which standard will you certify to — and what is the minimum you will accept?',
      'How much of the fee structure can you reduce for group smallholder schemes?',
      'What does certification as a contractual condition mean for your scale model?',
      'How do you protect auditor independence from mill and company pressure?',
      'What is your clause — and when do you insert it?',
    ],
    scorecard: [
      { label: 'Standard not diluted below NDPE', weight: 35 },
      { label: 'NGO endorsement of standard secured', weight: 25 },
      { label: 'Audit independence protected', weight: 25 },
      { label: 'Smallholder access pathway agreed', weight: 15 },
    ],
    survivalThreshold: null,
    bilateralPartners: ['XX', 'YY', 'AA'],
  },
};

// ─── GAME PHASES ──────────────────────────────────────────────────────────────
export const PHASES = [
  { id: 'setup',       label: 'Setup',           icon: '⚙️',  profOnly: true,  desc: 'Professor configures groups and assigns roles.' },
  { id: 'briefing',    label: 'Briefing',         icon: '📋',  profOnly: false, desc: 'Students read their role cards and background.' },
  { id: 'preparation', label: 'Preparation',      icon: '🧠',  profOnly: false, desc: 'Students privately complete their prep worksheet.' },
  { id: 'round1',      label: 'Round 1 — Opening', icon: '🎙️', profOnly: false, desc: 'Each stakeholder posts their opening position. No replies yet.' },
  { id: 'round2',      label: 'Round 2 — Bilateral', icon: '🤝', profOnly: false, desc: 'Private bilateral negotiations in permitted dyad channels.' },
  { id: 'round3',      label: 'Round 3 — Coalition', icon: '🔗', profOnly: false, desc: 'All parties in the group chat. Test whether bilateral deals stack.' },
  { id: 'round4',      label: 'Round 4 — Final Plan', icon: '📝', profOnly: false, desc: 'Agree the 5-year plan. Allocate cost pool. Choose monitoring. Vote.' },
  { id: 'debrief',     label: 'Debrief',          icon: '💡',  profOnly: false, desc: 'Scorecards revealed. Professor facilitates reflection.' },
];

// ─── PERMITTED BILATERAL DYADS ────────────────────────────────────────────────
// Based on real-world supply chain relationships only
export const BILATERAL_DYADS = [
  { id: 'XX_YY', roles: ['XX', 'YY'], label: 'Company XX ↔ Mills YY',        topic: 'Price premium, contracts, traceability, certification costs' },
  { id: 'XX_AA', roles: ['XX', 'AA'], label: 'Company XX ↔ NGOs AA',         topic: 'Commitments, monitoring, joint announcement, press conference' },
  { id: 'XX_CC', roles: ['XX', 'CC'], label: 'Company XX ↔ Certification CC', topic: 'Which standard, contractual condition, co-funding' },
  { id: 'YY_ZZ', roles: ['YY', 'ZZ'], label: 'Mills YY ↔ Farmers ZZ',        topic: 'Farm-gate premium, yield loss, training, group certification' },
  { id: 'YY_CC', roles: ['YY', 'CC'], label: 'Mills YY ↔ Certification CC',  topic: 'Group scheme, audit schedule, non-compliance handling' },
  { id: 'ZZ_GG', roles: ['ZZ', 'GG'], label: 'Farmers ZZ ↔ Government GG',   topic: 'Land tenure, subsidies, yield loss support, mandates' },
  { id: 'AA_CC', roles: ['AA', 'CC'], label: 'NGOs AA ↔ Certification CC',   topic: 'Standard stringency, NGO endorsement, audit independence' },
  { id: 'AA_GG', roles: ['AA', 'GG'], label: 'NGOs AA ↔ Government GG',      topic: 'Regulation vs voluntary, sovereignty, national sustainability' },
  { id: 'GG_YY', roles: ['GG', 'YY'], label: 'Government GG ↔ Mills YY',     topic: 'Export licences, mill-level compliance, tax treatment' },
];

// ─── COST POOL ITEMS ──────────────────────────────────────────────────────────
export const COST_POOL_ITEMS = [
  { id: 'certification',   label: 'Certification fees',          points: 18, desc: 'Audit costs, RSPO scheme membership, record-keeping for mills and group smallholder schemes.' },
  { id: 'training',        label: 'Farmer training & extension', points: 15, desc: 'Teaching sustainable land management, agricultural transition support, record-keeping for audits.' },
  { id: 'yield_loss',      label: 'Yield loss compensation',     points: 22, desc: 'Farmers lose 10–20% yield during transition years. The largest single item. The hardest to fund.' },
  { id: 'traceability',    label: 'Traceability infrastructure', points: 12, desc: 'GPS farm mapping, supply chain software, mill-level data systems for Company XX verification.' },
  { id: 'monitoring',      label: 'Independent monitoring',      points: 13, desc: 'Third-party audits, satellite monitoring, annual published reporting.' },
  { id: 'premium',         label: 'Price premium to farmers',    points: 20, desc: 'Per-tonne premium above market rate to make certified production economically viable long-term.' },
];

// ─── MONITORING MECHANISMS ────────────────────────────────────────────────────
export const MONITORING_MECHANISMS = [
  {
    id: 'satellite',
    label: 'Satellite monitoring',
    cost: 4,
    icon: '🛰️',
    desc: 'Annual imagery cross-referenced against farm boundaries. Catches land clearing. Cannot verify farming practices.',
    pros: 'Low cost per farm, high coverage',
    cons: "Catches land use only — not chemical use, labour practices, or record-keeping",
    ngo_accept: true,
  },
  {
    id: 'mill_hub',
    label: 'Mill as monitoring hub',
    cost: 6,
    icon: '🏭',
    desc: 'Mills verify farmer compliance as a condition of purchase. Non-compliant farmers refused or penalised.',
    pros: 'Highest coverage — all farmer output passes through mills',
    cons: 'Inherent conflict of interest — mills want to buy volume',
    ngo_accept: false,
  },
  {
    id: 'group_cert',
    label: 'Farmer group self-certification',
    cost: 3,
    icon: '👥',
    desc: 'Cooperatives certify collectively. Peer enforcement within communities.',
    pros: 'Low cost, community-led, works where social trust is high',
    cons: 'Self-reporting — NGOs may not trust without independent spot-checks',
    ngo_accept: false,
  },
  {
    id: 'field_audit',
    label: 'Third-party field audit',
    cost: 8,
    icon: '✅',
    desc: 'Independent auditors conduct physical farm visits on a randomised sample. Gold standard for credibility.',
    pros: 'Most credible to NGOs and investors',
    cons: 'Most expensive. Cannot cover every farm every year.',
    ngo_accept: true,
  },
];

// ─── CURVEBALL EVENTS ─────────────────────────────────────────────────────────
export const CURVEBALL_EVENTS = [
  {
    id: 'eu_regulation',
    title: 'EU Deforestation Regulation — timeline accelerated',
    affects: ['XX', 'YY', 'ZZ', 'GG'],
    suggestedPhase: 'round2',
    severity: 'high',
    description: `BREAKING: The European Parliament has voted to accelerate implementation of the EU Deforestation Regulation. New timeline: full enforcement in 9 months, not 14. Palm oil, soy, cattle, cocoa and coffee sectors immediately affected. Products unable to demonstrate deforestation-free sourcing face import ban from January.`,
    instruction: 'Every stakeholder must reconsider their timeline. 9 months changes the calculus. Does the urgency help or hurt your position?',
  },
  {
    id: 'competitor_offer',
    title: 'Competitor mill offers farmers full market rate — no sustainability strings',
    affects: ['YY', 'ZZ', 'XX'],
    suggestedPhase: 'round2',
    severity: 'high',
    description: `Hassan Yusof's operations manager calls during the session: a competitor mill has approached two of his largest farmer suppliers. They are offering full market rate with no sustainability requirements. No certification. No conditions. Hassan has until 5pm.`,
    instruction: "Mills YY: decide whether and when to reveal this. It changes your leverage. Farmers ZZ: you may hear about this. Does it change what you're willing to accept?",
  },
  {
    id: 'greenpeace_images',
    title: 'Greenpeace releases satellite images of new clearing',
    affects: ['XX', 'AA'],
    suggestedPhase: 'round2',
    severity: 'high',
    description: `Greenpeace has published satellite imagery showing new land clearing within 50km of Company XX's known supply base. The images are trending on social media. Company XX's share price is down 2.3% in morning trading. A journalist has emailed the company's press office.`,
    instruction: 'Company XX: your CFO just texted. NGOs AA: your mailing list is activated. Does this strengthen your hand or create pressure to settle quickly?',
  },
  {
    id: 'drought',
    title: 'Drought cuts smallholder yields 30% this season',
    affects: ['ZZ', 'YY', 'GG'],
    suggestedPhase: 'round3',
    severity: 'medium',
    description: `Regional meteorological data confirms a drought has cut smallholder palm oil yields by approximately 30% this season across Sabah. Farmers are already under financial stress before any transition costs. The government has declared a state of agricultural emergency in two districts.`,
    instruction: "Farmers ZZ: your survival threshold is now even lower. Restate your position. Government GG: this is your political crisis too. Does it unlock more rural development funding — or freeze it?",
  },
  {
    id: 'audit_fraud',
    title: 'Audit fraud discovered in a rival certification scheme',
    affects: ['CC', 'AA', 'XX'],
    suggestedPhase: 'round3',
    severity: 'medium',
    description: `An investigative report reveals systematic fraud in a competing palm oil certification body — auditors were accepting payments to pass non-compliant farms. The scheme certified 2.3 million hectares across three countries. NGOs are calling for all voluntary certification to be suspended pending a review.`,
    instruction: 'Certification CC: your credibility is under question by association. How do you distinguish your scheme? NGOs AA: does this push you toward demanding third-party field audit only?',
  },
  {
    id: 'government_election',
    title: 'Election threat: new populist leader threatens to exit RSPO',
    affects: ['GG', 'XX', 'CC'],
    suggestedPhase: 'round3',
    severity: 'high',
    description: `An opposition leader has announced that if elected, they will withdraw the country from the Roundtable on Sustainable Palm Oil (RSPO) and all voluntary international sustainability frameworks. Current polling shows the race is close. The Minister's political position has just become significantly more constrained.`,
    instruction: "Government GG: your political survival may now require you to appear to be defending farmer interests against foreign NGOs. How does this change what you can offer in this room?",
  },
];

// ─── DEBRIEF QUESTIONS ────────────────────────────────────────────────────────
export const DEBRIEF_QUESTIONS = [
  {
    category: 'Power & Dynamics',
    questions: [
      'Who had the most power in the negotiation? Did that change over time?',
      'Which stakeholder faced the greatest tension between short-term interests and long-term sustainability goals?',
      'Were there any alliances that surprised you? Why did they emerge?',
      'Siti Rahman has the least formal power in the room. How did structural indispensability work as leverage?',
    ],
  },
  {
    category: 'The Cost Pool',
    questions: [
      'Look at the final cost allocation. Whose interests did the plan actually serve — and is that fair?',
      'The yield loss (22 points) is the largest single item with the least obvious payer. How was it resolved in your group?',
      'What happens to the plan if Company XX faces an earnings miss in Year Two and wants to renegotiate?',
      'Where does the budget tell the truth that the language does not?',
    ],
  },
  {
    category: 'Monitoring & Credibility',
    questions: [
      'The more you need to monitor, the less the monitoring works. Did your group escape this paradox?',
      'Which monitoring mechanism did you agree, and who pushed hardest for it?',
      'What makes a sustainability commitment credible — words, numbers, or enforcement mechanisms?',
      "Elena's clause: the thing that actually works is often a technical detail nobody noticed. Does your plan have one?",
    ],
  },
  {
    category: 'Theory Connections',
    questions: [
      "Ostrom's 8 design principles for governing the commons — how many did your plan satisfy?",
      'This is both a distributive negotiation (cost pool) and an integrative one (monitoring choice). When did you switch modes?',
      'The mill-hub monitoring has an inherent conflict of interest. What is the principal-agent problem here?',
      'The RSPO has existed since 2004. Why is deforestation still happening at 4.2 million hectares per year?',
    ],
  },
  {
    category: 'Real World',
    questions: [
      'Unilever committed to 100% certified palm oil years ago. What challenges did they face?',
      'How does this exercise relate to other supply chain sustainability challenges — cobalt, cotton, seafood?',
      'If you were advising a real multinational today, what is the one structural change you would make?',
      'Which stakeholder in this game was hardest to represent honestly? What does that tell you?',
    ],
  },
];

// ─── PREP WORKSHEET QUESTIONS ─────────────────────────────────────────────────
export const PREP_QUESTIONS = [
  { id: 'position',    label: 'Your opening position',           placeholder: 'In one paragraph: what is your public stance entering the room?' },
  { id: 'offer',       label: 'What you are willing to offer',   placeholder: 'Be specific. What can you commit to in points, resources, or actions?' },
  { id: 'need',        label: 'What you need from others',       placeholder: 'What must other stakeholders agree to before you can sign?' },
  { id: 'redline',     label: 'Your red line',                   placeholder: 'What is the one thing you will not accept under any circumstances?' },
  { id: 'batna',       label: 'Your BATNA',                      placeholder: 'Best Alternative to a Negotiated Agreement — what happens if you walk away?' },
  { id: 'priority',    label: 'Your two most important dyads',   placeholder: 'Which two bilateral relationships matter most to you, and what do you need from each?' },
];

export const FIVE_YEAR_MILESTONES = [
  { year: 1, label: 'Year 1', hint: 'Baseline audit, scheme launch, training begins, contract amended' },
  { year: 2, label: 'Year 2', hint: '30% certified, compensation payments begin (quarterly), spot audits start' },
  { year: 3, label: 'Year 3', hint: 'Independent mid-term review published, conditional endorsement reviewed' },
  { year: 4, label: 'Year 4', hint: '75% certified, non-certified suppliers exited or given final year' },
  { year: 5, label: 'Year 5', hint: '100% deforestation-free, annual audited public reporting' },
];
