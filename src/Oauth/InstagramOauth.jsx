import React, { useEffect, useState } from 'react';

// Replace with your Facebook App details
const FB_APP_ID = '849578353662455'; // Replace with your app's Facebook App ID
const REDIRECT_URI = 'http://localhost:3000/dashboard'; // Replace with your app's redirect URI

const FacebookLogin = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Check if we have an access token in the URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const token = extractAccessToken(hash);
      setAccessToken(token);
      // Optionally, store the token in local storage or cookies
      console.log('Access Token:', token);
      localStorage.setItem('fb_access_token', token);
    }
  }, []);

  // Redirect the user to Facebook OAuth login page
  const loginWithFacebook = () => {
    const oauthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=email,public_profile`;

    window.location.href = oauthUrl;
  };

  // Extract access token from the URL hash
  const extractAccessToken = (hash) => {
    const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
    return params.get('access_token');
  };

  return (
    <div>
      <h2>Facebook OAuth 2.0 Login</h2>
      {accessToken ? (
        <div>
          <p>Access Token: {accessToken}</p>
        </div>
      ) : (
        <button onClick={loginWithFacebook}>Login with Facebook</button>
      )}
    </div>
  );
};

export default FacebookLogin;
