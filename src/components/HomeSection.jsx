import { useAuthStore } from "store/use-auth-data";
import DashboardHeader from "./DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { useYoutubeData } from "store/use-youtube-data";
import TemplateCard from "./TemplateCard";
import { MonthlyEngagementChart } from "./charts/MonthlyEngagementChart";
import { InsightsChart } from "./charts/InsightsChart";
import ShineBorder from "./ui/shine-border";
import { useEngagementData } from "store/use-engagement-data";
import { Instagram, Linkedin, LucideArrowDown10, LucideArrowDownLeft, LucideArrowUpRight, LucideAudioWaveform, LucideAward, LucideBell, LucideCopy, LucideFolderOpen, LucideGauge, LucideGaugeCircle, LucideHeart, LucideInstagram, LucideMessageSquare, LucideMoreVertical, LucideMusic, LucidePlus, LucideSearch, LucideSend, LucideSettings, LucideSparkles, LucideTrash2, LucideTrendingUp, LucideYoutube, Twitter, Youtube } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Spinner } from "@blueprintjs/core";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useEffect } from "react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import * as api from "../plotNoFeatures/api";
import { useProject } from "../plotNoFeatures/project";
import { Input } from "./ui/input";
import { NavUser } from "./nav-user";
import { ChartContainer } from "./ui/chart";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import EQSCircle from "../assets/EQSCircle.svg";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

