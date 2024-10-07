import { createNewPayment } from '../Services/paymentService.mjs';
import { getSupportedCoins } from '../Services/paymentService.mjs';

export const createPayment = async (req, res) => {
  const { amount, currency1, currency2, buyer_email } = req.body;

  try {
    // Fetch supported coins
    const supportedCoins = await getSupportedCoins();

    // Check if the requested coin is supported
    if (!supportedCoins || !supportedCoins[currency2]) {
      return res.status(400).json({
        message: "Error creating payment",
        error: `The currency '${currency2}' is not supported by the receiver.`,
      });
    }

    // Call service to create the payment
    const paymentResult = await createNewPayment({ amount, currency1, currency2, buyer_email });

    // If payment creation is successful
    if (paymentResult) {
      return res.status(200).json({
        message: "Payment created successfully",
        result: paymentResult,
      });
    } else {
      return res.status(400).json({
        message: "Error creating payment",
        error: "Payment creation failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
