// GOOGLE ANALYTICS
import ReactGA from "react-ga4";

// FUNCTION TO HANDLE EVENT
export default function HandleEvent(category, action) {
    ReactGA.event({
        category: category, 
        action: action,
    });
}