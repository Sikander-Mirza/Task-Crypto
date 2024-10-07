import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';

// CoinPayments API Keys (Replace with your actual keys)
const PUBLIC_KEY = '1f4b4376549fa3a00db0c1ec3dd646cd786d93f7abc646ef9cf4f41ad7d0d84f';
const PRIVATE_KEY = 'B550Fb539C5621E85E9003dc73F024b3a192CC0Deeea1DFc7bd011eeac994148';

// Function to create an HMAC signature for CoinPayments API
const createHMAC = (params) => {
  const queryString = qs.stringify(params);
  return crypto
    .createHmac('sha512', PRIVATE_KEY)
    .update(queryString)
    .digest('hex');
};

// Fetch supported coins from CoinPayments
export const getSupportedCoins = async () => {
  const params = {
    version: 1,
    cmd: 'rates',
    key: PUBLIC_KEY,
    accepted: 1,
    format: 'json',
  };

  const hmac = createHMAC(params);

  try {
    const response = await axios.post(
      'https://www.coinpayments.net/api.php',
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'HMAC': hmac,
        },
      }
    );

    if (response.data.error === 'ok') {
      return response.data.result; // Contains supported coins
    } else {
      console.error('Error fetching supported coins:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching supported coins:', error.message);
    return null;
  }
};

// Function to create a new payment
export const createNewPayment = async ({ amount, currency1, currency2, buyer_email }) => {
  const params = {
    version: 1,
    cmd: 'create_transaction',
    key: PUBLIC_KEY,
    amount,
    currency1,
    currency2,
    buyer_email,
    ipn_url: 'https://your-ipn-url.com', // Update this with your IPN URL
    format: 'json',
  };

  const hmac = createHMAC(params);

  try {
    const response = await axios.post(
      'https://www.coinpayments.net/api.php',
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'HMAC': hmac,
        },
      }
    );

    if (response.data.error === 'ok') {
      return response.data.result; // Contains payment details (like transaction ID, amount, etc.)
    } else {
      console.error('Error creating payment:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating payment:', error.message);
    return null;
  }
};
