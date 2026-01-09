import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class AuthService {
  constructor() {
    this.route = "/auth";
  }

  async SIGNUP({ token, name }) {
    const AccountType = localStorage.getItem("AccountType");

    // Construct payload conditionally
    const payload = { role: AccountType };
    if (name) payload.name = name;

    try {
      return await Request.post(`${this.route}/signup`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LOGIN({ token, email, password }) {
    try {
      return await Request.post(
        `${this.route}/login`,
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LOGOUT() {
    try {
      return await Request.get(`${this.route}/logout`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async GET_ME() {
    try {
      return await Request.get(`${this.route}/me`);
    } catch (error) {
      // if (error?.response?.data?.MESSAGE)
      //   alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new AuthService();