function HomeSection({ store , mediaKitData }) {
    const { user } = useAuthStore();
    const { data } = useYoutubeData();
    const { Engagement, setEngagement } = useEngagementData();
    const [loading, setLoading] = useState(false);
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
    return (
        <>  
            <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-between mb-2">
            {/* <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                        Menu
                    </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
            </div> */}
            <search className=" min-w-80 flex">
            <div className="flex flex-1 items-center border rounded-full px-1">
                <div className=" text-gray-400">
                <LucideSearch className="h-5"/>
                </div>
                <Input
                type="search"
                placeholder="Search ..."
                className=" border-none focus:outline-none focus:ring-0 bg-transparent w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            </search>
            <div className="flex gap-3">
                <LucideSettings className="h-5 my-auto" />
                <LucideBell className="h-5 my-auto" />
                <NavUser/>
            </div>
            </header>
            <DashboardHeader title={"Explore Flashkit"} buttonText={"Explore Flashkit"} bottomSection={true}/>
            <div className="p-2 flex-col flex gap-10">
              <div className=" text-[#252C32] flex justify-between">
                <div>
                  <p className=" font-semibold text-2xl">Welcome back {user&&user.displayName&&user.displayName.split(" ")[0]} !</p>
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
                {/* {localStorage.getItem("flashkitPlan") === "FLASHKITSOCIAL" ? 
                <> */}
                <div className="flex gap-1 flex-wrap">
                    <Card className="flex">
                        <CardContent className="flex gap-2 p-5 px-12 flex-col my-auto">
                            <Avatar className= "m-auto h-20 w-20">
                            {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                            <AvatarImage src="https://github.com/shadcn.png" />
                            }
                            <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="truncate text-xs font-semibold flex mx-auto">{user&&user.displayName ? user.displayName : ""}</span>
                            <div className="text-[#E1A100] bg-[#fdf5e1] text-center font-semibold flex pr-2 py-[2px] rounded-sm mx-auto"><LucideAward className="h-4 my-auto"/>Gold</div>
                        </CardContent>
                    </Card>
                    <Card className=" flex aspect-square">
                        <CardContent className="flex h-fit gap-2 p-5 flex-col">
                              <img src={EQSCircle} className="h-30 w-30 m-auto" alt="EQS Circle"/>
                              {/* <p className=" text-2xl font-semibold">{Engagement && typeof Engagement ==='object' && Object.keys(Engagement).length > 0 ? Engagement.engagementMetrics.score * 10 : 79} %</p> */}
                              {/* {data && typeof data === 'object' && Object.keys(data).length > 0 ?<Button className={"w-full" + loading ? " opacity-90 ":""} onClick={()=>getEQSScore(data)}>{loading ? "Loading ...":" Generate EQS Score"}</Button> : <></>} */}
                              <div className="flex text-sm font-medium gap-1"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                        </CardContent>
                    </Card>
                    <Card className= " flex flex-1 p-0 ">
                        <CardContent className="grid grid-cols-2 grid-rows-2 gap-1 p-1 flex-1">
                        <Card className=" bg-gradient-to-r from-[#E2F2FF] to-[#FFF3F3] rounded-lg">
                            <CardContent className="flex gap-2 p-4 flex-col flex-1">
                            <div className=" text-xs text-secondary font-semibold Inter flex gap-2">Total Followers</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">23K</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className="text-[#FF3B30] ml-auto flex">-0.4% <LucideArrowDownLeft className="h-4 w-4 mt-auto"/></p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Card className=" bg-gradient-to-r from-[#E2F2FF] to-[#FFF3F3] rounded-lg">
                            <CardContent className="flex gap-2 p-4 flex-col flex-1">
                            <div className=" text-xs text-secondary font-semibold Inter flex gap-2">Daily Engagements</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">23K</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className="text-[#FF9500] ml-auto flex">0%</p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Card className=" bg-gradient-to-r from-[#E2F2FF] to-[#FFF3F3] rounded-lg">
                            <CardContent className="flex gap-2 p-4 flex-col flex-1">
                            <div className=" text-xs text-secondary font-semibold Inter flex gap-2">Total Engagement</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">23K</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className="text-[#FF3B30] ml-auto flex">-0.4% <LucideArrowDownLeft className="h-4 w-4 mt-auto"/></p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Card className=" bg-gradient-to-r from-[#E2F2FF] to-[#FFF3F3] rounded-lg">
                            <CardContent className="flex gap-2 p-4 flex-col flex-1">
                            <div className=" text-xs text-secondary font-semibold Inter flex gap-2">Total Followers</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">23K</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className="text-[#34C759] ml-auto flex">+18% <LucideArrowUpRight className="h-4 w-4 mt-auto"/></p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        </CardContent>
                    </Card>
                </div>
                <div className="">
                <ShineBorder
                  className="relative flex w-full py-5 flex-1 justify-between overflow-hidden rounded-lg border bg-background md:shadow-lg"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  borderWidth={2}
                >
                  <div className="flex flex-col mr-auto">
                    <p className="text-[#151212] mr-auto flex gap-1 font-semibold text-base"><LucideSparkles className="h-4 my-auto"/> AI Growth Insights</p>
                    <p className="text-[#252C32] text-base mr-auto">Post on Thursdays at 5-7 PM for better reach. Use hashtags like #Inspiration and #Style!</p>
                  </div>
                  <Button className="bg-[#409BFF] h-12">Discover More</Button>
                </ShineBorder>
                </div>
                <div className="grid grid-cols-[60%,40%] gap-6 bg-[#f6f8f9] rounded-xl border p-6">
                <MonthlyEngagementChart/>
                <div className="flex flex-col gap-4 p-6">
                    <p className=" font-semibold text-2xl"> Choose account</p>
                    <RadioGroup defaultValue="option-one">
                        <div className="flex items-center justify-between bg-white rounded-xl border p-3 text-black space-x-2">
                            <p className="font-medium"> All Socials</p>
                            <Label htmlFor="allSocials">All Socials</Label>
                            <RadioGroupItem value="allSocials" id="allSocials" />
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-xl border p-3 text-black space-x-2">
                            <p className="font-medium flex gap-1"><LucideInstagram className="h-5"/> Instagram</p>
                            <Label htmlFor="instagram">Instagram</Label>
                            <RadioGroupItem value="instagram" id="instagram" />
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-xl border p-3 text-black space-x-2">
                            <p className="font-medium flex gap-1"><LucideYoutube className="h-5"/> Youtube</p>
                            <Label htmlFor="youtube">Youtube</Label>
                            <RadioGroupItem value="youtube" id="youtube" />
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-xl border p-3 text-black space-x-2">
                            <p className="font-medium flex gap-1"><LucideAudioWaveform className="h-5"/> TikTok</p>
                            <Label htmlFor="tiktok">TikTok</Label>
                            <RadioGroupItem value="tiktok" id="tiktok" />
                        </div>
                    </RadioGroup>
                </div>
                </div>
                <Card className="flex flex-col gap-4 bg-[#f6f8f9]">
                    <CardHeader className="flex-row justify-between pb-0">
                        <CardTitle className="text-lg font-semibold">Top content by reach</CardTitle>
                        <p className=" text-[#409BFF] font-medium">See More</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0 h-[200px] bg-[#e3e3e3] justify-center flex overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1733592688551-5ba7804a9634" alt="placeholder" className=" max-h-full my-auto" />
                            </CardContent>
                            <CardFooter className=" flex-col p-4 ">
                                <p className=" text-xs font-semibold mr-auto">Post caption</p>
                                <p className=" text-secondary text-xs mr-auto mt-[6px]">Sun, Oct 13 9:00am</p>
                                <div className="flex justify-between w-full max-w-56 mr-auto mt-3">
                                    <div className="flex text-xs gap-1"><LucideHeart className="h-3 w-3 my-auto text-red-600" fill="red"/> <p>23k</p></div>
                                    <div className="flex text-xs gap-1"><LucideMessageSquare className="h-3 w-3 my-auto text-blue-500" fill="#409bff"/> <p>129</p></div>
                                    <div className="flex text-xs gap-1"><LucideTrendingUp className="h-3 w-3 my-auto text-green-500"/> <p>1.3k</p></div>
                                    <div className="flex text-xs gap-1"><LucideSend className="h-3 w-3 my-auto text-blue-800"/> <p>435</p></div>
                                </div>
                            </CardFooter>
                        </Card>
                        ))}
                    </CardContent>
                </Card>
                <div className="">
                  <div className="justify-between flex flex-col mb-10">
                  <p className=" text-lg font-semibold mt-10">Recent Projects</p>
                  </div>
                  <DashboardProjects store={store} />
                </div>
                {/* <div className="">
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
                </div> */}
            </div>
        </>
    )
}

const DashboardProjects = observer(({ store }) => {
    const project = useProject();
    const [designsLoadings, setDesignsLoading] = useState(false);
    const [designs, setDesigns] =  useState([]);
  
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
  
    useEffect(() => {
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
      const [loading, setLoading] = useState(false);
      const [previewURL, setPreviewURL] = useState(design.previewURL);
    
      useEffect(() => {
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
            <Button className="p-2  bg-[#00000040] hover:bg-primary border "><LucideMoreVertical className="h-4"/></Button>
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
        
        <div className="mx-2 mt-4">
          <p className="text-sm font-semibold">{design.name}</p>
          <div className="flex justify-between">
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.split("T")[0]}</p>
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}</p>
          </div>
        </div>
        </div>
      );
    });

export default HomeSection;