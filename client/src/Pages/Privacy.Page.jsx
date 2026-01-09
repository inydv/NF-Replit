// REACT AND REACT ROUTER DOM
//import { Children } from "react";

// CUSTOM IMPORT
//import PrivatePolicyConstant from "../Constants/PrivatePolicy.Constant.json";
//import PublicPolicyConstant from "../Constants/PublicPolicy.Constant.json";
//import Images from "../Assets/index";

// IMAGE LAZY LOADING
import { LazyLoadImage } from "react-lazy-load-image-component";
import SEO from "../Components/SEO.Component";
import { generatePageTitle, generateCanonicalUrl, generateKeywords } from "../Utils/SEOHelpers.Util";

export default function Policy() {
  // SEO Configuration
  const pageData = {
    title: generatePageTitle("Privacy Policy"),
    description: "Read NursingFront's privacy policy to understand how we collect, use, and protect your personal information when using our nursing job platform.",
    keywords: generateKeywords(
      ["privacy policy", "data protection", "personal information"],
      ["nursing jobs privacy", "healthcare data security", "user privacy rights"]
    ),
    url: generateCanonicalUrl("/privacy"),
    imageUrl: "https://nursingfront.com/src/Assets/Logo.svg"
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description: pageData.description,
    url: pageData.url,
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com"
    }
  };
  document.title = "Privacy";
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
      {/* <div className="relative max-h-[500px] w-full">
        <div className="bg-overlay"></div>
        <LazyLoadImage
          src={Images["banner2"]}
          alt="About page banner image"
          className="max-h-[500px] h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full">
          <div className="rounded-md bg-gray-600 opacity-75 text-white p-5 sm:p-10  w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-base sm:text-xl lg:text-3xl text-center font-bold mb-2 sm:mb-4">
              Private Policy
            </h2>
            <p className="font-normal text-base sm:text-xl lg:text-3xl text-center">
              Last Updated: April 10, 2024.
            </p>
          </div>
        </div>
      </div> */}

      {/* {Children.toArray(
          PrivatePolicyConstant?.map(({ NAME, CONTENT }) => (
            <div className="mb-8">
              <div className="font-bold text-lg sm:text-xl mb-2">{NAME}</div>
              <p className="text-gray-700 text-sm sm:text-base leading-7">
                {CONTENT}
              </p>
            </div>
          ))
        )} */}

      <div className="bg-white sm:px-10 sm:py-4 mx-auto lg:max-w-7xl my-4 px-2 flex justify-center items-center">
        <div className="w-full md:w-2/3 lg:w-2/3 p-10 bg-[#F1F0FA]">
          <h1 className="text-base sm:text-xl lg:text-3xl font-bold mt-4">
            Private Policy
          </h1>
          <p className="font-normal italic text-base sm:text-md lg:text-l mt-4">
            Last Updated: April 10, 2024
          </p>
          <p className="mt-4 ">
            Please take a moment to review this policy as it contains important
            information regarding your personal data.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Welcome</h2>
          <p className="leading-7 mt-4">
            NursingFront, (hereinafter also referred to as &quot;Company/ we/
            our/ us&quot;) operates{" "}
            <a
              href="https://www.nursingfront.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              www.nursingfront.com
            </a>{" "}
            (&quot;Website&quot;) and provides service through their website
            (&quot;Services&quot;). Our Privacy Policy (&quot;Policy&quot;) in
            compliance with the Health Insurance Portability and Accountability
            Act (HIPAA), the California Consumer Privacy Act (CCPA)/ California
            Privacy Rights Act (CPRA) and other state data protection laws,
            governs your visit to our Website and explains how we collect,
            safeguard and disclose information that results from your use of our
            Service.
            <br />
            <br />
            We take your privacy very seriously. In this Policy, we seek to
            explain to you in the clearest way possible what information we
            collect, how we use it and what rights you have in relation to it.
            We hope you take some time to read through it carefully, as it is
            important. If there are any terms in this Policy that you do not
            agree with, please discontinue the use of our Services immediately.
            <br />
            <br />
            We use your data to provide and improve Service. By using the
            Service, you agree to the collection and use of information in
            accordance with this policy. Unless otherwise defined in this
            Policy, the terms used in this Policy have the same meanings as in
            our Terms and Conditions. Our Terms and Conditions govern all use of
            our Service and together with the Policy constitute your agreement
            with us.
            <br />
            <br />
            If this Policy is modified in any way, it will be updated here.
            Regularly checking and reviewing this page ensures that you are
            updated on the information which may be collected, used, and if it
            may be shared with other parties. If we believe that the
            modifications are material, we will notify you of the changes by
            posting a notice on the Website, or emailing you at the email
            address provided to us by you, and as we may deem appropriate. What
            constitutes a material change will be determined by us, at our sole
            and absolute discretion. In this Policy you, your or
            &quot;users&quot; refers to the users of the Website.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            What Information do we Collect?{" "}
          </h2>
          <h3 className="font-bold text-lg sm:text-xl mt-4">
            The personal information you disclose to us
          </h3>
          <p className="leading-7 mt-4">
            We may collect personal information that you voluntarily provide to
            us, express an interest in obtaining information about us or our
            Services or otherwise when you contact us. The personal information
            that we may collect depends on the context of your interactions with
            us and the Website, the choices you make and the services and
            features you use. The personal information we collect may include
            the following:
            <br />
            <br />
            <strong>Personal Information Provided by You.</strong> We collect
            email addresses and other information (through a survey form)
            provided voluntarily by you. The personal information that you
            provide to us must be true, complete and accurate, and you must
            notify us of any changes to such personal information.
            <br />
            <br />
            <strong>Social Media Login Data.</strong> We may provide you with
            the option to register with us using your existing social media
            account details, like your Facebook, Google, LinkedIn or other
            social media accounts. If you choose to register in this way, we
            will collect the information described in the section called
            &quot;HOW DO WE HANDLE YOUR SOCIAL LOGINS&quot; below.
          </p>
          <h3 className="font-bold text-lg sm:text-xl mt-4">
            Information automatically collected
          </h3>
          <p className="leading-7 mt-4">
            When you access our websites, we, our service providers and our
            partners may automatically collect information about you, your
            computer or mobile device, and your activity on our websites.
            Typically, this information includes your computer or mobile device
            operating system type and version number, manufacturer and model,
            device identifier (such as the Google Advertising ID or Apple ID for
            Advertising), browser type, screen resolution, IP address, the
            website you visited before browsing to our website, general location
            information such as city, state or geographic area; and information
            about your use of and actions on or in our websites, such as pages
            or screens you accessed, how long you spent on a page or screen,
            navigation paths between pages or screens, information about your
            activity on a page or screen, access times, and length of access.
            Our service providers and business partners may collect this type of
            information over time and across third-party websites. This
            information is collected via various mechanisms, such as via web
            beacons, embedded scripts, and similar technologies. This type of
            information may also be collected when you read our HTML-enabled
            emails.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            How do we Handle Your Social Logins
          </h2>
          <p className="leading-7 mt-4">
            Our Website offers you the ability to register and log in using your
            third-party social media account details (like your Google logins).
            Where you choose to do this, we will receive certain profile
            information about you from your social media provider. We will use
            the information we receive only for the purposes that are described
            in this privacy notice or that are otherwise made clear to you on
            the relevant Website. Please note that we do not control, and are
            not responsible for, other uses of your personal information by your
            third-party social media provider. We recommend that you review
            their privacy notice to understand how they collect, use and share
            your personal information, and how you can set your privacy
            preferences on their sites and apps.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Use of Cookies, Web Beacons and Other Trackers
          </h2>
          <p className="leading-7 mt-4">
            We use temporary and permanent cookies, tags, scripts, and other
            similar technologies to identify users of our services, enhance user
            experience and identify visitors, track website navigation, gather
            demographic information about visitors and users, understand email
            campaign effectiveness and target visitor and user engagement by
            tracking your activities on our websites. We use third-party
            tracking services like Google Analytics to understand the behavior
            of our website visitors and serve them better. Further, the pages on
            the website may also include web beacons or pixels, which are
            electronic files to count users who have visited that page, to track
            activity over time and across different websites, to determine
            users&apos; interactions with emails we send, to identify certain
            cookies on the computer or other electronic device accessing that
            page, or to collect other related information, and this information
            may be associated with your unique browser, device identifier, or
            Internet Protocol address. You can set your browser to refuse all
            cookies or to indicate when a cookie is being sent to your computer.
            However, this may prevent our site or services from working
            properly. You can also set your browser to delete cookies every time
            you finish browsing. For more information please refer to our{" "}
            <em>Cookies Policy</em>.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            How Do We Use Your Information?
          </h2>
          <p className="leading-7 mt-4">
            We use personal information collected via our Website for a variety
            of business purposes described below. We process your personal
            information for these purposes in reliance on our legitimate
            business interests, in order to enter into or perform a contract
            with you, with your consent, and/or for compliance with our legal
            obligations. We indicate the specific processing grounds we rely on
            next to each purpose listed below.
            <ul className="list-disc list-outside ml-8 mt-4 space-y-2">
              <li>
                <strong>To Provide Services:</strong> We may use your
                information to provide you our Services.
              </li>
              <li>
                <strong>To send administrative information to you:</strong> We
                may use your personal information to send you service and new
                feature information and/or information about changes to our
                terms, conditions, and policies.
              </li>
              <li>
                <strong>To protect our Services:</strong> We may use your
                information as part of our efforts to keep our Website safe and
                secure (for example, for fraud monitoring and prevention).
              </li>
              <li>
                <strong>
                  To enforce our terms, conditions, and policies for business
                  purposes:
                </strong>{" "}
                To comply with legal and regulatory requirements or in
                connection with our contract.
              </li>
              <li>
                <strong>To respond to legal requests and prevent harm:</strong>{" "}
                If we receive a subpoena or other legal request, we may need to
                inspect the data we hold to determine how to respond.
              </li>
              <li>
                <strong>
                  To respond to user inquiries/offer support to users:
                </strong>{" "}
                We may use your information to respond to your inquiries and
                solve any potential issues you might have with the use of our
                Services.
              </li>
              <li>
                <strong>
                  To send you marketing and promotional communications:
                </strong>{" "}
                We and/or our third-party marketing partners may use the
                personal information you send to us for our marketing purposes
                if this is in accordance with your marketing preferences.
              </li>
            </ul>
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Will your Information be Shared with Anyone?
          </h2>
          <p className="leading-7 mt-4">
            We may process or share the data that we hold based on the following
            legal basis:
            <ul className="list-disc list-outside ml-8 mt-4 space-y-2">
              <li>
                <strong>Consent:</strong> We may process your data if you have
                given us specific consent to use your personal information for a
                specific purpose.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> We may process your data
                when it is reasonably necessary to achieve our legitimate
                business interests.
              </li>
              <li>
                <strong>Performance of a Contract:</strong> Where we have
                entered into a contract with you, we may process your personal
                information to fulfil the terms of our contract.
              </li>
              <li>
                <strong>Legal Obligations:</strong> We may disclose your
                information where we are legally required to do so in order to
                comply with applicable law, governmental requests, a judicial
                proceeding, court order, or legal processes, such as in response
                to a court order or a subpoena (including in response to public
                authorities to meet national security or law enforcement
                requirements).
              </li>
              <li>
                <strong>Vital Interests: </strong>We may disclose your
                information where we believe it is necessary to investigate,
                prevent, or take action regarding potential violations of our
                policies, suspected fraud, situations involving potential
                threats to the safety of any person and illegal activities, or
                as evidence in litigation in which we are involved.
              </li>
            </ul>
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            What is Our Stance on Third-Party Websites?
          </h2>
          <p className="leading-7 mt-4">
            The Website may contain third parties links and which may link to
            other websites. We cannot guarantee the safety and privacy of the
            data you provide to any third parties. Any data collected by third
            parties is not covered by this Policy. We are not responsible for
            the content or privacy and security practices and policies of any
            third parties, including other websites, services or applications
            that may be linked to or from the Website. We strongly advise you to
            review the Privacy Policy of every site you visit. We have no
            control over and assume no responsibility for the content, privacy
            policies or practices of any third-party sites or services.
            <br />
            <br />
            WE HEREBY DISCLAIM LIABILITY FOR, ANY INFORMATION, MATERIALS,
            PRODUCTS, OR SERVICES POSTED OR OFFERED AT ANY OF THE THIRD-PARTY
            SITES LINKED TO THIS WEBSITE. BY CREATING A LINK TO A THIRD-PARTY
            WEBSITE, WE DO NOT ENDORSE OR RECOMMEND ANY PRODUCTS OR SERVICES
            OFFERED OR INFORMATION CONTAINED ON THAT WEBSITE, NOR ARE WE LIABLE
            FOR ANY FAILURE OF PRODUCTS OR SERVICES OFFERED OR ADVERTISED AT
            THOSE SITES. SUCH A THIRD PARTY MAY HAVE A PRIVACY POLICY DIFFERENT
            FROM THAT OF OURS AND THE THIRD-PARTY WEBSITE MAY PROVIDE LESS
            SECURITY THAN THIS SITE.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            How Long do We Keep Your Information?
          </h2>
          <p className="leading-7 mt-4">
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this Policy unless a longer
            retention period is required or permitted by law. No purpose in this
            Policy will require us to keep your personal information for longer
            than the period of time in which users have an account with us.
            <br />
            <br />
            When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize such
            information, or, if this is not possible then we will securely store
            your personal information and isolate it from any further processing
            until deletion is possible.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            How do We Keep Your Information Safe?
          </h2>
          <p className="leading-7 mt-4">
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, despite our safeguards and efforts
            to secure your information, no electronic transmission over the
            Internet or information storage technology can be guaranteed to be
            100% secure, so we cannot promise or guarantee that hackers,
            cybercriminals, or other unauthorized third parties will not be able
            to defeat our security, and improperly collect, access, steal, or
            modify your information. Although we will do our best to protect
            your personal information, the transmission of personal information
            to and from our Website is at your own risk. You should only access
            the Website within a secure environment.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Your Rights Under Health Insurance Portability and Accountability
            Act (HIPAA){" "}
          </h2>
          <p className="leading-7 mt-4">
            Under the Health Insurance Portability and Accountability Act
            (HIPAA) in the United States, individuals have specific rights
            regarding their protected health information (PHI). Here&apos;s a
            summary of these rights:
            <ul className="list-decimal list-outside ml-8 mt-4 space-y-2">
              <li>
                <strong>Right to Access:</strong> Individuals have the right to
                access their own PHI held by healthcare providers and health
                plans. This includes the right to view, obtain copies, and
                request electronic copies of their medical records.
              </li>
              <li>
                <strong>Right to Request Amendments: </strong>Individuals can
                request corrections or amendments to their PHI if they believe
                it is inaccurate or incomplete. Healthcare providers and plans
                must consider these requests.
              </li>
              <li>
                <strong>Right to an Accounting of Disclosures:</strong>
                Individuals have the right to request an accounting of
                disclosures of their PHI. This accounting lists who has accessed
                or received their PHI and for what purposes.
              </li>
              <li>
                <strong>Right to Request Restrictions:</strong> Patients can
                request restrictions on the use and disclosure of their PHI for
                certain purposes, such as limiting access to specific
                individuals or entities. However, healthcare providers and plans
                are not always required to agree to these restrictions.
              </li>
              <li>
                <strong>Right to Confidential Communications:</strong>
                Individuals can request that healthcare providers communicate
                with them in a certain way or at a specific location to protect
                their privacy. For example, they can request communications by
                mail instead of email.
              </li>
              <li>
                <strong>Right to File a Complaint:</strong> Individuals can file
                complaints with the U.S. Department of Health and Human Services
                (HHS) or their state&apos;s Attorney General&apos;s office if
                they believe their rights under HIPAA have been violated.
              </li>
              <li>
                <strong>Right to Receive Notice: </strong>Individuals have the
                right to receive a Notice of Privacy Practices from healthcare
                providers and health plans. This notice explains how their PHI
                may be used and disclosed, as well as their privacy rights.
              </li>
            </ul>
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            California Residents Have Specific Privacy Rights
          </h2>
          <p className="leading-7 mt-4">
            California Civil Code Section 1798.83, also known as the “Shine The
            Light” law, permits our users who are California residents to
            request and obtain from us, once a year and free of charge,
            information about categories of personal information (if any) we
            disclosed to third parties for direct marketing purposes and the
            names and addresses of all third parties with which we shared
            personal information in the immediately preceding calendar year.
            <br />
            <br />
            If you are a California resident and would like to make such a
            request, please submit your request in writing to us using the
            contact information provided below. If you are under 18 years of
            age, reside in California, and have a registered account with the
            Website, you have the right to request removal of unwanted data that
            you publicly post on the Website. To request removal of such data,
            please contact us using the contact information provided below, and
            include the email address associated with your account and a
            statement that you reside in California. We will make sure the data
            is not publicly displayed on the Website, but please be aware that
            the data may not be completely or comprehensively removed from all
            our systems (e.g. backups, etc.).
          </p>
          <h3 className="font-bold text-lg sm:text-xl mt-4">
            CCPA/CPRA Privacy Notice{" "}
          </h3>
          <p className="leading-7 mt-4">
            The California Code of Regulations defines a{" "}
            <strong>&quot;resident&quot;</strong> as:
            <ul className="list-none list-inside ml-8 mt-4 space-y-2">
              <li>
                <strong>a.</strong> every individual who is in the State of
                California for other than a temporary or transitory purpose and
              </li>
              <li>
                <strong>b.</strong> every individual who is domiciled in the
                State of California who is outside the State of California for a
                temporary or transitory purpose
              </li>
            </ul>
          </p>
          <p className="leading-7 mt-4">
            All other individuals are defined as{" "}
            <strong>&quot;non-residents.&quot;</strong> If this definition of{" "}
            <strong>&quot;resident&quot;</strong> applies to you, certain rights
            and obligations apply regarding your personal information.
          </p>
          <h3 className="font-bold text-lg sm:text-xl mt-4">
            How do we use and share your personal information?{" "}
          </h3>
          <p className="leading-7 mt-4">
            More information about our data collection and sharing practices can
            be found in this privacy notice. You can opt out from selling your
            personal information by disabling cookies in the Cookies Preferences
            Settings or clicking on the &quot;Do Not Sell My Personal
            Information&quot; link on our homepage. You may contact us by email,
            or by referring to the contact details at the bottom of this
            document. If you are using an authorized agent to exercise your
            right to opt-out, we may deny a request if the authorized agent does
            not submit proof that they have been validly authorized to act on
            your behalf.
          </p>
          <h3 className="font-bold text-lg sm:text-xl mt-4">
            Will your information be shared with anyone else?
          </h3>
          <p className="leading-7 mt-4">
            We may disclose your personal information with our service providers
            pursuant to a written contract between us and each service provider.
            Each service provider is a for-profit entity that processes the
            information on our behalf.
          </p>
          <h3 className="font-bold text-lg sm:text-xl mt-4">
            Your rights with respect to your personal data
          </h3>
          <p>
            <ul className="list-decimal list-inside ml-8 mt-4 space-y-2">
              <li>
                <strong>
                  Right to request deletion of the data - Request to delete
                </strong>
                <ul className="list-disc list-outside ml-8 mt-4 leading-7">
                  <li>
                    You can ask for the deletion of your personal information.
                    If you ask us to delete your personal information, we will
                    respect your request and delete your personal information,
                    subject to certain exceptions provided by law, such as (but
                    not limited to) the exercise by another consumer of his or
                    her right to free speech, our compliance requirements
                    resulting from a legal obligation or any processing that may
                    be required to protect against illegal activities.
                  </li>
                </ul>
              </li>
              <li className="mt-4">
                <strong>Right to be informed - Request to know</strong>
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    Depending on the circumstances, you have a right to know:
                  </li>
                  <li>Whether we collect and use your personal information;</li>
                  <li>
                    The categories of personal information that we collect;
                  </li>
                  <li>
                    The purposes for which the collected personal information is
                    used;
                  </li>
                  <li>
                    Whether we sell your personal information to third parties;
                  </li>
                  <li>
                    The categories of personal information that we sold or
                    disclosed for a business purpose;
                  </li>
                  <li>
                    The categories of third parties to whom the personal
                    information was sold or disclosed for
                  </li>
                  <li>
                    {" "}
                    A business purpose; and the business or commercial purpose
                    for collecting or selling personal information.
                  </li>
                  <li>
                    In accordance with applicable law, we are not obligated to
                    provide or delete consumer information that is de-identified
                    in response to a consumer request or to re-identify
                    individual data to verify a consumer request
                  </li>
                </ul>
              </li>
              <li className="mt-4">
                <strong>
                  Right to Non-Discrimination for the Exercise of a
                  Consumer&apos;s Privacy Rights
                </strong>
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    We will not discriminate against you if you exercise your
                    privacy rights
                  </li>
                </ul>
              </li>
              <li className="mt-4">
                <strong>Other privacy rights </strong> 
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    You may object to the processing of your personal data.
                  </li>
                  <li>
                    you may request correction of your personal data if it is
                    incorrect or no longer relevant, or ask to restrict the
                    processing of the data.
                  </li>
                  <li>
                    you can designate an authorized agent to make a request
                    under the CCPA/CPRA on your behalf. We may deny a request
                    from an authorized agent who does not submit proof that they
                    have been validly authorized to act on your behalf in
                    accordance with the CCPA/CPRA.
                  </li>
                  <li>
                    you may request to opt-out from future selling of your
                    personal information to third parties. Upon receiving a
                    request to opt-out, we will act upon the request as soon as
                    feasibly possible, but no later than 15 days from the date
                    of the request submission.
                  </li>
                </ul>
              </li>
            </ul>
          </p>
          <p className="mt-4">
            Upon receiving your request, we will need to verify your identity to
            determine you are the same person with whom we have the information
            in our system. These verification efforts require us to ask you to
            provide information so that we can match it with the information you
            have previously provided us. For instance, depending on the type of
            request you submit, we may ask you to provide certain information so
            that we can match the information you provide with the information
            we already have on file, or we may contact you through a
            communication method (e.g. phone or email) that you have previously
            provided to us. We may also use other verification methods as the
            circumstances dictate.
            <br />
            <br />
            We will only use personal information provided in your request to
            verify your identity or authority to make the request. To the extent
            possible, we will avoid requesting additional information from you
            for the purposes of verification. If, however, if we cannot verify
            your identity from the information already maintained by us, we may
            request that you provide additional information for the purposes of
            verifying your identity, and for security or fraud-prevention
            purposes. We will delete such additional provided information as
            soon as we finish verifying you.
            <br />
            <br />
            To exercise these rights, you can contact us by referring to the
            contact details at the bottom of this document. If you have a
            complaint about how we handle your data, we would like to hear from
            you.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Your Data Protection Rights Under the Laws of Other States in the
            USA
          </h2>
          <p className="leading-7 mt-4">
            <ul className="list-decimal list-outside ml-8 mt-4 leading-7 space-y-2">
              <li>
                <strong>Navada:</strong> If you are a resident of Nevada, you
                have some additional rights
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    We do not sell your covered information, as defined under
                    Chapter 603A of the Nevada Revised Statutes.
                  </li>
                </ul>
              </li>
              <li className="mt-4">
                <strong> Virginia:</strong> If you are a resident of Virginia,
                you have some additional rights:
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    If we deny your rights request, you have the right to appeal
                    that decision. We will provide you with the necessary
                    information to submit an appeal at that time.{" "}
                  </li>
                  <li>
                    You have the right to opt out of targeted advertising.{" "}
                  </li>
                  <li>
                    You have the right to opt out of profiling in furtherance of
                    decisions that produce legal or similarly significant
                    effects concerning the consumer.
                  </li>
                </ul>
              </li>
              <li className="mt-4">
                <strong> Colorado:</strong> If you are a resident of Colorado,
                you have some additional rights:
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    If we deny your rights request, you have the right to appeal
                    that decision. We will provide you with the necessary
                    information to submit an appeal at that time.{" "}
                  </li>
                  <li>
                    You have the right to opt out of targeted advertising.
                  </li>
                  <li>
                    You have the right to opt out of profiling in furtherance of
                    decisions that produce legal or similarly significant
                    effects concerning the consumer.{" "}
                  </li>
                </ul>
              </li>
              <li className="mt-4">
                <strong> Connecticut:</strong> If you are a resident of
                Connecticut, you have some additional rights:
                <ul className="list-disc list-outside ml-8 mt-4 leading-7 space-y-2">
                  <li>
                    If we deny your rights request, you have the right to appeal
                    that decision. We will provide you with the necessary
                    information to submit an appeal at that time.
                  </li>
                  <li>
                    {" "}
                    You have the right to opt out of targeted advertising.{" "}
                  </li>
                  <li>
                    You have the right to opt out of profiling in furtherance of
                    decisions that produce legal or similarly significant
                    effects concerning the consumer.
                  </li>
                </ul>
              </li>
            </ul>
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Controls for Do-Not-Track Features{" "}
          </h2>
          <p className="leading-7 mt-4">
            Most web browsers and some mobile operating systems and mobile
            applications include a Do-Not-Track (“DNT”) feature or setting you
            can activate to signal your privacy preference and not to have data
            about your online browsing activities monitored and collected. At
            this stage, no uniform technology standard for recognizing and
            implementing DNT signals has been finalized. As such, we do not
            currently respond to DNT browser signals or any other mechanism that
            automatically communicates your choice not to be tracked online. If
            a standard for online tracking is adopted that we must follow in the
            future, we will inform you about that practice in a revised version
            of this privacy notice.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            How Do we protect Children&apos;s Privacy?
          </h2>
          <p className="leading-7 mt-4">
            Our Services are not for the use of children below the age of 13
            (&qout;Child&qout; or &qout;Children&qout;). In compliance with the
            Children&apos;s Online Privacy Protection Act (&qout;COPPA&qout;),
            we do not knowingly collect personally identifiable information from
            Adding unique H1 tag with primary keyword

