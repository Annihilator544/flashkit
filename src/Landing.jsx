import { LucideFacebook, LucideGithub, LucideInstagram, LucidePlayCircle, LucideTwitter } from 'lucide-react';
import logo from './assets/logo.svg';
import Landing1 from './assets/Landing1.svg';
import Landing2 from './assets/Landing2.svg';
import Landing3 from './assets/Landing3.svg';
import Marquee from './components/magicui/marquee';     
import Sparks from './assets/spark.svg';
import connect from './assets/connect.svg';
import create from './assets/create.svg';
import analyze from './assets/analyze.svg';
import share from './assets/share.svg';
import { Link } from 'react-router-dom';

function Landing() {

    return (
        <div className="bg-[#feeae6] Inter">
            <div className="flex h-[10vh] border-b-black border-b-[1px] px-20 justify-between">
                <div className='flex gap-2 my-auto'>
                    <img src={logo} alt="logo" className='w-[20px] h-[40px]' />
                    <p className=' font-semibold text-3xl'>Flashkit</p>
                </div>
                <div className='Rethink flex gap-7 font-normal text-lg my-auto'>
                    <p className='my-auto'>About</p>
                    <p className='my-auto'>Plans</p>
                    <p className='my-auto'>Learn More ?</p>
                    <button className='bg-[#ff847c] text-white px-4 py-[4px] rounded-full font-bold'>Sign in</button>
                </div>
            </div>
            <div className='grid grid-cols-2 p-36 max-w-[100vw] gap-10'>
                <div className='my-auto flex-1'>
                    <p className=' font-bold text-6xl '>Create, Share, and Track Your Success</p>
                    <p className='text-lg my-10 '>Empower your content creation with our all-in-one social media kit, designed to help you craft visually stunning posts and monitor your performance instantly.</p>
                    <div className=' flex gap-7 my-2'>
                        <button className='bg-[#ff847c] text-white px-4 border-transparent  py-2 rounded-full font-bold'>Create Account</button>
                        <Link to='/canvas' className=' hover:no-underline'>
                            <button className=' text-black px-4 border-[1px] border-black  py-2 rounded-full font-bold flex gap-2'><LucidePlayCircle/><p className='my-auto'>View Demo</p></button>
                        </Link>
                    </div>
                </div>
                <div className='w-full'>
                    <img src={Landing1} alt="Landing1" className='ml-auto' />
                </div>
            </div>
            <Marquee pauseOnHover className="[--duration:20s] bg-[#ffe296] text-2xl font-bold border-t-[1px] py-4 border-black border-b-[1px]">
                <p>Connect</p>
                <img src={Sparks} alt="Sparks" className='mx-10' />
                <p>Create</p>
                <img src={Sparks} alt="Sparks" className='mx-10' />
                <p>Analyze</p>
                <img src={Sparks} alt="Sparks" className='mx-10' />
                <p>Share</p>
                <img src={Sparks} alt="Sparks" className='mx-10' />
            </Marquee>
            <div className='grid grid-cols-[40%,60%] bg-[#ffd7c0]'>
                <div className=' bg-[#ffd7c0] mx-auto my-auto'>
                    <img src={Landing2} alt="Landing2" className='' />
                </div>
                <div className='bg-white flex flex-col gap-10 py-20 px-16'>
                    <p className='text-[#ff847c] text-lg font-medium'>SOCIAL MEDIA KIT</p>
                    <p className='text-5xl font-bold'>Showcase your influence</p>
                    <p className='text-lg max-w-[70%]'>Discover over 100+ templates tailored for 20+ inluencer A markets. Choose the perfect design that represents you and your brand.</p>
                    <button className=' text-black px-4 border-[1px] border-black max-w-fit py-2 rounded-full font-bold flex gap-2'><LucidePlayCircle/><p className='my-auto'>View Demo</p></button>
                    <div className='grid grid-cols-2 max-w-[70%] mt-14'>
                        <div className='flex gap-5 '>
                            <img src={connect} alt="connect" className='' />
                            <div className='flex flex-col'>
                                <p className='text-lg font-bold'>Connect</p>
                                <p className='text-base'>Your social media</p>
                            </div>
                        </div>
                        <div className='flex gap-5'>
                            <img src={create} alt="create" className='' />
                            <div className='flex flex-col'>
                                <p className='text-lg font-bold'>Create</p>
                                <p className='text-base'>Your social media</p>
                            </div>
                        </div>
                        <div className='flex gap-5 mt-7'>
                            <img src={analyze} alt="analyze" className='' />
                            <div className='flex flex-col'>
                                <p className='text-lg font-bold'>Analyze</p>
                                <p className='text-base'>Your social media</p>
                            </div>
                        </div>
                        <div className='flex gap-5 mt-7'>
                            <img src={share} alt="share" className='' />
                            <div className='flex flex-col'>
                                <p className='text-lg font-bold'>Share</p>
                                <p className='text-base'>Your social media</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 p-36 max-w-[100vw] gap-10 bg-[#ffe296]'>
                <div className='my-auto flex-1'>
                    <p className='text-[#006bd1] text-lg font-medium my-7'>LIVE STATISTICS</p>
                    <p className=' font-bold text-5xl '>Track and boost </p>
                    <p className=' font-bold text-5xl '>your engagement </p>
                    <p className='text-lg my-10 '>Unlock the full potential of your social media presence with out Al-Powered engagement performance tracker. strive for platinum status with personalised recommendations tailored to boost your engagement</p>
                    <div className=' flex gap-7 my-2'>
                        <button className=' text-black px-4 border-[1px] border-black  py-2 rounded-full font-bold flex gap-2'><p className='my-auto'>Get Started</p></button>
                    </div>
                </div>
                <div className='w-full'>
                    <img src={Landing3} alt="Landing1" className='ml-auto' />
                </div>
            </div>
            <div className=' grid grid-cols-3 p-24 bg-white'>
                <div className=' text-lg'>
                    <div className='flex gap-2 my-auto'>
                        <img src={logo} alt="logo" className='w-[20px] h-[40px]' />
                        <p className=' font-semibold text-3xl'>Flashkit</p>
                    </div>
                    <p className=' text-lg'>The Influencer kit, Trusted since 2018</p>
                    <div className=' flex gap-4 mt-20'>
                        <div className=' p-2 border-[#D4D4D8] border-2 rounded-full w-fit text-black hover:text-white hover:border-transparent hover:bg-[#ff847c]'>
                            <LucideTwitter className='' />
                        </div>
                        <div className=' p-2 border-[#D4D4D8] border-2 rounded-full w-fit text-black hover:text-white hover:border-transparent hover:bg-[#ff847c]'>
                            <LucideFacebook className='' />
                        </div>
                        <div className=' p-2 border-[#D4D4D8] border-2 rounded-full w-fit  hover:text-white hover:border-transparent hover:bg-[#ff847c]'>
                            <LucideInstagram className='' />
                        </div>
                        <div className=' p-2 border-[#D4D4D8] border-2 rounded-full w-fit text-black hover:text-white hover:border-transparent hover:bg-[#ff847c]'>
                            <LucideGithub className='' />
                        </div>
                    </div>
                </div>
                <div className=' grid grid-cols-2'>
                    <div className=' flex flex-col gap-3'>
                        <p className='text-[#ff847c] text-xl font-semibold'>Link</p>
                        <p>About Us</p>
                        <p>Career</p>
                        <p>Contact</p>
                        <p>Blog</p>
                    </div>
                    <div className=' flex flex-col gap-3'>
                        <p className='text-[#ff847c] text-xl font-semibold'>Community</p>
                        <p>Help Center</p>
                        <p>Be Pro</p>
                    </div>
                </div>
                <div className=' text-sm mt-auto text-[#71717A] ml-auto text-left'>
                    © 2024 All Rights Reserved by LILA LLC
                </div>
            </div>
        </div>
    );
}

export default Landing;