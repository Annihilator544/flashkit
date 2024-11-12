import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "components/ui/sidebar"
import logo from "../assets/logo.png"
import flashKit from "../assets/flashkit.png"

export function TeamSwitcher() {
  return (
    (<SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div
            className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <img src={logo} alt="Logo" className="h-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <img src={flashKit} alt="flashkit logo" className="h-8" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
