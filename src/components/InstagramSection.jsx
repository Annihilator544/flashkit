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

const calculateFollowersChange = (data) => {
  const date = new Date(new Date().getTime() -  1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const pastWeek = new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const followersToday = data.daily[date]?.follower_count || 0;
  const followersLastWeek = data.daily[pastWeek]?.follower_count || 0;
  const followersChange = followersToday - followersLastWeek;
  const percentageChange = ((followersChange / followersLastWeek) * 100).toFixed(2);
  return percentageChange;
};

function calculateTotalImpressions(data, days) {
  let totalImpressions = 0;
  for (let i = 1; i <= days; i++) {
    const day = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    totalImpressions += data.daily[day]?.impressions || 0;
  }
  return totalImpressions;
}

function calculateTotalReach(data, days) {
  let totalReach = 0;
  for (let i = 1; i <= days; i++) {
    const day = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    totalReach += data.daily[day]?.reach || 0;
  }
  return totalReach;
} 

function calculateTopCountry(data) {
  let maxCountryCode = null;
  let maxTotal = 0;
  
  for (const [countryCode, stats] of Object.entries(data)) {
    const total = stats.engaged_audience_demographics + stats.reached_audience_demographics + stats.follower_demographics;
    if (total > maxTotal) {
      maxTotal = total;
      maxCountryCode = countryCode;
    }
  }
  
  const maxCountryName = countryNames[maxCountryCode];
  return maxCountryName;
}

function InstagramSection (){
    const { instagramData } = useInstagramData();

    const [ instagramCalculatedData, setInstagramCalculatedData ] = useState({
        percentageChangeFollowers: 0,
        totalImpressions: 0,
        percentageChangeImpressions: 0,
        totalReach: 0,
        percentageChangeReach: 0,
        topCountry: '',
        numberOfDaysOfData: 0
    });
    useEffect(() => {
    const percentageChangeFollowers = calculateFollowersChange(instagramData);
    const totalImpressions = calculateTotalImpressions(instagramData, 7);
    const totalImpressionsLastWeek = calculateTotalImpressions(instagramData, 14);
    const percentageChangeImpressions = totalImpressionsLastWeek ? (((totalImpressions - totalImpressionsLastWeek) / totalImpressionsLastWeek) * 100).toFixed(2) : 0;
    const totalReach = calculateTotalReach(instagramData, 7);
    const totalReachLastWeek = calculateTotalReach(instagramData, 14);
    const percentageChangeReach = totalReachLastWeek ? (((totalReach - totalReachLastWeek) / totalReachLastWeek) * 100).toFixed(2) : 0;
    const topCountry = calculateTopCountry(instagramData.demographicData);
    const numberOfDaysOfData = Object.keys(instagramData.daily).length;
    
    setInstagramCalculatedData({
        totalImpressions,
        totalReach,
        percentageChangeReach,
        percentageChangeImpressions,
        percentageChangeFollowers,
        topCountry,
        numberOfDaysOfData
    });
    },[instagramData]);
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
              <Card>
                <CardContent className="flex flex-row gap-4 p-4 max-md:flex-col">
                  <div className="flex flex-col gap-2 max-md:justify-center max-md:items-center">
                    <CircularProgress currentScore={79} startColor="#BD65F6" endColor="#FEB559" />
                    <div className="flex gap-1 mx-auto text-sm font-medium"><p className="text-[#34C759] flex">+20%<LucideArrowUpRight className="w-4 h-4 mt-auto"/></p><p className="text-secondary"> than last week</p></div>
                  </div>
                  <Separator orientation="vertical" className="max-md:hidden"/>
                  <Separator orientation="horizontal" className="md:hidden"/>
                  <div className="flex md:flex-1">
                    <div className="flex flex-col flex-1 gap-2 ">
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Followers</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{instagramData.userData.followers_count}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${instagramCalculatedData.percentageChangeFollowers > 0 ? "text-[#34C759]": instagramCalculatedData.percentageChangeFollowers === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramCalculatedData.percentageChangeFollowers}% {instagramCalculatedData.percentageChangeFollowers > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramCalculatedData.percentageChangeFollowers === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Impressions</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{instagramCalculatedData.totalImpressions}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${instagramCalculatedData.percentageChangeImpressions > 0 ? "text-[#34C759]": instagramCalculatedData.percentageChangeImpressions === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramCalculatedData.percentageChangeImpressions}%{instagramCalculatedData.percentageChangeImpressions > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramCalculatedData.percentageChangeImpressions === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        </div>
                        <Separator orientation="vertical"/>
                        <div className="flex flex-col flex-1 gap-2">
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Reach</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{instagramCalculatedData.totalReach}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${instagramCalculatedData.percentageChangeReach > 0 ? "text-[#34C759]": instagramCalculatedData.percentageChangeReach === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramCalculatedData.percentageChangeReach}%{instagramCalculatedData.percentageChangeReach > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramCalculatedData.percentageChangeReach === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Top Country</div>
                            <p className="my-auto text-3xl font-semibold ">{instagramCalculatedData.topCountry}</p>
                            </CardContent>
                        </Card>
                  </div>
                  </div>
                </CardContent>
              </Card>
              <div>
                <div className="flex flex-col flex-1 gap-4 mt-3">
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <DailyFollower followerData={instagramData.daily} percentageChangeFollowers={instagramCalculatedData.percentageChangeFollowers} numberOfDaysOfData={instagramCalculatedData.numberOfDaysOfData}/>
                    <DailyImpressions impressionsData={instagramData.daily} percentageChangeImpressions={instagramCalculatedData.percentageChangeImpressions} numberOfDaysOfData={instagramCalculatedData.numberOfDaysOfData}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <DailyReach reachData={instagramData.daily} percentageChangeReach={instagramCalculatedData.percentageChangeReach} numberOfDaysOfData={instagramCalculatedData.numberOfDaysOfData}/>
                    <Demographics demographicData={instagramData.demographicData}/>
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
                <Accordion type="single" collapsible >
                  <AccordionItem value="follower-growth" className="border-none ">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                          <img src={triangle} alt="triangle" className="h-2" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-left text-secondary">Follower Growth</div>
                          <div className="text-sm font-semibold">Growth is down this week</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 ml-4 text-gray-600 list-disc">
                        <li>Post 3 videos per week targeting high-performing topics</li>
                        <li>Optimize thumbnails and titles for higher click-through rates</li>
                        <li>Collaborate with influencers in your niche</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="engagement-rate" className="border-none ">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                          <LucideEqual className="h-4 w-4 text-[#FF9500]" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-left text-secondary">Engagement Rate</div>
                          <div className="text-sm font-semibold">Engagement is steady</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 ml-4 text-gray-600 list-disc">
                        <li>Host a Q&A or create polls to boost interaction</li>
                        <li>Reply to at least 50% of comments within 24 hours</li>
                        <li>Add clear CTAs in your videos and descriptions</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="audience-age"  className="border-none ">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                          <LucideUsers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-left text-secondary">Audience Age</div>
                          <div className="text-sm font-semibold">Younger viewers dominating</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 ml-4 text-gray-600 list-disc">
                        <li>Create fast-paced content tailored for younger viewers</li>
                        <li>Use trending memes to make your videos relatable</li>
                        <li>Promote videos on Instagram and TikTok for broader reach</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="trending-content-insights" className="border-none ">
                    <AccordionTrigger>
                      <div className="flex flex-row gap-2">
                        <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                          <LucideHash className="h-4 w-4 text-[#409BFF]" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-left text-secondary">Trending Content Insights</div>
                          <div className="text-sm font-semibold">Try new topics</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 ml-4 text-gray-600 list-disc">
                        <li>Make videos on trending topics relevant to your niche</li>
                        <li>Use trending hashtags and optimized tags for better visibility</li>
                        <li>Include "reaction" or "how-to" themes tied to the trends</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
                <h1 className="text-2xl font-semibold">Connect Your Instagram Account</h1>
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
