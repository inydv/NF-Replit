import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class PaymentsService {
  constructor() {
    this.route = "/payment";
  }

  async CREATE_STRIPE_CHECKOUT_SESSION({ reqBody }) {
    try {
      return await Request.post(
        `${this.route}/stripe/create-checkout-session`,
        reqBody
      );
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new PaymentsService();
