import { Link } from "react-router-dom";
import logo from '../assets/logo.svg';

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
                    <button className='bg-[#ff847c] text-white px-4 py-[4px] rounded-full font-bold'>Sign in</button>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;