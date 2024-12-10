import { useState } from 'react';
import { Link, useRouteLoaderData, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import axios from 'axios';
import { PinPropType } from './propTypes';


const API_URL = import.meta.env.VITE_API_URL;

const Pin = ({ pin }) => {
    
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();
    
    const { postedBy, image, _id, destination, save } = pin;
    const urlArray = image?.url.split('/');
    const imageName = urlArray[urlArray.length - 1];

    const user = useRouteLoaderData("root");

    const deletePin = async (id) => {
      try{
        const response = await axios.delete(`${API_URL}/pin/${id}`);
        if (response.status != 200){
            throw new Error(response);
        }

        window.location.reload();

        } catch (error) {
            console.error(`Error delete ${id} pin fron DB:`, error );
            //Boundary Error?
            //throw new Error ('Server Error, Please Try Again Later');
      };
    };

   const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub)?.length);
   
   //alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

   const savePin = async (id) => {
      if(!alreadySaved) {
          setSavingPost(true);

          const userId = user?._id;
          
          if ( userId ) {
              try{
                  const response = await axios.patch(`${API_URL}/pin/save-pin`, { userId: userId, postId: id });
                  if (response.status != 200){
                      throw new Error(response);
                  }
                  window.location.reload();
                  setSavingPost(false);
      
              } catch (error) {
                  console.error(`Error updating ${id} pin in DB:`, error );
                  //Boundary Error?
                  //throw new Error ('Server Error, Please Try Again Later');
              };
          } else {
            console.error('User session expired, login required');
            alert('Session expired, please login ');
            navigate('/login');
          }
          
      }
    };


    return (
       <div className='m-2'>
           <div
              onMouseEnter={() => setPostHovered(true)}
              onMouseLeave={() => setPostHovered(false)}
              onClick={() => navigate(`/pin-detail/${_id}`)}
              className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
           >
               {image && (
                <img className='rounded-lg w-full' src={image.url || "https://via.placeholder.com/250" } alt="user-post"/>
               )}
               {postHovered && (
                   <div
                      className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 pt-2 z-50'
                   >
                       <div className='flex items-center justify-between'>
                          <div className='flex gap-2'>
                             <a 
                               href={`${image?.url}&dl=${imageName}`}
                               download
                               onClick={(e) => {
                                e.stopPropagation();
                               }}
                               className='bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'  
                             >
                                <MdDownloadForOffline/>
                             </a>
                          </div>
                          {alreadySaved ? (
                             <button type='button' className='bg-sky-900 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                               {pin?.save?.length} Liked
                             </button>
                          ) : (
                            <button
                               onClick={(e) => {
                                e.stopPropagation();
                                savePin(_id);
                               }}
                               type='button'
                               className='bg-sky-900 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                            >
                                {pin?.save?.length} {savingPost ? 'Saving' : 'Like'}
                            </button>
                          )
                        }
                       </div>
                       <div className='flex justify-between items-center gap-2 w-full'>
                           {destination?.slice(8).length> 0 ? (
                              <a 
                                href={destination}
                                target='_blank'
                                className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                rel='noreferrer'
                              >
                                <BsFillArrowUpRightCircleFill/>
                                {destination.length > 17 ? destination?.slice(8, 17): destination.slice(8)}
                              </a>
                           ) : undefined
                           }
                           {
                            postedBy?._id === user?._id && (
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePin(_id);
                                  }}
                                  className='bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none'
                                >
                                    <AiTwotoneDelete/>
                                </button>
                            )
                           }
                       </div>
                   </div>
               )}
           </div>
           <Link to={`/user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
              <img 
                  className='w-8 h-8 rounded-full object-cover'
                  src={postedBy?.image} 
                  alt="user-profile" />
                  <p className='font-semibold capitalize'>{postedBy?.userName}</p>
           </Link>
       </div>
    );
};


Pin.propTypes = {
  pin: PinPropType.isRequired,
};


export default Pin;