"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LucideChevronDown,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "components/ui/sidebar"
import { useAuthStore } from "store/use-auth-data"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, signOut } = useAuthStore();
  return (
    (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex gap-2">
              <Avatar className="h-8 w-8 rounded-full">
                    {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                        <AvatarImage src="https://github.com/shadcn.png" />
                      }
                        <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs font-semibold flex">{user&&user.displayName ? user.displayName : ""} <LucideChevronDown className="m-auto h-3"/></span>
                <span className="truncate text-secondary text-xs">{user&&user.email ? user.email : ""}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                      {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                        <AvatarImage src="https://github.com/shadcn.png" />
                      }
                        <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user&&user.displayName ? user.displayName : ""}</span>
                  <span className="truncate text-xs">{user&&user.email ? user.email : ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
            {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
              <DropdownMenuItem>
                <Sparkles className="h-4" />
                Upgrade to Pro
              </DropdownMenuItem>
              : localStorage.getItem("flashkitPlan") === "FLASHKITPRO" ?
              <DropdownMenuItem>
                <Sparkles className="h-4" />
                Upgrade to Social
              </DropdownMenuItem>
              : <DropdownMenuItem>
                <Sparkles className="h-4" />
                Social
              </DropdownMenuItem>}
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={()=>window.location.href="/account"}>
                <BadgeCheck className="h-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>window.location.href="/billing"}>
                <CreditCard className="h-4" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>signOut()}>
              <LogOut className="h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>)
  );
}
