import paymentService from "../Services/paymentService.mjs";

const paymentController = {
  createPayment: async (req, res) => {
    const { amount, currency, order_id, order_name } = req.body;

    // Validate required parameters
    if (!amount || !currency || !order_id || !order_name) {
      return res.status(400).json({ message: "Amount, currency, order_id, and order_name are required." });
    }

    try {
      const result = await paymentService.createPayment(amount, currency, order_id, order_name);
      res.status(200).json({
        message: "Payment created successfully",
        result,
      });
    } catch (error) {
      console.error("Error details:", error.message);
      res.status(error.status || 500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  createsecond : async(req,res)=>{
    const { amount, order_id } = req.body;



    try {
        const result = await paymentService.secondPayment(amount,order_id);
        res.json(result);
    } catch (error) {
        console.error('Payment creation failed:', error);
        res.status(500).json({ error: 'Payment creation failed' });
    }
  }
};

export default paymentController;
