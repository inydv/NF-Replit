import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class CompaniesService {
  constructor() {
    this.route = "/companies";
  }

  async POST_COMPANY({ reqBody }) {
    try {
      return await Request.post(this.route, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_COMPANIES() {
    try {
      return await Request.get(this.route);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_COMPANIES_USING_USER() {
    try {
      return await Request.get(`${this.route}/using-user`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async GET_COMPANY({ companySlug }) {
    try {
      return await Request.get(`${this.route}/${companySlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_COMPANY_PROFILE({ companySlug, reqBody }) {
    try {
      return await Request.put(`${this.route}/profile/${companySlug}`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_COMPANY({ companySlug, reqBody }) {
    try {
      return await Request.put(`${this.route}/${companySlug}`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DELETE_COMPANY({ companySlug }) {
    try {
      return await Request.delete(`${this.route}/${companySlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new CompaniesService();
