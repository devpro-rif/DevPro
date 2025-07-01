const stripe = require('../config/stripe.js');

const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd', paymentMethodType = 'card' } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency,
      payment_method_types: [paymentMethodType],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };