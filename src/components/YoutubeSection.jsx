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
import { LucideArrowBigDown, LucideArrowDownLeft, LucideArrowUpRight, LucideBell, LucideEqual, LucideHash, LucideMessageSquare, LucideSettings, LucideSparkles, LucideTrendingDown, LucideUser, LucideUsers } from "lucide-react";
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

const calculateLastDaysViews = (data, days) => {
  const dailyData = data.daily;
  const lastFetched = new Date(data.lastFetched);

  let totalViews = 0;

  for (let i = 0; i < days; i++) {
    const dateKey = new Date(
      lastFetched.getTime() - i * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      totalViews += dailyData[dateKey].views || 0;
    }
  }

  return totalViews;
};

const calculateTotalWatchTime = (data, days) => {
  const dailyData = data.daily;
  const lastFetched = new Date(data.lastFetched);

  let totalEstimatedMinutesWatched = 0;

  for (let i = 0; i < days; i++) {
    const dateKey = new Date(
      lastFetched.getTime() - i * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      totalEstimatedMinutesWatched += dailyData[dateKey].estimatedMinutesWatched || 0;
    }
  }

  return totalEstimatedMinutesWatched;
};

const calculateTotalSubscribers = (data) => {
  const dailyData = data.daily;
  const lastFetched = new Date(data.lastFetched);
  
  let lastWeekSubscribers = 0;

  for (let i = 0; i < 7; i++) {
    const dateKey = new Date(
      lastFetched.getTime() - i * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      lastWeekSubscribers += dailyData[dateKey].subscribers || 0;
    }
  }

  return lastWeekSubscribers;
};


const calculateAverageViewDuration = (data, start, days) => {
  const dailyData = data.daily;
  const lastFetched = new Date(data.lastFetched);
  let count = 0;
  let totalAverageViewDuration = 0;

  for (let i = start; i < days; i++) {
    const dateKey = new Date(
      lastFetched.getTime() - i * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      totalAverageViewDuration += dailyData[dateKey].averageViewDuration || 0;
      count++;
    }
  }

  return count === 0 ? 0 :  totalAverageViewDuration/count;
};

