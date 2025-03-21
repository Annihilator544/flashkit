import { LucideArrowDownLeft, LucideArrowUpRight, LucideBell, LucideEqual, LucideHash, LucideHeart, LucideMessageSquare, LucidePlus, LucideSettings, LucideUsers } from "lucide-react";
import CircularProgress from "./CircularProgress";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { NavUser } from "./nav-user";
import sparkle from "../assets/sparkle.svg";
import triangle from "../assets/triangle.svg";
import instagramSvg from "../assets/instagram.svg"
import { useInstagramData } from "store/use-instagram-data";
import { useEffect, useState } from "react";
import countryNames from "../lib/InstagramCountries";
import DailyFollower from "./InstagramCharts/DailyFollowers";
import DailyImpressions from "./InstagramCharts/DailyImpressions";
import DailyReach from "./InstagramCharts/DailyReach";
import Demographics from "./InstagramCharts/Demographics";
import connectAccount from "../assets/connectAccount.svg"
import { Button } from "./ui/button";
import { TabsList, TabsTrigger } from "./ui/tabs";
import { SidebarTrigger } from "./ui/sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import Navbar from "./Navbar";
import NavbarLeftComponent from "./NavbarLeftComponent";
import InstagramStats from "./InstagramStats";

function formatDate(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleDateString("en-US", options).replace(",", "");
}

const labelMap = {
  profile_views: "Profile Views",
  accounts_engaged: "Accounts Engaged",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  saves: "Saves",
  replies: "Replies",
  follows_and_unfollows: "Follows & Unfollows",
  total_interactions: "Total Interactions",
};

