import logo from '../assets/logoNewMini.png';

export const LogoSection = {
  name: 'logo',
  Tab: (props) => (
      <div className=' md:py-[15px] max-md:px-4 flex' onClick={()=>window.location.href="/dashboard"}>
        <img src={logo} alt='logo' className='mx-auto mt-auto md:h-[42px] max-md:h-[36px]'  />
      </div>
  ),
  // we need observer to update component automatically on any store changes
  Panel: null
};
