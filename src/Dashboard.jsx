import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideAward, LucideCircleUserRound, LucideCopy, LucideFolderOpen, LucideGauge, LucideLayoutDashboard, LucideLogOut, LucideMoreHorizontal, LucideMoreVertical, LucidePieChart, LucidePlus, LucideSearch, LucideSettings, LucideSparkles, LucideTrash2, LucideTvMinimalPlay, LucideUsersRound, Twitter, Youtube } from "lucide-react";
import React, { useEffect } from "react";
import { useProject } from "plotNoFeatures/project";
import { Spinner } from "@blueprintjs/core";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

import PieChartDisplay from "./components/charts/PieChartDisplay";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "./components/ui/select";
import logo from "./assets/logo.svg" 
import ConnectAccount from "./components/ConnectAccount";
import { YoutubeMonthly } from "./components/charts/YoutubeMonthly";
import { useYoutubeData } from "store/use-youtube-data";
import { useAuthStore } from "store/use-auth-data";
import BarChartDisplay from "./components/charts/BarChartDisplay";
import RadarChartDisplay from "./components/charts/RadarChartDisplay";
import RadialChartDisplay from "./components/charts/RadialChartDisplay";
import LineChartDisplay from "./components/charts/LineChartDisplay";
import { Separator } from "./components/ui/separator";
import { InsightsChart } from "./components/charts/InsightsChart";
import { MonthlyEngagementChart } from "./components/charts/MonthlyEngagementChart";
import { TopContentCarousel } from "./components/TopContentCarousel";
import TemplateCard from "./components/TemplateCard";
import ChatWidget from "./components/ChatWidget";
import { useEngagementData } from "store/use-engagement-data";
import SidebarLayout from "layouts/SideBarLayout";
import DashboardHeader from "./components/DashboardHeader";
import { InstagramContentCarousel } from "./components/InstagramContentCarousel";
import { useInstagramData } from "store/use-instagram-data";
import S3FileManager from "./components/S3MarketPlace";
import { Link } from "react-router-dom";
import ShineBorder from "./components/ui/shine-border";
import headerSvg from "./assets/header.svg";
import { Input } from "./components/ui/input"
import ProjectSection from "./components/ProjectSection";
import HomeSection from "./components/HomeSection";

const categories = [
  { label: "Starred", icon: "⭐" },
  { label: "New!", icon: "✨" },
  { label: "Trending!", icon: "🔥" },
  { label: "All" },
  { label: "Media Kit" },
  { label: "Education" },
  { label: "Marketing" },
  { label: "Cards & Invitation" },
  { label: "Social Media" },
]

