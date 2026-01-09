import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class NotificationsService {
  constructor() {
    this.route = "/notifications";
  }

  async UPDATE_NOTIFICATION_READ_STATUS({ id }) {
    try {
      return await Request.patch(`${this.route}/${id}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_ALL_NOTIFICATIONS_READ_STATUS() {
    try {
      return await Request.patch(`${this.route}/all`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DELETE_NOTIFICATIONS({ id }) {
    try {
      return await Request.delete(`${this.route}/${id}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_ALL_READ_NOTIFICATIONS({ isRead }) {
    try {
      return await Request.get(`${this.route}/all?status=${isRead}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new NotificationsService();