function InstagramSection () {
    const { instagramData, instagramCalculatedData, instagramEQSText } = useInstagramData();

    const headingsMap = {
      "Follower Growth": {
        value: "follower-growth",
        iconType: "triangle",
      },
      "Engagement Rate": {
        value: "engagement-rate",
        iconType: "LucideEqual",
      },
      "Audience": {
        value: "audience",
        iconType: "LucideUsers",
      },
      "Content Insights": {
        value: "content-insights",
        iconType: "LucideHash",
      },
    };
    //remove the first 1. from the text
    const text = instagramEQSText??''.replace(/^\d+\.\s/, "");
    // Split the text by each insight section (look for lines like: "1. Some Heading")
    // This will give us an array of sections (each representing one block of insight data).
    const sections = text.split(/\n\d+\.\s/).map(s => s.trim()).filter(Boolean);
    // Parse each section to extract:
    // 1) heading  (e.g. "Follower Growth")
    // 2) subtitle (e.g. "Steady Upward Trajectory")
    // 3) bulletPoints (everything under "Insights:\n- ...")
    const parsedData = sections.map(section => {
      const lines = section.split("\n").map(line => line.trim()).filter(Boolean);
      // First line is the heading (e.g. "Follower Growth")
      const heading = lines[0];
      // Find the subtitle line (should start with "Subtitle:" according to the text format)
      const subtitleLine = lines.find(l => l.startsWith("Subtitle:"));
      const subtitle = subtitleLine ? subtitleLine.replace("Subtitle:", "").trim() : "";
  
      // Find where "Insights:" starts and gather bullet points after that
      const insightsIndex = lines.findIndex(l => l.startsWith("Insights:"));
      let bulletPoints = [];
      if (insightsIndex !== -1 && insightsIndex < lines.length - 1) {
        bulletPoints = lines
          .slice(insightsIndex + 1)
          .filter(l => l.startsWith("-"))
          .map(l => l.replace(/^-/, "").trim());
      }
  
      return { heading, subtitle, bulletPoints };
    });
  
    // Match each heading to our map and build final data
    const mappedData = parsedData.map(item => {
      const matchKey = Object.keys(headingsMap).find(h => h.toLowerCase() === item.heading.toLowerCase());
      if (!matchKey) return null;
  
      return {
        ...headingsMap[matchKey],
        heading: matchKey,
        subHeading: item.subtitle,
        bulletPoints: item.bulletPoints
      };
    }).filter(Boolean);

    return (
        <>
            <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2 max-md:justify-between">
            <SidebarTrigger className=" md:hidden"/>
                <NavbarLeftComponent />
            </header>
            {/* <div className={` rounded-lg mb-6 h-[140px] overflow-hidden relative`}>
                <img src={youtubeData.channel.brandingSettings.image.bannerExternalUrl} alt="youtube" className="absolute w-full center -translate-y-1/4"/>
                <h1 className="mb-4 text-3xl font-light text-black"></h1>
            </div> */}
            <div className={`bg-gradient-to-r from-[#fbbf2426] via-[#ec489926] to-[#8b5cf626] rounded-lg mb-6 p-8 h-[140px]`}>
                <h1 className="flex gap-2 mb-2 text-2xl font-light text-black"><img src={instagramSvg} alt="youtube" className="h-6 my-auto"/>Instagram Analytics</h1>
                <p className="text-base text-secondary">Uncover Key Insights to Boost Your Instagram Performance</p>
            </div>
            {localStorage.getItem("instagramAccessToken") 
            ?
            <div className="flex flex-col gap-10 p-2">
              <h1 className="text-2xl font-semibold">Insights</h1>
              <InstagramStats/>
              <div>
                <div className="flex flex-col flex-1 gap-4 mt-3">
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <DailyFollower/>
                    <DailyImpressions/>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <DailyReach />
                    <Demographics/>
                  </div>
                  <Card className="flex-1 bg-[#f6f8f9] rounded-lg shadow-md">
                    <CardHeader>
                      <p className="text-[#101010] font-semibold text-lg">Extra Metrics</p>
                      <p className="text-secondary">this week</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {Object.entries(instagramData.extraMetrics).map(([key, value], index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow"
                      >
                        <p className="text-sm text-gray-600">{labelMap[key]}</p>
                        <p className="text-xl font-bold text-gray-900">{value.thisWeek}</p>
                      </div>
                    ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Card className="flex-1 bg-[#f6f8f9] shadow-md">
                <CardHeader>
                  <p className="text-[#101010] font-semibold text-lg flex gap-1"><img src={sparkle} alt="sparkle" /> AI Growth Insights</p>
                  <p className="text-sm text-secondary ">Tailored tips to boost your YouTube growth.</p>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 max-md:grid-cols-1 ">
                {mappedData.map((item, index) => (
                    <Accordion type="single" collapsible key={index}>
                      <AccordionItem value={item.value} className="border-none">
                        <AccordionTrigger>
                          <div className="flex flex-row gap-2">
                            <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                              {item.iconType === "triangle" && <img src={triangle} alt="triangle" className="h-2" />}
                              {item.iconType === "LucideEqual" && <LucideEqual className="h-4 w-4 text-[#FF9500]" />}
                              {item.iconType === "LucideUsers" && <LucideUsers className="w-4 h-4" />}
                              {item.iconType === "LucideHash" && <LucideHash className="h-4 w-4 text-[#409BFF]" />}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-left text-secondary">{item.heading}</div>
                              <div className="text-sm font-semibold">{item.subHeading}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="mt-2 ml-4 text-gray-600 list-disc">
                            {item.bulletPoints.map((point, i) => <li key={i}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
              <Card className="flex-1 bg-[#f6f8f9] shadow-md">
                <CardHeader>
                  <p className="text-[#101010] font-semibold text-xl flex gap-1">Content Insights</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 p-4 text-sm font-semibold text-gray-700 border-b border-gray-300 bg-gray-50">
                    <div>Content</div>
                    <div className="text-center">Comments</div>
                    <div className="text-center">Likes</div>
                    <div className="text-center">Timestamp</div>
                  </div>

                  {instagramData.posts.filter((item) => item.media_type !== "VIDEO").slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="grid items-center grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.media_url}
                          alt={item.caption}
                          className="object-cover w-24 h-16 rounded-md"
                        />
                        <div className="max-md:hidden">
                          <p className="font-medium text-gray-900">{item.caption}</p>
                          <p className="text-sm text-gray-500">
                            <a
                              href={item.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View Post
                            </a>
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">{item.comments_count}</p>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">{item.like_count}</p>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {formatDate(new Date(item.timestamp))}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="flex-1 bg-[#f6f8f9] shadow-md">
                <CardHeader>
                  <p className="text-[#101010] font-semibold text-xl flex gap-1">Story Analytics</p>
                </CardHeader>
                {instagramData.stories.length ? 
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {instagramData.stories.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-0 h-[200px] bg-[#e3e3e3] justify-center flex overflow-hidden">
                                {item.media_type === "VIDEO" ? <img src={item.thumbnail_url} alt="Story Thumbnail" className="max-h-full my-auto "/> :
                                    <img src={item.media_url} alt="Story Thumbnail" className="max-h-full my-auto " />
                                }
                            </CardContent>
                              <CardFooter className="flex-col p-4 ">
                                  <p className="mr-auto text-xs text-gray-500 ">
                                  <a
                                    href={item.permalink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    View Story
                                  </a>
                                </p>
                                <p className=" text-secondary text-xs mr-auto mt-[6px]">{formatDate(new Date(item.timestamp))}</p>
                                <div className="flex w-full gap-3 mt-3 mr-auto max-w-56">
                                    <div className="flex gap-1 text-xs"><LucideHeart className="w-3 h-3 my-auto text-red-600" fill="red"/> <p>{item.like_count.toLocaleString()}</p></div>
                                    <div className="flex gap-1 text-xs"><LucideMessageSquare className="w-3 h-3 my-auto text-blue-500" fill="#409bff"/> <p>{item.comments_count.toLocaleString()}</p></div>
                                </div>
                            </CardFooter>
                        </Card>
                  ))}
                </CardContent>
                : <CardContent className="p-4 text-center text-secondary">No Stories found</CardContent>}
                </Card>
                <Card className="flex-1 bg-[#f6f8f9] shadow-md">
                <CardHeader>
                  <p className="text-[#101010] font-semibold text-xl flex gap-1">Reels Insights</p>
                </CardHeader>
                {instagramData.posts.filter((item) => item.media_type === "VIDEO").length ?
                <CardContent>
                  <div className="grid grid-cols-4 p-4 text-sm font-semibold text-gray-700 border-b border-gray-300 bg-gray-50">
                    <div>Content</div>
                    <div className="text-center">Comments</div>
                    <div className="text-center">Likes</div>
                    <div className="text-center">Timestamp</div>
                  </div>

                  {instagramData.posts.filter((item) => item.media_type === "VIDEO").slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="grid items-center grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <img src={item.thumbnail_url} alt="Story Thumbnail" className="max-h-full my-auto "/>
                        <div>
                          <p className="font-medium text-gray-900">{item.caption}</p>
                          <p className="text-sm text-gray-500">
                            <a
                              href={item.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View Post
                            </a>
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">{item.comments_count}</p>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">{item.like_count}</p>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {formatDate(new Date(item.timestamp))}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                : <CardContent className="p-4 text-center text-secondary">No Reels found</CardContent>}
              </Card>
            </div>
            :
            <div className="flex flex-col items-center justify-center flex-1 gap-4 ">
                <img src={connectAccount} alt="" className=" h-60" /> 
                <h1 className="text-2xl max-md:text-xl font-semibold">Connect Your Instagram Account</h1>
                <p className="text-center text-secondary">Get started by connecting your Instagram account to view insights.</p>
                <TabsList className="p-0 bg-white border-none">
                  <TabsTrigger value="settings" className="p-0 bg-white border-none">
                    <Button className=""><LucidePlus className="h-4 my-auto"/> Connect Instagram</Button>
                  </TabsTrigger>
                </TabsList>
            </div>
            }
    </>
    )
}

export default InstagramSection;
