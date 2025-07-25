import { Home, MapPin, Heart, User, MessageCircle } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Find Sitters", url: "/sitters", icon: MapPin },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Messages", url: "/messages", icon: MessageCircle },
  { title: "Profile", url: "/profile", icon: User },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"

  return (
    <Sidebar
      className={open ? "w-64" : "w-16"}
      collapsible="icon"
    >
      <SidebarContent className="pt-8">
        <div className="px-4 mb-6">
          {open && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                PetSitter
              </span>
            </div>
          )}
          {!open && (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Heart className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}