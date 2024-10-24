import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideAward, LucideCircleUserRound, LucideFolderOpen, LucideGauge, LucideLayoutDashboard, LucideLogOut, LucideMoreHorizontal, LucidePieChart, LucidePlus, LucideSettings, LucideTrash2, LucideTvMinimalPlay, LucideUsersRound, Twitter, Youtube } from "lucide-react";
import React from "react";
import { useProject } from "plotNoFeatures/project";
import { observer } from "mobx-react-lite";
import * as api from "./plotNoFeatures/api";
import { Spinner } from "@blueprintjs/core";
import { Card } from "./components/ui/card";
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

function DashBoard({ store }) {
  const { data } = useYoutubeData();
  const { user, signOut } = useAuthStore();
  return (
    <>
      <div className="borber-b border-b-[1px] sticky top-0 bg-white z-50"><img src={logo} alt="logo" className=" aspect-video max-h-[8vh] mr-auto ml-4"/></div>
      <div className=" flex">
        <Tabs className="flex flex-1 " defaultValue="dashboard" >
          <TabsList className="flex flex-col p-3 gap-2 bg-[#f6f8f9] border-r rounded-none sticky top-Dashbord-calc">
              <p className="text-secondary Inter text-xs">Choose an social account</p>
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
              <SelectSeparator/>
              <TabsTrigger value="dashboard" className=""><LucideLayoutDashboard className="h-5"/> Dashboard</TabsTrigger>
              <TabsTrigger value="analytics" className=""><LucidePieChart className="h-5"/> Analytics</TabsTrigger>
              <TabsTrigger value="mediakit" className=""><LucideTvMinimalPlay className="h-5"/> Media Kit</TabsTrigger>
              <TabsTrigger value="profile" className=""><LucideCircleUserRound className="h-5"/> Profile</TabsTrigger>
              <TabsTrigger value="settings" className=""><LucideSettings className="h-5"/> Settings</TabsTrigger>
              <Button className="w-full mt-auto flex gap-2" onClick={signOut}>Logout <LucideLogOut className="h-4"/></Button>
          </TabsList>
          <TabsContent value="dashboard" className="flex-1 overflow-y-auto">
            <div>
              <div className="m-5  flex justify-around">
                  <div className="flex gap-4">
                      <Avatar className= "m-auto">
                      {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                        <AvatarImage src="https://github.com/shadcn.png" />
                      }
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="my-auto space-y-1">
                        <p className=" font-bold mt-2 text-center text-xl">@{user&&user.displayName ? user.displayName.replace(" ","") : "Set Up Profile"}</p>
                        <div className="flex justify-between">
                          <p className="text-[#6E7C87] font-medium text-sm">Profile Status</p>
                          <div className="text-[#E1A100] bg-[#fdf5e1] text-center font-semibold flex pr-2 py-[2px] rounded-sm"><LucideAward className="h-4 my-auto"/>Gold</div>
                        </div>
                      </div>
                  </div>
                <Separator orientation="vertical" className="mx-4"/>
                <div className=" flex flex-col gap-2">
                    <div className=" text-base font-semibold Inter flex gap-2"><LucideGauge className="h-5 my-auto"/> EQS Score</div>
                    <p className=" text-2xl font-semibold">79 %</p>
                    <div className="flex text-sm font-medium gap-1"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                </div>
                <Separator orientation="vertical" className="mx-4"/>
                <div className=" flex flex-col gap-2">
                    <div className=" text-base font-semibold Inter flex gap-2"><LucideUsersRound className="h-5 my-auto"/> Followers</div>
                    <p className=" text-2xl font-semibold">23000</p>
                    <div className="flex text-sm font-medium gap-1"><p className="text-[#FF9500]">-0.4%</p><p className="text-secondary"> than last week</p></div>
                </div>
                <Separator orientation="vertical" className="mx-4"/>
                <div className=" flex flex-col gap-2">
                    <div className=" text-base font-semibold Inter flex gap-2"><LucideUsersRound className="h-5 my-auto"/> Engagement</div>
                    <div className="flex text-sm font-medium gap-1"><p className=" text-2xl font-semibold">9.2</p><p className="text-secondary mt-auto mb-1"> / 10</p></div>
                    <div className="flex text-sm font-medium gap-1"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                </div>
              </div>
              <Separator className="mx-8"/>
              <div className="mx-5 my-5">
                  <div className="flex gap-4">
                   <InsightsChart/> 
                   <MonthlyEngagementChart/>
                  </div>
                <div className="justify-between flex flex-1 gap-5">
                <div>
                <p className=" text-lg font-semibold mt-10">Start Building</p>
                <p className="text-[#6E7C87] font-medium text-sm">Choose a template and craft eye-catching stats</p>
                </div>
                  <Button
                  variant="dotted"
                  className=" my-8 px-10 py-8 "
                    onClick={async () => {
                      window.location.href = `/canvas?id=create_new_design`;
                    }}
                  >
                    <LucidePlus className=" h-4"/>Create new project
                  </Button>
                </div>
                <DashboardProjects store={store} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="flex-1 p-4 gap-4">{ data && typeof data === 'object' && Object.keys(data).length > 0 ?
                  <div className="flex-1">
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
                  :<></>
                } 
          </TabsContent>
          <TabsContent value="mediakit" className="flex-1">Tab 4 content</TabsContent>
          <TabsContent value="profile" className="flex-1">Tab 5 content</TabsContent>
          <TabsContent value="settings" className="flex-1">
            <div className="m-5">
              <ConnectAccount/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
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

  React.useEffect(() => {
    loadDesigns();
  }, [project.cloudEnabled, project.designsLength]);
  return (
    <div className="flex flex-col flex-wrap">
      <div className="flex gap-5 flex-wrap">
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
        />
      ))}
      </div>
    </div>
  );});

  const DesignCard = observer(({ design, store, onDelete }) => {
    const [loading, setLoading] = React.useState(false);
    const [previewURL, setPreviewURL] = React.useState(design.previewURL);
  
    React.useEffect(() => {
      const load = async () => {
        const url = await api.getPreview({ id: design.id });
        setPreviewURL(url);
      };
      load();
    },[]);
  
    const handleSelect = async () => {
      setLoading(true);
      window.location.href = `/canvas?id=${design.id}`;
      setLoading(false);
    };
  
    return (
      <Card
        style={{  padding: '3px', position: 'relative' }}
        interactive
        className="fit-content w-fit mb-auto mx-1"
        onClick={() => {
          handleSelect();
        }}
      >
        <div className="rounded-lg overflow-hidden">
        <img src={previewURL} style={{ width: '100%' }} alt="url" />
        </div>
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '3px',
          }}
        >
          {design.name || 'Untitled'}
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
          <Button className="p-2"><LucideMoreHorizontal className="h-4"/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white mx-1">
          <DropdownMenuItem className="flex gap-2" onClick={() => {
                    handleSelect();
                  }}>
              <LucideFolderOpen className='h-4'/>Open
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2" onClick={() => {
                    if (window.confirm('Are you sure you want to delete it?')) {
                      onDelete({ id: design.id });
                    }
                  }}>
              <LucideTrash2 className='h-4'/>Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </Card>
    );
  });

export default DashBoard;