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
      <header className="flex shrink-0 h-10 items-center gap-2 justify-end mb-2">
        <SidebarTrigger className="md:hidden" />
        <div className="flex gap-3 ml-auto">
          <LucideSettings className="h-5 my-auto" />
          <LucideBell className="h-5 my-auto" />
          <NavUser />
        </div>
      </header>
      <DashboardHeader
        title="Template Hub"
        buttonText="Explore Templates"
        bottomSection={false}
      />
      <div className="p-2 max-md:p-0 flex-col flex gap-10">
        <div className="flex gap-2 flex-wrap">
          <div className="min-w-80 flex">
            <div className="flex flex-1 items-center border rounded-full px-1">
              <div className="text-gray-400">
                <LucideSearch className="h-5" />
              </div>
              <Input
                type="search"
                placeholder="Search ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent w-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              className="whitespace-nowrap rounded-full"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div>
          <p className="text-lg font-semibold mb-5">{selectedCategory} Templates</p>
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
