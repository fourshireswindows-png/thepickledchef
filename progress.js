export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const SUPABASE_URL = 'https://ctlwnlxifaibyezrvlau.supabase.co';
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  try {
    const { action, data, userId } = req.body;

    if (action === 'save_progress') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/course_progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: err });
      }

      // Count modules
      const countRes = await fetch(
        `${SUPABASE_URL}/rest/v1/course_progress?user_id=eq.${userId}&select=id`,
        { headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` } }
      );
      const rows = await countRes.json();
      const count = Array.isArray(rows) ? rows.length : 0;

      // Update profile module count
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ completed_modules: count })
      });

      return res.status(200).json({ success: true, moduleCount: count });
    }

    if (action === 'save_certificate') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: err });
      }

      return res.status(200).json({ success: true });
    }

    res.status(400).json({ error: 'Unknown action' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
