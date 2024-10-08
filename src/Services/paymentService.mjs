import axios from "axios";

const API_KEY = 'nRt04gZqgkmWO1ywxMuTSURILovYxSV1ZNI6lu3ZbpdiIJ9eSH5ech36qmorT_UR'; // Plisio API key

const paymentService = {
  createPayment: async (amount, currency, order_id, order_name) => {
    // Prepare the API request to Plisio
    const options = {
      method: 'GET',
      url: `https://plisio.net/api/v1/invoices/new`,
      params: {
        api_key: API_KEY,
        amount,
        currency,
        order_number: order_id,
        order_name, // Add the order_name parameter here
      },
      timeout: 5000, // Set a timeout of 5 seconds
    };

    try {
      const response = await axios(options);

      // Check if the response is successful
      if (response.data && response.data.status === "success") {
        return response.data.data; // Return the payment data
      } else {
        throw { status: 400, message: response.data.message }; // Throw an error for the controller to catch
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with a status other than 200 range
        throw { status: error.response.status, message: error.response.data.message || error.message };
      } else if (error.request) {
        // Request was made but no response was received
        throw { status: 500, message: "No response received from server." };
      } else {
        // Something happened in setting up the request
        throw { status: 500, message: error.message };
      }
    }
  },
};

export default paymentService;
