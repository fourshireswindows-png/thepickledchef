export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { text, voiceId } = req.body;
    const clean = text.replace(/[*_#`]/g, '').replace(/\n+/g, ' ').slice(0, 600);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY || 'sk_c5405e88e81813e3d45cca67f01a67b1911db506836a5dfc'
      },
      body: JSON.stringify({
        text: clean,
        model_id: 'eleven_turbo_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ 
        error, 
        status: response.status,
        keyPresent: !!process.env.ELEVENLABS_API_KEY,
        keyLength: process.env.ELEVENLABS_API_KEY ? process.env.ELEVENLABS_API_KEY.length : 0
      });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
