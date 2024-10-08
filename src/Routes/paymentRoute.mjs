import paymentController from "../Controllers/paymentController.mjs";

const Routes = (app) => {
  app.post("/create-payment", paymentController.createPayment);
};

export default Routes;
