import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideAward, LucideCircleUserRound, LucideCopy, LucideFolderOpen, LucideGauge, LucideLayoutDashboard, LucideLogOut, LucideMoreHorizontal, LucideMoreVertical, LucidePieChart, LucidePlus, LucideSearch, LucideSettings, LucideSparkles, LucideTrash2, LucideTvMinimalPlay, LucideUsersRound, Twitter, Youtube } from "lucide-react";
import React, { useEffect } from "react";
import { useProject } from "plotNoFeatures/project";
import { Spinner } from "@blueprintjs/core";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

import PieChartDisplay from "./components/charts/PieChartDisplay";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "./components/ui/select";
import logo from "./assets/logo.svg" 
import ConnectAccount from "./components/ConnectAccount";
import { YoutubeMonthly } from "./components/charts/YoutubeMonthly";
import { useYoutubeData } from "store/use-youtube-data";
import { useAuthStore } from "store/use-auth-data";
import BarChartDisplay from "./components/charts/BarChartDisplay";
import RadarChartDisplay from "./components/charts/RadarChartDisplay";
import RadialChartDisplay from "./components/charts/RadialChartDisplay";
import LineChartDisplay from "./components/charts/LineChartDisplay";
import { Separator } from "./components/ui/separator";
import { InsightsChart } from "./components/charts/InsightsChart";
import { MonthlyEngagementChart } from "./components/charts/MonthlyEngagementChart";
import { TopContentCarousel } from "./components/TopContentCarousel";
import TemplateCard from "./components/TemplateCard";
import ChatWidget from "./components/ChatWidget";
import { useEngagementData } from "store/use-engagement-data";
import SidebarLayout from "layouts/SideBarLayout";
import DashboardHeader from "./components/DashboardHeader";
import { InstagramContentCarousel } from "./components/InstagramContentCarousel";
import { useInstagramData } from "store/use-instagram-data";
import S3FileManager from "./components/S3MarketPlace";
import { Link } from "react-router-dom";
import ShineBorder from "./components/ui/shine-border";
import headerSvg from "./assets/header.svg";
import { Input } from "./components/ui/input"
import ProjectSection from "./components/ProjectSection";
import HomeSection from "./components/HomeSection";
import TemplateSection from "./components/TemplateSection";
import SettingsSection from "./components/SettingsSection";
import axios from "axios";

