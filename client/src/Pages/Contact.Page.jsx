import React, { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import ContactsService from "../Services/Contacts.Service";
import { alert } from "../Utils/AlertGlobalInterface.Util";
import SEO from "../Components/SEO.Component";
import { generatePageTitle, generateCanonicalUrl, generateKeywords } from "../Utils/SEOHelpers.Util";
import RoutesConstant from "../Constants/Routes.Constant.json";

export default function ContactPage() {
  // SEO Configuration
  const pageData = {
    title: generatePageTitle("Contact Us - Get in Touch"),
    description: "Contact NursingFront for support, partnerships, or questions about nursing jobs and career opportunities. We're here to help connect nurses with their ideal workplace.",
    keywords: generateKeywords(
      ["contact", "support", "nursing jobs", "customer service"],
      ["get in touch", "nursing support", "healthcare jobs help", "nursing career assistance"]
    ),
    url: generateCanonicalUrl("/contact"),
    imageUrl: "https://nursingfront.com/src/Assets/Logo.svg"
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact NursingFront",
    description: pageData.description,
    url: pageData.url,
    mainEntity: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "English",
        email: "support@nursingfront.com"
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await ContactsService.POST_CONTACT({ reqBody: formData });

    if (data && data?.SUCCESS) {
      setFormData({ name: "", email: "", message: "" }); // Reset form
      alert.success(data?.MESSAGE);
    }
  };

  return (
    <>
      <SEO
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        structuredData={structuredData}
        url={pageData.url}
        pageType="website"
        imageUrl={pageData.imageUrl}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex flex-col justify-center items-center px-6 py-10">
        {/* Container */}
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Contact NursingFront
          </h1>
          <p className="text-gray-600 text-center text-lg mb-8">
            Have questions or feedback?
            <br />
            <span>
              Fill out the form below, and we'll get back to you as soon as
              possible.
            </span>
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Message Input */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                rows={4}
                className="mt-1 block w-full h-48 px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200"
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center text-sm text-gray-500">
            <p>
              We aim to respond to all inquiries within 24-48 hours. Thank you for
              reaching out!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}