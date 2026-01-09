import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class QuickJobsService {
  constructor() {
    this.route = "/quick-jobs";
  }

  async POST_QUICK_JOBS({ reqBody }) {
    try {
      return await Request.post(this.route, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new QuickJobsService();