function DashBoard({ store }) {
  const { data } = useYoutubeData();
  const { user } = useAuthStore();
  const [mediaKitData, setMediaKitData] = React.useState([]);
  const [boldDesigns, setBoldDesigns] = React.useState([]);
  const [minimalDesigns, setMinimalDesigns] = React.useState([]);
  const [classicDesigns, setClassicDesigns] = React.useState([]);
  const { Engagement, setEngagement } = useEngagementData();
  const {instagramData} = useInstagramData();

  async function getDesignTemplates() {
    try{
    await fetch("https://api.polotno.com/api/get-templates?size=1080x1080&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res) =>res.json()).then((res) => {
      setMediaKitData(res.items);
    });
    await fetch("https://api.polotno.com/api/get-templates?size=851x315&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res) =>res.json()).then((res) => {
      setBoldDesigns(res.items);
    });
    await fetch("https://api.polotno.com/api/get-templates?size=1080x1920&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res) =>res.json()).then((res) => {
      setMinimalDesigns(res.items);
    });
    await fetch("https://api.polotno.com/api/get-templates?size=1280x720&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res)=>res.json()).then((res) => {
      setClassicDesigns(res.items);
    });
  }
    catch(e){
      console.log(e);
    }
  }
  useEffect(() => {
    getDesignTemplates();
  }, []);
  return (
    <div className="flex flex-col">
      {/* <header>
        <div className="flex h-[7vh] fixed z-10 w-full bg-white top-0 left-0 border-b-[1px] px-6 justify-between">
            <Link to='/' className=' hover:no-underline my-auto'>
                <div className='flex gap-2 my-auto'>
                    <img src={logo} alt="logo" className=' h-8' />
                </div>
            </Link>
        </div>
      </header> */}
      <div className="flex">
        <Tabs className="flex flex-1 " defaultValue="home" >
        <SidebarLayout>
        <div className=" flex">
            <TabsContent value="home" className="flex-1 p-4 pt-2 overflow-y-auto">
              <HomeSection store={store} mediaKitData={mediaKitData}/>
            </TabsContent>
            <TabsContent value="youtube" className="flex-1 p-4 space-y-6">
            <p className=" text-3xl font-semibold">Youtube Analytics</p>
            <div>
              <p className="text-secondary font-medium text-lg">Overview</p>
              <div className="flex gap-5 mt-3">
                  <Card className="flex-1 shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Followers</p>
                      <p className="text-3xl font-semibold">127K</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Engagement</p>
                      <p className="text-3xl font-semibold">127K</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Daily Visitors</p>
                      <p className="text-3xl font-semibold">5.3K</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
              </div>
            </div>
            <div>
              <p className="text-secondary font-medium text-lg">Audience</p>
              { data && typeof data === 'object' && Object.keys(data).length > 0 ?
                      <div className="flex-1 mt-3">
                        <div className="flex-1 p-4 flex gap-4">
                          <PieChartDisplay/>
                          <YoutubeMonthly/>
                          
                        </div>
                        <div className="flex-1 p-4 flex gap-4 flex-wrap">
                          <RadarChartDisplay/>
                          <RadialChartDisplay/>
                        </div>
                        <div className="flex-1 p-4 flex gap-4 flex-wrap">
                          <BarChartDisplay/>
                          <LineChartDisplay/>
                        </div>
                      </div>
                      :
                      <div className="flex gap-5 mt-3">
                        <InsightsChart/>
                        <MonthlyEngagementChart/>
                      </div>
                } 
            </div>
            <div>
                <p className="text-secondary font-medium text-lg mb-3">Top Content</p>
                <TopContentCarousel />
            </div>
            </TabsContent>
            <TabsContent value="instagram" className="flex-1 p-4 space-y-6">
            <p className=" text-3xl font-semibold">Instagram Analytics</p>
            {instagramData && instagramData.userData.id ?
            <Card>
              <CardHeader className="flex-row justify-between">
                <CardTitle className="text-lg">
                    Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage src={instagramData.userData.profile_picture_url} />
                  <AvatarFallback>IG</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold text-lg">@{instagramData.userData.username}</p>
                  <p className="text-secondary text-sm">{instagramData.userData.biography}</p>
                </div>
                </CardContent>
            </Card>
            : <></> }
            <div>
              <p className="text-secondary font-medium text-lg">Overview</p>
              <div className="flex gap-5 mt-3">
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Followers</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.followers_count}</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Follows</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.follows_count}</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Post Count</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.media_count}</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
              </div>
            </div>
            <div>
                <p className="text-secondary font-medium text-lg mb-3">Top Content</p>
                {instagramData && <InstagramContentCarousel CarouselItems={instagramData.posts} />}
            </div>
            </TabsContent>
            <TabsContent value="templates" className="flex-1 p-4 pt-2 space-y-6">
              <DashboardHeader title={"Design Stunning Content Effortlessly!"} buttonText={"Explore Templates"} bottomSection={false}/>
            <div className="flex flex-col gap-4">
            <div className="relative flex flex-1 items-center">
              <Input
                type="search"
                placeholder="Search Templates ..."
                className="rounded-full w-1/2"
              />
              <div className="absolute right-[51%] text-gray-400">
                <LucideSearch className="h-5"/>
              </div>
            </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat, i) => (
                  <Button key={i} variant="outline" className="whitespace-nowrap rounded-full">
                    {cat.icon && <span className="mr-1">{cat.icon}</span>}
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
                <div>
                <p className="text-lg font-semibold">Choose your template</p>
                </div>
              <div>
                <p className="text-lg font-semibold">Templates for you</p>
                <p className="text-secondary font-medium text-sm mb-5">Choose a template and craft eye-catching stats</p>
                <div className="flex flex-wrap gap-3">
                {
                  mediaKitData.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">MarketPlace</p>
                <S3FileManager store={store}/>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Bold</p>
                <div className="flex flex-wrap gap-3">
                {
                  boldDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Minimal</p>
                <div className="flex flex-wrap gap-3">
                {
                  minimalDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Classic</p>
                <div className="flex flex-wrap gap-3">
                {
                  classicDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div>
            </TabsContent>
            <TabsContent value="projects" className="flex-1 p-4 pt-2 space-y-6">
                <ProjectSection store={store} />
            </TabsContent>
        </div>
        </SidebarLayout>
        </Tabs>
        {/* {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
        <div className="w-[15%] border-2 border-black my-2 mr-4">
            <p className="my-auto">Ad Space</p>
        </div>
        : <></>} */}
      </div>
      {/* {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
        <></>
        : 
        <ChatWidget />} */}
        <ChatWidget />
    </div>
  );
}

export default DashBoard;