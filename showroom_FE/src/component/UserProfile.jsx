import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { BsBookmarkPlusFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { useParams, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import axios from "axios";
import Spinner from './Spinner';
import Masonry from 'react-masonry-css';
import Pin from './Pin';
import banner from '../assets/banner.png';


const activeBtnStyles = 'bg-sky-900 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';


const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [userIsReady, setUserIsReady] = useState(false);
  const [saveDpBtn, SetSaveDpBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postHovered, setPostHovered] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();
  const fileInputRef  = React.useRef();

  const User = useRouteLoaderData("root");

  useEffect(() => {
    const fetchUser = async () => {
      //Retrieve user from BE Api.
      try{
        const response = await axios.get(`${API_URL}/user/${userId}`);
        if (response.status != 200){
            throw new Error(response);
        }
        
        setUser(response.data); 
  
        } catch (error) {
            console.error("Error fetching user fron DB:", error );
            //Boundary Error?
            //throw new Error ('Server Error, Please Try Again Later');
        };
      };
  
      fetchUser()
  }, [userId])


  useEffect(() => {
    if (user) {
      setUserIsReady(true);
    }
  }, [user])

  useEffect(() => {
    
   if (userIsReady) {
      const timeoutId = setTimeout(() => {
          setImageAsset(user?.urlRef.asset);
          
      }, 1000)

      return () => clearTimeout(timeoutId);
   }
   
  }, [userIsReady, user]);


  useEffect(() => {
    
    const fetchUserPostData = async () => {
      
      if (text === 'Created') {
        try {
          const response = await axios.get(`${API_URL}/pin/user-created?userId=${userId}`);
          if (response.status !== 200 ){
            throw new Error("Failed to fetch user's posts");
          }

          setPins(response.data);

        } catch (error) {
          console.log(error);
        }
      } else {
        const response = await axios.get(`${API_URL}/pin/user-saved?userId=${userId}`);
        if (response.status !== 200 ){
          throw new Error("Failed fetching user saved posts");
        }
        setPins(response.data)
       
      }
    }
    
    fetchUserPostData();
  }, [text, userId]);


  const uploadPhoto = async (e) => {
    const  selectedFile = e.target.files?.[0];
      if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg') {
        setWrongImageType(false);
        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const response = await axios.post(`${API_URL}/pin/asset-upload`, formData);

          if (response.status != 201) {
            throw new Error(response)
          }


          setImageAsset(response.data.url);
          setLoading(false);
          SetSaveDpBtn(true);

        } catch (error) {
          console.error("File upload failed", error.message || error)
        }
      } else {
        setLoading(false);
        setWrongImageType(true);
      }
  };
  


  const saveDp = async () => {

    const imageId = imageAsset?._id;
   

      try {
        const response = await axios.post(`${API_URL}/user/edit-dp`, { imageId: imageId, userId: userId, imageUrl: imageAsset?.url});
        if ( response.status !==201 ) {
          console.error('Failed to fetch user display picture')
        }
  
      
        SetSaveDpBtn(false);
  
      } catch (error) {
        setImageAsset(null);
        SetSaveDpBtn(false);
        console.error({'Failed to fetch user dispaly image': error});
      }   
  };


  const handleLogout = () => {
    googleLogout(); //Logs user session off

    console.log('User logged out successfully');

    localStorage.removeItem('user');
    navigate('/login');
  };


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };


  const breakpointColumnsObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1100: 3,
    700: 2,
    500: 1
  };

  
 
  if (!user) return <Spinner message="Loading profile..."/>;


  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div 
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            className="flex flex-col justify-center items-center"
            >
            {loading && (
                <Spinner className='absolute mt-20'/>
              )}
            {
              wrongImageType && (
                <p>Wrong file type.</p>
              )}
            {postHovered && (
              <div className='absolute bottom-24 z-1 right-0 p-2 opacity-70'>
                {userId === User._id && (
                  <>
                  {saveDpBtn ? (
                      <button
                      type="button"
                      className="bg-white p-2 rounded-full  cursor-pointer outline-none shadow-md"
                      onClick={saveDp}
                      >
                        <BsBookmarkPlusFill fontSize={21} />
                      </button>
                    ) : (
                      
                      <button
                      type="button"
                      className="bg-white p-2 rounded-full  cursor-pointer outline-none shadow-md"
                      onClick={handleButtonClick}
                      >
                        <MdEdit fontSize={21} />
                      </button>
                    )}
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={uploadPhoto}
                      style={{ display: 'none'}} 
                    />
                  </>
                )}
              </div>
            )}
            {imageAsset ? (
              <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src={imageAsset}
              alt="user-banner-pic"
            />
            ) : (
              <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src={banner}
              alt="user-banner-pic"
              />
            )}
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>
          
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User._id && (
                  <button
                    type="button"
                    aria-label='Log Out?'
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={handleLogout}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
              )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Liked
          </button>
        </div>

        <div className="px-2">
          {pins && (
            <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointColumnsObj}>
              {pins?.map( pin => (
                  <Pin key={pin._id} pin={pin} className='w-max' />
                ))}
            </Masonry>    
          )}
        </div>

        {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Posts Found!
        </div>
        )}
      </div>

    </div>
  );
};


export default UserProfile