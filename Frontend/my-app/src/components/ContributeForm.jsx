import React, { useState } from 'react';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const ContributeForm = ({ projectId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5001/api/projects/${projectId}/contribute`, {
        amount,
        token: paymentMethod.id,
      });
      setMessage(`Contribution successful! Thank you for supporting this project.`);
      console.log(res.data);
    } catch (err) {
      setMessage('Payment failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Contribute to this Project</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
        required
      />
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Contribute
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ContributeForm;