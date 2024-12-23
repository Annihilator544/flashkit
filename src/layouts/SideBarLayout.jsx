import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../components/AppSidebar"
import { Separator } from "../components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { LucideBell, LucideSearch, LucideSettings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { useAuthStore } from "store/use-auth-data"
import { Input } from "components/ui/input"
import logo from '../assets/logo.svg';
import { Link } from "react-router-dom"
 
export default function SidebarLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}