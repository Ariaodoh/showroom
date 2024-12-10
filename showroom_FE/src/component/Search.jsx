import { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import Pin from './Pin';
import Masonry from 'react-masonry-css';
import Spinner from './Spinner';

const API_URL = import.meta.env.VITE_API_URL;

const Search = () => {
  const context = useOutletContext();
  const { searchTerm } = context;
  
  const [ pins, setPins ] = useState();
  const [ loading, setLoading ] = useState(false);
  

  const fetchData = async ()  => {
    if (searchTerm !== ''){
      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}/feed/${searchTerm.toLowerCase()}`)

        if(response.status !== 200 ){
          throw new Error("Failed to filter posts", response);   
        }

        setLoading(false);
        setPins(response.data);
        

      } catch (error) {
        console.error('Error fetching posts', error);
      }
    } else {

      try {
        const response = await axios.get(`${API_URL}/feed`);
        
        if (response.status !== 200) {
          throw new Error("Faild to fetch posts", response);  
        }

        setLoading(false);
        setPins(response.data); 
       

      } catch (error) {
        console.error('Error fetching posts', error);
      }
    }
  }

  useEffect(() => {
     fetchData();
  }, [searchTerm]);

  const breakpointColumnsObj = {
    
    default: 4,
    3000: 6,
    2000: 5,
    1100: 3,
    700: 2,
    500: 1
  };

  
  
  return (
    <div>
      { 
        loading && <Spinner message="Fetching posts"/>
      }
      {
        pins?.length !== 0 && (
        <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointColumnsObj}>
          {pins?.map( pin => (
              <Pin key={pin._id} pin={pin} className='w-max' />
          ))}
        </Masonry>  
      )
    }
    {
      pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>No Posts Found</div>
      )
    }
      
    </div>
  )
}

export default Search;