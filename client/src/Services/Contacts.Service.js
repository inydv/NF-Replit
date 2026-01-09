import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class ContactsService {
  constructor() {
    this.route = "/contacts";
  }

  async POST_CONTACT({ reqBody }) {
    try {
      return await Request.post(this.route, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new ContactsService();
