import { Button } from '../components/ui/button';
import { LucideLogIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useInstagramData } from 'store/use-instagram-data';

// Replace with your Facebook App details
const FB_APP_ID = '849578353662455'; // Replace with your app's Facebook App ID
const REDIRECT_URI = 'https://app.flashkit.co.uk/dashboard'; // Replace with your app's redirect URI

const SCOPES = [
  'email',
  'public_profile',
  'instagram_basic',
  'pages_show_list',
  'pages_read_engagement',
  'business_management',
  'instagram_manage_insights',
];

const FacebookLogin = () => {

  // Redirect the user to Facebook OAuth login page
  const loginWithFacebook = async () => {
    const oauthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=${SCOPES.join(',')}`;

    window.location.href = oauthUrl;
  };

  return (
      <Button onClick={loginWithFacebook} className='my-5 max-w-96'>
          Connect <LucideLogIn className='h-5 w-5 ml-2' />
      </Button>
  );
};

export default FacebookLogin;