children under 13 without the consent of the legal guardian. If you
            become aware that a Child has provided us with Personal Data without
            the parent&apos;s consent, please contact us. If we become aware
            that we have collected Personal Data from Children, we take steps to
            remove that information from our servers.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            How can You Submit a Complaint?
          </h2>
          <p className="leading-7 mt-4">
            If you have a complaint about our handling of your personal data,
            you may contact us using the contact information below. We request
            that a complaint be made in writing. Please provide details about
            your concern or complaint so that our data protection officer can
            investigate it. We will take appropriate action in response to your
            complaint, which may include conducting internal discussions with
            relevant business representatives. We may contact you for additional
            details or clarification about your concern or complaint. We will
            contact you to inform you of our response to your complaint.{" "}
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Do we Make Updates to this Notice?
          </h2>
          <p className="leading-7 mt-4">
            We may update this privacy notice from time to time. The updated
            version will be indicated by an updated “Last updated” date and the
            updated version will be effective as soon as it is accessible. If we
            make material changes to this privacy notice, we may notify you
            either by prominently posting a notice of such changes or by
            directly sending you a notification. We encourage you to review this
            privacy notice frequently to be informed of how we are protecting
            your information.{" "}
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Contact Us</h2>
          <p className="leading-7 mt-4">
            After reviewing this policy, if you have any additional questions
            concerning this Privacy Policy, please contact us by sending an
            email to{" "}
            <a
              href="mailto:fnduati@nursingfront.com "
              className="text-blue-500 underline"
            >
              fnduati@nursingfront.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}