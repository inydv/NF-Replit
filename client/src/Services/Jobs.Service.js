import { Request } from "../Configs/RequestMethod.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class JobsService {
  constructor() {
    this.route = "/jobs";
  }

  async POST_JOB({ reqBody }) {
    try {
      return await Request.post(this.route, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async SAVE_JOB({ jobSlug }) {
    try {
      return await Request.post(`${this.route}/save-job/${jobSlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_JOBS({ filters }) {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        Array.isArray(value)
          ? value.forEach((v) => params.append(key, v))
          : params.append(key, value);
      });

      return await Request.get(`${this.route}?${params}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_JOBS_USING_USER() {
    try {
      return await Request.get(`${this.route}/using-user`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_SAVED_JOBS() {
    try {
      return await Request.get(`${this.route}/saved-jobs`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async LIST_CRAWLED_JOBS({ filters }) {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        Array.isArray(value)
          ? value.forEach((v) => params.append(key, v))
          : params.append(key, value);
      });

      return await Request.get(`${this.route}/crawled?${params}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async GET_JOB({ jobSlug }) {
    try {
      return await Request.get(`${this.route}/${jobSlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_JOB({ jobSlug, reqBody }) {
    try {
      return await Request.put(`${this.route}/${jobSlug}`, reqBody);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async UPDATE_JOB_STATUS({ slug }) {
    try {
      return await Request.patch(`${this.route}/${slug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DEACTIVATE_JOB({ slug }) {
    try {
      return await Request.patch(`${this.route}/deactivate/${slug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DELETE_SAVED_JOB({ jobSlug }) {
    try {
      return await Request.delete(`${this.route}/save-job/${jobSlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }

  async DELETE_Job({ jobSlug }) {
    try {
      return await Request.delete(`${this.route}/${jobSlug}`);
    } catch (error) {
      if (error?.response?.data?.MESSAGE)
        alert.error(error.response.data.MESSAGE);
    }
  }
}

export default new JobsService();
