import { LucideFacebook, LucideGithub, LucideInstagram, LucideTwitter } from "lucide-react";
import logo from '../assets/logo.svg';
import { Link } from "react-router-dom";

function Footer ({className}) {
  return (
    <footer className="max-md:hidden">
        <div className={'grid grid-cols-3 p-24 bg-white '+ className}>
            <div className=' text-lg'>
                <div className='flex gap-2 my-auto'>
                    <img src={logo} alt="logo" className=' h-[40px]' />
                </div>
                <p className=' text-lg'>The Influencer kit, Trusted since 2024</p>
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
                    <p className='text-primary text-xl font-semibold'>Link</p>
                    <Link to='/dashboard'>Home</Link>
                    <Link to='/legal'>Legal</Link>
                    <Link to='/privacy'>Privacy</Link>
                    <Link to='/terms'>Terms</Link>
                </div>
                <div className=' flex flex-col gap-3'>
                    <p className='text-primary text-xl font-semibold'>Community</p>
                    <Link to='/aboutus'>About Us</Link>
                    <Link to='/faq'>FAQ</Link>
                </div>
            </div>
            <div className=' text-sm mt-auto text-[#71717A] ml-auto text-left'>
                © 2024 All Rights Reserved by LIFTCO SOLUTIONS LTD
            </div>
        </div>
    </footer>
  )
}

export default Footer;