import { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Outlet, useRouteLoaderData } from 'react-router-dom';
import axios from 'axios';

import { useCollectionContext } from '../App';
import { Sidebar } from '../component';
import logo from '../assets/logo.png';


const API_URL = import.meta.env.VITE_API_URL;


const Home = () => {

  const [collections, setCollections] = useState();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const scrollRef = useRef(null);

  const user = useRouteLoaderData("root");
  const { setCollectionData } = useCollectionContext();

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });


  useEffect(() => {

    const fetchCollections = async () => {

      //const userToken = localStorage.getItem('user').split(',')[3];
      //const userId = userToken.split(":")[1].slice(1,-1);

      const userId = user._id;
      
      if (!userId) {
        console.error('User Id missing or invalid')
        setCollections(null);
      }
    
      try {
    
        const response = await axios.get(`${API_URL}/collection/?userId=${userId}`);
    
        if(response.status !== 200) {
          console.error('No data returned from API');
          setCollections(null);
        };

      
  
        setCollections(response.data);
        setCollectionData(response.data);
    
      } catch (error) {
        console.error("Error fetching collections:", error)
        setCollections(null);
      };
    };

    fetchCollections();
  }, [user._id])

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
        <div className='hidden md:flex h-screen flex-initial'>
          <Sidebar user={user && user} collections={collections}/>
        </div>
        <div className='flex md:hidden flex-row'>
          <div className='p-2 w-full flex flex-row justify-between itmes-center shadow-md'>
            <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)}/>
            <Link to='/'>
              <img src={logo} alt="logo" className='w-28' />
            </Link>
            <Link to={`/user-profile/${user?._id}`}>
              <img src={user?.image} alt="user picture" className='w-9 h-9 rounded-full' />
            </Link>
          </div>
          
          {toggleSidebar && (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
               <div className='absolute w-full flex justify-end items-center p-2'>
                  <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)}/>
               </div>
               <Sidebar closeToggle={setToggleSidebar} user={user && user} collections={collections}/>
            </div>
          )}
        </div>

        <div className='pb-2 flex-1 h-sreen overflow-y-scroll' ref={scrollRef}>
            <Outlet/>
        </div>  
    </div>
  );
};

export default Home