// UserEngagement.Pipe.js
import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function UserEngagement() {
    useEffect(() => {
        // Scroll Tracking
        const handleScroll = () => {
            const scrollPosition =
                window.scrollY || document.documentElement.scrollTop;
            const windowHeight =
                window.innerHeight || document.documentElement.clientHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const scrollPercentage =
                (scrollPosition / (documentHeight - windowHeight)) * 100;

            // Track scroll depth at different percentages
            if (scrollPercentage >= 25 && scrollPercentage < 50) {
                ReactGA.event({
                    label: document.title,
                    category: "Scroll Depth",
                    action: "25% Scrolled",
                });
            } else if (scrollPercentage >= 50 && scrollPercentage < 75) {
                ReactGA.event({
                    label: document.title,
                    category: "Scroll Depth",
                    action: "50% Scrolled",
                });
            } else if (scrollPercentage >= 75) {
                ReactGA.event({
                    label: document.title,
                    category: "Scroll Depth",
                    action: "75% Scrolled",
                });
            }
        };

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Clean up event listener
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return null; // This component doesn't render anything
}
