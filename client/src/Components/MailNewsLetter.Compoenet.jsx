import { useContext, useState } from "react";
import SubscribedUsersService from "../Services/SubscribedUsers.Service";
import { Bell } from "lucide-react";

/// CUSTOM IMPORTS
import HandleEvent from "../Pipes/HandleEvent.Pipe";
import { alert } from "../Utils/AlertGlobalInterface.Util";

export default function MailNewsLetter() {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false); // State to determine if the alert is an error

  const handleSubscribe = async () => {
    HandleEvent("Button", "Click on Convert Kit Subscribe Button");
    const { data } = await SubscribedUsersService.POST_SUBSCRIBED_USERS({
      reqBody,
    });

    if (data && data?.SUCCESS) {
      setEmail("");
      alert.success(
        "Success! Now check your email to confirm your subscription."
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl overflow-hidden shadow-xl py-8 px-6 lg:py-10 lg:px-10 text-white mb-8 relative">
      {/* Abstract decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Icon header */}
        <div className="flex items-center justify-center mb-5">
          <div className="bg-white/20 p-3 rounded-full">
            <Bell className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-sm">
          Stay Updated on Nursing Opportunities
        </h2>

        <p className="mb-8 text-white/90 max-w-xl mx-auto">
          Get personalized job alerts, career resources, and industry insights
          delivered right to your inbox.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 p-1 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <input
              type="email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white outline-none text-sm sm:text-base placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-white hover:bg-white/90 transition-colors py-3 px-6 rounded-lg text-indigo-600 font-medium text-sm sm:text-base shadow-sm"
              onClick={() => handleSubscribe()}
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-white/70 mt-3">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}