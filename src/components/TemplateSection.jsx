import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { Input } from "./ui/input";
import { LucideBadgeAlert, LucideBell, LucideFlame, LucideSearch, LucideSettings, LucideStar } from "lucide-react";
import { Button } from "./ui/button";
import TemplateCard from "./TemplateCard";
import S3FileManager from "./S3MarketPlace";
import { NavUser } from "./nav-user";
import { Card } from "@blueprintjs/core";
import { CarouselPrevious, CarouselNext, Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

function TemplateSection({ store }) {
    const [mediaKitData, setMediaKitData] = useState([]);
    const [boldDesigns, setBoldDesigns] = useState([]);
    const [minimalDesigns, setMinimalDesigns] = useState([]);
    const [classicDesigns, setClassicDesigns] = useState([]);
    
    const categories = [
      { label: "Starred", icon: <LucideStar className="h-4" fill="#FFC02D" stroke="#FFC02D" /> },
      { label: "New!", icon: <LucideBadgeAlert className="h-5" fill={"#89D0F7"} stroke="#fff"/> },
      { label: "Trending!", icon: <LucideFlame className="h-4" fill={"#FE5655"} stroke="#FE5655" /> },
      { label: "All" },
      { label: "Media Kit" },
      { label: "Marketing" },
      { label: "Social Media" },
    ]

    const choose = [
        "Documents",
        "Media Kit",
        "Instagram",
        "Facebook",
        "YouTube",
        "Invitations",
    ]
    
    async function getDesignTemplates() {
        try{
        await fetch("https://api.polotno.com/api/get-templates?size=1080x1080&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res) =>res.json()).then((res) => {
          setMediaKitData(res.items);
        });
        await fetch("https://api.polotno.com/api/get-templates?size=851x315&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res) =>res.json()).then((res) => {
          setBoldDesigns(res.items);
        });
        await fetch("https://api.polotno.com/api/get-templates?size=1080x1920&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res) =>res.json()).then((res) => {
          setMinimalDesigns(res.items);
        });
        await fetch("https://api.polotno.com/api/get-templates?size=1280x720&query=&per_page=10&page=1&KEY=iRIwFHCuH539pYGokN6n").then((res)=>res.json()).then((res) => {
          setClassicDesigns(res.items);
        });
      }
        catch(e){
          console.log(e);
        }
      }
      useEffect(() => {
        getDesignTemplates();
      }, []);
  return (
    <>
        <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2">
            <div className="flex gap-3">
                <LucideSettings className="h-5 my-auto" />
                <LucideBell className="h-5 my-auto" />
                <NavUser/>
            </div>
        </header>
        <DashboardHeader title={"Design Stunning Content Effortlessly!"} buttonText={"Explore Templates"} bottomSection={false}/>
        <div className="p-2 flex-col flex gap-10">
            <div className="flex gap-2">
                <search className=" min-w-80 flex">
                <div className="flex flex-1 items-center border rounded-full px-1">
                    <div className=" text-gray-400">
                    <LucideSearch className="h-5"/>
                    </div>
                    <Input
                    type="search"
                    placeholder="Search ..."
                    className=" border-none focus:outline-none focus:ring-0 bg-transparent w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                </search>
                {categories.map((cat, i) => (
                <Button key={i} variant="outline" className="whitespace-nowrap rounded-full">
                    {cat.icon && <span className="mr-1">{cat.icon}</span>}
                    {cat.label}
                </Button>
                ))}
            </div>
            <div>
                <p className="text-lg font-semibold">Choose your category</p>
                <div className="flex justify-between gap-3 px-4 mt-5">
                {
                  choose.map((item)=>(
                    <div className="p-2 bg-gray-100 rounded-lg border flex flex-col gap-2 align-middle ">
                        <div className=" rounded-lg h-20 w-40 flex items-center justify-center bg-cover">
                            <img src="https://images.unsplash.com/photo-1729761137674-9a3a841f7cea" className="h-full w-full object-cover rounded-lg" alt="category"/>
                        </div>
                        <p className="mx-auto">{item}</p>
                    </div>
                  ))
                }
                </div>
            </div>
              <div className="max-w-[80vw]">
                <p className="text-lg font-semibold mb-5">Trending Templates</p>
                <Carousel>
                    <CarouselContent>
                        {
                        mediaKitData.map((item,index)=>{
                            return(
                            <CarouselItem className="basis-[180px]" key={index}>
                                <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                            </CarouselItem>
                            )
                        })
                        }
                    </CarouselContent>
                    <CarouselPrevious variant="outline" className="absolute -left-5 top-1/2 -translate-y-1/2" />
                    <CarouselNext variant="outline" className="absolute -right-5 top-1/2 -translate-y-1/2"/>
                </Carousel>
              </div>
              {/* <div>
                <div className="flex justify-between">
                    <p className="text-lg font-semibold mb-5">MarketPlace</p>
                    <p className=" text-[#409BFF] font-medium">See More</p>
                </div>
                <S3FileManager store={store}/>
              </div> */}
              {/* <div>
                <div className="flex justify-between">
                    <p className="text-lg font-semibold mb-5">Youtube Templates</p>
                    <p className=" text-[#409BFF] font-medium">See More</p>
                </div>
                <div className="flex flex-wrap gap-3">
                {
                  boldDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div> */}
              <div>
                <div className="flex justify-between">
                    <p className="text-lg font-semibold mb-5">Instagram Stories</p>
                    <p className=" text-[#409BFF] font-medium">See More</p>
                </div>
                <div className="flex flex-wrap gap-3">
                {
                  minimalDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                    <p className="text-lg font-semibold mb-5">Youtube Templates</p>
                    <p className=" text-[#409BFF] font-medium">See More</p>
                </div>
                <div className="flex flex-wrap gap-3">
                {
                  classicDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                }
                </div>
              </div>
        </div>
    </>
  );
}

export default TemplateSection;