import { LucidePlayCircle } from 'lucide-react';
import logo from './assets/logo.svg';
import Landing1 from './assets/Landing1.svg';

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
                    <button className='bg-[#ff847c] text-white px-4 py-2 rounded-full font-bold'>Sign in</button>
                </div>
            </div>
            <div className='grid grid-cols-2 p-36 max-w-[100vw] gap-10'>
                <div>
                    <p className=' font-bold text-6xl '>Create, Share, and Track Your Success</p>
                    <p className='text-lg my-7 '>Empower your content creation with our all-in-one social media kit, designed to help you craft visually stunning posts and monitor your performance instantly.</p>
                    <div className=' flex gap-7 my-2'>
                        <button className='bg-[#ff847c] text-white px-4 border-transparent  py-2 rounded-full font-bold'>Create Account</button>
                        <button className=' text-black px-4 border-[1px] border-black  py-2 rounded-full font-bold flex gap-2'><LucidePlayCircle/><p className='my-auto'>View Demo</p></button>
                    </div>
                </div>
                <div className='w-full'>
                    <img src={Landing1} alt="Landing1" className=' w-[90%]' />
                </div>
            </div>
        </div>
    );
}

export default Landing;