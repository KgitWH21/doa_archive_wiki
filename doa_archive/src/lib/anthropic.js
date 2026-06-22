// Stub: swap for real Anthropic API call via axios when backend is ready
export async function sendBookerMessage(messages, isMember) {
  await new Promise((r) => setTimeout(r, 900))

  const last = messages[messages.length - 1]?.content?.toLowerCase() ?? ''

  if (last.includes('shade') || last.includes('haven')) {
    return {
      text: isMember
        ? "SHADE (K. Haven) — Field Operative, OKI Station. Clearance: Type B Ultra. Elder brother. Currently tracking the Zamami Node anomaly. Classified contact log available in the personnel file."
        : "SHADE (K. Haven) — Middle brother and primary field operative assigned to OKI Station. Public record only. Upgrade to member access for classified contact logs.",
      results: [{ slug: 'shade-k-haven', title: 'Shade (K. Haven)', entry_type: 'personnel' }],
    }
  }

  if (last.includes('bonta') || last.includes('higa')) {
    return {
      text: isMember
        ? "HIGA BONTA — Civilian asset, age 15, Uruma City. Infiltrated Zamami aboard military ferry. Sustained thermal burn from Champion-class operative. Sister Meio detained at Zamami Node. Full incident report and contact log with K-97 accessible."
        : "HIGA BONTA — Civilian drawn into the Cereus Event. Age 15, Uruma City origin. Upgrade to member access for classified contact logs and incident reports.",
      results: [{ slug: 'higa-bonta', title: 'Higa Bonta', entry_type: 'personnel' }],
    }
  }

  if (last.includes('cereus') || last.includes('event')) {
    return {
      text: "CEREUS EVENT — Designation for the anomalous atmospheric phenomenon first observed at Awose Port. Classified as a Type B Limnic event by the Department of Otherworldly Affairs. Multiple civilian and operative contacts confirmed.",
      results: [
        { slug: 'cereus-event', title: 'The Cereus Event', entry_type: 'event' },
        { slug: 'zamami-node', title: 'Zamami Node', entry_type: 'location' },
      ],
    }
  }

  return {
    text: `QUERY RECEIVED. I have searched the archive for "${messages[messages.length - 1]?.content}". ${isMember ? 'No specific records found for that query. Try searching by operative name, location designation, or event codename.' : 'Public records are limited. Member access unlocks the full classified archive.'}`,
    results: [],
  }
}
