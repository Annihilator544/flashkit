import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideAward, LucideCircleUserRound, LucideCopy, LucideFolderOpen, LucideGauge, LucideLayoutDashboard, LucideLogOut, LucideMoreHorizontal, LucideMoreVertical, LucidePieChart, LucidePlus, LucideSearch, LucideSettings, LucideSparkles, LucideTrash2, LucideTvMinimalPlay, LucideUsersRound, Twitter, Youtube } from "lucide-react";
import React, { useEffect } from "react";
import { useProject } from "plotNoFeatures/project";
import { observer } from "mobx-react-lite";
import * as api from "./plotNoFeatures/api";
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
  const [loading, setLoading] = React.useState(false);
  const { Engagement, setEngagement } = useEngagementData();
  const {instagramData} = useInstagramData();
  const getEQSScore = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch("https://uibtscb6a4mio6htt6rdpuqc640hbnof.lambda-url.eu-west-2.on.aws/", {
        method: 'POST',
        body: JSON.stringify({
          data : userData
        })
      });

      const data = await response.json();
      console.log(data);
      setEngagement(data);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

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
      <header>
        <div className="flex h-[7vh] fixed z-10 w-full bg-white top-0 left-0 border-b-[1px] px-6 justify-between">
            <Link to='/' className=' hover:no-underline my-auto'>
                <div className='flex gap-2 my-auto'>
                    <img src={logo} alt="logo" className=' h-8' />
                    {/* <p className=' font-semibold text-3xl'>FlashKit</p> */}
                </div>
            </Link>
        </div>
      </header>
      <div className="flex h-[93vh] mt-[7vh]">
        <Tabs className="flex flex-1 " defaultValue="home" >
        <SidebarLayout>
        <div className=" flex">
            <TabsContent value="home" className="flex-1 overflow-y-auto">
              <DashboardHeader/>
              <div className="m-10 text-[#252C32] flex justify-between">
                <div>
                  <p className=" font-semibold text-2xl">Welcome back {user.displayName&&user.displayName.split(" ")[0]} !</p>
                  <p className=" font-normal text-base ">Your latest social media performance </p>
                </div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Instagram"><div className="flex gap-2"><Instagram className="h-5"/>Instagram </div></SelectItem>
                        <SelectItem value="Twitter"><div className="flex gap-2"><Twitter className="h-5"/>Twitter </div></SelectItem>
                        <SelectItem value="Youtube"><div className="flex gap-2"><Youtube className="h-5"/>Youtube</div></SelectItem>
                        <SelectItem value="LinkedIn"><div className="flex gap-2"><Linkedin className="h-5"/>LinkedIn </div></SelectItem>
                        {/* <SelectItem value="TikTok"><div className="flex gap-2"><TikTok className="h-5"/>Instagram </div></SelectItem> */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              </div>
              <div>
                {/* {localStorage.getItem("flashkitPlan") === "FLASHKITSOCIAL" ? 
                <> */}
                <div className="m-10  flex justify-around flex-wrap">
                    <div className="flex gap-4">
                        <Avatar className= "m-auto">
                        {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                          <AvatarImage src="https://github.com/shadcn.png" />
                        }
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="my-auto space-y-1">
                          <div className=" flex flex-col gap-2">
                              <div className=" text-base font-semibold Inter flex gap-2"><LucideGauge className="h-5 my-auto"/> EQS Score</div>
                              <p className=" text-2xl font-semibold">{Engagement && typeof Engagement ==='object' && Object.keys(Engagement).length > 0 ? Engagement.engagementMetrics.score * 10 : 79} %</p>
                              <div className="text-[#E1A100] bg-[#fdf5e1] text-center font-semibold flex pr-2 py-[2px] rounded-sm mr-auto"><LucideAward className="h-4 my-auto"/>Gold</div>
                              {data && typeof data === 'object' && Object.keys(data).length > 0 ?<Button className={"w-full" + loading ? " opacity-90 ":""} onClick={()=>getEQSScore(data)}>{loading ? "Loading ...":" Generate EQS Score"}</Button> : <></>}
                          </div>
                        </div>
                    </div>
                  <Separator orientation="vertical" className="mx-4"/>
                  <div className=" flex flex-col gap-2">
                      <div className=" text-base font-semibold Inter flex gap-2">Total Followers</div>
                      <p className=" text-2xl font-semibold">23000</p>
                      <div className="flex text-sm font-medium gap-1"><p className="text-[#FF9500]">-0.4%</p><p className="text-secondary"> than last week</p></div>
                  </div>
                  <Separator orientation="vertical" className="mx-4"/>
                  <div className=" flex flex-col gap-2">
                      <div className=" text-base font-semibold Inter flex gap-2">Total Engagement</div>
                      <div className="flex text-sm font-medium gap-1"><p className=" text-2xl font-semibold">{Engagement && typeof Engagement ==='object' && Object.keys(Engagement).length > 0 ? Engagement.engagementMetrics.details.recentEngagementScore : 9.2}</p><p className="text-secondary mt-auto mb-1"> / 10</p></div>
                      <div className="flex text-sm font-medium gap-1"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                  </div>
                  <Separator orientation="vertical" className="mx-4"/>
                  <div className=" flex flex-col gap-2">
                      <div className=" text-base font-semibold Inter flex gap-2"> Daily Engagement</div>
                      <p className=" text-2xl font-semibold">{Engagement && typeof Engagement ==='object' && Object.keys(Engagement).length > 0 ? Engagement.engagementMetrics.score * 10 : 79} %</p>
                      <div className="flex text-sm font-medium gap-1"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                  </div>
                </div>
                <div className="m-10">
                <ShineBorder
                  className="relative flex w-full py-5 flex-1 flex-col overflow-hidden rounded-lg border bg-background md:shadow-xl"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  borderWidth={2}
                >
                  <p className="text-[#151212] mr-auto flex gap-1 font-semibold text-base"><LucideSparkles className="h-4 my-auto"/> AI Growth Insights</p>
                  <p className="text-[#252C32] text-base mr-auto">Post on Thursdays at 5-7 PM for better reach. Use hashtags like #Inspiration and #Style!</p>
                </ShineBorder>
                </div>
                <div className="m-10">
                    <div className="flex gap-6">
                    <InsightsChart/> 
                    <MonthlyEngagementChart/>
                    </div>
                </div>
                <div className="m-10">
                  <div className="justify-between flex flex-col mb-10">
                  <p className=" text-lg font-semibold mt-10">Start Building</p>
                  <p className="text-[#6E7C87] font-medium text-sm">Choose a template and craft eye-catching stats</p>
                  </div>
                  <DashboardProjects store={store} />
                </div>
                <div className="m-10">
                  <p className="text-lg font-semibold">Templates for you</p>
                  <p className="text-secondary font-medium text-sm mb-5">Choose a template and craft eye-catching stats</p>
                  <div className="flex  gap-3">
                  {
                    mediaKitData.slice(1,6).map((item,index)=>{
                      return(
                        <TemplateCard key={index} url={item.preview} jsonURL={item.json} store={store}/>
                      )
                    })
                  }
                  </div>
                </div>
                </div>
            </TabsContent>
            <TabsContent value="youtube" className="flex-1 p-10 space-y-6">
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
            <TabsContent value="instagram" className="flex-1 p-10 space-y-6">
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
            <TabsContent value="templates" className="flex-1 p-10 space-y-6">
            <div className="bg-gradient-to-r relative overflow-hidden from-[#036a84] to-[#469098] stops-[#93bfaf] p-8 rounded-lg mb-6">
              <h1 className="text-4xl font-semibold text-white mb-4">Design Stunning Content Effortlessly!</h1>
              <Button variant="secondary" className="bg-white text-black hover:bg-gray-100 drop-shadow-2xl">
                Explore Templates
              </Button>
              <img src={headerSvg} alt="header" className="absolute right-5 -bottom-10 w-64 h-64" />
            </div>
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
            <TabsContent value="projects" className="flex-1 p-10 space-y-6">
                <ProjectSection />
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

const DashboardProjects = observer(({ store }) => {
  const project = useProject();
  const [designsLoadings, setDesignsLoading] = React.useState(false);
  const [designs, setDesigns] = React.useState([]);

  const loadDesigns = async () => {
    setDesignsLoading(true);
    const list = await api.listDesigns();
    setDesigns(list);
    setDesignsLoading(false);
  };

  const handleProjectDelete = ({ id }) => {
    setDesigns(designs.filter((design) => design.id !== id));
    api.deleteDesign({ id });
  };

  const handleProjectDuplicate = async({ id }) => {
    await api.duplicateDesign({ id: id});
    await loadDesigns();
  } 

  React.useEffect(() => {
    loadDesigns();
  }, [project.cloudEnabled, project.designsLength]);
  return (
    <div className="flex flex-col flex-wrap">
      <div className="flex gap-5 flex-wrap">
        <Button
          variant="dotted"
          className="px-10 py-8 aspect-square h-full"
            onClick={async () => {
              window.location.href = `/canvas?id=create_new_design`;
            }}
          >
            <LucidePlus className=" h-4"/>Create new project
        </Button>
      {!designsLoadings && !designs.length && (
        <div style={{ paddingTop: '20px', textAlign: 'center', opacity: 0.6 }}>
          You have no designs yet.
        </div>
      )}
      {designsLoadings && (
        <div style={{ paddingTop: '20px', textAlign: 'center', opacity: 0.6 }}>
          Loading designs...
        </div>
      )}
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onDelete={handleProjectDelete}
          onDuplicate={handleProjectDuplicate}
        />
      ))}
      </div>
    </div>
  );});

  const DesignCard = observer(({ design, store, onDelete, onDuplicate }) => {
    const [loading, setLoading] = React.useState(false);
    const [previewURL, setPreviewURL] = React.useState(design.previewURL);
  
    React.useEffect(() => {
      const load = async () => {
        const url = await api.getPreview({ id: design.id });
        setPreviewURL(url);
      };
      load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
  
    const handleSelect = async () => {
      setLoading(true);
      window.location.href = `/canvas?id=${design.id}`;
      setLoading(false);
    };
  
    return (
      <div className="flex flex-col">
      <Card
        style={{  padding: '3px', position: 'relative' }}
        interactive
        className="fit-content w-fit mb-auto mx-1"
        onClick={() => {
          handleSelect();
        }}
      >
        <div className="rounded-lg overflow-hidden">
        <img src={previewURL} style={{ width: '200px' }} alt="url" />
        </div>
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Spinner />
          </div>
        )}
        <div
          style={{ position: 'absolute', top: '5px', right: '5px' }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
        <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="p-2 bg-transparent hover:bg-primary border "><LucideMoreVertical className="h-4"/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white mx-1">
          <DropdownMenuItem className="flex gap-2" onClick={() => {
                    handleSelect();
                  }}>
              <LucideFolderOpen className='h-4'/>Open
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2" onClick={() => {
                      onDelete({ id: design.id });
                  }}>
              <LucideTrash2 className='h-4'/>Delete
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2" onClick={() => {
                      onDuplicate({ id: design.id });
                  }}>
              <LucideCopy className='h-4'/>Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </Card>
      
      <div className="mx-2">
        <p className="text-sm font-semibold">{design.name}</p>
        <div className="flex justify-between">
        <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.split("T")[0]}</p>
        <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}</p>
        </div>
      </div>
      </div>
    );
  });

export default DashBoard;