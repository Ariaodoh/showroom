import {useState, useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import Spinner from './Spinner';
import Pin from './Pin';
import { useCollectionContext } from '../App';

const API_URL = import.meta.env.VITE_API_URL;

const Feed = () => {
  const [pins, setPins] = useState();
  const [collectionPins, setCollectionPins] = useState();
  const [collectionPinIds, setCollectionPinIds] = useState();
  const [pinnedIsReady, setPinnedIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const { filter } = useParams();

  const { collectionData } = useCollectionContext();
  const location = useLocation();
  //const prevFilter = useRef(filter);

  useEffect(() => {

    //if (filter !== prevFilter.current) {
      //prevFilter.current = filter;
      
    //}
    fetchData();
  }, [filter, location]);

  useEffect(() => {
    
    
    if (collectionPinIds) {
      setPinnedIsReady(true);
    }
  }, [collectionPinIds])


  useEffect(() => {
    
    if (pinnedIsReady) {
      const timeoutId = setTimeout(() => {
        fetchCollectPins(collectionPinIds);
        setPinnedIsReady(false);
      }, 500)

      return () => clearTimeout(timeoutId);
   }
  }, [pinnedIsReady, collectionPinIds])



  async function fetchData () {

    if (filter){
      setLoading(true);
      setPins(null);
      setCollectionPins(null);
      setCollectionPinIds(null)
      

        const lastHyphenIndex = filter.lastIndexOf("-");
        const searchTokens = filter.slice(0, lastHyphenIndex);
        const collectionId = filter.slice(lastHyphenIndex + 1);
          
        collectionData?.forEach((item) => {
          if (item._id === collectionId && item.pinned !== undefined){
            (setCollectionPinIds(item.pinned));   
          } 
        });
      //Retrieve filter feed from BE Api.

      try{
        const response = await axios.get(`${API_URL}/feed/${searchTokens}`);
        if (response.status != 200){
            throw new Error(response);
        }
        
        setPins(response.data);
        
        setLoading(false);

        } catch (error) {
            console.error(`Error fetching ${filter} feed fron DB:`, error );
            //Boundary Error?
            //throw new Error ('Server Error, Please Try Again Later');
        };
    } else {
        setLoading(true);
        setCollectionPins(null);
        setCollectionPinIds(null);
      

        //Fetch all pins from BE
        try {
          const response = await axios.get(`${API_URL}/feed`);
          if (response.status != 200){
            throw new Error(response);
          }

          setPins(response.data);
          setLoading(false);
    
        } catch (error) {
          console.error("Error fetching feed fron DB:", error );
              //Boundary Error?
              //throw new Error ('Server Error, Please Try Again Later');
        };
    };
  };


  
  const fetchCollectPins = async ( array ) => {
    const itemIds = array?.map((item) => item._ref);
    const searchTerm = itemIds?.join(',');
    

    if (searchTerm) {
      try {
        const response = await axios.get(`${API_URL}/pin/collected-pins?searchTerm=${searchTerm}`);
        if(response.status !== 200){
          throw new Error("No collection posts found", response);
          
        }

        setCollectionPins(response.data);
        
        //setCollectionPinIds(null);
      } catch (error) {
        console.error('Failed to retrieve collection pins', error);
        
      }};
  };

  
  if (loading) {
    return(
      <Spinner message={`Updating your Feed with more ideas!`}/>
    );
  }

  const breakpointColumnsObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1100: 3,
    700: 2,
    500: 1
  };
  
 //console.log(pins)
  return (
    <div>
      
      {filter && (collectionPins ? (
        <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointColumnsObj}>
          {collectionPins?.map( pin => (
              <Pin key={pin._id} pin={pin} className='w-max' />
            )
            )}
        </Masonry>    
      ): (
          <p className="text-center">You haven't added ideas to this collection.</p>
          
      ))}
    
      { filter && <h2 className="text-center font-bold text-2xl mt-8 mb-4">Discover similar ideas</h2>}
      
      {pins && (
        <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointColumnsObj}>
          {pins?.map( pin => (
              <Pin key={pin._id} pin={pin} className='w-max' />
            ))}
        </Masonry>    
      )}
    </div>
  );
};

export default Feed