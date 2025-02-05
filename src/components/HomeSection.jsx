import { useAuthStore } from "store/use-auth-data";
import DashboardHeader from "./DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import TemplateCard from "./TemplateCard";
import { MonthlyEngagementChart } from "./charts/MonthlyEngagementChart";
import { InsightsChart } from "./charts/InsightsChart";
import ShineBorder from "./ui/shine-border";
import { useEngagementData } from "store/use-engagement-data";
import { Calculator, Calendar, CreditCard, Instagram, Linkedin, LucideArrowDown10, LucideArrowDownLeft, LucideArrowUpRight, LucideAudioWaveform, LucideAward, LucideBell, LucideCommand, LucideCopy, LucideFolder, LucideFolderOpen, LucideGauge, LucideGaugeCircle, LucideGlobeLock, LucideHeart, LucideHelpCircle, LucideHome, LucideInstagram, LucideLayoutDashboard, LucideMessageSquare, LucideMoreVertical, LucideMusic, LucidePlus, LucideSearch, LucideSend, LucideSettings, LucideSparkles, LucideTrash2, LucideTrendingUp, LucideYoutube, Settings, Smile, Twitter, User, Youtube } from "lucide-react";
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
import EQSCircle from "../assets/EQSCircle.jpg";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import instagramSVG from "../assets/instagram.svg";
import tiktokSVG from "../assets/tiktok.svg";
import youtubeSVG from "../assets/youtube.svg";
import { useSyncState } from "store/use-sync-state";
import CircularProgress from "./CircularProgress";
import { useYoutubeData } from "store/use-youtube-data";
import { SidebarTrigger } from "./ui/sidebar";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "./ui/command";
import { TabsList, TabsTrigger } from "./ui/tabs";
import YoutubeSvg from "../assets/youtube.svg"
import instagramSvg from "../assets/instagram.svg"
import NavbarLeftComponent from "./NavbarLeftComponent";
import InstagramStats from "./InstagramStats";
import YoutubeSection from "./YoutubeSection";
import YoutubeStats from "./YoutubeStats";
import InstagramContent from "./InstagramContent";
import YoutubeContent from "./YoutubeContent";

