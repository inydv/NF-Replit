import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserAlt } from "react-icons/fa";
import RoutesConstant from "../Constants/Routes.Constant.json";
import SEO from "../Components/SEO.Component";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import AuthService from "../Services/Auth.Service";
import FirebaseService from "../Services/Firebase.Service";
import { useUser } from "../Context/User.Context";

// SEO structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Login or Signup - NursingFront",
  description:
    "Sign in or create a new account on NursingFront to access nursing job opportunities or post nursing jobs.",
};

const LoginSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  // States
  const [authStage, setAuthStage] = useState("userType");
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState(
    new URLSearchParams(location.search).get("userType") ||
      localStorage.getItem("AccountType")
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize view based on existing userType
  React.useEffect(() => {
    if (userType) {
      setAuthStage("credentials");
    }
  }, []);

  // Handle regular login/signup
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        if (!email || !password) {
          setError("Please enter both email and password");
          return;
        }

        HandleEvent("Auth", "Email Login", { userType });

        const token = await FirebaseService.LOGIN_WITH_EMAIL_AND_PASSWORD(
          email,
          password
        );
        if (token) {
          const { data } = await AuthService.LOGIN({ token, email, password });
          if (data?.SUCCESS) {
            setUser(data.DATA);
            navigate(RoutesConstant.HOME);
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        if (!name || !email || !password) {
          setError("Please fill in all required fields");
          return;
        }

        HandleEvent("Auth", "Email Signup", { userType });

        const token = await FirebaseService.REGISTER_WITH_EMAIL_AND_PASSWORD(
          email,
          password
        );
        if (token) {
          const { data } = await AuthService.SIGNUP({
            token,
            name,
          });
          if (data?.SUCCESS) {
            setIsLogin(true);
            setError("");
          }
        } else {
          setError("Failed to create account. Please try again.");
        }
      }
    } catch (error) {
      setError(
        isLogin
          ? "Login failed. Please try again."
          : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    if (provider === "google") {
      // GOOGLE_LOGIN(userType);
      HandleEvent("Auth", "Google Login", { userType });

      const token = await FirebaseService.CONTINUE_WITH_GOOGLE();
      if (token) {
        const { data } = await AuthService.SIGNUP({
          token,
        });
        if (data?.SUCCESS) {
          setUser(data.DATA);
          navigate(RoutesConstant.HOME);
        }
      } else {
        setError("Failed to create account. Please try again.");
      }
    } else if (provider === "facebook") {
      HandleEvent("Auth", "Facebook Login", { userType });

      const token = await FirebaseService.CONTINUE_WITH_FACEBOOK();
      if (token) {
        const { data } = await AuthService.SIGNUP({
          token,
        });
        if (data?.SUCCESS) {
          setUser(data.DATA);
          navigate(RoutesConstant.HOME);
        }
      } else {
        setError("Failed to create account. Please try again.");
      }
    }
  };

  // Select user type
  const handleUserTypeSelection = (type) => {
    setUserType(type);
    localStorage.setItem("AccountType", type);
    setAuthStage("credentials");
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Render error message if present
  const ErrorMessage = () =>
    error && (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        {error}
      </div>
    );

  return (
    <>
      <SEO
        title={isLogin ? "Login to NursingFront" : "Sign Up for NursingFront"}
        description={
          isLogin
            ? "Access your NursingFront account"
            : "Create a new NursingFront account"
        }
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4">
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* User Type Selection View */}
            {authStage === "userType" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Welcome to NursingFront
                </h1>

                <p className="text-gray-600 mb-8 text-center">
                  Please select your account type to continue
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => handleUserTypeSelection("RECRUITER")}
                    className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition group"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏢</div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-brand-600">
                        I'm an Employer
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Looking to hire nursing professionals
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleUserTypeSelection("JOB_SEEKER")}
                    className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition group"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">👩‍⚕️</div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-brand-600">
                        I'm a Job Seeker
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Looking for nursing opportunities
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Login/Signup Form */}
            {authStage === "credentials" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* Back button to change user type */}
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setAuthStage("userType")}
                    className="text-gray-500 hover:text-brand-600 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Change account type
                  </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  {isLogin ? "Welcome Back" : "Create Your Account"}
                </h1>

                <h2 className="text-lg text-gray-600 mb-6 text-center">
                  {userType === "employer"
                    ? "Employer Portal"
                    : "Nursing Professional Portal"}
                </h2>

                {/* Google login button */}
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="flex items-center justify-center w-full py-3 px-4 mb-6 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    className="mr-3"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Facebook login button */}
                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="flex items-center justify-center w-full py-3 px-4 mb-6 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="25"
                    height="25"
                    viewBox="0 0 48 48"
                    className="mr-3"
                  >
                    <path
                      fill="#3f51b5"
                      d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M29.368,24H26v12h-5V24h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H30v4h-2.287 C26.104,16,26,16.6,26,17.723V20h4L29.368,24z"
                    ></path>
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-600">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Email login/signup form */}
                <form onSubmit={handleCredentialSubmit}>
                  <ErrorMessage />

                  {!isLogin && (
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserAlt className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-500" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        placeholder={
                          isLogin ? "Your password" : "Create a password"
                        }
                        required
                      />
                    </div>
                  </div>

                  {isLogin && (
                    <div className="mb-6 text-right">
                      <Link
                        to={RoutesConstant.FORGOT_PASSWORD}
                        className="text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner />
                        Processing...
                      </>
                    ) : isLogin ? (
                      "Log In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Toggle between login and signup */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {isLogin ? "Sign up" : "Log in"}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginSignupPage;
