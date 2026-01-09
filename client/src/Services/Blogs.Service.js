import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class BlogsService {
  constructor() {
    this.route = "/blogs";
  }

  async POST_BLOG({ reqBody }) {
    try {
      return await Request.post(this.route, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_BLOGS() {
    try {
      return await Request.get(this.route);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async GET_BLOG({ blogSlug }) {
    try {
      return await Request.get(`${this.route}/${blogSlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_BLOG({ blogSlug, reqBody }) {
    try {
      return await Request.put(`${this.route}/${blogSlug}`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DELETE_BLOG({ blogSlug }) {
    try {
      return await Request.delete(`${this.route}/${blogSlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new BlogsService();
