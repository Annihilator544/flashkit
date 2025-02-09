
import { useEffect, useState } from 'react';
import logo from './assets/logo.svg'
import { Card } from './components/ui/card';
import { LucideChartNoAxesCombined, LucideCheck, LucideCircleDollarSign, LucidePlus, LucideThumbsUp } from 'lucide-react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from './components/ui/button';

const isLocalhost = typeof window !== "undefined" && window.location.href.indexOf('localhost') >= 0;
// Replace with your Facebook App details
const FB_APP_ID = '849578353662455'; // Replace with your app's Facebook App ID
const REDIRECT_URI = isLocalhost ? 'http://localhost:3000/onboarding':'https://app.flashkit.co.uk/onboarding'; // Replace with your app's redirect URI

const SCOPES = [
  'email',
  'public_profile',
  'instagram_basic',
  'pages_show_list',
  'pages_read_engagement',
  'business_management',
  'instagram_manage_insights',
  'instagram_branded_content_ads_brand',
  'instagram_branded_content_brand',
  'instagram_branded_content_creator',
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
    <Card className="w-full p-6 flex items-center gap-4 cursor-pointer" onClick={loginWithFacebook}>
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="instagram" className="w-8 h-8"/> 
        <span className="text-lg font-semibold">Connect Instagram</span>
        {localStorage.getItem('instagramAccessToken') ? <LucideCheck className="h-6 w-6 text-green-500 ml-auto"/> : <LucidePlus className="h-6 w-6 text-blue-500 ml-auto"/>}
    </Card>
  );
};

const ConnectButton = () => {
  
    const login = useGoogleLogin({
      onSuccess: tokenResponse => {
        localStorage.setItem('youtubeAccessToken', tokenResponse.accessToken);
      },
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
    });
  
    return (
    <Card className="w-full p-6 flex items-center gap-4 cursor-pointer" onClick={() => login()} >
        {/* youtube logo */}
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111748.png" alt="youtube" className="w-8 h-8"/>
        <span className="text-lg font-semibold">Connect Youtube</span>
        {localStorage.getItem("youtubeAccessToken") ? <LucideCheck className="h-6 w-6 text-green-500 ml-auto"/> : <LucidePlus className="h-6 w-6 text-blue-500 ml-auto"/>}
    </Card>
    );
  };

const GoalCard = ({title, Logo}) => {
    const [selected, setSelected] = useState(false);
    return (
        <Card className={`w-full p-4 flex items-center gap-4 cursor-pointer ${selected ? "border-primary bg-[#f6fbff]":""} `} onClick={()=>setSelected(!selected)}>
            <div className='p-2 bg-[#f6fbff] rounded-2xl'>
                <Logo className="h-6 w-6"/>
            </div>
            <span className="text-lg font-semibold">{title}</span>
        </Card>
    )
}

function Onboarding() {

    const [onboardingStep, setOnboardingStep] = useState(1);

    const extractAccessToken = (hash) => {
        const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
        return params.get('access_token');
      };

     useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          const token = extractAccessToken(hash);
          localStorage.setItem('instagramAccessToken', token);
          window.history.pushState({}, document.title, window.location.pathname);
        }
      });

  return (
    <div className='grid grid-cols-2 h-screen'>
        <div className=' bg-gradient-to-r from-[#A0D0EA] to-[#6CC2F1] flex-1 flex flex-col  rounded-r-[50px] SignUp'>
                
        </div>
        {onboardingStep === 1 ? <div className='flex flex-col flex-1 overflow-y-auto'>
            <div className='flex flex-col justify-center align-middle w-[80%] m-auto'>
                <img src={logo} alt='logo' className='h-12 mr-auto mb-10'/>
                <p className='text-2xl font-medium nter'>Connect Your Accounts</p>
                <p className='text-base font-normal text-secondary mb-10'>Link your social media accounts for personalized insights and suggestions</p>

                <div className='flex flex-col gap-4'>
                <FacebookLogin />
                <GoogleOAuthProvider clientId="981134062816-8dkf4i2lm59dhfotllmf43vlgc44408c.apps.googleusercontent.com">
                    <div className="App flex flex-col">
                        <ConnectButton />
                    </div>
                </GoogleOAuthProvider>
                </div>
                
                <div className='flex justify-between p-4 my-10'>
                    <p className='my-auto text-secondary cursor-pointer' onClick={()=>setOnboardingStep(2)}>Skip for now</p>
                    <Button onClick={()=>setOnboardingStep(2)}>Next</Button>
                </div>
            </div>
        </div>
        : onboardingStep === 2 ? <div className='flex flex-col flex-1 overflow-y-auto'>
            <div className='flex flex-col justify-center align-middle w-[80%] m-auto'>
                <img src={logo} alt='logo' className='h-12 mr-auto mb-10'/>
                <p className='text-2xl font-medium nter'>What's Your Goal?</p>
                <p className='text-base font-normal text-secondary mb-10'>Help us tailor your experience to your needs</p>

                <div className='flex flex-col gap-4'>
                    <GoalCard title="Grow My Audience" Logo={LucideChartNoAxesCombined}/>
                    <GoalCard title="Improve engagement" Logo={LucideThumbsUp}/>
                    <GoalCard title="Monetize my content" Logo={LucideCircleDollarSign}/>
                </div>
                
                <div className='flex justify-between p-4 my-10'>
                    <Button onClick={()=>setOnboardingStep(1)}>Back</Button>
                    <Button onClick={()=>window.location.href="/dashboard"}>Next</Button>
                </div>
            </div>
            </div>
            :
            <></>
        }
    </div>
  );
}

export default Onboarding;