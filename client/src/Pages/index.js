// REACT
import { lazy } from "react";

// IMPORTS
const About = lazy(() => import("./About.Page.jsx"));
const CompanyDetail = lazy(() => import("./CompanyDetail.Page.jsx"));
const Privacy = lazy(() => import("./Privacy.Page.jsx"));
const Blogs = lazy(() => import("./Blogs.Page.jsx"));
const TermsAndCondition = lazy(() => import("./TermsAndCondition.Page.jsx"));
const WorkValues = lazy(() => import("./WorkValues.Page.jsx"));
const SingleBlog = lazy(() => import("./SingleBlog.Page.jsx"));
const AddBlogs = lazy(() => import("./AddBlogs.Page.jsx"));
const SingleJobDetail = lazy(() => import("./SingleJobDetail.Page.jsx"));
const PostQuickJob = lazy(() => import("./PostQuickJob.Page.jsx"));
const ContactUs = lazy(() => import("./Contact.Page.jsx"));
const UserCreateJob = lazy(() => import("./UserCreateJob.Page.jsx"));
const UserCreateCompany = lazy(() => import("./UserCreateCompany.Page.jsx"));
const UserCompany = lazy(() => import("./UserCompany.Page.jsx"));
const LoginSignup = lazy(() => import("./LoginSignup.Page.jsx"));
const JobSeekerProfile = lazy(() => import("./JobSeekerProfile.Page.jsx"));
const ForgotPassword = lazy(() => import("./ForgotPassword.Page.jsx"));
const Job = lazy(() => import("./Job.Page.jsx"));
const Notifications = lazy(() => import("./Notifications.Page.jsx"));

// EXPORTS
export {
  About,
  CompanyDetail,
  Privacy,
  Blogs,
  TermsAndCondition,
  WorkValues,
  SingleBlog,
  AddBlogs,
  PostQuickJob,
  SingleJobDetail,
  ContactUs,
  UserCreateJob,
  UserCreateCompany,
  UserCompany,
  LoginSignup,
  JobSeekerProfile,
  ForgotPassword,
  Job,
  Notifications,
};
