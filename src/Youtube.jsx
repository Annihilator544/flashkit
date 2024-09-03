import React, { useState, useCallback } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useYoutubeData } from 'store/use-youtube-data';
import { Button } from './components/ui/button';

const ConnectButton = ({ onSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { setData } = useYoutubeData();

  const fetchYouTubeAnalytics = useCallback(async (accessToken) => {
    try {
      const response = await axios.get(
        'https://youtubeanalytics.googleapis.com/v2/reports', {
          params: {
            "ids": "channel==MINE",
            startDate: '2019-01-01',
            endDate: '2024-12-31',
            metrics: 'comments,likes,dislikes,shares,views',
            dimensions: 'day',
            sort: 'day'
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      // Process and display the data
      const arr = response.data.rows;
      for(let i=0; i<arr.length; i++){
        for(let j=1; j<arr[i].length; j++){
          if(arr[i][j] !== 0){
            console.log(arr[i][0], arr[i][j]);
          }
        }
      }
      setData(response.data);
    } catch (error) {
      console.error('Error fetching YouTube Analytics:', error);
    }
  }, [setData]);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse);
      setIsConnected(true);
      onSuccess(tokenResponse.access_token);
      fetchYouTubeAnalytics(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  return (
    <Button onClick={() => login()} className='my-5 max-w-96'>
      {isConnected ? 'Connected' : 'Connect YouTube Account'}
    </Button>
  );
};

function Youtube() {
  const handleLoginSuccess = (accessToken) => {
    console.log('Access Token:', accessToken);
  };
  
  const { data, setData } = useYoutubeData();

  const fetchDataManually = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://youtubeanalytics.googleapis.com/v2/reports', {
          params: {
            "ids": "channel==MINE",
            startDate: '2019-01-01',
            endDate: '2024-12-31',
            metrics: 'comments,likes,dislikes,shares,views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained',
            dimensions: 'day',
            sort: 'day'
          },
          headers: {
            Authorization: `Bearer ya29.a0AcM612zTot2Y9KVbw_xxiDT9xBc7mEYdLzWXmSzkyTcA69a7JtyY5TtuzuwZHIHirrbseysWJd4SK1WHaMFGo4dZeSjHd8oJa31OHR3cwwq0xoloLifZ_M5xHPgRA0uPJeXK5X0sno9DjqX9DnaU9zBGl47SDSWywgaCgYKAesSARISFQHGX2MiCmvQlcegr3ngBPhzWhQ-bg0169`,
          },
        }
      );
      console.log(response.data);
      setData(response.data);
      const channelResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'statistics',
            mine: true,
          },
          headers: {
            Authorization: `Bearer ya29.a0AcM612zTot2Y9KVbw_xxiDT9xBc7mEYdLzWXmSzkyTcA69a7JtyY5TtuzuwZHIHirrbseysWJd4SK1WHaMFGo4dZeSjHd8oJa31OHR3cwwq0xoloLifZ_M5xHPgRA0uPJeXK5X0sno9DjqX9DnaU9zBGl47SDSWywgaCgYKAesSARISFQHGX2MiCmvQlcegr3ngBPhzWhQ-bg0169`,
          },
        }
      );
      console.log(channelResponse.data);
      const subscriberCount = channelResponse.data.items[0].statistics.subscriberCount;
      console.log(subscriberCount);
      
    } catch (error) {
      console.error('Error fetching YouTube Analytics:', error);
    }
  }, [setData]);

  

  return (
    <GoogleOAuthProvider clientId="981134062816-8dkf4i2lm59dhfotllmf43vlgc44408c.apps.googleusercontent.com">
      <div className="App flex flex-col">
        <h1>YouTube Analytics Dashboard</h1>
        <ConnectButton onSuccess={handleLoginSuccess} />
        <Button onClick={fetchDataManually} className="my-5 max-w-96">fetch data</Button>
        {data && data.rows && data.rows.length > 0 && (
          <table>
            <thead>
              <tr>
                {data.columnHeaders.map(header => (
                  <th key={header.name} className='p-3'>{header.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, index) => (
                    <td key={index} className='p-3'>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            </table>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default Youtube;