function YoutubeSection () {
    const { youtubeData } = useYoutubeData();
    const [videos, setVideos] = useState([]);
    const [youtubeCalculatedData, setYoutubeCalculatedData] = useState({
        totalViewsThisWeek: 0,
        percentageChangeViews: 0,
        totalWatchTime: 0,
        percentageChangeWatchTime: 0,
        percentageChangeSubscribers: 0, 
        averageViewDuration: 0,
        percentageChangeAverageViewDuration: 0,
    });
    const getRecentVideos = async ( channelResponse ) => {
      const API_KEY ="AIzaSyA7Nf4gXPnicfy0m3QV5atXhrj6jRPIh88";
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
        console.log(videoResponse);
    
        const videos = videoResponse.data.items.map((video) => ({
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          thumbnails: video.snippet.thumbnails,
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          commentCount: video.statistics.commentCount,
        }));
    
        console.log(videos);
        setVideos(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    //sum of views this week , youtube.daily is an object with keys as dates and values as views
    useEffect(() => {
    const totalViewsThisWeek = calculateLastDaysViews( youtubeData, 7 );
    const totalViewsLastWeek = calculateLastDaysViews( youtubeData, 14 ) - totalViewsThisWeek;
    const percentageChangeViews = totalViewsLastWeek === 0 ? 0 : ((totalViewsThisWeek - totalViewsLastWeek) / totalViewsLastWeek) * 100;
    const totalWatchTime = calculateTotalWatchTime( youtubeData, 7 );
    const totalWatchTimeLastWeek = calculateTotalWatchTime( youtubeData, 14 ) - totalWatchTime;
    const percentageChangeWatchTime = totalWatchTimeLastWeek === 0 ? 0 : ((totalWatchTime - totalWatchTimeLastWeek) / totalWatchTimeLastWeek) * 100;
    const lastWeekSubscribers = calculateTotalSubscribers( youtubeData );
    const percentageChangeSubscribers = lastWeekSubscribers === 0 ? 0 : ((youtubeData.channel.statistics.subscriberCount - lastWeekSubscribers) / lastWeekSubscribers) * 100;
    const lastWeekAverageViewDuration = calculateAverageViewDuration( youtubeData, 7, 14 );
    const averageViewDuration = calculateAverageViewDuration( youtubeData, 0, 7 );
    const percentageChangeAverageViewDuration = lastWeekAverageViewDuration === 0 ? 0 : ((averageViewDuration - lastWeekAverageViewDuration) / lastWeekAverageViewDuration) * 100;
    setYoutubeCalculatedData({
        totalViewsThisWeek,
        percentageChangeViews,
        totalWatchTime,
        percentageChangeWatchTime,
        percentageChangeSubscribers,
        averageViewDuration,
        percentageChangeAverageViewDuration,
    });
    getRecentVideos( youtubeData.channel )
    }, [youtubeData]);

  return (
    <>
            <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2">
                <div className="flex gap-3">
                    <LucideSettings className="h-5 my-auto" />
                    <LucideBell className="h-5 my-auto" />
                    <NavUser/>
                </div>
            </header>
            {/* <div className={` rounded-lg mb-6 h-[140px] overflow-hidden relative`}>
                <img src={youtubeData.channel.brandingSettings.image.bannerExternalUrl} alt="youtube" className="w-full center absolute -translate-y-1/4"/>
                <h1 className="text-3xl font-light text-black mb-4"></h1>
            </div> */}
            <div className={`bg-gradient-to-r from-[#FF003308] to-[#FF00331F] rounded-lg mb-6 p-6 h-[140px]`}>
                <h1 className="text-3xl font-light text-black mb-2 flex gap-2"><img src={youtubeSvg} alt="youtube" className="h-7 my-auto"/>Youtube Analytics</h1>
                <p className="text-secondary text-base">Uncover Key Insights to Boost Your Youtube Performance</p>
            </div>
            <div className="p-2 flex-col flex gap-10">
              <h1 className="text-2xl font-semibold">Insights</h1>
              <Card>
                <CardContent className="p-4 flex flex-row gap-4">
                  <div className="gap-2 flex flex-col">
                    <CircularProgress currentScore={youtubeData?.channel?.statistics?.subscriberCount} startColor="#FECAD5" endColor="#FF2853" />
                    <div className="flex text-sm font-medium gap-1 mx-auto"><p className="text-[#34C759] flex">+20%<LucideArrowUpRight className="h-4 w-4 mt-auto"/></p><p className="text-secondary"> than last week</p></div>
                  </div>
                  <Separator orientation="vertical"/>
                  <div className="gap-2 flex flex-col flex-1">
                        <Card className=" border-none rounded-lg shadow-none">
                            <CardContent className="flex gap-1 p-2 flex-col flex-1">
                            <div className=" text-sm text-secondary font-medium Inter flex gap-2">Total Views</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">{youtubeCalculatedData.totalViewsThisWeek}</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeViews > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeViews === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeViews}% {youtubeCalculatedData.percentageChangeViews > 0 ? <LucideArrowUpRight className="h-4 w-4 mt-auto"/> : youtubeCalculatedData.percentageChangeViews === 0 ? <></> : <LucideArrowDownLeft className="h-4 w-4 mt-auto"/>}</p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className=" border-none rounded-lg shadow-none">
                            <CardContent className="flex gap-1 p-2 flex-col flex-1">
                            <div className=" text-sm text-secondary font-medium Inter flex gap-2">Total Subscribers</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">{youtubeData?.channel?.statistics?.subscriberCount}</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeSubscribers > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeSubscribers === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeSubscribers}%{youtubeCalculatedData.percentageChangeSubscribers > 0 ? <LucideArrowUpRight className="h-4 w-4 mt-auto"/> : youtubeCalculatedData.percentageChangeSubscribers === 0 ? <></> : <LucideArrowDownLeft className="h-4 w-4 mt-auto"/>}</p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                  </div>
                  <Separator orientation="vertical"/>
                  <div className="gap-2 flex flex-col flex-1">
                        <Card className=" border-none rounded-lg shadow-none">
                            <CardContent className="flex gap-1 p-2 flex-col flex-1">
                            <div className=" text-sm text-secondary font-medium Inter flex gap-2">Total Watch Time</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">{youtubeCalculatedData.totalWatchTime}</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeWatchTime > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeWatchTime === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeWatchTime}%{youtubeCalculatedData.percentageChangeWatchTime > 0 ? <LucideArrowUpRight className="h-4 w-4 mt-auto"/> : youtubeCalculatedData.percentageChangeWatchTime === 0 ? <></> : <LucideArrowDownLeft className="h-4 w-4 mt-auto"/>}</p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className=" border-none rounded-lg shadow-none">
                            <CardContent className="flex gap-1 p-2 flex-col flex-1">
                            <div className=" text-sm text-secondary font-medium Inter flex gap-2">Average View Duration</div>
                            <div className="flex justify-between">
                            <p className=" text-2xl font-semibold my-auto">{youtubeCalculatedData.averageViewDuration}</p>
                            <div className="flex flex-col text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeAverageViewDuration > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeAverageViewDuration === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeAverageViewDuration}% {youtubeCalculatedData.percentageChangeAverageViewDuration > 0 ? <LucideArrowUpRight className="h-4 w-4 mt-auto"/> : youtubeCalculatedData.percentageChangeAverageViewDuration === 0 ? <></> : <LucideArrowDownLeft className="h-4 w-4 mt-auto"/>}</p>
                                <p className="text-secondary ml-auto"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                  </div>
                </CardContent>
              </Card>
              <div>
                <div className="flex-1 mt-3 flex flex-col gap-4">
                  <div className="flex-1 flex gap-4">
                    <DailyViewsYoutube youtubeData={youtubeData} percentageChangeViews={youtubeCalculatedData.percentageChangeViews}/>
                    {/* <YoutubeMonthly/> */}
                    <DailyWatchMetrics youtubeData={youtubeData}/>
                  </div>
                  <div className="flex-1 flex gap-4 flex-wrap">
                    <DialySubscribedUnsubscribed youtubeData={youtubeData} percentageChangeViews={youtubeCalculatedData.percentageChangeViews}/>
                    <DailyCommentsYoutube youtubeData={youtubeData}/>
                  </div>
                  <div className="flex-1 flex gap-4 flex-wrap">
                    <DailySubscribersYoutube youtubeData={youtubeData} percentageChangeSubscribers={youtubeCalculatedData.percentageChangeSubscribers}/>
                    <DailyLikeShareDislikeYoutube youtubeData={youtubeData}/>
                  </div>
                </div>
              </div>
              <Card className="flex-1 bg-[#f6f8f9] shadow-md">
                <CardHeader>
                  <p className="text-[#101010] font-semibold text-lg flex gap-1"><img src={sparkle} alt="sparkle" /> AI Growth Insights</p>
                  <p className="text-secondary text-sm ">Tailored tips to boost your YouTube growth.</p>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 grid-rows-2">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row gap-2">
                      <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                        <img src={triangle} alt="triangle" className="h-2 "/>
                      </div>
                      <div>
                        <div className="text-secondary text-xs font-medium">Follower Growth</div>
                        <div className=" text-sm font-semibold">Growth is down this week</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc ml-4 text-gray-600 mt-2">
                        <li>Post 3 videos per week targeting high-performing topics</li>
                        <li>Optimize thumbnails and titles for higher click-through rates</li>
                        <li>Collaborate with influencers in your niche</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row gap-2">
                      <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                        <LucideEqual className="h-4 w-4 text-[#FF9500]"/>
                      </div>
                      <div>
                        <div className="text-secondary text-xs font-medium">Engagement Rate</div>
                        <div className=" text-sm font-semibold">Engagement is steady</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc ml-4 text-gray-600 mt-2">
                        <li>Host a Q&A or create polls to boost interaction</li>
                        <li>Reply to at least 50% of comments within 24 hours</li>
                        <li>Add clear CTAs in your videos and descriptions</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row gap-2">
                      <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                        <LucideUsers className="h-4 w-4"/>
                      </div>
                      <div>
                        <div className="text-secondary text-xs font-medium">Audience Age</div>
                        <div className=" text-sm font-semibold">Younger viewers dominating</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc ml-4 text-gray-600 mt-2">
                        <li>Create fast-paced content tailored for younger viewers</li>
                        <li>Use trending memes to make your videos relatable</li>
                        <li>Promote videos on Instagram and TikTok for broader reach</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row gap-2">
                      <div className="p-2 bg-[#f6f8f9] rounded-lg flex h-10 w-10 items-center justify-center">
                        <LucideHash className="h-4 w-4 text-[#409BFF]"/>
                      </div>
                      <div>
                        <div className="text-secondary text-xs font-medium">Trending Content Insights</div>
                        <div className=" text-sm font-semibold">Try new topics</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc ml-4 text-gray-600 mt-2">
                        <li>Make videos on trending topics relevant to your niche</li>
                        <li>Use trending hashtags and optimized tags for better visibility</li>
                        <li>Include "reaction" or "how-to" themes tied to the trends</li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-[#f6f8f9] shadow-md">
              <CardHeader>
                <p className="text-[#101010] font-semibold text-xl flex gap-1">Content Insights</p>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-4 border-b border-gray-300 bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                    <div>Content</div>
                    <div className="text-center">Comments</div>
                    <div className="text-center">Likes</div>
                    <div className="text-center">Views</div>
                  </div>

                  {/* Table Rows */}
                  {videos.map((video,index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-100"
                    >
                      {/* Content Section */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={video.thumbnails.default.url}
                          alt={video.title}
                          className="w-24 h-16 rounded-md object-cover"
                        />
                        <div>
                          <p className="text-gray-900 font-medium">{video.title}</p>
                          <p className="text-gray-500 text-sm">
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
                        <p className="text-gray-900 font-medium">{video.commentCount}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-900 font-medium">{video.likeCount}</p>
                      </div>

                      {/* Views */}
                      <div className="text-center">
                        <p className="text-gray-900 font-medium">{video.viewCount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
              </Card>
            </div>
    </>
  );
}

export default YoutubeSection;