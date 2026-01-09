import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class UsersService {
  constructor() {
    this.route = "/user";
  }

  async CREATE_MANAGED_USER({ reqBody }) {
    try {
      return await Request.post(`${this.route}/managed-user`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_MANAGED_USERS() {
    try {
      return await Request.get(`${this.route}/managed-user`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_PROFILE({ reqBody }) {
    try {
      return await Request.patch(`${this.route}/profile`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_MANAGED_USER_ROLES({ userId, reqBody }) {
    try {
      return await Request.patch(
        `${this.route}/managed-user/${userId}`,
        reqBody
      );
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DELETE_MANAGED_USER({ userId }) {
    try {
      return await Request.delete(`${this.route}/managed-user/${userId}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async SEARCH_USERS(search) {
    try {
      return await Request.get(`${this.route}/list/recruiter`, {
        params: { search },
      });
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new UsersService();
