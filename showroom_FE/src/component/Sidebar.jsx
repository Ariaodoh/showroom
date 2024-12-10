import {useState} from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { RiHomeFill} from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { MdAddToPhotos } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";
import logo from '../assets/logo.png';
import favicon from '../assets/icon.png';
import axios from 'axios';
import { UserPropType, CloseTogglePropType, CollectionsArrayPropType } from './propTypes';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


const API_URL = import.meta.env.VITE_API_URL;


const Sidebar = ({ closeToggle, user, collections }) => {
  
  const [linkHover, setLinkHover] = useState(false);
  const navigate = useNavigate();

  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };



  const deleteCollection = async ( id ) => {

      if (!id) {
        throw new Error("Collection Id required to delete collection");
  
      }

      try {
        const response = await axios.delete(`${API_URL}/collection/${id}`);

        if(response.status !== 200){
          throw new Error("Unable to delete collection");
        }

        navigate('/');
        handleCloseSidebar();
        window.location.reload();

      } catch (error) {
        console.log('Failed to delete colection', error);
      }
  }

  //console.log(collections)
  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link 
          to="/"
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className='w-full' />
        </Link>
        <div className='flex flex-col gap-5'>
          <NavLink
            to="/"
            className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)}
            onClick={handleCloseSidebar}
          >
              <RiHomeFill/>
              Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Your Collections</h3>
          {user && collections?.map((category) => {
              const searchTokens = category.title.split(" ");
              searchTokens.push(category.idea);
              searchTokens.push(category._id)
              const filter = searchTokens.join("-");

              return (
                <div 
                  key={category._id} 
                  className='relative flex'
                  onMouseEnter={() => setLinkHover(true)}
                  onMouseLeave={() => setLinkHover(false)}
                  >
                  <NavLink
                    to={`/category/${filter}`}
                    className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)}
                    onClick={handleCloseSidebar}
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
                          className="absolute p-2 right-0 z-1 p-2 space-x-reverserounded-full cursor-pointer"
                          onClick={(e) => {
                              e.stopPropagation();
                              deleteCollection(category?._id)
                              
                            }}
                          >
                          <RiDeleteBin3Line size={21} className='hover:text-red-500'/>
                        </button>
                    )}
                </div>
            );
          })}
        </div>
        { user ? (
          <div> 
            <NavLink
              to={`/category/create`}
              onClick={handleCloseSidebar} 
              className='flex flex-row pt-5 px-5 text-gray-500 hover:text-sky-900 transition-all duration-200 ease-in-out capitalize'
              >
              <MdAddToPhotos size={30} className='mr-5'/> Add Collection 
            </NavLink>
          </div>
        ) : (
          <NavLink
              to={`/login`}
              onClick={handleCloseSidebar} 
              className='flex flex-row pt-5 px-5 text-gray-500 hover:text-sky-900 transition-all duration-200 ease-in-out capitalize'
              >
              <MdAddToPhotos size={30} className='mr-5'/> Add Collection 
            </NavLink>
        )}

      </div>
      { user && (
        <Link
          to={`user-profile/${user._id}`}
          className='flex my-5 mb-3 gap-2 items-center bg-white rounded-lg shadow-lg mx-3'
          onClick={handleCloseSidebar}
        >
          <img src={user.image} alt="avatar" className='w-10 h-10 rounded-full' />
          <p>{user.userName}</p>
          <IoIosArrowForward/>
        </Link>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  closeToggle: CloseTogglePropType.isRequired,
  collections: CollectionsArrayPropType,
  user: UserPropType.isRequired,
};

export default Sidebar;