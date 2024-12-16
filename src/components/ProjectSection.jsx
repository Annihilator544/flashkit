import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import projectSvg from '../assets/project.svg'
import { useState } from "react";
import { LucideFilter, LucidePlus, LucideSearch } from "lucide-react"

const categories = [
    { label: "All" },
    { label: "Folders" },
    { label: "Design" },
  ]

function ProjectSection(){
    const [open, setOpen] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false)
    return (
        <>
            <div className="bg-gradient-to-r relative from-[#584eff] to-[#e365d7] stops-[#e185a9] p-8 rounded-lg mb-6 overflow-hidden">
              <h1 className="text-4xl font-semibold text-white mb-4">Projects</h1>
              <img src={projectSvg} alt="header" className="absolute right-5 -bottom-16 w-60 h-60" />
            </div>
            <div>
                <div className="flex items-center justify-between py-4 rounded-md">
                    <div className="relative flex flex-1 items-center">
                    <Input
                        type="search"
                        placeholder="Search Templates ..."
                        className="rounded-full w-1/2"
                    />
                    <div className="absolute right-[51%] text-gray-400">
                        <LucideSearch className="h-5"/>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild> */}
                        <Button variant="outline"><LucideFilter className="h-4 my-auto mr-2"/>Filters</Button>
                    {/* </PopoverTrigger>
                    <PopoverContent className="p-4 w-48">
                        <p>Filter options</p>
                    </PopoverContent>
                    </Popover> */}
                    <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <div  className=" p-[2px] rounded-sm bg-[#fe5655] mr-2 ">
                                    <LucidePlus size={14} fill="#fff"  color="#fff" className=''/>
                            </div>Add New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-4">
                        <DialogHeader>
                        <DialogTitle>Add New Template</DialogTitle>
                        </DialogHeader>
                        <p>Content for adding a new template.</p>
                    </DialogContent>
                    </Dialog>
                </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {categories.map((cat, i) => (
                        <Button key={i} variant="outline" className="whitespace-nowrap rounded-full">
                        {cat.icon && <span className="mr-1">{cat.icon}</span>}
                        {cat.label}
                        </Button>
                    ))}
                </div>
            </div>
            <p className=" text-3xl font-semibold">Projects</p>
              <div>
                <p className="text-lg font-semibold">Recent Projects for you</p>
                <p className="text-secondary font-medium text-sm mb-5">Choose a template and craft eye-catching stats</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  mediaKitData.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Bold</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  boldDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Minimal</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  minimalDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Classic</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  classicDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
            </>
    )
}

export default ProjectSection