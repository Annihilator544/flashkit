import {
    ChevronRight,
    LucideCircleUserRound,
    LucideDiamond,
    LucideGem,
    LucideHome,
    LucideLayoutDashboard,
    LucidePieChart,
    LucideScroll,
    LucideTvMinimalPlay,
  } from "lucide-react"
  
  import { NavUser } from "components/nav-user"
  import { TeamSwitcher } from "components/team-switcher"
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
  } from "components/ui/sidebar"
import { TabsList, TabsTrigger } from "./ui/tabs"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible"
import { CollapsibleContent } from "@radix-ui/react-collapsible"
import { Badge } from "./ui/badge"

  export function AppSidebar({
    ...props
  }) {
    return (
        <TabsList className=" bg-[#f6f8f9] border-r rounded-none sticky p-0">
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                <TeamSwitcher />
                </SidebarHeader>
                <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <TabsTrigger value="home" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <LucideHome className="h-5"/> Home
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <LucideLayoutDashboard className="h-5"/> Templates
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                            <SidebarMenu>
                                <Collapsible
                                    asChild
                                    defaultOpen={true}
                                    className="group/collapsible">
                                    <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className=" font-semibold">
                                        <LucidePieChart className="h-5"/> Analytics
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                        <TabsTrigger value="instagram" className="p-0">
                                            <SidebarMenuSubItem >
                                            <SidebarMenuSubButton asChild>
                                                <span>Instagram</span>
                                            </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TabsTrigger>
                                        </SidebarMenuSub>
                                        <SidebarMenuSub>
                                        <TabsTrigger value="twitter" className="p-0">
                                            <SidebarMenuSubItem >
                                            <SidebarMenuSubButton asChild>
                                                <span>Twitter</span>
                                            </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TabsTrigger>
                                        </SidebarMenuSub>
                                        <SidebarMenuSub>
                                        <TabsTrigger value="youtube" className="p-0">
                                            <SidebarMenuSubItem >
                                            <SidebarMenuSubButton asChild>
                                                <span>Youtube</span>
                                            </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TabsTrigger>
                                        </SidebarMenuSub>
                                        <SidebarMenuSub>
                                        <TabsTrigger value="linkedIn" className="p-0">
                                            <SidebarMenuSubItem >
                                            <SidebarMenuSubButton asChild>
                                                <span>LinkedIn</span>
                                            </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TabsTrigger>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </SidebarMenu>
                        <TabsTrigger value="mediakit" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                <LucideTvMinimalPlay className="h-5"/> Media Kit
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                <LucideScroll className="h-5"/> Projects
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="p-0">
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                <LucideCircleUserRound className="h-5"/> Profile
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TabsTrigger>
                            { localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ?<SidebarMenuItem>
                                <SidebarMenuButton className="font-semibold" onClick={()=>window.location.href="/billing"}>
                                    <LucideGem className="h-5"/> Upgrade to <Badge className="bg-[#ffeae9] text-[#F56B63] rounded-sm">Pro</Badge>
                                </SidebarMenuButton>
                            </SidebarMenuItem> 
                            : 
                            <></>}
                    </SidebarMenu>
                </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </TabsList>
    );
  }
  