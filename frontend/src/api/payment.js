import API from "./axios";

export const createCheckoutSession = async (data) => {
  const response = await API.post("/payment/create-checkout-session", data);
  return response.data;
};

export const confirmCheckoutSession = async (sessionId) => {
  const response = await API.post("/payment/confirm-session", { sessionId });
  return response.data;
};

export const createPaymentIntent = async (data) => {
  const response = await API.post("/payment/create-payment-intent", data);
  return response.data;
};

export const confirmPaymentIntent = async (paymentIntentId) => {
  const response = await API.post("/payment/confirm-payment-intent", { paymentIntentId });
  return response.data;
};
