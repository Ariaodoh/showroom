import {useState} from 'react';
import { NavLink} from 'react-router-dom';
import axios from 'axios';
import { CloseTogglePropType, UserPropType, CollectionsArrayPropType, PinIdPropType } from './propTypes';
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdAddToPhotos } from "react-icons/md";
import favicon from '../assets/favicon.png'


const API_URL = import.meta.env.VITE_API_URL;

export const Drawer = ({ closeToggle, user, collections, pinId }) => {

    const [linkHover, setLinkHover] = useState(false);

    
    const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
    const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold transition-all duration-200 ease-in-out capitalize';
    
    
    const handleCloseDrawer = () => {
        if (closeToggle) closeToggle(false);
    };


    const addToCollection = async ( id )  => {

        if (pinId && collections){
    
          try {
            const result = await axios.patch(`${API_URL}/collection/add-to-collection`, {pinId: pinId, collectionId: id });
            if (result.status !== 200) {
             
              throw new Error("Failed to add to collection", result);   
            }
            
            handleCloseDrawer();

          } catch (error) {
            console.error('Failed to add idea to collection', error);
          };
        };   
      };


    return (
        <div className='flex flex-col bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className='flex flex-col mt-10'>  
                {user && collections?.map((category) => {
                    return (
                        <div 
                            key={category._id} 
                            className='relative flex mb-7 '
                            onMouseEnter={() => setLinkHover(true)}
                            onMouseLeave={() => setLinkHover(false)}
                        >
                            <NavLink
                                className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)}
                                //onClick={addToCollection(category?._id)}
                            >                  
                                <img 
                                src={category.image.url || favicon} 
                                alt="avatar" 
                                className='w-8 h-8 mr-4 rounded-full shadow-sm'
                                />
                                {category.title}
                                
                            </NavLink>
                            { linkHover && (
                                    <button
                                    className="absolute pr-10 right-0 z-1 p-2 space-x-reverserounded-full cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCollection(category?._id)
                                        
                                        }}
                                    >
                                    <IoIosAddCircleOutline size={25} className='hover:text-red-500'/>
                                    </button>
                                )}
                        </div>
                    );
                })}
                </div>
                { user ? (
                <div> 
                    <NavLink
                    to={'/category/create'}
                    onClick={handleCloseDrawer} 
                    className='flex flex-row pt-5 px-5 text-gray-500 hover:text-sky-900 transition-all duration-200 ease-in-out capitalize'
                    >
                    <MdAddToPhotos size={30} className='mr-5'/> Add Collection 
                    </NavLink>
            </div>
            ) : (
            <NavLink
                to={'/login'}
                onClick={handleCloseDrawer} 
                className='flex flex-row pt-5 px-5 text-gray-500 hover:text-sky-900 transition-all duration-200 ease-in-out capitalize'
                >
                <MdAddToPhotos size={30} className='mr-5'/> Add Collection 
                </NavLink>
            )}

        </div>
    );
}

Drawer.propTypes = {
    closeToggle: CloseTogglePropType.isRequired,
    user: UserPropType.isRequired,
    collections: CollectionsArrayPropType,
    pinId: PinIdPropType,
};

export default Drawer;