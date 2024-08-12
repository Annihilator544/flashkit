import { LucidePlayCircle } from 'lucide-react';
import logo from './assets/logo.svg';
import Landing1 from './assets/Landing1.svg';
import Landing2 from './assets/Landing2.svg';
import Marquee from './components/magicui/marquee';
import Sparks from './assets/spark.svg'

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
                        <button className=' text-black px-4 border-[1px] border-black  py-2 rounded-full font-bold flex gap-2'><LucidePlayCircle/><p className='my-auto'>View Demo</p></button>
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
                </div>
            </div>
        </div>
    );
}

export default Landing;