// REACT AND REACT ROUTER DOM
import { Suspense, useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// CUSTOM  IMPORTS
import {
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
} from "./Pages/index";
import {
  Header,
  Footer,
  Loader,
  EmployerHeader,
  MarketingFooter,
  MainLayout,
} from "./Layouts/index";
import RoutesConstant from "./Constants/Routes.Constant.json";
import { Request } from "./Configs/RequestMethod.Config";
import AuthService from "./Services/Auth.Service.js";

// GOOGLE ANALYTICS
import ReactGA from "react-ga4";
import UserEngagement from "./Pipes/UserEngagement.Pipe";
import { useUser } from "./Context/User.Context";
import {
  AuthRoutes,
  JobSeekerRoutes,
  MasterRoutes,
  RecruiterRoutes,
} from "./Routes/index.js";
import ProfileCompletionPrompt from "./Components/ProfileCompletionPrompt.Component.jsx";

const MEASUREMENT_ID =
  import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID || "";

export default function App() {
  // STATE
  const [loading, setLoading] = useState(false);

  // NAVIGATE AND LOCATION
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // CONTEXT
  const { setUser } = useUser();

  // CUSTOM FUNCTION
  const loadingState = (type = "REMOVE") => {
    if (type === "ADD") {
      document.body.style.overflow = "hidden";
      setLoading(true);
    } else {
      document.body.style.overflow = "auto";
      setLoading(false);
    }
  };

  // AXIOS INTERCEPTOR
  const axiosInterceptor = useCallback(() => {
    Request.interceptors.request.use(
      function (req) {
        loadingState("ADD");
        return req;
      },
      (err) => {
        loadingState();
        return Promise.reject(err);
      }
    );

    Request.interceptors.response.use(
      function (res) {
        loadingState();
        return res;
      },
      (err) => {
        loadingState();
        return Promise.reject(err);
      }
    );
  }, []);

  // USE EFFECT
  useEffect(() => {
    axiosInterceptor();
  }, [axiosInterceptor]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Initialize GA4 only once (ideally in the highest-level component)
    if (!ReactGA.isInitialized) {
      // Check if already initialized
      ReactGA.initialize(MEASUREMENT_ID);
    }

    // TRACK PAGEVIEW ON COMPONENT MOUNT
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
      title: document.title,
    });

    // USER ENGAGEMENT METRICS
  }, [navigate]);

  useEffect(() => {
    (async function () {
      const { data } = await AuthService.GET_ME();

      if (data && data?.SUCCESS) {
        setUser(data?.DATA);
      }
    })();
  }, [setUser]);

  return (
    <HelmetProvider>
      <MainLayout>
        <div className="flex flex-col min-h-screen">
          <ProfileCompletionPrompt />

          {/* HEADER */}
          {pathname === "/work-values" ? <EmployerHeader /> : <Header />}

          {/* MAIN CONTENT */}
          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* MASTER ROUTES */}
                <Route element={<MasterRoutes />}>
                  <Route
                    exact
                    path={RoutesConstant.POST_JOB}
                    element={<UserCreateJob />}
                  />
                </Route>

                {/* JOB SEEKER ROUTES */}
                <Route element={<JobSeekerRoutes />}></Route>

                {/* RECRUITER ROUTES */}
                <Route element={<RecruiterRoutes />}>
                  <Route
                    exact
                    path={RoutesConstant.USER_COMPANY}
                    element={<UserCompany />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.USER_COMPANY + "/:slug"}
                    element={<CompanyDetail />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.USER_CREATE_JOB + "/:slug"}
                    element={<UserCreateJob />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.USER_CREATE_COMPANY}
                    element={<UserCreateCompany />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.USER_CREATE_COMPANY + "/:slug"}
                    element={<UserCreateCompany />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.USER_CREATE_JOB}
                    element={<UserCreateJob />}
                  />
                </Route>

                {/* AUTH ROUTES - NO USER */}
                <Route element={<AuthRoutes isUser={false} />}>
                  <Route
                    exact
                    path={RoutesConstant.LOGINSIGNUP}
                    element={<LoginSignup />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.FORGOT_PASSWORD}
                    element={<ForgotPassword />}
                  />
                </Route>

                {/* AUTH ROUTES - USER */}
                <Route element={<AuthRoutes isUser={true} />}>
                  <Route
                    exact
                    path={RoutesConstant.ADD_BLOGS}
                    element={<AddBlogs />}
                  />
                  <Route
                    exact
                    path={RoutesConstant.JOBSEEKERPROFILEPAGE + "/:username"}
                    element={<JobSeekerProfile />}
                  />
                </Route>

                {/* PUBLIC ROUTES */}
                <Route exact path={RoutesConstant.BLOGS} element={<Blogs />} />
                <Route
                  exact
                  path={RoutesConstant.BLOGS + "/:slug"}
                  element={<SingleBlog />}
                />
                <Route exact path={RoutesConstant.ABOUT} element={<About />} />
                <Route
                  exact
                  path={RoutesConstant.SINGLE_JOB_DETAILS_PAGE + "/:slug"}
                  element={<SingleJobDetail />}
                />
                <Route exact path={RoutesConstant.HOME} element={<Job />} />
                <Route
                  exact
                  path={RoutesConstant.PRIVACY}
                  element={<Privacy />}
                />
                <Route
                  exact
                  path={RoutesConstant.TERMS_AND_CONDITION}
                  element={<TermsAndCondition />}
                />
                <Route
                  exact
                  path={RoutesConstant.WORK_VALUES}
                  element={<WorkValues />}
                />
                <Route
                  exact
                  path={RoutesConstant.POST_QUICK_JOB}
                  element={<PostQuickJob />}
                />
                <Route
                  exact
                  path={RoutesConstant.CONTACT_US}
                  element={<ContactUs />}
                />
                <Route
                  exact
                  path={RoutesConstant.UPDATE_JOB + "/:id" + "/:slug"}
                  element={<UserCreateJob />}
                />
                <Route
                  exact
                  path={RoutesConstant.NOTIFICATIONS}
                  element={<Notifications />}
                />
              </Routes>
            </Suspense>
          </main>

          {/* FOOTER */}
          {pathname === "/work-values" ? <MarketingFooter /> : <Footer />}

          {/* LOADER */}
          {loading && <Loader />}
        </div>
        <UserEngagement />
      </MainLayout>
    </HelmetProvider>
  );
}
