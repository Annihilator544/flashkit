import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Instagram, Linkedin, LucideAward, LucideCircleUserRound, LucideCopy, LucideFolderOpen, LucideGauge, LucideLayoutDashboard, LucideLogOut, LucideMoreHorizontal, LucideMoreVertical, LucidePieChart, LucidePlus, LucideSearch, LucideSettings, LucideSparkles, LucideTrash2, LucideTvMinimalPlay, LucideUsersRound, Twitter, Youtube } from "lucide-react";
import React, { use, useEffect, useState } from "react";
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
import YoutubeSection from "./components/YoutubeSection";
import InstagramSection from "./components/InstagramSection";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { useToast } from "./hooks/use-toast"
import { ToastAction } from "./components/ui/toast";
import countryNames from "./lib/InstagramCountries";

function calculateDailyChanges(processedData, currentFollowers){
  const dailyData = {};
  let previousFollowers = currentFollowers;
  processedData.forEach(data => {
    if(data.name === 'follower_count'){
      data.values.forEach(value => {
        previousFollowers -= value.value;
      });
    }});

  processedData.forEach(data => {
    const name = data.name;
    data.values.forEach(value => {
      const date = value.end_time.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { follower_count: 0, impressions: 0, reach: 0 };
      }
      if (name === 'follower_count') {
        previousFollowers += value.value;
        dailyData[date].follower_count = previousFollowers;
      } else {
        dailyData[date][name] = value.value;
      }
    });
  });
  return dailyData;
}

function calculateExtraMetrics(monthlyData, lastWeekData, thisWeekData) {
  const extraMetrics = {};
  monthlyData.forEach(data => {
    const name = data.name;
    const value2 = data?.total_value?.value || 0;
    if (!extraMetrics[name]) {
      extraMetrics[name] = {monthly: 0, lastWeek: 0, thisWeek: 0};
    }
    extraMetrics[name].monthly = value2;
  })
  lastWeekData.forEach(data => {
    const name = data.name;
    const value2 = data?.total_value?.value || 0;
    if (!extraMetrics[name]) {
      extraMetrics[name] = {monthly: 0, lastWeek: 0, thisWeek: 0};
    }
    extraMetrics[name].lastWeek = value2;
  })
  thisWeekData.forEach(data => {
    const name = data.name;
    const value2 = data?.total_value?.value || 0;
    if (!extraMetrics[name]) {
      extraMetrics[name] = {monthly: 0, lastWeek: 0, thisWeek: 0};
    }
    extraMetrics[name].thisWeek = value2;
  })
  return extraMetrics;
}

function calculateDemographicsData(engagementData, reachedData, followerData) {
  const demographicsData = {};
  if (engagementData) {
  engagementData.forEach(data => {
    data.total_value.breakdowns[0].results.forEach(result => {
      const country = result.dimension_keys[0];
      const value = result.value;
      if (!demographicsData[country]) {
        demographicsData[country] = {engaged_audience_demographics: 0, reached_audience_demographics: 0, follower_demographics: 0};
      }
      demographicsData[country].engaged_audience_demographics = value;
    });
  });
  }
  reachedData.forEach(data => {
    data.total_value.breakdowns[0].results.forEach(result => {
      const country = result.dimension_values[0];
      const value = result.value;
      if (!demographicsData[country]) {
        demographicsData[country] = {engaged_audience_demographics: 0, reached_audience_demographics: 0, follower_demographics: 0};
      }
      demographicsData[country].reached_audience_demographics = value;
    });
  });
  followerData.forEach(data => {
    data.total_value.breakdowns[0].results.forEach(result => {
      const country = result.dimension_values[0];
      const value = result.value;
      if (!demographicsData[country]) {
        demographicsData[country] = {engaged_audience_demographics: 0, reached_audience_demographics: 0, follower_demographics: 0};
      }
      demographicsData[country].follower_demographics = value;
    });
  });
  return demographicsData;
}

