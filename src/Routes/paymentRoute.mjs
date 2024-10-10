import paymentController from "../Controllers/paymentController.mjs";

const Routes = (app) => {
  app.post("/create-payment", paymentController.createPayment);
  app.post("/create-second",paymentController.createsecond)
};

export default Routes;
