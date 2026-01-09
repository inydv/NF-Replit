// REACT AND REACT ROUTER DOM
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// CUSTOM IMPORTS
import { Form } from "../Shared/index";
import CreateCompanyFormConstant from "../Constants/CreateCompanyForm.Constant.json";
import RoutesConstant from "../Constants/Routes.Constant.json";
import CompanyTagConstant from "../Constants/CompanyFilter.Constant.json";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import { useUser } from "../Context/User.Context";
import CompaniesService from "../Services/Companies.Service.js";
import Validation from "../Pipes/Validation.Pipe";
import { alert } from "../Utils/AlertGlobalInterface.Util";

// CONSTANT
const INPUTS = {
  personalHealth: [],
  teamValues: [],
  careerGrowth: [],
};

function UserCreateCompany() {
  // PAGE TITLE
  document.title = "Create Company";

  // STATES
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState({ ...INPUTS });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [valid, setValid] = useState(false);

  // CONTEXT
  const { user } = useUser();

  // NAVIGATE, USE LOCATION AND USE SEARCH PARAMS
  const navigate = useNavigate();
  const { slug } = useParams();
  const { pathname } = useLocation();

  // CUSTOM FUNCTION
  const handleCreate = async () => {
    const { STATUS, MESSAGE } = Validation(
      CreateCompanyFormConstant[currentStep - 1],
      inputs,
      user
    );

    if (!STATUS) {
      alert.error(MESSAGE);
      return;
    }

    HandleEvent("Button", "Click on create company button");

    if (slug) {
      const { data } = await CompaniesService.UPDATE_COMPANY({
        companySlug: slug,
        reqBody: inputs,
      });

      if (data && data?.SUCCESS) {
        navigate(RoutesConstant.USER_COMPANY);
      }
    } else {
      const { data } = await CompaniesService.POST_COMPANY({
        reqBody: inputs,
      });

      if (data && data?.SUCCESS) {
        navigate(RoutesConstant.USER_COMPANY);
      }
    }
  };

  const handleEdit = async () => {
    HandleEvent("Button", "Click on edit company button");
  };

  const getCompany = useCallback(async () => {
    const { data } = await CompaniesService.GET_COMPANY({
      companySlug: slug,
    });

    if (data && data?.SUCCESS) {
      setInputs({
        name: data?.DATA?.name,
        location: data?.DATA?.location,
        website: data?.DATA?.website,
        image: data?.DATA?.image,
        personalHealth: data?.DATA?.personalHealth,
        teamValues: data?.DATA?.teamValues,
        careerGrowth: data?.DATA?.careerGrowth,
      });
      setValid(true);
    }
  }, [slug]);

  const handleNextBtn = () => {
    const { STATUS, MESSAGE } = Validation(
      CreateCompanyFormConstant[currentStep - 1],
      inputs,
      user
    );

    if (!STATUS) {
      alert.error(MESSAGE);
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  // USE EFFECT
  useEffect(() => {
    if (slug) getCompany();
  }, [slug]);

  useEffect(() => {
    document.body.style.paddingTop = "0px";
  }, []);

  // Hero section with pricing info
  const PricingBanner = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Find Your Next Healthcare Superstar
        </h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">
                Premium Job Listing
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  30 Days Visibility
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Featured in Newsletter
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Social Media Promotion
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm opacity-80">Job ad starting at</div>
              <div className="text-4xl font-bold mb-2">$99.99</div>
              <div className="text-sm opacity-80">per month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Progress indicator
  const ProgressBar = () => (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex justify-between">
        {CreateCompanyFormConstant.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
            ${
              currentStep > index + 1
                ? "bg-green-500"
                : currentStep === index + 1
                ? "bg-blue-600"
                : "bg-gray-200"
            }
            text-white`}
            >
              {currentStep > index + 1 ? "✓" : index + 1}
            </div>
            <div className="text-sm text-gray-600">{step.title}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return pathname.includes("create") ||
    (pathname.includes("manage") && valid) ? (
    <div className="min-h-screen bg-gray-50">
      <PricingBanner />

      <div className="container mx-auto py-12 px-4">
        <ProgressBar />

        {/* FORM */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Company Information
          </h2>

          <Form
            formConstant={CreateCompanyFormConstant[currentStep - 1]}
            selection={CompanyTagConstant}
            inputs={inputs}
            setInputs={setInputs}
            previewLogo={previewLogo}
            setPreviewLogo={setPreviewLogo}
          />

          {/* BUTTONS */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
              >
                Previous
              </button>
            )}

            <button
              type="button"
              className="border px-4 py-2 rounded-md text-md bg-brand-400 hover:bg-brand-600 text-white"
              onClick={() => {
                currentStep < CreateCompanyFormConstant?.length
                  ? handleNextBtn()
                  : handleCreate();
              }}
            >
              {currentStep < CreateCompanyFormConstant?.length
                ? "Next"
                : slug
                ? "Update"
                : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h2 className="p-5 font-semibold text-xl text-center">No Company Found</h2>
  );
}

export default UserCreateCompany;
