import React from "react";
import TermsData from "../Constants/PublicPolicy.Constant.json";
import SEO from "../Components/SEO.Component";
import { generatePageTitle, generateCanonicalUrl, generateKeywords } from "../Utils/SEOHelpers.Util";

const TermsAndCondition = () => {
  // SEO Configuration
  const pageData = {
    title: generatePageTitle("Terms and Conditions"),
    description: "Read NursingFront's terms and conditions to understand the rules and guidelines for using our nursing job platform and services.",
    keywords: generateKeywords(
      ["terms and conditions", "terms of service", "user agreement"],
      ["nursing platform terms", "healthcare job service terms", "user guidelines"]
    ),
    url: generateCanonicalUrl("/terms"),
    imageUrl: "https://nursingfront.com/src/Assets/Logo.svg"
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms and Conditions",
    description: pageData.description,
    url: pageData.url,
    publisher: {
      "@type": "Organization",
      name: "NursingFront",
      url: "https://nursingfront.com"
    }
  };
  document.title = "Terms";
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
      <div className="bg-white sm:px-10 sm:py-4 mx-auto lg:max-w-7xl my-4 px-2 flex justify-center items-center">
        <div className="w-full md:w-2/3 lg:w-2/3 p-10 bg-[#F1F0FA]">
          <h1 className="text-base sm:text-xl lg:text-3xl font-bold mt-4">
            Terms and Conditions
          </h1>
          <p className="font-normal italic text-base sm:text-md lg:text-l mt-4">
            Last Updated: April 1a, 2024
          </p>
          <p className="mt-4 uppercase">
            Please be aware that your use of and access to our services (as
            defined below) are governed by the following terms. If you do not
            agree to all of these terms, you may not use or access the services in
            any way.
          </p>

          <p className="leading-7 mt-4">
            NursingFront, (hereinafter also referred to as &quot;Company/ we/ our/
            us&quot;) operates{" "}
            <a
              href="https://www.nursingfront.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              www.nursingfront.com
            </a>{" "}
            (&quot;Website&quot;) and provides service through their website
            (&quot;Services&quot;). These Terms and Conditions (&quot;Terms&quot;)
            govern the Services and use of the Services provided by NursingFront.
            By accessing and/or otherwise using the Services in any manner, you,
            therefore, agree that you have read and accepted these Terms. We
            reserve the right to modify these Terms, without notice, at any time.
            You understand that your continued use of the Services after these
            Terms have been modified constitutes your acceptance of these Terms as
            amended.
            <br />
            <br />
            Regularly checking and reviewing this page ensures that you are
            updated on the terms and conditions governing your use of the
            Services. If we believe that the modifications are material, we will
            notify you of the changes by posting a notice on our Website, or
            emailing you at the email address provided to us by you, and as we may
            deem appropriate. What constitutes a material change will be
            determined by us, at our sole and absolute discretion.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4 capitalize">
            Agreement to Terms
          </h2>

          <p className="leading-7 mt-4">
            By accessing this Website, you agree to be bound by the same and
            acknowledge that it constitutes an agreement between you and the
            Company (hereinafter the &quot;User Agreement&quot;). You may not use
            the Services if you do not accept the Terms or are unable to be bound
            by the Terms. Your use of the Website is at your own risk, including
            the risk that you might be exposed to content that is objectionable,
            or otherwise inappropriate.
            <br />
            <br />
            The terms &apos;user(s)&apos;, &quot;your&quot; and &quot;you&quot;
            hereunder refer to the person visiting, accessing, browsing through
            and/or using the Website at any point in time.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Eligibility</h2>
          <p className="leading-7 mt-4">
            In order to use the Website, You need to be 18 (eighteen) years of age
            or older. The Website may only be used or accessed by such Persons who
            can enter into and perform legally binding contracts under the
            applicable laws. The Company shall not be liable in case of any false
            information provided by the user including the user’s age and the user
            and/or his natural or appointed guardian alone shall be liable for the
            consequences as per the applicable laws. The Company disclaims all
            liability arising out of such unauthorized use of the Website and any
            third-party liability arising out of Your use of the Website if You
            are a minor.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Limited License</h2>
          <p className="leading-7 mt-4">
            We grant you a limited, non-exclusive, non-transferable license,
            subject to the terms of this Agreement, to access and use the Site,
            and related content, materials, and information (collectively, the
            &quot;Content&quot;) solely for approved purposes as permitted by us
            from time to time. Any other use of the Site or Content is expressly
            prohibited and all other right, title, and interest in the Site or
            Content is exclusively the property of the Company and its licensors.
            You agree not to copy, transmit, distribute, sell, license, reverse
            engineer, modify, publish, or participate in the transfer or sale of,
            create derivative works from, or in any other way exploit any of the
            Content, in whole or in part. All Free Materials are our intellectual
            property, and we retain all rights not expressly granted. Free
            Materials are provided &quot;as is&quot; without warranties, and we
            can terminate this license at any time without notice for any reason,
            including a breach of these terms.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Accuracy, Completeness, ad Timeliness of Information
          </h2>
          <p className="leading-7 mt-4">
            We are not responsible if the information made available on this
            Website is not accurate, complete, or current. The material on this
            Website is provided for general information only and should not be
            relied upon or used as the sole basis for making decisions without
            consulting primary, more accurate, more complete, or more timely
            sources of information. We reserve the right to modify the contents of
            this Website at any time, but we have no obligation to update any
            information on our Website. You agree that it is your responsibility
            to monitor changes to our Website.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4 capitalize">
            Modifications in Service
          </h2>
          <p className="leading-7 mt-4">
            We reserve the right at any time to modify or discontinue the Service
            (or any part or content thereof) without notice at any time. We shall
            not be liable to you or to any third party for any modification, price
            change, suspension, or discontinuance of the Services. If you purchase
            any services from us, you agree to pay the full amount for the
            service, and any applicable taxes, in a timely manner.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4 capitalize">
            Use of the Website and the Services{" "}
          </h2>
          <p className="leading-7 mt-4">
            You agree to use this website only in accordance with these Terms. In
            the event that your unauthorized use of this website results in loss
            or damage to any person who then brings a claim against us, you agree
            to indemnify us for all losses and/or damages arising from such claim.
            <br />
            <br />
            As a user of this website you undertake:
            <ul className="list-decimal list-outside ml-8 mt-4 space-y-2">
              <li>
                Not use our website in any way that causes or may cause damage to
                the website or impairment of the availability or accessibility of
                the website; or in any way that is unlawful, illegal, fraudulent,
                harmful, or in connection with any unlawful, illegal, fraudulent,
                or harmful activity or purpose;
              </li>
              <li>
                Not use our website to copy, store, host, transmit, send, use,
                publish or distribute any material that consists of (or is linked
                to) any spyware, virus, Trojan horse, worm, keystroke logger,
                rootkit, or other malicious computer software;
              </li>
              <li>
                Not conduct any systematic or automated data collection
                activities, including without limitation scraping, data mining,
                data extraction, and data harvesting on or in relation to our
                website without our express written consent;
              </li>
              <li>
                Not to knowingly or recklessly contravene, in the course of using
                this website, the provisions of any legal or regulatory
                requirements of any competent authority having jurisdiction over
                you or over any activity you undertake;
              </li>
              <li>
                Not to use this website to make unauthorized attempts to access or
                interfere with any of our systems or third party networks;
              </li>
              <li>
                Not to use this website to conduct any business or activity or
                solicit the performance of any activity that is prohibited by law;
              </li>
              <li>
                Not to use this website for the transmission or posting of any
                material which is defamatory, offensive or of an abusive, obscene
                or menacing nature or which infringes third party rights, or for
                the purpose of causing annoyance, inconvenience or needless
                anxiety to any third party, or send any message which you know to
                be false or make use of this website for such purpose(s);
              </li>
              <li>
                To inform us immediately of any claim or action against you for
                any use of this website and, on request from us, to immediately
                cease the act complained of.
              </li>
            </ul>
            <br />
            We reserve the right but have no obligation to monitor the materials
            posted on the Website. The Company shall have the right to remove or
            edit any content that in its sole discretion violates, or is alleged
            to violate, any applicable law or either the spirit or letter of these
            Terms. Notwithstanding this right, You remain solely responsible for
            the content of the materials You post on the Website and in Your
            private messages. Please be advised that such content posted does not
            reflect the Company&apos;s views. In no event shall the Company assume
            or have any responsibility or liability for any content posted or for
            any claims, damages or Losses resulting from the use of content and/or
            appearance of the content on the Website. You hereby represent and
            warrant that You have all necessary rights in and to all content which
            You provide and all information it contains and that such content
            shall not infringe any proprietary or intellectual property or other
            rights of third parties or contain any libelous, tortious, or
            otherwise unlawful information.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Privacy and Usage of Cookies
          </h2>
          <p className="leading-7 mt-4">
            NursingFront will not intentionally disclose any personally
            identifying information about you to third parties, except where the
            Company, in good faith, believes such disclosure is necessary to
            comply with the law or enforce these Terms. By using the Website, you
            signify your acceptance of the Privacy policy. Members signing up for
            the Website are opting in to receive newsletters and other special
            offers through emails/notifications from the Website. If you do not
            wish to receive these emails, you may opt out anytime by
            unsubscribing. For more information, refer to our{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Intellectual Property Rights
          </h2>
          <p className="leading-7 mt-4">
            &quot;Intellectual Property Rights&quot; means any and all rights
            existing from time to time under patent law, copyright law, moral
            rights law, trade secret law, trade mark law, unfair competition law,
            publicity rights law, privacy rights law, and any and all other
            proprietary rights, as well as, any and all applications, renewals,
            extensions, restorations and reinstatements thereof, now or hereafter
            in force and effect worldwide. All material and content on the
            Website, including images, illustrations, text, graphics, logos,
            button icons, images, audio clips, digital downloads, data
            compilations and software, is our property, or the property of our
            affiliates or content suppliers, and is protected by the domestic as
            well as international intellectual property law, including copyright,
            authors’ rights, database rights laws, trademarks, and other
            intellectual property rights that are owned and controlled by us or by
            other parties that have licensed their material to us. The compilation
            of all content on the Website is our exclusive property and is
            protected by domestic as well as international copyright and database
            rights laws. You hereby agree to not copy, reproduce, republish,
            upload, post, transmit or distribute such material in any way,
            including by e-mail or other electronic means whether directly or
            indirectly and you must not assist any other person to do so. Without
            the prior written consent of the owner, modification of the materials,
            use of the materials on any other Website or use of the materials for
            any purpose other than personal, non-commercial use is a violation of
            the copyrights, trademarks and other proprietary rights, and is
            prohibited.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Indemnification</h2>
          <p className="leading-7 mt-4">
            You understand and agree that you are personally responsible for your
            behavior on the Website. You agree to indemnify, defend and hold the
            Company harmless from and against all claims, losses, expenses,
            damages and costs (including, but not limited to, direct, incidental,
            consequential, exemplary and indirect damages), and reasonable
            attorneys&apos; fees, resulting from or arising out of your use,
            misuse, or inability to use the Website or the Content, or any
            violation by you of these Terms.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Disclaimer of Warranty
          </h2>
          <p className="leading-7 mt-4">
            Your use of the Website, Content and Services is at your sole
            discretion and risk. The Website, Content and Services, made available
            through the foregoing, are provided on an “as is” and “as available”
            basis without warranties of any kind.
            <br />
            <br />
            WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, EXPRESS, IMPLIED OR
            STATUTORY, RELATING TO THE SITE, CONTENT, AND SERVICES, MADE AVAILABLE
            THROUGH THE FOREGOING, INCLUDING WITHOUT LIMITATION THE WARRANTIES OF
            TITLE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT OF PROPRIETARY RIGHTS, COURSE OF DEALING OR COURSE OF
            PERFORMANCE. WE DISCLAIM ANY WARRANTIES, EXPRESS OR IMPLIED, (I)
            REGARDING THE SECURITY, ACCURACY, RELIABILITY, TIMELINESS AND
            PERFORMANCE OF THE SITE, CONTENT AND SERVICES; OR (II) THAT THE SITE
            AND SERVICES WILL BE ERROR-FREE OR THAT ANY ERRORS WILL BE CORRECTED;
            OR (III) REGARDING THE PERFORMANCE OF OR ACCURACY, QUALITY, CURRENCY,
            COMPLETENESS OR USEFULNESS OF ANY INFORMATION PROVIDED BY THE SITE AND
            SERVICES.
            <br />
            <br />
            We are not responsible for any incorrect or inaccurate Content posted
            on the Website or in connection with the Services, or transmitted by
            any user, whether by users of the Services or by any of the equipment
            or programming associated with the Services. We take no responsibility
            for third party advertisements which are posted on this Website or
            through the Services, nor does it take any responsibility for the
            services provided by its advertisers. No advice or information,
            whether oral or written, obtained by you from us, shall create any
            warranty not expressly stated in these Terms. If you choose to rely on
            such information, you do so solely at your own risk. Some states or
            jurisdictions do not allow the exclusion of certain warranties.
            Accordingly, some of the above exclusions may not apply to you. Check
            your local laws for any restrictions or limitations regarding the
            exclusion of implied warranties.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Limitation of Liability
          </h2>
          <p className="leading-7 mt-4">
            To the maximum extent permitted by law, our Company, its affiliates,
            partners, officers, directors, agents, and employees shall not be
            liable for any direct, indirect, incidental, special, consequential,
            or punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill,
            or other intangible losses, resulting from (i) your access to or use
            of our website or any content or services accessed from or through our
            website, (ii) your inability to access or use our website or any
            content or services accessed from or through our website, (iii) any
            conduct or content of any third party on our website, including
            without limitation, any defamatory, offensive, or illegal conduct of
            other users or third parties, (iv) any content obtained from or
            through our website, or (v) unauthorized access, use or alteration of
            your transmissions or content.
            <br />
            <br />
            Some jurisdictions do not allow the exclusion or limitation of
            liability for incidental or consequential damages, so the above
            limitations may not apply to you.
            <br />
            <br />
            To the extent permitted by applicable law, you hereby release and
            waive all claims against our Company, its affiliates, partners,
            officers, directors, agents, and employees from any and all liability
            for claims, damages, expenses, or losses arising out of or in any way
            related to your use of our website or any content or services accessed
            from or through our website.
            <br />
            <br />
            IN NO EVENT SHALL WE OR ANY OF OUR OFFICERS, DIRECTORS, EMPLOYEES, OR
            AGENTS BE LIABLE TO YOU FOR ANY DAMAGES WHATSOEVER, INCLUDING WITHOUT
            LIMITATION INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL
            DAMAGES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE,
            CONTENT AND SERVICES, INCLUDING BUT NOT LIMITED TO THE QUALITY,
            ACCURACY, OR UTILITY OF THE INFORMATION PROVIDED AS PART OF OR THROUGH
            THE SITE OR THE SERVICES, WHETHER THE DAMAGES ARE FORESEEABLE AND
            WHETHER OR NOT WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
            DAMAGES. EXCEPT WITH RESPECT TO THE PURCHASE OF PHYSICAL GOODS, THE
            FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT
            PERMITTED BY LAW IN THE APPLICABLE JURISDICTION AND IN NO EVENT SHALL
            OUR CUMULATIVE LIABILITY TO YOU EXCEED U.S. $100. YOUR SOLE AND
            EXCLUSIVE REMEDY WITH RESPECT TO ANY PURCHASED SERVICES WILL BE THE
            REFUND BY THE COMPANY OF THE AMOUNT YOU PAID FOR SUCH SERVICE.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">
            Governing Law and Jurisdiction
          </h2>
          <p className="leading-7 mt-4">
            These Terms and any separate agreements whereby we provide you
            Services shall be governed by and construed in all respects in
            accordance with the Laws of Massachusetts, United States of America
            and the courts of Massachusetts, United States of America shall have
            exclusive jurisdiction over any dispute arising under this Agreement.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Notices</h2>
          <p className="leading-7 mt-4">
            Legal notices must be served on the email address provided in the
            &apos;Contact Us&apos; clause. Notice will be deemed given 48 hours
            after the email is sent unless the sending party is notified that the
            email address is invalid or that the email has not been delivered.
            Alternatively, we may give you legal notice by mail to the address
            provided by you during the registration process. In such a case,
            notice will be deemed given three days after the date of mailing.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Legal Disputes</h2>
          <p className="leading-7 mt-4">
            If a dispute arises between you and the Company, our goal is to
            provide you with a neutral and cost-effective means of resolving the
            dispute quickly. We strongly encourage you to first contact us to seek
            a resolution. If your dispute is not resolved by contacting us, all
            legal notices and formal disputes should be sent to us at the email
            address.
            <br />
            <br />
            If We have not been able to resolve the dispute with you informally,
            we each agree to resolve any claim, dispute or controversy arising out
            of or in connection with or relating to these Terms through binding
            arbitration or in a small claims court.
            <br />
            <br />
            Arbitration is a more informal way to resolve our disagreements than a
            lawsuit in court. For instance, arbitration uses a neutral arbitrator
            instead of a judge or jury, involves more limited discovery and is
            subject to very limited review by courts. Although the process is more
            informal, arbitrators can award the same damages and relief that a
            court can award. You agree that, by agreeing to these Terms of Use,
            the US Federal Arbitration Act governs the interpretation and
            enforcement of this provision, and that you and NursingFront are each
            waiving the right to a trial by jury or to participate in a class
            action. The arbitrator has exclusive authority to resolve any dispute
            relating to the interpretation, applicability or enforceability of
            this binding arbitration agreement. This arbitration provision shall
            survive the termination of this Agreement.
            <br />
            <br />
            Any arbitration will be administered by the American Arbitration
            Association (&quot;AAA&quot;) under the Consumer Arbitration Rules
            then in effect for the AAA, except as provided herein. You can find
            their forms at www.adr.org Unless you and NursingFront agree
            otherwise, the arbitration will be conducted in Massachusetts, United
            States of America. Each party will be responsible for paying any AAA
            filing, administrative and arbitrator fees in accordance with AAA
            rules.
            <br />
            <br />
            The arbitrator shall issue a reasoned written decision explaining the
            essential findings and conclusions on which the award is based, and
            any judgment on the award rendered by the arbitrator may be entered in
            any court of competent jurisdiction. Nothing in this Section shall
            prevent either party from seeking injunctive or other equitable relief
            from the courts, including for matters related to data security,
            intellectual property or unauthorized access to the Service.
            <br />
            <br />
            ALL CLAIMS MUST BE BROUGHT IN THE PARTIES&apos; INDIVIDUAL CAPACITY,
            AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
            REPRESENTATIVE PROCEEDING, AND, UNLESS WE AGREE OTHERWISE, THE
            ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON&apos;S CLAIMS. YOU
            AGREE THAT, BY ENTERING INTO THESE TERMS, YOU AND NURSINGFRONT ARE
            EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS
            ACTION. NOTHING IN THESE TERMS SHALL AFFECT ANY NON-WAIVABLE STATUTORY
            RIGHTS THAT APPLY TO YOU.
            <br />
            <br />
            To the extent that any claim, dispute or controversy regarding
            NursingFront or our Service is not arbitrable under applicable laws or
            otherwise, you and NursingFront both agree that any claim or dispute
            regarding NursingFront will be resolved exclusively in accordance with
            the applicable federal and state laws.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Miscellaneous </h2>
          <p className="leading-7 mt-4">
            <strong>Severability -</strong> The provision or part-provision of
            this Agreement is or becomes invalid, illegal or unenforceable, it
            shall be deemed modified to the minimum extent necessary to make it
            valid, legal and enforceable. If such modification is not possible,
            the relevant provision or part-provision shall be deemed deleted. Any
            modification to or deletion of a provision or part-provision under
            this clause shall not affect the validity and enforceability of the
            rest of this agreement. If any provision or part-provision of this
            Agreement is invalid, illegal or unenforceable, the parties shall
            negotiate in good faith to amend such provision so that as amended, It
            is legal, valid and enforceable, and, to the greatest extent possible,
            achieves the intended commercial result of the original provision.
            <br />
            <br />
            <strong>Entire Agreement -</strong> The failure of us to exercise or
            enforce any right or provision of these Terms and Conditions shall not
            constitute a waiver of such right or provision. These Terms and
            Conditions and any policies or operating rules posted by us on this
            site or in respect to the Service constitute the entire agreement and
            understanding between you and us and govern your use of the Service,
            superseding any prior or contemporaneous agreements, communications
            and proposals, whether oral or written, between you and us. Any
            ambiguities in the interpretation of these Terms and Conditions shall
            not be construed against the drafting party.
            <br />
            <br />
            <strong>Waiver -</strong> If you breach these Terms and we take no
            action, we will still be entitled to use our rights and remedies in
            any other situation where you breach these Terms.
            <br />
            <br />
            <strong>Amendments - </strong>Notwithstanding anything contained
            hereinbefore, The Company may amend and implement the Terms, whenever
            required, in the interest of maintaining the standard and improving
            user experience without any prior notice and you shall be governed by
            such Terms so implemented from time to time. Please review the Terms
            from time to time on a regular basis since your ongoing use is subject
            to the Terms as amended.
          </p>
          <h2 className="font-bold text-lg sm:text-xl mt-4">Termination</h2>
          <p className="leading-7 mt-4">
            The obligations and liabilities of the parties incurred prior to the
            termination date shall survive the termination of this agreement for
            all purposes. These Terms and Conditions are effective unless and
            until terminated by either you or us. You may terminate these Terms
            and Conditions at any time by notifying us that you no longer wish to
            use our Services, or when you cease using our site.
            <br />
            <br />
            If in our sole judgment, you fail, or we suspect that you have failed,
            to comply with any term or provision of these Terms and Conditions, we
            also may terminate this agreement at any time without notice and you
            will remain liable for all amounts due up to and including the date of
            termination; and/or accordingly may deny you access to our Services.
          </p>

          <h2 className="font-bold text-lg sm:text-xl mt-4">Contact Us</h2>
          <p className="leading-7 mt-4">
            After reviewing these Terms, if you have any additional questions,
            concerning these Terms and Conditions, please contact us by sending an
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
};

export default TermsAndCondition;