const calculateFollowersChange = (data) => {
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
  const date = new Date(new Date(data.lastFetched).getTime() -  1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const pastWeek = new Date(new Date(data.lastFetched).getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const followersToday = data?.daily[date]?.follower_count || 0;
  const followersLastWeek = data?.daily[pastWeek]?.follower_count || 0;
  const followersChange = followersToday - followersLastWeek;
  const percentageChange = followersLastWeek ? ((followersChange / followersLastWeek) * 100).toFixed(2): 0;
  return percentageChange;
};

function calculateTotalImpressions(data, days) {
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
  let totalImpressions = 0;
  for (let i = 1; i <= days; i++) {
    const day = new Date(new Date(data.lastFetched).getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    totalImpressions += data.daily[day]?.impressions || 0;
  }
  return totalImpressions;
}

function calculateTotalReach(data, days) {
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
  let totalReach = 0;
  for (let i = 1; i <= days; i++) {
    const day = new Date(new Date(data.lastFetched).getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
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

const calculateLastDaysViews = (data, days) => {
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
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
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
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
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
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

const getEQSOneLiner = async (userData,eqs) => {
  try {
    const response = await fetch("https://pkuirym7cu6nbbyke3f7ortkpu0xnzvb.lambda-url.eu-west-2.on.aws/", {
      method: 'POST',
      body: JSON.stringify({
        "pastWeekData":userData,
        "engagementMetrics":eqs
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error:', error);
  }
}


const calculateAverageViewDuration = (data, start, days) => {
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
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

const getYoutubeEQSScore = async (userData) => {
  try {
    const response = await fetch("https://n5qthtqcoxts3m2gftclxqfvee0chgau.lambda-url.eu-west-2.on.aws/", {
      method: 'POST',
      body: JSON.stringify({
        ...userData
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const getInstagramEQSScore = async (userData) => {
  try {
    const response = await fetch("https://iseuy5s5vboych7i2vwmbj2w4e0vkxsy.lambda-url.eu-west-2.on.aws/", {
      method: 'POST',
      body: JSON.stringify({
        ...userData
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const getYoutubeEQSText = async (userData,eqs) => {
  try {
    const response = await fetch("https://crdax4rvilnivs5of7lak6r7qe0sffpk.lambda-url.eu-west-2.on.aws/", {
      method: 'POST',
      body: JSON.stringify({
        "pastWeekData":userData,
        "engagementMetrics":eqs
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error:', error);
  }
}

const getInstagramEQSText = async (userData,eqs) => {
  try {
    const response = await fetch("https://744cjowgnl3q2b6oepxplzkaqq0dcsan.lambda-url.eu-west-2.on.aws/", {
      method: 'POST',
      body: JSON.stringify({
        "pastWeekData":userData,
        "engagementMetrics":eqs
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error:', error);
  }
}

const EQSNormalizedFunction = (value) => {
  return (Math.log(value) / (Math.log(value) + Math.log(5))).toFixed(2)*100;
}

const pastDaysData = (data, start, end) => {
  if (!data?.lastFetched || isNaN(new Date(data.lastFetched).getTime())) {
    return 0;
  }
  const dailyData = data.daily;
  const lastFetched = new Date(data.lastFetched);
  const pastDays = {};
  for (let i = start; i < end; i++) {
    const dateKey = new Date(
      lastFetched.getTime() - i * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      pastDays[dateKey] = dailyData[dateKey];
    }
  }
  return pastDays;
};


function DashBoard({ store }) {
  const { youtubeData, eqsText, setYoutubeOneLiner, setEQSText, setYoutubeData, setYoutubeCalculatedData, setEQS, eqs } = useYoutubeData();
  const [ selectedValue , setSelectedValue ] = useState('home');
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { instagramData, setInstagramOneLiner , setInstagramEQS, setInstagramEQSText, setInstagramCalculatedData, setPostData, setUserData, setDaily, setExtraMetrics, setDemographicData, setStoryData, setLastFetched } = useInstagramData();
  const fetchInstagramBusinessAccount = async (userAccessToken) => {
    if(!userAccessToken)return
    
    console.log('Fetching Instagram Business Account',userAccessToken);
    try {
    //   const region = "eu-west-2";
    //   const credentials = {
    //     accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
    //   };
    //   const ddbClient = new DynamoDBClient({ region, credentials });
    //   const docClient = DynamoDBDocumentClient.from(ddbClient);
    //   const tableName = "flashkitUserData";
    //   const paramsSetAccessToken = {
    //     TableName: tableName,
    //     Key: { uid: user.uid },
    //     UpdateExpression: 'SET instagramAccessToken = :new_items',
    //     ExpressionAttributeValues: {
    //       ':new_items': userAccessToken,
    //     },
    //     ReturnValues: 'ALL_NEW',
    //   };
    //   await docClient.send(new UpdateCommand(paramsSetAccessToken));
    //   const params = {
    //   TableName: tableName,
    //   Key: { uid: user.uid },
    // };
    //   const result = await docClient.send(new GetCommand(params));
    //   console.log('Result:', result);
    //   if((result.Item && result.Item.instagramData && Object.keys(result.Item.instagramData).length > 0)){
      // Step 1: Get the user's Facebook Pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/me/accounts?fields=id,name,access_token&access_token=${userAccessToken}`
      );
      const pagesData = await pagesResponse.json();

      if(pagesData.error){
        if(pagesData.error.code === 190){
          console.log('Token Expired');
          localStorage.removeItem('instagramAccessToken');
          toast({
            title: "Instagram Disconnected ",
            description: "Please log in again.",
            action: <Button onClick={()=>{setSelectedValue("settings")}} size="sm" variant="destructive">Login</Button>,});
          console.error('Error fetching Instagram Business Account:', pagesData.error);
          return;
        }
      }

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

            // Step 4: Fetch Instagram media using the Page Access Token
            const mediaResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,username,like_count,comments_count&access_token=${pageAccessToken}`
            );
            const mediaData = await mediaResponse.json();
            setPostData(mediaData.data);

            // Step 5: Fetch Instagram user data using the Page Access Token
            const userDataResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}?fields=biography,followers_count,follows_count,ig_id,media_count,name,profile_picture_url,username,website&access_token=${pageAccessToken}`
            );
            const userData = await userDataResponse.json();
            setUserData(userData);
            const currentEpoch = Math.floor(new Date().getTime() / 1000);
            const monthAgoEpoch = currentEpoch - 30 * 24 * 60 * 60;
            const insightsResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=follower_count,impressions,reach&period=day&since=${monthAgoEpoch}&until=${currentEpoch}&access_token=${pageAccessToken}`
            );
            const insightsData = await insightsResponse.json();
            const processedData = calculateDailyChanges(insightsData.data, userData.followers_count);
            setDaily(processedData);

            const extraMetrics = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=profile_views,accounts_engaged,likes,comments,shares,saves,replies,follows_and_unfollows,total_interactions&metric_type=total_value&period=day&since=${monthAgoEpoch}&until=${currentEpoch}&access_token=${pageAccessToken}`
            );
            const extraMetricsData = await extraMetrics.json();

            const thisWeekEpoch = currentEpoch - 7 * 24 * 60 * 60;
            const lastWeekEpoch = thisWeekEpoch - 7 * 24 * 60 * 60;
            const extraMetricsLastWeek = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=profile_views,accounts_engaged,likes,comments,shares,saves,replies,follows_and_unfollows,total_interactions&metric_type=total_value&period=day&since=${lastWeekEpoch}&until=${thisWeekEpoch}&access_token=${pageAccessToken}`
            );
            const extraMetricsLastWeekData = await extraMetricsLastWeek.json();

            const extraMetricsThisWeek = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=profile_views,accounts_engaged,likes,comments,shares,saves,replies,follows_and_unfollows,total_interactions&metric_type=total_value&period=day&since=${thisWeekEpoch}&until=${currentEpoch}&access_token=${pageAccessToken}`
            );
            const extraMetricsThisWeekData = await extraMetricsThisWeek.json();

            const ExtraMetrics = calculateExtraMetrics(extraMetricsData.data, extraMetricsLastWeekData.data, extraMetricsThisWeekData.data);
            setExtraMetrics(ExtraMetrics);

            let engagedAudienceData = { data : [] };
            let reachedAudienceData = { data: [] };
            let followerDemographicsData = { data: [] };

            try{
            const engagedAudienceResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=engaged_audience_demographics&period=lifetime&timeframe=this_month&breakdown=country&metric_type=total_value&access_token=${pageAccessToken}`
            );
            engagedAudienceData = await engagedAudienceResponse.json();
            } catch (error) {
              console.error('Error fetching Engaged Audience Data:', error);
            }

            try{
            const reachedAudienceDataResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=reached_audience_demographics&period=lifetime&timeframe=this_month&breakdown=country&metric_type=total_value&access_token=${pageAccessToken}`
            );
            reachedAudienceData = await reachedAudienceDataResponse.json();
            } catch (error) {
              console.error('Error fetching Reached Audience Data:', error);
            }

            try{
            const followerDemographicsResponse = await fetch(
              `https://graph.facebook.com/${instagramBusinessAccountId}/insights?metric=follower_demographics&period=lifetime&timeframe=this_month&breakdown=country&metric_type=total_value&access_token=${pageAccessToken}`
            );
            followerDemographicsData = await followerDemographicsResponse.json();
            } catch (error) {
              console.error('Error fetching Follower Demographics Data:', error);
            }
            const DemographicsData = calculateDemographicsData(engagedAudienceData.data, reachedAudienceData.data, followerDemographicsData.data);
            setDemographicData(DemographicsData);
              // Exit loop after finding the first Instagram business account
            try{
              const storyresponse = await fetch(
                `https://graph.facebook.com/${instagramBusinessAccountId}/stories?fields=id,media_type,media_url,permalink,timestamp,username,like_count,comments_count,thumbnail_url&access_token=${pageAccessToken}`
              );
              const storyData = await storyresponse.json();
              setStoryData(storyData.data);
            } catch (error) {
              console.error('Error fetching Instagram Stories:', error);
            }
            setLastFetched(new Date().toISOString());
            const region = "eu-west-2";
            const credentials = {
              accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
            };
            const ddbClient = new DynamoDBClient({ region, credentials });
            const docClient = DynamoDBDocumentClient.from(ddbClient);
            const tableName = "flashkitUserData";
            const params = {
              TableName: tableName,
              Key: { uid: user.uid },
              UpdateExpression: 'SET instagramData = :new_items',
              ExpressionAttributeValues: {
                ':new_items': instagramData,
              },
              ReturnValues: 'ALL_NEW',
            };
            await docClient.send(new UpdateCommand(params));
            break;
          }
        }
      } else {
        console.log('No pages found.');
      }
    // } else {
    //   console.log('Not fetching data as it is already present');
    // }
    } catch (error) {
      console.error('Error fetching Instagram Business Account:', error);
    }
    
  };
  
  // Extract access token from the URL hash
  const extractAccessToken = (hash) => {
    const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
    return params.get('access_token');
  };

  function processData(data) {
    return data.rows.map(row => ({
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
  }

  function calculateDailyChangesYoutube(processedData, engagementData) {
    const dailyChanges = {};
    //only get the last 90 days
    const processedData90Days = processedData.slice(-90);
    const engagementData90Days = engagementData.rows.filter(row => new Date(row[0]) >= new Date(new Date().setDate(new Date().getDate() - 90)));
    processedData90Days.forEach(day => {
      const date = day.date.toISOString().split('T')[0];
      if (!dailyChanges[date]) {
        dailyChanges[date] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
      }
      dailyChanges[date].views += day.views;
      dailyChanges[date].subscribers += (day.subscribersGained - day.subscribersLost);
      dailyChanges[date].comments += day.comments;
      dailyChanges[date].likes += day.likes;
      dailyChanges[date].dislikes += day.dislikes;
      dailyChanges[date].shares += day.shares;
      dailyChanges[date].estimatedMinutesWatched += day.estimatedMinutesWatched;
      dailyChanges[date].averageViewDuration += day.averageViewDuration;
      dailyChanges[date].averageViewPercentage += day.averageViewPercentage;
    });
    engagementData90Days.forEach(row => {
      const date = row[0];
      if (!dailyChanges[date]) {
        dailyChanges[date] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
      }
      if (row[1] === 'SUBSCRIBED') {
        dailyChanges[date].subscribed += row[2];
      } else if (row[1] === 'UNSUBSCRIBED') {
        dailyChanges[date].unsubscribed += row[2];
      }
    }
    );
    return dailyChanges;
  }
  
  function calculateMonthlyChanges(processedData, engagementData) {
    const monthlyChanges = {};
    let averageView = {};

    processedData.forEach(day => {
      const yearMonth = `${day.date.getFullYear()}-${(day.date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyChanges[yearMonth]) {
        monthlyChanges[yearMonth] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
      }
      if(!averageView[yearMonth]) {
        averageView[yearMonth] = { sumDuration: 0, sumPercentage: 0, countDuration: 0, countPercentage: 0 };
      }
      
      monthlyChanges[yearMonth].views += day.views;
      monthlyChanges[yearMonth].subscribers += (day.subscribersGained - day.subscribersLost);
      monthlyChanges[yearMonth].comments += day.comments;
      monthlyChanges[yearMonth].likes += day.likes;
      monthlyChanges[yearMonth].dislikes += day.dislikes;
      monthlyChanges[yearMonth].shares += day.shares;
      monthlyChanges[yearMonth].estimatedMinutesWatched += day.estimatedMinutesWatched;
      averageView[yearMonth].sumDuration += day.averageViewDuration;
      averageView[yearMonth].sumPercentage += day.averageViewPercentage;
      if(day.averageViewDuration) averageView[yearMonth].countDuration++;
      if(day.averageViewPercentage) averageView[yearMonth].countPercentage++;
    });

    Object.keys(averageView).forEach(yearMonth => {
      monthlyChanges[yearMonth].averageViewDuration = averageView[yearMonth].countDuration ? averageView[yearMonth].sumDuration / averageView[yearMonth].countDuration : 0;
      monthlyChanges[yearMonth].averageViewPercentage = averageView[yearMonth].countPercentage ? averageView[yearMonth].sumPercentage / averageView[yearMonth].countPercentage : 0;
    });

    engagementData.rows.forEach(row => {
      const day = new Date(row[0]);
      const yearMonth = `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyChanges[yearMonth]) {
        monthlyChanges[yearMonth] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
      }
      
      if (row[1] === 'SUBSCRIBED') {
        monthlyChanges[yearMonth].subscribed += row[2];
      } else if (row[1] === 'UNSUBSCRIBED') {
        monthlyChanges[yearMonth].unsubscribed += row[2];
      }
    });
    
    return monthlyChanges;
  }
  
  function calculateYearlyChanges(processedData, engagementData) {
    const yearlyChanges = {};
    let averageView = {};
    
    processedData.forEach(day => {
      const year = day.date.getFullYear();
      
      if (!yearlyChanges[year]) {
        yearlyChanges[year] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
      }
      if(!averageView[year]) {
        averageView[year] = { sumDuration: 0, sumPercentage: 0, countDuration: 0, countPercentage: 0 };
      }
      
      yearlyChanges[year].views += day.views;
      yearlyChanges[year].subscribers += (day.subscribersGained - day.subscribersLost);
      yearlyChanges[year].comments += day.comments;
      yearlyChanges[year].likes += day.likes;
      yearlyChanges[year].dislikes += day.dislikes;
      yearlyChanges[year].shares += day.shares;
      yearlyChanges[year].estimatedMinutesWatched += day.estimatedMinutesWatched;
      averageView[year].sumDuration += day.averageViewDuration;
      averageView[year].sumPercentage += day.averageViewPercentage;
      if(day.averageViewDuration) averageView[year].countDuration++;
      if(day.averageViewPercentage) averageView[year].countPercentage++;
    });

    Object.keys(averageView).forEach(year => {
      yearlyChanges[year].averageViewDuration = averageView[year].countDuration ? averageView[year].sumDuration / averageView[year].countDuration : 0;
      yearlyChanges[year].averageViewPercentage = averageView[year].countPercentage ? averageView[year].sumPercentage / averageView[year].countPercentage : 0;
    });

    engagementData.rows.forEach(row => {
      const day = new Date(row[0]);
      const year = day.getFullYear();
      
      if (!yearlyChanges[year]) {
        yearlyChanges[year] = { views: 0, subscribers: 0, comments: 0, subscribed: 0, unsubscribed: 0, likes: 0, dislikes: 0, shares: 0, estimatedMinutesWatched: 0, averageViewDuration: 0, averageViewPercentage: 0  };
      }
      
      if (row[1] === 'SUBSCRIBED') {
        yearlyChanges[year].subscribed += row[2];
      } else if (row[1] === 'UNSUBSCRIBED') {
        yearlyChanges[year].unsubscribed += row[2];
      }
    });
    
    return yearlyChanges;
  }
  
  function analyzeChannelData(rawData, engagementData, channelData) {
    const processedData = processData(rawData);
    const dailyData = calculateDailyChangesYoutube(processedData, engagementData);
    const monthlyChanges = calculateMonthlyChanges(processedData, engagementData);
    const yearlyChanges = calculateYearlyChanges(processedData, engagementData);
    const lastFetched = new Date().toISOString();
    return {
      lastFetched: lastFetched,
      daily: dailyData,
      monthly: monthlyChanges,
      yearly: yearlyChanges,
      channel: channelData,
    };
  } 
  
  async function fetchDataManually(userAccessToken){
    if(!userAccessToken)return
    console.log('Fetching YouTube Analytics');
    const endDate = new Date().toISOString().split('T')[0];
    try {
      const channelResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'snippet,contentDetails,statistics,brandingSettings',
            mine: true,
          },
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        }
      );
      const startDate = channelResponse.data.items[0].snippet.publishedAt.split('T')[0];
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
            Authorization: `Bearer ${userAccessToken}`,
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
            Authorization: `Bearer ${userAccessToken}`,
          },
        }
      );
      const result = analyzeChannelData(response.data, engagementResponse.data, channelResponse.data.items[0]);
      setYoutubeData(result);
      try {
        const region = "eu-west-2";
            const credentials = {
              accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
            };
            const ddbClient = new DynamoDBClient({ region, credentials });
            const docClient = DynamoDBDocumentClient.from(ddbClient);
            const tableName = "flashkitUserData";
            const params = {
              TableName: tableName,
              Key: { uid: user.uid },
              UpdateExpression: 'SET youtubeData = :new_items',
              ExpressionAttributeValues: {
                ':new_items': result,
              },
              ReturnValues: 'ALL_NEW',
            };
            await docClient.send(new UpdateCommand(params));
      } catch (error) {
        console.error('Error updating DynamoDB:', error);
      }
      try {
        const region = "eu-west-2";
            const credentials = {
              accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
            };
            const ddbClient = new DynamoDBClient({ region, credentials });
            const docClient = DynamoDBDocumentClient.from(ddbClient);
            const tableName = "flashkitUserData";
            const params = {
              TableName: tableName,
              Key: { uid: user.uid },
              UpdateExpression: 'SET youtubeAccessToken = :new_items',
              ExpressionAttributeValues: {
                ':new_items': userAccessToken,
              },
              ReturnValues: 'ALL_NEW',
            };
            await docClient.send(new UpdateCommand(params));
      } catch (error) {
        console.error('Error updating DynamoDB:', error);
      }
      console.log('YouTube Analytics fetched and saved');
    } catch (error) {
      console.error('Error fetching YouTube Analytics:', error);
        if(error.status === 401){
          localStorage.removeItem('youtubeAccessToken');
          toast({
            title: "YouTube Disconnected",
            description: "Please log in again.",
            action: <Button onClick={()=>{setSelectedValue("settings")}} size="sm" variant="destructive">Login</Button>,});
          return;
        }
    }
  }
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const token = extractAccessToken(hash);
      localStorage.setItem('instagramAccessToken', token);
      console.log('instagram data fetching')
      fetchInstagramBusinessAccount(token);
      console.log('instagram data fetched')
      window.history.pushState({}, document.title, window.location.pathname);
    }
      const instagramToken = localStorage.getItem('instagramAccessToken');
      if(!instagramToken){
        toast({
          title: "Instagram Disconnected ",
          description: "Please log in again.",
          action: <Button onClick={()=>{setSelectedValue("settings")}} size="sm" variant="destructive">Login</Button>,});
      }
      console.log('instagram data fetching')
      fetchInstagramBusinessAccount(instagramToken);
      console.log('instagram data fetched')
      const youtubeToken = localStorage.getItem('youtubeAccessToken');
      if(!youtubeToken){
        toast({
          title: "YouTube Disconnected",
          description: "Please log in again.",
          action: <Button onClick={()=>{setSelectedValue("settings")}} size="sm" variant="destructive">Login</Button>,});
      }
      console.log('youtube data fetching')
      fetchDataManually(youtubeToken);
      console.log('youtube data fetched')
  }, []);

  useEffect(() => {
    if(Object.keys(instagramData).length){
    async function updateInstagramEQSData() {
        const lastWeekData = pastDaysData( instagramData, 0, 7 )
        const thisWeekEQSScore = await getInstagramEQSScore( lastWeekData );
        const lastWeekEQSScore = await getInstagramEQSScore( pastDaysData( instagramData, 7, 14 ) );
        const percentageChange = EQSNormalizedFunction(thisWeekEQSScore.eqsScore) - EQSNormalizedFunction(lastWeekEQSScore.eqsScore)
        setInstagramEQS({eqsPercentage: EQSNormalizedFunction(thisWeekEQSScore.eqsScore)||0, eqsPercentageChange: percentageChange||0});
        console.log('Instagram EQS Data Updated');
        const eqsText = await getYoutubeEQSText( lastWeekData, thisWeekEQSScore );
        setInstagramEQSText(eqsText);
        const EQSOneLiner = await getEQSOneLiner( lastWeekData, thisWeekEQSScore );
        setInstagramOneLiner(EQSOneLiner);
    }
  updateInstagramEQSData();
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
}
  },[instagramData]);

  useEffect(() => {
    // round to 2 decimal places
  if(Object.keys(youtubeData).length){
  async function updateYoutubeEQSData() {
      const lastWeekData = pastDaysData( youtubeData, 0, 7 )
      const thisWeekEQSScore = await getYoutubeEQSScore( lastWeekData );
      const lastWeekEQSScore = await getYoutubeEQSScore( pastDaysData( youtubeData, 7, 14 ) );
      const percentageChange = EQSNormalizedFunction(thisWeekEQSScore.eqs) - EQSNormalizedFunction(lastWeekEQSScore.eqs)
      setEQS({eqsPercentage: EQSNormalizedFunction(thisWeekEQSScore.eqs)||0, eqsPercentageChange: percentageChange||0});
      console.log('YouTube EQS Data Updated');
      const eqsText = await getYoutubeEQSText( lastWeekData, thisWeekEQSScore );
      setEQSText(eqsText);
      const EQSOneLiner = await getEQSOneLiner( lastWeekData, thisWeekEQSScore );
      setYoutubeOneLiner(EQSOneLiner);
    }
  updateYoutubeEQSData();
  const totalViewsThisWeek = calculateLastDaysViews( youtubeData, 7 );
  const totalViewsLastWeek = calculateLastDaysViews( youtubeData, 14 ) - totalViewsThisWeek;
  const percentageChangeViews = totalViewsLastWeek === 0 ? 0 : (((totalViewsThisWeek - totalViewsLastWeek) / totalViewsLastWeek) * 100).toFixed(2 );
  const totalWatchTime = calculateTotalWatchTime( youtubeData, 7 );
  const totalWatchTimeLastWeek = calculateTotalWatchTime( youtubeData, 14 ) - totalWatchTime;
  const percentageChangeWatchTime = totalWatchTimeLastWeek === 0 ? 0 : (((totalWatchTime - totalWatchTimeLastWeek) / totalWatchTimeLastWeek) * 100).toFixed(2 );
  const lastWeekSubscribers = calculateTotalSubscribers( youtubeData );
  const percentageChangeSubscribers = lastWeekSubscribers === 0 ? 0 : (((youtubeData.channel.statistics.subscriberCount - lastWeekSubscribers) / lastWeekSubscribers) * 100).toFixed(2 );
  const lastWeekAverageViewDuration = calculateAverageViewDuration( youtubeData, 7, 14 );
  const averageViewDuration = calculateAverageViewDuration( youtubeData, 0, 7 );
  const percentageChangeAverageViewDuration = lastWeekAverageViewDuration === 0 ? 0 : (((averageViewDuration - lastWeekAverageViewDuration) / lastWeekAverageViewDuration) * 100).toFixed(2 );
  setYoutubeCalculatedData({
      totalViewsThisWeek,
      percentageChangeViews,
      totalWatchTime,
      percentageChangeWatchTime,
      percentageChangeSubscribers,
      averageViewDuration,
      percentageChangeAverageViewDuration,
  });
  }
  }, [youtubeData]);

  return (
    <div className="flex flex-col">
      <div className="flex">
      <Tabs className="flex flex-1 " value={selectedValue} onValueChange={setSelectedValue}>
        <SidebarLayout>
        <div className="flex ">
            <TabsContent value="home" className="flex-1 p-4 pt-2 overflow-y-auto min-h-data-[state=active]:flex data-[state=active]:flex-col">
              <HomeSection store={store}/>
            </TabsContent>
            <TabsContent value="youtube" className="flex-1 p-4 pt-2 overflow-y-auto min-h-screen data-[state=active]:flex data-[state=active]:flex-col">
              <YoutubeSection />
            </TabsContent>
            <TabsContent value="instagram" className="flex-1 p-4 pt-2 overflow-y-auto min-h-screen data-[state=active]:flex data-[state=active]:flex-col">
              <InstagramSection />
            {/* <p className="text-3xl font-semibold ">Instagram Analytics</p>
            {instagramData && instagramData.userData.id ?
            <Card>
              <CardHeader className="flex-row justify-between">
                <CardTitle className="text-lg">
                    Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Avatar className="w-12 h-12 rounded-lg">
                  <AvatarImage src={instagramData.userData.profile_picture_url} />
                  <AvatarFallback>IG</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">@{instagramData.userData.username}</p>
                  <p className="text-sm text-secondary">{instagramData.userData.biography}</p>
                </div>
                </CardContent>
            </Card>
            : <></> }
            <div>
              <p className="text-lg font-medium text-secondary">Overview</p>
              <div className="flex gap-5 mt-3">
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Followers</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.followers_count}</p>
                      <div className="flex gap-1 mt-6 text-sm font-medium"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Total Follows</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.follows_count}</p>
                      <div className="flex gap-1 mt-6 text-sm font-medium"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
                  <Card className="flex shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-lg font-semibold">Post Count</p>
                      <p className="text-3xl font-semibold">{instagramData.userData.media_count}</p>
                      <div className="flex gap-1 mt-6 text-sm font-medium"><p className="text-[#34C759]">+20%</p><p className="text-secondary"> than last week</p></div>
                    </CardContent>
                  </Card>
              </div>
            </div>
            <div>
                <p className="mb-3 text-lg font-medium text-secondary">Top Content</p>
                {instagramData && <InstagramContentCarousel CarouselItems={instagramData.posts} />}
            </div> */}
            </TabsContent>
            <TabsContent value="templates" className="flex-1 p-4 pt-2 min-h-screen data-[state=active]:flex data-[state=active]:flex-col">
              <TemplateSection store={store} />
            </TabsContent>
            <TabsContent value="projects" className="flex-1 p-4 pt-2 space-y-6 min-h-screen data-[state=active]:flex data-[state=active]:flex-col">
              <ProjectSection store={store} />
            </TabsContent>
            <TabsContent value="settings" className="flex-1 p-4 pt-2 space-y-6 min-h-screen data-[state=active]:flex data-[state=active]:flex-col">
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
