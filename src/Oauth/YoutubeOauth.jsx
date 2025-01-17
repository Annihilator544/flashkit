import React, { useState, useCallback } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useYoutubeData } from 'store/use-youtube-data';
import { Button } from '../components/ui/button';
import { LucideCheck, LucideLogIn } from 'lucide-react';
import localforage from 'localforage';
import { useAuthStore } from 'store/use-auth-data';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ConnectButton = ({ onSuccess, afterSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      setIsConnected(true);
      onSuccess(tokenResponse.access_token);
      afterSuccess();
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  return (
    <Button onClick={() => login()} className='my-5 max-w-96'>
      {isConnected ? "Connected" :"Connect"} {isConnected ?  <LucideCheck className='h-5 w-5 ml-2' /> :<LucideLogIn className='h-5 w-5 ml-2' />}
    </Button>
  );
};

function YoutubeOauth() {
  const handleLoginSuccess = (accessToken) => {
    localStorage.setItem('youtubeAccessToken', accessToken);
  };
  
  const { setYoutubeData } = useYoutubeData();
  const { user } = useAuthStore();

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

  function calculateDailyChanges(processedData, engagementData) {
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
    const dailyData = calculateDailyChanges(processedData, engagementData);
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
  

  const fetchDataManually = useCallback(async () => {
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
            Authorization: `Bearer ${localStorage.getItem('youtubeAccessToken')}`,
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
                ':new_items': localStorage.getItem('youtubeAccessToken'),
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
    }
  }, [setYoutubeData]);

  

  return (
    <GoogleOAuthProvider clientId="981134062816-8dkf4i2lm59dhfotllmf43vlgc44408c.apps.googleusercontent.com">
      <div className="App flex flex-col">
        <ConnectButton onSuccess={handleLoginSuccess} afterSuccess={fetchDataManually} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default YoutubeOauth;