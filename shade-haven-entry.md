# Shade Haven — Sample Gated Entry SQL

Paste into Supabase SQL Editor.

```sql
INSERT INTO public.entries (
  title,
  slug,
  type,
  classification,
  status,
  file_no,
  summary,
  gated_content,
  is_gated,
  is_published,
  created_at,
  updated_at,
  created_by
) VALUES (
  'Key "Shade" Haven',
  'key-shade-haven',
  'personnel',
  'ultra',
  'active',
  'DOA-P-0012',
  'Middle operative of the Haven unit. Designation: SHADE. Field role — balance, observation, tactical arbitration between high-volatility brothers SUN and SCORCH. Augmented combat classification: Dare-capable. Known abilities include Veil Step and Echo Strike. Psychological profile: introspective, high nuance threshold. Last confirmed deployment: Cereus Limnic perimeter, Type B anomaly zone. Current status: separated from unit. Whereabouts: unconfirmed.',
  'CLASSIFIED OPERATIONAL FILE — MEMBER ACCESS ONLY

PSYCHOLOGICAL ASSESSMENT
Subject exhibits chronic self-critical cognition consistent with middle-child displacement syndrome. Negative thought patterns mirror informational decay — misinformation spreads faster than correction. Field psychologists note difficulty distinguishing internal narrative from external manipulation. Cipher confirmed this as an exploitable vector during the Mt. Takatsuki engagement. Post-encounter debrief flagged: subject questioned whether he was puppeted during the fight and could not confirm with certainty.

DARE REGISTRY — CONFIRMED ACTIVE
Individual:
  VEIL STEP — "A step into silence, a promise of reprisal." Displacement maneuver, near-undetectable.
  ECHO STRIKE — "The enemy''s own strength turns against them." Kinetic redirection.
  LENS OF DUSK — "Every flaw becomes visible in twilight''s gaze." Perception enhancement, threat illumination.
  WIRE SNAP — Dare used to sever Cipher''s puppet connection. Single confirmed use, Node 1 summit.

Dual (with SUN):
  ECLIPSE BURST — "Sun blinds the world; Shade strikes unseen."
  DAWN''S EDGE — "First light and final shadow, one blade together."

Dual (with SCORCH):
  SMOKE VEIL — "Darkness cloaks, fire erupts — the battlefield becomes chaos."
  HELL''S MIRAGE — "A phantom of shadow and flame, confusion and ruin follow."

Triple (with SUN + SCORCH):
  DAYBREAK TRINITY — "Sun ignites, Shade directs, Scorch consumes. A brotherhood of light, shadow, and fire breaks upon the enemy like dawn itself." Confirmed use: Beach engagement, Battle Sequence 1111. Massive AOE. Enemy stunned. Allied morale surge.

FIELD INCIDENT LOG
— Beach engagement: Subject executed Ghost Step, intervened to prevent SCORCH fatality. Triple Dare confirmed successful.
— Post-battle: Subject and SCORCH noted unnatural silence from jungle perimeter. Anomaly unresolved.
— Disappearance event: Subject woke to find both brothers gone. Footprints led in opposing directions. Subject refused to accept KIA determination. Began solo search.
— Cenotaph sector: Subject engaged a PLA puppet-soldier using Veil Step. Puppet subsequently vocalized using Subject''s own voice. Subject identified indigenous resistance activity and elected to follow thermal operative CIPHER toward Node 1 rather than continue search for SCORCH.
— Node 1 summit (Mt. Takatsuki): Subject defeated CIPHER. Psychological warfare employed — CIPHER referenced Subject''s middle-child complex and suggested one brother had "understood" the puppetry logic. USSFDOA drone harvested CIPHER''s neural matter post-engagement without Subject''s authorization. Subject operational but disoriented.
— Post-Node 1: Subject made contact with sniper asset TIMEERA KOI. Received node shutdown codes for remaining six nodes. KOI confirmed one brother is searching for Subject; the other is searching for "something else." Subject identified KOI''s honeypot methodology but remained susceptible. Emergency descent triggered by emergence of Guardian-class entity from node base.

LIMIT ASSESSMENT
Designation: The Limit of Control and Unity.
Subject cannot hold the unit together by force. His arc requires patience and acceptance — the recognition that unity cannot be coerced. Communication style (direct, action-oriented) reflects a need for clarity; the limit is learning to live with ambiguity. Node ties: N4 (Identity), N6 (Ethics).

CORRESPONDENCE — BROTHERS ERASED (LETTER, AUTHOR: KEY HAVEN)
Subject authored a letter to SCORCH post-separation. Tone: unconditional loyalty, solemn vow. Acknowledges erasure of family history and identity as active psychological wound. Confirms he is fighting to reunite and complete the mission. Letter intercepted by DOA archival systems during Node 2 transit. Classification escalated to ULTRA on receipt.',
  true,
  true,
  now(),
  now(),
  (SELECT id FROM public.profiles WHERE is_admin = true LIMIT 1)
);
```
