// REACT
import { useEffect, useState } from "react";

// CUSTOM IMPORTS
import { Form, SideDrawer } from "../Shared/index";
import JobFormConstant from "../Constants/JobForm.Constant.json";
import JobFilterConstant from "../Constants/JobFilter.Constant.json";
import JobDetail from "../Components/JobDetail.Component";
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import JobsService from "../Services/Jobs.Service";
import PaymentService from "../Services/Payment.Service";
import { useUser } from "../Context/User.Context";
import Validation from "../Pipes/Validation.Pipe";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import { useNavigate, useParams } from "react-router-dom";
import routesConstant from "../Constants/Routes.Constant.json";

// CONSTANT
const INPUTS = {
  isUrgent: false,
  isFeatured: false,
};

function UserCreateJob() {
  // PAGE TITLE
  document.title = "Post Job";

  const { slug } = useParams();

  // STATES
  const [company, setCompany] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState({ ...INPUTS });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);

  // CONTEXT
  const { user } = useUser();

  const navigate = useNavigate();

  // CUSTOM FUNCTION
  const handlePreview = () => {
    const { STATUS, MESSAGE } = Validation(
      JobFormConstant[currentStep - 1],
      inputs,
      user
    );

    if (!STATUS) {
      alert.error(MESSAGE);
      return;
    }

    HandleEvent("Button", "Click on form Preview Button");
    setIsDrawerOpen(true);
  };

  const handlePay = async () => {
    HandleEvent("Button", "Click on form Pay Button");

    if (slug) {
      const { data } = await JobsService.UPDATE_JOB({
        jobSlug: slug,
        reqBody: inputs,
      });

      if (data && data?.SUCCESS) {
        navigate(routesConstant.HOME);
      }
    } else {
      const { data } = await JobsService.POST_JOB({ reqBody: inputs });

      if (data && data?.SUCCESS) {
        if (user.role === "MASTER") {
          const { data: statusDate } = await JobsService.UPDATE_JOB_STATUS({
            slug: data?.DATA?.slug,
          });

          if (statusDate && statusDate?.SUCCESS) navigate(routesConstant.HOME);
        } else {
          const { data: paymentData } =
            await PaymentService.CREATE_STRIPE_CHECKOUT_SESSION({
              reqBody: {
                id: data?.DATA?.id,
                name: data?.DATA?.title,
                img: data?.DATA?.companyImage?.url,
                slug: data?.DATA?.slug,
                email: data?.DATA?.email,
                type: data?.DATA?.isUrgent
                  ? "URGENT"
                  : data?.DATA?.isFeatured
                  ? "FEATURED"
                  : "REGULAR",
                model: "JOB",
                website: data?.DATA?.website,
              },
            });

          if (paymentData && paymentData?.SUCCESS) {
            window.open(paymentData?.DATA?.url, "_self");
          } else {
            alert.error("Something went wrong!");
          }
        }
      }
    }
  };

  const changeCompany = (company_id) => {
    const companyDetail = company?.find((company) => company.id === company_id);

    if (companyDetail) {
      setInputs((prevState) => {
        return {
          ...prevState,
          companyName: companyDetail?.name,
          companyLocation: companyDetail?.location,
          companyImage: companyDetail?.image,
        };
      });

      setPreviewLogo(companyDetail?.image?.url);
    }
  };

  const handleNextBtn = () => {
    const { STATUS, MESSAGE } = Validation(
      JobFormConstant[currentStep - 1],
      inputs,
      user
    );

    if (!STATUS) {
      alert.error(MESSAGE);
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  useEffect(() => {
    setInputs((prev) => ({ ...prev, email: user?.email }));
  }, [user]);

  useEffect(() => {
    if (slug) {
      (async function () {
        const { data } = await JobsService.GET_JOB({ jobSlug: slug });

        if (data?.SUCCESS && data?.DATA) {
          const res = data.DATA;
          setInputs({
            ...inputs,
            ...(res.companyId != null && { companyId: res.companyId }),
            companyLocation: res.companyLocation,
            companyName: res.companyName,
            companyImage: res.companyImage,
            email: res.email,
            employementType: res.employementType,
            experience: res.experience,
            jobType: res.jobType,
            maxSalary: res.maxSalary,
            location: res.location,
            minSalary: res.minSalary,
            overview: res.overview,
            salaryType: res.salaryType,
            schedule: res.schedule,
            shift: res.shift,
            title: res.title,
            website: res.website,
            isFeatured: res.isFeatured,
            isUrgent: res.isUrgent,
          });
        } else {
          alert.error("Job Not Found");
          navigate(routesConstant.HOME);
        }
      })();
    }
  }, [slug]);

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
        {JobFormConstant.map((step, index) => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PricingBanner />
      <div className="container mx-auto py-12 px-4">
        <ProgressBar />
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* FORM */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {currentStep === 1
              ? "Personal Details"
              : currentStep === 2
              ? "Company Information"
              : "Job Details"}
          </h2>

          <Form
            formConstant={JobFormConstant[currentStep - 1]}
            selection={{ ...JobFilterConstant, COMPANY: company }}
            inputs={inputs}
            setInputs={setInputs}
            previewLogo={previewLogo}
            setPreviewLogo={setPreviewLogo}
            changeCompany={changeCompany}
          />

          {/* BUTTONS */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            ) : (
              ""
            )}
            <button
              type="button"
              className="border px-4 py-2 rounded-md text-md bg-brand-400 hover:bg-brand-600 text-white"
              onClick={() => {
                currentStep < JobFormConstant?.length
                  ? handleNextBtn()
                  : handlePreview();
              }}
            >
              {currentStep < JobFormConstant?.length
                ? "Continue"
                : "Preview Job Post"}
            </button>
          </div>
        </div>
      </div>

      {/* SIDE DRAWER TO PREVIEW JOB DETAIL */}
      <SideDrawer
        btnText={"Post"}
        content={
          <JobDetail
            data={{
              ...inputs,
              company_logo: {
                url: previewLogo,
              },
            }}
            showBtn={false}
          />
        }
        handleBtn={handlePay}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </div>
  );
}

export default UserCreateJob;
