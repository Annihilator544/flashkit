import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideChartLine, LucideChevronDown, LucideCircleHelp, LucideCircleUser, LucideCrown, LucideDelete, LucideFolderOpen, LucideLayoutDashboard, LucideLogIn, LucideLogOut, LucideMoreHorizontal, LucideMoreVertical, LucideTrash, LucideTrash2, LucideTvMinimalPlay, Slash, Twitter, Youtube } from "lucide-react";
import React from "react";
import { useProject } from "project";
import { observer } from "mobx-react-lite";
import * as api from "api";
import { MenuItem, Popover, Position, Spinner } from "@blueprintjs/core";
import { Menu } from "@blueprintjs/icons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import image from "./assets/image.png";
import PieChartDisplay from "Charts/PieChartDisplay";
import { AreaChartDisplay } from "Charts/AreaChartDisplay";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./components/ui/select";
import logo from "./assets/logo.png" 
import { Badge } from "./components/ui/badge";
import ConnectAccount from "./components/ConnectAccount";
import { YoutubeMonthly } from "Charts/YoutubeMonthly";
import { useYoutubeData } from "store/use-youtube-data";

function DashBoard({ store }) {
  const { data } = useYoutubeData();
  console.log(data);
  return (
    <div className="h-screen flex">
      <Tabs className="flex flex-1 " defaultValue="dashboard" >
        <TabsList className="flex flex-col p-3 gap-2 bg-white border-r rounded-none">
            <img src={logo} alt="logo" className=" aspect-video max-h-16 mx-auto"/>
            <Card className="w-40">
              <CardContent className="p-2">
                <div>
                  <Avatar className= "mx-auto">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className=" font-bold mt-2 text-center">Sara Patter</p>
                  <p className="text-yellow-400 text-center">Gold</p>
                </div>
                <SelectSeparator/>
                <div className="flex justify-between"><p className="font-semibold">This Week </p><LucideChevronDown className="h-4 my-auto"/></div>
                <div className="mt-2 text-muted-foreground"> EQS Score</div>
                <div className="flex justify-between"><p className="font-semibold">79% </p><Badge variant="success">+3.4%</Badge> </div>
              </CardContent>
            </Card>
            <TabsTrigger value="upgrade" className=""><LucideCrown/> Upgrade</TabsTrigger>
            <TabsTrigger value="dashboard" className=""><LucideLayoutDashboard/> Dashboard</TabsTrigger>
            <TabsTrigger value="analytics" className=""><LucideChartLine/> Analytics</TabsTrigger>
            <TabsTrigger value="mediakit" className=""><LucideTvMinimalPlay/> Media Kit</TabsTrigger>
            <TabsTrigger value="profile" className=""><LucideCircleUser/> Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="upgrade" className="flex-1">Tab 1 content</TabsContent>
        <TabsContent value="dashboard" className="flex-1 overflow-y-scroll">
          <div>
            <div className="h-14 flex justify-between px-5 border-b  mb-3">
            <Breadcrumb className= "my-auto">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  /
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  /
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Components</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            <div className="mx-5">
              <div className="flex gap-5 ">
              { data && typeof data === 'object' && Object.keys(data).length > 0 ?
                <>
                  <PieChartDisplay/>
                  <YoutubeMonthly/>
                </>
                :<></>
              } 
              </div>
              <DashboardProjects store={store} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="flex-1">Tab 3 content</TabsContent>
        <TabsContent value="mediakit" className="flex-1">Tab 4 content</TabsContent>
        <TabsContent value="profile" className="flex-1">
          <div className="m-5">
            <ConnectAccount/>
          </div>
        </TabsContent>
      </Tabs>
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

  React.useEffect(() => {
    loadDesigns();
  }, [project.cloudEnabled, project.designsLength]);
  return (
    <div className="flex flex-col flex-wrap">
      <Button
      className=" my-8"
        onClick={async () => {
          window.location.href = `/canvas?id=create_new_design`;
        }}
      >
        Create new design
      </Button>
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
    }, []);
  
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
        <img src={previewURL} style={{ width: '100%' }} />
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