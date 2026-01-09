import { CheckCircle2, ArrowRight } from "lucide-react";
import Images from "../Assets/index";
import { generateImageAlt } from "../Utils/SEOHelpers.Util";

export default function NursingValuesSection() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl overflow-hidden shadow-md mb-10 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-100/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

      <div className="p-8 sm:p-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Career Values
            </div>

            <h2 className="inter_variable text-3xl font-bold text-gray-900 mb-4">
              Find a Workplace That Shares Your Values
            </h2>

            <p className="text-gray-700 mb-8 text-lg">
              Every nursing professional has unique values and priorities. We
              help match you with workplaces that align with what matters most
              to you.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 transition-all hover:shadow-md">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mt-0.5 flex-shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    Work-Life Balance
                  </p>
                  <p className="text-gray-600">
                    Find positions with manageable schedules and flexible
                    options
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 transition-all hover:shadow-md">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mt-0.5 flex-shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    Growth Opportunities
                  </p>
                  <p className="text-gray-600">
                    Discover employers who invest in continuing education and
                    advancement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 transition-all hover:shadow-md">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mt-0.5 flex-shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    Supportive Culture
                  </p>
                  <p className="text-gray-600">
                    Connect with teams that prioritize collaboration and respect
                  </p>
                </div>
              </div>
            </div>

            {/* <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full py-3 px-6 transition-all hover:shadow-lg inline-flex items-center gap-2 group">
              Take the Values Assessment
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button> */}
          </div>

          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 -m-4 bg-indigo-200/30 rounded-2xl rotate-3"></div>
              <img
                src={Images["ThreeHappyNurses2"]}
                alt={generateImageAlt("ThreeHappyNurses2", "Three diverse nurses representing workplace values and supportive healthcare environment")}
                className="rounded-xl shadow-lg object-cover w-full relative z-10 border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}