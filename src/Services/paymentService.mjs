import axios from "axios";
import crypto from "crypto";

// Plisio API key
const API_KEY = 'nRt04gZqgkmWO1ywxMuTSURILovYxSV1ZNI6lu3ZbpdiIJ9eSH5ech36qmorT_UR';

// Zerocryptopay class for handling ZeroCryptoPay payments
class Zerocryptopay {
    constructor() {
        this.baseApi = 'https://zerocryptopay.com';
        this.validatedIpsWebhook = ['194.113.233.9', '176.124.192.233','54.196.228.198'];
        this.secretKey = '7BcGE87o6kD52P641CCPo1z9Q28urN8dRF2';
        this.token = 's8kl3tFbRI9ybswv482vq2N78W8qrIBz7ns';
        this.login = 'sikandersunny2017@gmail.com';
    }

    newPay(postdata) {
        return this.doIt('/pay/newtrack', this.calcSignForm(postdata));
    }

    getStatus(postdata) {
        return this.doIt('/pay/status', this.calcSignStatus(postdata));
    }

    calcSignStatus(postdata) {
        const sign = crypto.createHash('sha256').update(`${this.token}${postdata.hash_trans}${this.secretKey}${postdata.id_track}${this.login}`).digest('hex');
        delete postdata.secret_key;
        postdata.signature = sign;
        return postdata;
    }

    calcSignForm(postdata) {
        const sign = crypto.createHash('sha256').update(`${postdata.amount}${this.secretKey}${postdata.order_id}${this.login}`).digest('hex');
        delete postdata.secret_key;
        postdata.signature = sign;
        return postdata;
    }

    async doIt(path, postdata) {
        try {
            const response = await axios.post(`${this.baseApi}${path}`, new URLSearchParams(postdata), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data;
        } catch (error) {
            console.error('Error making request to Zerocryptopay:', error.response ? error.response.data : error.message);
            throw new Error('Error making request to Zerocryptopay');
        }
    }
}

// Instantiate the Zerocryptopay class
const zerocryptopay = new Zerocryptopay();

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

    secondPayment: async (amount, order_id) => {
        const postdata = {
            amount,
            order_id,
            secret_key: zerocryptopay.secretKey,
            token: zerocryptopay.token,
            login: zerocryptopay.login,
        };

        try {
            const result = await zerocryptopay.newPay(postdata);
            return result; // Return the result from the ZeroCryptoPay API
        } catch (error) {
            throw { status: 500, message: error.message || "Failed to process payment with ZeroCryptoPay." };
        }
    },
};

export default paymentService;
