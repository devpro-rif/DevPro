import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import styles from './CheckoutForm.module.css';  

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontSize: '16px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#a0aec0' },
    },
    invalid: { color: '#e53e3e', iconColor: '#e53e3e' },
  },
  hidePostalCode: false,
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [status,  setStatus]            = useState({ success: false, error: null });
  const [form,    setForm]              = useState({ name: '', email: '' });


  useEffect(() => {

    axios
      .post('http://localhost:4000/api/paiment/create-payment-intent', {
        amount: 500,  
      })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(()  => setStatus({ success: false, error: 'Failed to initialize payment.' }));
      console.log('serct:',clientSecret)
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setStatus({ success: false, error: null });

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name:  form.name,
            email: form.email,
          },
        },
      }
    );

    if (error) {
      setStatus({ success: false, error: error.message });
    } else if (paymentIntent.status === 'succeeded') {
      setStatus({ success: true, error: null });
      cardElement.clear();
      setForm({ name: '', email: '' });
    }

    setLoading(false);
  };


  return (
    <div className={styles.wrapper}>
      <h1>  Complete your payment</h1>
      <h2 className={styles.heading}>Checkout</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
      
        <label className={styles.label}>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

   
        <label className={styles.label}>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

      
        <label className={styles.label}>
          Card details
          <div className={styles.cardBox}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </label>

        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className={styles.submit}
        >
          {loading ? 'Processing…' : 'Pay $50'}
        </button>
        
      </form>


      {status.error   && <div className={styles.error}>{status.error}</div>}
      {status.success && <div className={styles.success}>
        Payment succeeded! 🎉 Thank you.
      </div>}
    </div>
  );
};

export default CheckoutForm;
