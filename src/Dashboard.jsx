import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideChartLine, LucideCircleHelp, LucideCircleUser, LucideCrown, LucideDelete, LucideFolderOpen, LucideLayoutDashboard, LucideLogIn, LucideLogOut, LucideMoreHorizontal, LucideMoreVertical, LucideTrash, LucideTrash2, LucideTvMinimalPlay, Slash, Twitter, Youtube } from "lucide-react";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./components/ui/select";

function DashBoard({ store }) {
  return (
    <div className="h-screen flex">
      <Tabs className="flex flex-1 " defaultValue="2" >
        <TabsList className="flex flex-col p-3 gap-2">
            <TabsTrigger value="1" className="aspect-square"><LucideCrown/></TabsTrigger>
            <TabsTrigger value="2" className="aspect-square"><LucideLayoutDashboard/></TabsTrigger>
            <TabsTrigger value="3" className="aspect-square"><LucideChartLine/></TabsTrigger>
            <TabsTrigger value="4" className="aspect-square"><LucideTvMinimalPlay/></TabsTrigger>
            <TabsTrigger value="5" className="aspect-square"><LucideCircleUser/></TabsTrigger>
            <TabsTrigger value="6" className=" mt-auto aspect-square"><LucideCircleHelp/></TabsTrigger>
            <TabsTrigger value="7" className="aspect-square"><LucideLogOut/></TabsTrigger>
        </TabsList>
        <TabsContent value="1" className="flex-1">Tab 1 content</TabsContent>
        <TabsContent value="2" className="flex-1 overflow-y-scroll">
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
            <Avatar className= "my-auto">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </div>
            <div className="mx-5">
              <div className="flex gap-5 ">
                <PieChartDisplay/>
                <AreaChartDisplay/>
                <Card className="mb-auto">
                  <CardHeader>
                    <CardTitle>Social Accounts</CardTitle>
                    <CardDescription>Choose a Social Account to Connect</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="gap-2">Connect <LucideLogIn className="h-5"/></Button>
                  </CardFooter>
                </Card>
              </div>
              <DashboardProjects store={store} />
            </div>
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