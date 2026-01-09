import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class SubscribedUsersService {
  constructor() {
    this.route = "/subscribed-users";
  }

  async POST_SUBSCRIBED_USERS({ reqBody }) {
    try {
      return await Request.post(this.route, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async POST_CONVERT_KIT({ reqBody }) {
    try {
      return await Request.post(`${this.route}/convert-kit`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new SubscribedUsersService();
