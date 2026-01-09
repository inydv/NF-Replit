import { useState } from "react";
import QuickJobsService from "../Services/QuickJobs.Service";
import PaymentService from "../Services/Payment.Service";
import { Loader } from "../Layouts";

export default function PostQuickJob() {
  document.title = "Post a Job | NursingFront";
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState("regular");

  const pricingTiers = {
    regular: {
      name: "Regular Post",
      price: "$99.99",
      benefits: [
        "Visible for 30 days",
        "50k+ monthly pageviews",
        "10k+ unique visitors",
        "Shared across social media",
      ],
    },
    featured: {
      name: "Featured Post",
      price: "$149.99",
      benefits: [
        "Everything in Regular Post",
        "Featured placement",
        "Priority visibility",
      ],
    },
    urgent: {
      name: "Urgently Hiring",
      price: "$299.99",
      benefits: [
        "Everything in Featured Post",
        "Urgent hiring badge",
        "Top of search results",
        "Premium promotion",
      ],
    },
  };

  const loadingState = (type = "REMOVE") => {
    document.body.style.overflow = type === "ADD" ? "hidden" : "auto";
    setLoading(type === "ADD");
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    try {
      loadingState("ADD");

      const { data } = await QuickJobsService.POST_QUICK_JOBS({
        reqBody: {
          ...formObj,
          isUrgent: JSON.parse(formObj.isUrgent),
          isFeatured: JSON.parse(formObj.isFeatured),
        },
      });

      if (data?.SUCCESS) {
        const { data: paymentData } =
          await PaymentService.CREATE_STRIPE_CHECKOUT_SESSION({
            reqBody: {
              id: data?.DATA?.id,
              name: data?.DATA?.name,
              email: data?.DATA?.email,
              img: "https://scontent.fdel10-1.fna.fbcdn.net/v/t39.30808-6/441853948_122142617960130584_477824141440131360_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3ZlJjdt_qywQ7kNvwHjvWRo&_nc_oc=AdnfYOnq2i6wur4a_JTMjbSO7CyazQp2e34HayGCav9yeJqnH40i_y1_9V5gkOt_haA&_nc_zt=23&_nc_ht=scontent.fdel10-1.fna&_nc_gid=e10FJJOXNOlqE2KxtlvmBA&oh=00_AfJ2pdyHeYw7JOu9G1A25URxDMbPMXJc60t0PJB2Bhx0bg&oe=681F9B0E",
              slug: "Quick Job",
              type: data?.DATA?.isUrgent
                ? "URGENT"
                : data?.DATA?.isFeatured
                ? "FEATURED"
                : "REGULAR",
              model: "QUICK_JOB",
              website: data?.DATA?.website,
            },
          });

        if (paymentData && paymentData?.SUCCESS) {
          window.open(paymentData?.DATA?.url, "_self");
        } else {
          alert.error("Something went wrong!");
        }
      }
    } catch (error) {
      console.error("Error submitting job:", error);
    } finally {
      loadingState();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FBFD] py-8 px-4">
      <form
        className="bg-white shadow-lg rounded-lg px-8 py-10 w-full max-w-md border border-gray-100"
        onSubmit={handlePay}
      >
        <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-4">
          Post a Job
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Add your details below, and your job post will be live within 24 hours
        </p>

        {/* Pricing Options */}
        <div className="mb-8 space-y-4">
          {Object.entries(pricingTiers).map(([key, tier]) => (
            <div
              key={key}
              className={`relative rounded-lg border p-4 transition-all duration-200 ${
                selectedTier === key
                  ? "border-[#28A745] bg-[#28A745]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedTier(key)}
            >
              <input
                type="radio"
                value={key}
                id={key}
                checked={selectedTier === key}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="absolute right-4 top-4 h-4 w-4 cursor-pointer accent-[#28A745]"
              />
              <label htmlFor={key} className="block cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-medium">{tier.name}</span>
                  <span className="font-bold text-[#28A745] mr-8">
                    {tier.price}
                  </span>
                </div>
                <ul className="space-y-1">
                  {tier.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="text-[#28A745] text-xs">●</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </label>
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-[#2C89E8] focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-[#2C89E8] focus:outline-none"
          />
          <input
            type="url"
            name="website"
            required
            placeholder="Link to job post"
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:border-[#2C89E8] focus:outline-none"
          />
          <input
            type="hidden"
            name="isFeatured"
            value={selectedTier === "featured" || selectedTier === "urgent"}
          />
          <input
            type="hidden"
            name="isUrgent"
            value={selectedTier === "urgent"}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-[#28A745] to-[#2C89E8] shadow-md hover:opacity-90 transition-opacity duration-200"
        >
          Submit {pricingTiers[selectedTier].price}
        </button>
      </form>
      {loading && <Loader />}
    </div>
  );
}
