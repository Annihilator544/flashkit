import { LucideBell, LucideBellDot, LucideSettings } from "lucide-react";
import { NavUser } from "./nav-user";
import { TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "../hooks/use-toast";

function NavbarLeftComponent() {
  const { toasts } = useToast()
  
  return (
    <div className="flex gap-3 ml-auto">
        <TabsList className="p-0 text-black bg-white shadow-none cursor-pointer hover:bg-none active:bg-none hover:text-black active:text-black active:shadow-none">
            <TabsTrigger value="settings" className="p-0 cursor-pointer hover:text-black hover:shadow-none active:text-black active:shadow-none data-[state=active]:text-black data-[state=active]:drop-shadow-none">
                <LucideSettings className="h-5 my-auto" />
            </TabsTrigger>
        </TabsList>
        <Popover>
            <PopoverTrigger>
                {toasts.length ? <LucideBellDot className="h-5 my-auto"/>:<LucideBell className="h-5 my-auto" />}
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-4 w-96">
                {toasts.map(function ({ id, title, description, action, ...props }) {   
                    return (
                        <div key={id} className="grid gap-1 p-3 border rounded-2xl">
                            {title && <h4 className="font-semibold">{title}</h4>}
                            {description && <p>{description}</p>}
                        </div>
                    );
                })}
            </PopoverContent>
        </Popover>
        <NavUser/>
    </div>
  );
}

export default NavbarLeftComponent;