function HomeSection({ store}) {
    const { user } = useAuthStore();
    const [selected, setSelected] = useState("Instagram");
      
    const [open, setOpen] = useState(false)
    useEffect(() => {
      const down = (e) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }
   
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])

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
            
            <SidebarTrigger className=" md:hidden"/>
            <search className="flex md:min-w-80" onClick={() => setOpen(true)}>
            <div className="flex items-center flex-1 px-1 border rounded-full">
                <div className="text-gray-400 ">
                <LucideSearch className="h-5"/>
                </div>
                <Input
                type="search"
                placeholder="Search ..."
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center gap-1 px-2 py-1 mr-1 text-xs text-gray-400 bg-gray-100 rounded-lg ">
                  <LucideCommand className="h-3"/> K
                </div>
            </div>
            </search>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                <TabsList className="flex flex-col w-full p-0 text-black bg-white hover:text-black">
                  <CommandItem onSelect={()=>window.location.href="/canvas?id=create_new_design"}>
                    <div  className=" rounded-sm bg-[#fe5655]">
                        <LucidePlus size={10} fill="#fff"  color="#fff" className=''/>
                    </div>
                    <p className="text-sidebar-foreground Inter">
                    Open New Project
                    </p>
                  </CommandItem>
                  <TabsTrigger value="youtube" className="p-0 bg-white border-none text-black data-[state=active]:text-black data-[state=active]:drop-shadow-sm hover:bg-[#ffffff] hover:text-black">
                    <CommandItem className="w-full"><img src={YoutubeSvg} alt="youtube Logo" className="w-5"/>Open Youtube Analytics</CommandItem>
                  </TabsTrigger>
                  <TabsTrigger value="instagram" className="p-0 bg-white border-none text-black data-[state=active]:text-black data-[state=active]:drop-shadow-sm hover:bg-[#ffffff] hover:text-black">
                    <CommandItem className="w-full"><img src={instagramSvg} alt="Instagram Logo" className="w-5"/>Open Instagram Analytics</CommandItem>
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="p-0 bg-white border-none text-black data-[state=active]:text-black data-[state=active]:drop-shadow-sm hover:bg-[#ffffff] hover:text-black">
                    <CommandItem className="w-full"><LucideLayoutDashboard className="h-6"/>Open Templates</CommandItem>
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="p-0 bg-white border-none text-black data-[state=active]:text-black data-[state=active]:drop-shadow-sm hover:bg-[#ffffff] hover:text-black">
                    <CommandItem className="w-full"><LucideFolder className="h-6"/> Open Projects</CommandItem>
                  </TabsTrigger>
                  <CommandItem onSelect={()=>window.location.href="/faq"}>
                    <LucideHelpCircle className="h-6"/> Get Help
                  </CommandItem>
                  <CommandItem onSelect={()=>window.location.href="/terms"}>
                    <LucideAward className="h-6"/> Terms of Service
                  </CommandItem>
                  <CommandItem onSelect={()=>window.location.href="/privacy"}>
                    <LucideGlobeLock className="h-6"/> Privacy Policy
                  </CommandItem>
                  <TabsTrigger value="settings" className="p-0 bg-white border-none text-black data-[state=active]:text-black data-[state=active]:drop-shadow-sm hover:bg-[#ffffff] hover:text-black">
                    <CommandItem className="w-full"> <LucideSettings className="h-6 my-auto" /> Open Settings</CommandItem>
                  </TabsTrigger>
                </TabsList>
                </CommandGroup>
              </CommandList>
            </CommandDialog>
            <NavbarLeftComponent/>
            </header>
            <DashboardHeader title={"Explore Flashkit"} buttonText={"Explore Flashkit"} bottomSection={true}/>
            <div className="flex flex-col gap-10 p-2 max-md:p-0">
              <div className=" text-[#252C32] flex justify-between">
                <div>
                  <p className="text-2xl font-semibold ">Welcome back {user&&user.displayName&&user.displayName.split(" ")[0]}!</p>
                  <p className="text-base font-normal ">Your latest social media performance </p>
                </div>
                <Select value={selected} onValueChange={setSelected} className="w-[180px]">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Instagram"><span className="flex gap-2"><img src={instagramSvg} alt="Instagram Logo" className=""/>Instagram</span></SelectItem>
                        <SelectItem value="Youtube"><span className="flex gap-2"><img src={YoutubeSvg} alt="youtube Logo" className=""/>Youtube</span></SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              </div>
                {/* {localStorage.getItem("flashkitPlan") === "FLASHKITSOCIAL" ? 
                <> */}
                <div className="flex flex-wrap gap-2 max-md:flex-col">
                      <Card className="flex items-center justify-center drop-shadow-sm">
                          <CardContent className="flex flex-col gap-2 p-5 px-12 my-auto">
                              <Avatar className= "w-20 h-20 m-auto">
                              {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                              <AvatarImage src="https://github.com/shadcn.png" />
                              }
                              <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <span className="flex mx-auto text-xs font-semibold truncate">{user&&user.displayName ? user.displayName : ""}</span>
                              <div className="text-[#E1A100] bg-[#fdf5e1] text-center font-semibold flex pr-2 py-[2px] rounded-sm mx-auto"><LucideAward className="h-4 my-auto"/>Gold</div>
                          </CardContent>
                      </Card>
                      {
                        selected === "Instagram" ?
                      <InstagramStats className="flex-1"/>:
                       selected === "Youtube" ?
                       <YoutubeStats className="flex-1"/>:
                        <></>
                      }
                </div>
                <div className="">
                <ShineBorder
                  className="relative flex justify-between flex-1 w-full p-5 overflow-hidden border rounded-2xl bg-background md:shadow-md max-md:flex-col max-md:gap-4"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  borderWidth={2}
                >
                  <div className="flex flex-col mr-auto">
                    <p className="text-[#151212] mr-auto flex gap-1 font-semibold text-base"><LucideSparkles className="h-4 my-auto"/> AI Growth Insights</p>
                    <p className="text-[#252C32] text-base mr-auto">Post on Thursdays at 5-7 PM for better reach. Use hashtags like #Inspiration and #Style!</p>
                  </div>
                  <TabsList className="p-0 text-black bg-white shadow-none cursor-pointer hover:bg-none active:bg-none hover:text-black active:text-black active:shadow-none">
                  {selected==="Instagram" ?
                  <TabsTrigger value="instagram" className="p-0 cursor-pointer hover:text-black hover:shadow-none active:text-black active:shadow-none data-[state=active]:text-black data-[state=active]:drop-shadow-none">
                    <Button className="bg-[#409BFF] h-11">Discover More</Button>
                  </TabsTrigger>
                  : selected==="Youtube" ? 
                  <TabsTrigger value="youtube" className="p-0 cursor-pointer hover:text-black hover:shadow-none active:text-black active:shadow-none data-[state=active]:text-black data-[state=active]:drop-shadow-none">
                    <Button className="bg-[#409BFF] h-11">Discover More</Button>
                    </TabsTrigger>
                    : <></>}
                  </TabsList>
                </ShineBorder>
                </div>
                {/* <div className="grid grid-cols-[60%,40%] gap-6 bg-[#f6f8f9] rounded-xl border p-6">
                <MonthlyEngagementChart/>
                <div className="flex flex-col gap-4 p-6">
                    <p className="text-2xl font-semibold "> Choose account</p>
                    <RadioGroup defaultValue="option-one">
                        <div className="flex items-center justify-between p-3 space-x-2 text-black bg-white border rounded-xl">
                            <p className="font-medium"> All Socials</p>
                            <Label htmlFor="allSocials">All Socials</Label>
                            <RadioGroupItem value="allSocials" id="allSocials" />
                        </div>
                        <div className="flex items-center justify-between p-3 space-x-2 text-black bg-white border rounded-xl">
                            <p className="flex gap-1 font-medium"><img src={instagramSVG} alt="instagram svg" /> Instagram</p>
                            <Label htmlFor="instagram">Instagram</Label>
                            <RadioGroupItem value="instagram" id="instagram" />
                        </div>
                        <div className="flex items-center justify-between p-3 space-x-2 text-black bg-white border rounded-xl">
                            <p className="flex gap-1 font-medium"><img src={tiktokSVG} alt="tiktok svg" /> TikTok</p>
                            <Label htmlFor="tiktok">TikTok</Label>
                            <RadioGroupItem value="tiktok" id="tiktok" />
                        </div>
                        <div className="flex items-center justify-between p-3 space-x-2 text-black bg-white border rounded-xl">
                            <p className="flex gap-1 font-medium"><img src={youtubeSVG} alt="youtube svg" /> Youtube</p>
                            <Label htmlFor="youtube">Youtube</Label>
                            <RadioGroupItem value="youtube" id="youtube" />
                        </div>
                    </RadioGroup>
                </div>
                </div> */}
                {selected === "Instagram" ?
                <InstagramContent/>:
                selected === "Youtube" ?
                <YoutubeContent/>:
                <></>
                }
                <div className="">
                  <div className="flex flex-col justify-between mb-10">
                  <p className="mt-10 text-lg font-semibold ">Recent Projects</p>
                  </div>
                  <DashboardProjects store={store} />
                </div>
                {/* <div className="">
                  <p className="text-lg font-semibold">Templates for you</p>
                  <p className="mb-5 text-sm font-medium text-secondary">Choose a template and craft eye-catching stats</p>
                  <div className="flex gap-3">
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
    const { syncing } = useSyncState();
  
    useEffect(() => {
      loadDesigns();
    }, [project.cloudEnabled, project.designsLength,syncing]);
    return (
      <div className="flex flex-col flex-wrap">
        <div className="md:flex md:gap-2 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
          <Button
            variant="dotted"
            className="h-full px-10 py-8 aspect-square max-md:w-full max-md:px-2"
              onClick={async () => {
                window.location.href = `/canvas?id=create_new_design`;
              }}
            >
              <LucidePlus className="h-4 "/>Create new project
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
          className="mx-1 mb-auto fit-content w-fit group"
          onClick={() => {
            handleSelect();
          }}
        >
          <div className="overflow-hidden rounded-2xl">
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
            className="absolute top-1 right-1 "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
          <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="p-2 rounded-2xl bg-[#00000040] hover:bg-[#00000080] border hidden group-hover:block"><LucideMoreVertical className="h-4"/></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute mx-1 bg-white">
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
        
        <div className="mx-2 mt-3">
          <p className="text-xs font-semibold">{design.name}</p>
          <div className="flex justify-between">
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.split("T")[0]}</p>
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}</p>
          </div>
        </div>
        </div>
      );
    });

export default HomeSection;
