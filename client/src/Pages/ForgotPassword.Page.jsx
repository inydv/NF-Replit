import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import RoutesConstant from "../Constants/Routes.Constant.json";
import FirebaseService from "../Services/Firebase.Service";

const ForgotPassword = () => {
  // States
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle regular login/signup
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email) {
        setError("Please enter email");
        return;
      }

      await FirebaseService.SEND_PASSWORD_RESET_EMAIL(email);
      setEmail("");
      setError("Forgot Password email sent. Please check your inbox.");
    } catch (error) {
      setError("Forgot Password failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4">
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-10">
                Forgot Password
              </h1>

              {/* Email login/signup form */}
              <form onSubmit={handleCredentialSubmit}>
                <ErrorMessage />

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

                <div className="mb-6 text-right">
                  <Link
                    to={RoutesConstant.LOGINSIGNUP}
                    className="text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Back To Login?
                  </Link>
                </div>

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
                  ) : (
                    "Forgot Password"
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ForgotPassword;
