import Banner from "./Banner";
import BrowseByCategory from "./BrowseByCategory";
import BrowseCompanies from "./BrowseCompanies";
import CallToAction from "./CallToAction";
import RecentJob from "./RecentJob";
import Suggestions from "./Suggestions";
export default function Homepage() {
  return (
    <div className="flex flex-col">
      <Banner />
      <RecentJob />
      <BrowseByCategory />
      <BrowseCompanies />
      <Suggestions />
      <CallToAction />
    </div>
  );
}
