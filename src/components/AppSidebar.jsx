import {
    ChevronRight,
    LucideChevronsLeft,
    LucideCircleUserRound,
    LucideFileChartColumn,
    LucideFileSearch,
    LucideFileText,
    LucideFolder,
    LucideGem,
    LucideHelpCircle,
    LucideHome,
    LucideLayoutDashboard,
    LucidePieChart,
    LucidePlus,
  } from "lucide-react"
  
  import { NavUser } from "components/nav-user"
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarTrigger,
  } from "components/ui/sidebar"
import { TabsList, TabsTrigger } from "./ui/tabs"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible"
import { CollapsibleContent } from "@radix-ui/react-collapsible"
import { Badge } from "./ui/badge"
import logo from "../assets/logoNewMini.png"
import flashkit from "../assets/logoNew.png"
import flashkitPro from "../assets/flashkitPro.png"
import flashkitSocial from "../assets/flashkitSocial.png"
import YoutubeSvg from "../assets/youtube.svg"
import instagramSvg from "../assets/instagram.svg"
import { Link } from "react-router-dom"

  export function AppSidebar({
    ...props
  }) {
    return (
        <TabsList className=" bg-[#f6f8f9] border-r rounded-none sticky p-0">
            <Sidebar collapsible="icon" {...props}>
                {/* <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        className="data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground gap-0">
                        <div
                            className="flex aspect-square size-8 items-center group-data-[collapsible=icon]:justify-center justify-end rounded-lg text-sidebar-primary-foreground">
                            <img src={logo} alt="Logo" className="h-6" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
                            <img src={flashkit} alt="flashkit logo" className="h-8" />
                            : localStorage.getItem("flashkitPlan") === "FLASHKITSOCIAL" ?
                            <img src={flashkitSocial} alt="flashkit logo" className="h-8" />
                            : <img src={flashkitPro} alt="flashkit logo" className="h-8" /> }
                        </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                </SidebarHeader> */}
                <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        className="data-[state=open]:bg-sidebar-accent hover:bg-inherit data-[state=open]:text-sidebar-accent-foreground active:bg-inherit group-data-[collapsible=icon]:gap-0 gap-1 h-10 p-0 px-2">
                        <div
                            className="items-center hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center justify-end rounded-lg text-sidebar-primary-foreground">
                            <img src={logo} alt="Logo" className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                        </div>
                        <div className="flex justify-between flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden my-auto">
                             {/* {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
                            <img src={flashkit} alt="flashkit logo" className="h-5" />
                            : localStorage.getItem("flashkitPlan") === "FLASHKITSOCIAL" ?
                            <img src={flashkitSocial} alt="flashkit logo" className="h-5" />
                            : <img src={flashkitPro} alt="flashkit logo" className="h-5" /> } */}
                           <img src={flashkit} alt="flashkit logo" className="h-[18px] my-auto" />
                           <SidebarTrigger className="group-data-[collapsible=icon]:hidden max-md:hidden"/>
                        </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                        <TabsTrigger value="home" className="p-0 ">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <LucideHome className="h-6"/> <p className="text-sidebar-foreground">Home</p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                        <SidebarMenuItem className="">
                                <SidebarMenuButton onClick={()=>window.location.href="/canvas?id=create_new_design"}>
                                <div  className=" p-[2px] rounded-sm bg-[#004b8c]">
                                    <LucidePlus size={14} fill="#fff"  color="#fff" className=''/>
                                </div>
                                <p className="text-sidebar-foreground Inter">
                                Create New
                                </p>
                                </SidebarMenuButton>
                        </SidebarMenuItem> 
                        <TabsTrigger value="templates" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <LucideLayoutDashboard className="h-6"/> <p className="text-sidebar-foreground">Template Hub</p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                            <SidebarMenu>
                                <Collapsible
                                    asChild
                                    defaultOpen={false}
                                    className="group/collapsible">
                                    <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className=" font-normal">
                                        <LucideFileChartColumn className="h-6"/> <p className="text-sidebar-foreground Inter">Insights</p>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                        <TabsTrigger value="instagram" className="p-0">
                                            <SidebarMenuSubItem >
                                            <SidebarMenuSubButton asChild>
                                                <span><img src={instagramSvg} alt="Instagram Logo" className=""/>Instagram</span>
                                            </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TabsTrigger>
                                        </SidebarMenuSub>
                                        <SidebarMenuSub>
                                        <TabsTrigger value="youtube" className="p-0">
                                            <SidebarMenuSubItem >
                                            <SidebarMenuSubButton asChild>
                                                <span><img src={YoutubeSvg} alt="youtube Logo" className=""/>Youtube</span>
                                            </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TabsTrigger>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </SidebarMenu>
                        <TabsTrigger value="projects" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                <LucideFolder className="h-6"/> <p className="text-sidebar-foreground"> Projects</p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                            {/* { localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ?<SidebarMenuItem>
                                <SidebarMenuButton className="font-semibold" onClick={()=>window.location.href="/billing"}>
                                    <LucideGem className="h-5"/> Upgrade<Badge className="bg-[#ffeae9] text-[#F56B63] rounded-sm">Pro</Badge>
                                </SidebarMenuButton>
                            </SidebarMenuItem> 
                            : 
                            <></>} */}
                    </SidebarMenu>
                </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <Link to="/faq" className="p-0">
                        <SidebarMenuButton>
                        <LucideHelpCircle className="h-6 text-white" fill="#000"/> <p className="text-sidebar-foreground text-xs"> Need Help ?</p>
                        </SidebarMenuButton>
                    </Link>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </TabsList>
    );
  }
  