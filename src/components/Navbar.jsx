import { Link } from "react-router-dom";
import logo from '../assets/logoNew.png';
import { Button } from './ui/button';

function Navbar (){
    return(
        <div className="flex h-[10vh] border-b-black border-b-[1px] md:px-20 max-md:px-1 justify-between">
            <Link to='/' className=' hover:no-underline my-auto'>
                <div className='flex gap-2 my-auto'>
                    <img src={logo} alt="logo" className=' h-[40px]' />
                    {/* <p className=' font-semibold text-3xl'>FlashKit</p> */}
                </div>
            </Link>
            <div className='Rethink flex gap-7 font-normal text-lg my-auto'>
                <Link to='/login' className=' hover:no-underline'>
                    <Button className=' px-6  rounded-full font-bold'>Sign in</Button>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;