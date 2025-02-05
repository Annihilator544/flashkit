import React, { use, useEffect, useState } from "react";
import { useYoutubeData } from "store/use-youtube-data";
import BarChartDisplay from "./charts/BarChartDisplay";
import { InsightsChart } from "./charts/InsightsChart";
import LineChartDisplay from "./charts/LineChartDisplay";
import { MonthlyEngagementChart } from "./charts/MonthlyEngagementChart";
import PieChartDisplay from "./charts/PieChartDisplay";
import RadarChartDisplay from "./charts/RadarChartDisplay";
import RadialChartDisplay from "./charts/RadialChartDisplay";
import { YoutubeMonthly } from "./charts/YoutubeMonthly";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideArrowBigDown, LucideArrowDownLeft, LucideArrowUpRight, LucideBell, LucideEqual, LucideHash, LucideMessageSquare, LucidePlus, LucideSettings, LucideSparkles, LucideTrendingDown, LucideUser, LucideUsers } from "lucide-react";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";
import youtubeSvg from "../assets/youtube.svg"
import CircularProgress from "./CircularProgress";
import { Separator } from "./ui/separator";
import DailyViewsYoutube from "./YoutubeCharts/DailyViews";
import DialySubscribedUnsubscribed from "./YoutubeCharts/DailySubscribedUnsubscribed";
import DailySubscribersYoutube from "./YoutubeCharts/DailySubscribers";
import DailyLikeShareDislikeYoutube from "./YoutubeCharts/DailyLikeShareDislike";
import DailyWatchMetrics from "./YoutubeCharts/DailyWatchMetrics";
import DailyCommentsYoutube from "./YoutubeCharts/DailyComments";
import sparkle from "../assets/sparkle.svg";
import triangle from "../assets/triangle.svg";
import axios from "axios";
import { useAuthStore } from "store/use-auth-data";
import { useCallback } from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { TabsList, TabsTrigger } from "./ui/tabs";
import connectAccount from "../assets/connectAccount.svg"
import { SidebarTrigger } from "./ui/sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import NavbarLeftComponent from "./NavbarLeftComponent";
import YoutubeStats from "./YoutubeStats";


function YoutubeSection () {
    const { youtubeData, youtubeCalculatedData, eqsText } = useYoutubeData();
    const [videos, setVideos] = useState([]);
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
    const text = eqsText.replace(/^\d+\.\s/, "");
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

    const getRecentVideos = async ( channelResponse ) => {
      const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
      try {
        const uploadPlaylistId =
          channelResponse.contentDetails.relatedPlaylists.uploads;
    
        // Step 2: Get Videos from the Upload Playlist
        const playlistResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=5&key=${API_KEY}`
        );
    
        const videoIds = playlistResponse.data.items.map(
          (item) => item.snippet.resourceId.videoId
        );
    
        // Step 3: Fetch Video Statistics
        const videoResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(",")}&key=${API_KEY}`
        );
    
        const videos = videoResponse.data.items.map((video) => ({
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          thumbnails: video.snippet.thumbnails,
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          commentCount: video.statistics.commentCount,
        }));
        setVideos(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    //sum of views this week , youtube.daily is an object with keys as dates and values as views
    useEffect(() => {
      // round to 2 decimal places
    if(Object.keys(youtubeData).length){
      getRecentVideos( youtubeData.channel )
    }
    }, []);

  return (
    <>
            <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2 max-md:justify-between">
            <SidebarTrigger className=" md:hidden"/>
                <NavbarLeftComponent/>
            </header>
            {/* <div className={` rounded-lg mb-6 h-[140px] overflow-hidden relative`}>
                <img src={youtubeData.channel.brandingSettings.image.bannerExternalUrl} alt="youtube" className="absolute w-full center -translate-y-1/4"/>
                <h1 className="mb-4 text-3xl font-light text-black"></h1>
            </div> */}
            <div className={`bg-gradient-to-r from-[#FF003308] to-[#FF00331F] rounded-lg mb-6 p-8 h-[140px]`}>
                <h1 className="flex gap-2 mb-2 text-2xl font-light text-black"><img src={youtubeSvg} alt="youtube" className="h-6 my-auto"/>Youtube Analytics</h1>
                <p className="text-base text-secondary">Uncover Key Insights to Boost Your Youtube Performance</p>
            </div>
            {!localStorage.getItem("youtubeAccessToken")
            ?
            <div className="flex flex-col gap-10 p-2">
              <h1 className="text-2xl font-semibold">Insights</h1>
              <YoutubeStats/>
              <div>
                <div className="flex flex-col flex-1 gap-4 mt-3">
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <DailyWatchMetrics youtubeData={youtubeData}/>
                    <DialySubscribedUnsubscribed youtubeData={youtubeData} percentageChangeViews={youtubeCalculatedData.percentageChangeViews}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <DailyLikeShareDislikeYoutube youtubeData={youtubeData}/>
                    <DailyCommentsYoutube youtubeData={youtubeData} percentageChangeSubscribers={youtubeCalculatedData.percentageChangeSubscribers}/>
                  </div>
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
                    <div className="text-center">Views</div>
                  </div>

                  {/* Table Rows */}
                  {videos.map((video,index) => (
                    <div
                      key={index}
                      className="grid items-center grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-gray-100"
                    >
                      {/* Content Section */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={video.thumbnails.default.url}
                          alt={video.title}
                          className="object-cover w-24 h-16 rounded-md"
                        />
                        <div className="max-md:hidden">
                          <p className="font-medium text-gray-900">{video.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(video.publishedAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Average View Duration */}
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{video.commentCount}</p>
                      </div>

                      <div className="text-center">
                        <p className="font-medium text-gray-900">{video.likeCount}</p>
                      </div>

                      {/* Views */}
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{video.viewCount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
              </Card>
            </div>
            :
            <div className="flex flex-col items-center justify-center flex-1 gap-4 ">
                <img src={connectAccount} alt="" className=" h-60" /> 
                <h1 className="text-2xl font-semibold">Connect Your Youtube Account</h1>
                <p className="text-center text-secondary">Get started by connecting your Youtube account to view insights.</p>
                <TabsList className="p-0 bg-white border-none">
                  <TabsTrigger value="settings" className="p-0 bg-white border-none">
                    <Button className=""><LucidePlus className="h-4 my-auto"/> Connect Youtube</Button>
                  </TabsTrigger>
                </TabsList>
            </div>
            }
    </>
  );
}

export default YoutubeSection;