function DashBoard({ store }) {
  const { youtubeData, setYoutubeData } = useYoutubeData();
  const {instagramData} = useInstagramData();
  const { setPostData, setUserData  } = useInstagramData();
  const fetchInstagramBusinessAccount = async (userAccessToken) => {
    try {
      // Step 1: Get the user's Facebook Pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/me/accounts?fields=id,name,access_token&access_token=${userAccessToken}`
      );
      const pagesData = await pagesResponse.json();

      if (pagesData && pagesData.data && pagesData.data.length > 0) {
        // Step 2: Iterate over pages to find connected Instagram accounts
        for (const page of pagesData.data) {
          const pageId = page.id;
          const pageAccessToken = page.access_token;

          // Step 3: Check if the page has a connected Instagram Business Account
          const igAccountResponse = await fetch(
            `https://graph.facebook.com/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
          );
          const igAccountData = await igAccountResponse.json();

          if (igAccountData && igAccountData.instagram_business_account) {
            const instagramBusinessAccountId =
              igAccountData.instagram_business_account.id;

            console.log('Instagram Business Account ID:', instagramBusinessAccountId);

            // Step 4: Fetch Instagram media using the Page Access Token
            const mediaResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,username,like_count,comments_count&access_token=${pageAccessToken}`
            );
            const mediaData = await mediaResponse.json();

            console.log('Media Data:', mediaData);
            setPostData(mediaData.data);

            // Step 5: Fetch Instagram user data using the Page Access Token
            const userDataResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}?fields=biography,followers_count,follows_count,ig_id,media_count,name,profile_picture_url,username,website&access_token=${pageAccessToken}`
            );
            const userData = await userDataResponse.json();
            setUserData(userData);

            // Exit loop after finding the first Instagram business account
            break;
          }
        }
      } else {
        console.log('No pages found.');
      }
    } catch (error) {
      console.error('Error fetching Instagram Business Account:', error);
    }
  };
  
  // Extract access token from the URL hash
  const extractAccessToken = (hash) => {
    const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
    return params.get('access_token');
  };

  const fetchYoutubeDailyData = async () => {
    function calculateDailyChanges(processedData, engagementData, dailyDataPast) {
      processedData.forEach(day => {
        const date = day.date.toISOString().split('T')[0];
        if (!dailyDataPast[date]) {
          dailyDataPast[date] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
        }
        dailyDataPast[date].views += day.views;
        dailyDataPast[date].subscribers += (day.subscribersGained - day.subscribersLost);
        dailyDataPast[date].comments += day.comments;
        dailyDataPast[date].likes += day.likes;
        dailyDataPast[date].dislikes += day.dislikes;
        dailyDataPast[date].shares += day.shares;
        dailyDataPast[date].estimatedMinutesWatched += day.estimatedMinutesWatched;
        dailyDataPast[date].averageViewDuration += day.averageViewDuration;
        dailyDataPast[date].averageViewPercentage += day.averageViewPercentage;
      });
      engagementData.rows.filter(row => new Date(row[0]) >= new Date(new Date().setDate(new Date().getDate() - 90))).forEach(row => {
        const date = row[0];
        if (!dailyDataPast[date]) {
          dailyDataPast[date] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
        }
        if (row[1] === 'SUBSCRIBED') {
          dailyDataPast[date].subscribed += row[2];
        } else if (row[1] === 'UNSUBSCRIBED') {
          dailyDataPast[date].unsubscribed += row[2];
        }
      }
      );
      //onli last 90 days data
      const dailyDataPastKeys = Object.keys(dailyDataPast);
      if (dailyDataPastKeys.length > 90) {
        const keysToDelete = dailyDataPastKeys.slice(0, dailyDataPastKeys.length - 90);
        keysToDelete.forEach(key => {
          delete dailyDataPast[key];
        });
      }
      return dailyDataPast;
    }
    function analyzeChannelData(rawData, engagementData, dailyDataPast) {
      const processedData = rawData.rows.map(row => ({
        date: new Date(row[0]),
        comments: row[1],
        likes: row[2],
        dislikes: row[3],
        shares: row[4],
        views: row[5],
        estimatedMinutesWatched: row[6],
        averageViewDuration: row[7],
        averageViewPercentage: row[8],
        subscribersGained: row[9],
        subscribersLost: row[10]  // Assuming this is the correct index for subscribersLost
      }));
      return calculateDailyChanges(processedData, engagementData, dailyDataPast);
    } 
    const accessToken = localStorage.getItem('youtubeAccessToken');
    const lastFetched = youtubeData?.lastFetched?.split('T')[0];
    console.log('Last Fetched:', lastFetched,youtubeData);
    const today = new Date().toISOString().split('T')[0];
    if (accessToken && lastFetched !== today) {
      try {
        const channelResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/channels', {
            params: {
              part: 'snippet,contentDetails,statistics,brandingSettings',
              mine: true,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('youtubeAccessToken')}`,
            },
          }
        );
        const startDate = '2022-01-07';
        const endDate = new Date().toISOString().split('T')[0];
        const response = await axios.get(
          'https://youtubeanalytics.googleapis.com/v2/reports', {
            params: {
              "ids": "channel==MINE",
              startDate: startDate,
              endDate: endDate,
              metrics: 'comments,likes,dislikes,shares,views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost',
              dimensions: 'day',
              sort: 'day'
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('youtubeAccessToken')}`,
            },
          }
        );
        const engagementResponse = await axios.get(
          'https://youtubeanalytics.googleapis.com/v2/reports', {
            params: {
              "ids": "channel==MINE",
              startDate: startDate,
              endDate: endDate,
              metrics: 'views',
              dimensions: 'day,subscribedStatus',
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('youtubeAccessToken')}`,
            },
          }
        );
        const dailyData = youtubeData.daily;
        const result = analyzeChannelData(response.data, engagementResponse.data, dailyData);
        setYoutubeData({ ...youtubeData, daily: result, lastFetched: today , channel: channelResponse.data.items[0] });
      } catch (error) {
        console.error('Error fetching Youtube Daily Data:', error);
      }
    }
    else{
      console.log('Data already fetched for today');
    }
  };
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const token = extractAccessToken(hash);
      console.log('Access Token:', token);
      localStorage.setItem('instagramAccessToken', token);
      fetchInstagramBusinessAccount(token);
    }
    //move this to server side
   // fetchYoutubeDailyData();
  }, []);


  return (
    <div className="flex flex-col">
      {/* <header>
        <div className="flex h-[7vh] fixed z-10 w-full bg-white top-0 left-0 border-b-[1px] px-6 justify-between">
            <Link to='/' className=' hover:no-underline my-auto'>
                <div className='flex gap-2 my-auto'>
                    <img src={logo} alt="logo" className=' h-8' />
                </div>
            </Link>
        </div>
      </header> */}
      <div className="flex">
        <Tabs className="flex flex-1 " defaultValue="home" >
        <SidebarLayout>
        <div className=" flex">
            <TabsContent value="home" className="flex-1 p-4 pt-2 overflow-y-auto">
              <HomeSection store={store}/>
            </TabsContent>
            <TabsContent value="youtube" className="flex-1 p-4 space-y-6">
            <p className=" text-3xl font-semibold">Youtube Analytics</p>
            <div>
              <p className="text-secondary font-medium text-lg">Overview</p>
              <div className="flex gap-5 mt-3">
                  <Card className="flex-1 shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Followers</p>
                      <p className="text-3xl font-semibold">127K</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Engagement</p>
                      <p className="text-3xl font-semibold">127K</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Daily Visitors</p>
                      <p className="text-3xl font-semibold">5.3K</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
              </div>
            </div>
            <div>
              <p className="text-secondary font-medium text-lg">Audience</p>
              { youtubeData && typeof youtubeData === 'object' && Object.keys(youtubeData).length > 0 ?
                      <div className="flex-1 mt-3">
                        <div className="flex-1 p-4 flex gap-4">
                          <PieChartDisplay/>
                          <YoutubeMonthly/>
                          
                        </div>
                        <div className="flex-1 p-4 flex gap-4 flex-wrap">
                          <RadarChartDisplay/>
                          <RadialChartDisplay/>
                        </div>
                        <div className="flex-1 p-4 flex gap-4 flex-wrap">
                          <BarChartDisplay/>
                          <LineChartDisplay/>
                        </div>
                      </div>
                      :
                      <div className="flex gap-5 mt-3">
                        <InsightsChart/>
                        <MonthlyEngagementChart/>
                      </div>
                } 
            </div>
            <div>
                <p className="text-secondary font-medium text-lg mb-3">Top Content</p>
                <TopContentCarousel />
            </div>
            </TabsContent>
            <TabsContent value="instagram" className="flex-1 p-4 space-y-6">
            <p className=" text-3xl font-semibold">Instagram Analytics</p>
            {instagramData && instagramData.userData.id ?
            <Card>
              <CardHeader className="flex-row justify-between">
                <CardTitle className="text-lg">
                    Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage src={instagramData.userData.profile_picture_url} />
                  <AvatarFallback>IG</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold text-lg">@{instagramData.userData.username}</p>
                  <p className="text-secondary text-sm">{instagramData.userData.biography}</p>
                </div>
                </CardContent>
            </Card>
            : <></> }
            <div>
              <p className="text-secondary font-medium text-lg">Overview</p>
              <div className="flex gap-5 mt-3">
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Followers</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.followers_count}</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Follows</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.follows_count}</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Post Count</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.media_count}</p>
                      <div className="flex text-sm font-medium gap-1 mt-6"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
              </div>
            </div>
            <div>
                <p className="text-secondary font-medium text-lg mb-3">Top Content</p>
                {instagramData && <InstagramContentCarousel CarouselItems={instagramData.posts} />}
            </div>
            </TabsContent>
            <TabsContent value="templates" className="flex-1 p-4 pt-2">
              <TemplateSection store={store} />
            </TabsContent>
            <TabsContent value="projects" className="flex-1 p-4 pt-2 space-y-6">
              <ProjectSection store={store} />
            </TabsContent>
            <TabsContent value="settings" className="flex-1 p-4 pt-2 space-y-6">
              <SettingsSection/>
            </TabsContent>
        </div>
        </SidebarLayout>
        </Tabs>
        {/* {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
        <div className="w-[15%] border-2 border-black my-2 mr-4">
            <p className="my-auto">Ad Space</p>
        </div>
        : <></>} */}
      </div>
      {/* {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
        <></>
        : 
        <ChatWidget />} */}
        <ChatWidget />
    </div>
  );
}

export default DashBoard;