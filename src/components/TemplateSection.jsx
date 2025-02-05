import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { Input } from "./ui/input";
import {
  LucideBell,
  LucideSearch,
  LucideSettings,
} from "lucide-react";
import { Button } from "./ui/button";
import TemplateCard from "./TemplateCard";
import { NavUser } from "./nav-user";
import { SidebarTrigger } from "./ui/sidebar";
import NavbarLeftComponent from "./NavbarLeftComponent";

function TemplateSection({ store }) {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Instagram Posts");

  const categorySizes = {
    "Instagram Posts": "1080x1080",
    "Instagram Story": "1080x1920",
    "Facebook Posts": "1200x630",
    "Facebook Covers": "851x315",
    "Facebook Ad": "1200x628",
    "YouTube Thumbnail": "1280x720",
    "YouTube Channel": "2560x1440",
  };

  const categories = Object.keys(categorySizes);

  useEffect(() => {
    const size = categorySizes[selectedCategory];
    fetch(
      `https://api.polotno.com/api/get-templates?size=${size}&query=${searchQuery}&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n`
    )
      .then((res) => res.json())
      .then((res) => {
        setTemplates(res.items);
      })
      .catch(() => {});
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <header className="flex items-center justify-end h-10 gap-2 mb-2 shrink-0">
        <SidebarTrigger className="md:hidden" />
        <NavbarLeftComponent />
      </header>
      <DashboardHeader
        title="Template Hub"
        buttonText="Explore Templates"
        bottomSection={false}
      />
      <div className="flex flex-col gap-10 p-2 max-md:p-0">
        <div className="flex flex-wrap gap-2">
          <div className="flex min-w-80">
            <div className="flex items-center flex-1 px-1 border rounded-full">
              <div className="text-gray-400">
                <LucideSearch className="h-5" />
              </div>
              <Input
                type="search"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              className="rounded-full whitespace-nowrap"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div>
          <p className="mb-5 text-lg font-semibold">{selectedCategory} Templates</p>
          <div className="flex flex-wrap gap-3 max-md:grid max-md:grid-cols-2">
            {templates.map((item, index) => (
              <TemplateCard
                key={index}
                url={item.preview}
                jsonURL={item.json}
                store={store}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TemplateSection;
