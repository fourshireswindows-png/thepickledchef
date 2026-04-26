export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { userId, email } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: userId }
      },
      line_items: [{
        price: 'price_1TQPxVR4QZLGyKAd0IcTzkCN',
        quantity: 1,
      }],
      success_url: 'https://www.pickledchef.com/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.pickledchef.com/chat.html',
      metadata: { userId: userId }
    });

    res.status(200).json({ url: session.url });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
