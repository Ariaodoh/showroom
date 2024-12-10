import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch} from 'react-icons/io';
import { UserPropType, SearchTermPropType, SetSearchTermPropType } from './propTypes';

const Navbar = ({ searchTerm, setSearchTerm, user}) => {

  const navigate = useNavigate();

  const handleFocus = () => {
      navigate('/search');
  };
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  if (user) {

    return (
      <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
        <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
          <IoMdSearch fontSize={21} className='ml-1'/>
          <input
            type='text'
            onChange={handleChange}
            placeholder='Search'
            value={searchTerm}
            onFocus={handleFocus}
            className='p-2 w-full bg-white outline-none'
          />
        </div>
        <div className='flex gap-3'>
          <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
            <img src={user.image} alt="user-picture" className='w-14 h-12 rounded-lg' />
          </Link>
          <Link to='/create-pin' className='bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center'>
            <IoMdAdd/>
          </Link>
        </div>
      </div>
    );
  }

  return null;
  
}


Navbar.propTypes = {
  user: UserPropType.isRequired,
  searchTerm: SearchTermPropType.isRequired,
  setSearchTerm: SetSearchTermPropType.isRequired,
};


export default Navbar