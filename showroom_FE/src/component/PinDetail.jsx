import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useRouteLoaderData } from 'react-router-dom';
import Spinner from './Spinner';
import { AiFillCloseCircle } from 'react-icons/ai';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import Pin from './Pin';
import { Drawer } from './Drawer';
import { useCollectionContext } from '../App';

const PinDetail = () => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [collected, setCollected] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState(false)
  const [toggleCollectionShelf, setToggleCollectionShelf] = useState(false)

  const user = useRouteLoaderData("root");
  const { collectionData } = useCollectionContext();
  const pageRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPinDetails = async () =>{
    
    try{
      const response = await axios.get(`${API_URL}/pin/${pinId}`);
      if (response.status !== 200){
          throw new Error(response);
      }

      setPinDetail(response.data[0])

      if (response.data[0]){
        const filter = response.data[0].category;
      
        const response2 = await axios.get(`${API_URL}/feed/${filter}`);

        if (response2.status !== 200) {
          throw new Error("Failed to retrieve more pins", response2);
          
        }

        setPins(response2.data)
      }

      } catch (error) {
          console.error(`Error fetching data:`, error );
          //Boundary Error?
          //throw new Error ('Server Error, Please Try Again Later');
    };
    
  }

  useEffect(() => {
    if (pageRef.current === null) {
      pageRef.current = pinId;
    } else if (pageRef.current === pinId){
      setCollected(true);
    }
  }, [pinId])

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = async () => {
    if (comment) {
      setAddingComment(true);
      
      try {
        
        const response = await axios.patch(`${API_URL}/pin/add-comment`, { pinId: pinDetail?._id, comment: comment, userId: user?._id});
        if (response.status != 200){
          throw new Error("Failed to unpload comment", response);   
        }
        
        fetchPinDetails();
        setComment('');
        setAddingComment(false);
      } catch (error) {
        console.error("Error adding comment:", error)
      }
    }
  };

  
  if (!pinDetail){
    return(
      <Spinner message='We are loading that idea' />
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

  return (
    <div className='relative '>
      {toggleCollectionShelf && (
        <>
          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0  bg-blackOverlay"/>
         
          <div className='fixed bottom-0 w-4/6 bg-white h-3/6 rounded-xl justify-center items-center overflow-y-auto hide-scrollbar z-10 animate-slide-in'>
              <div className='w-full flex justify-end items-center p-2'>
                <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleCollectionShelf(false)}/>
              </div>
              <Drawer closeToggle={setToggleCollectionShelf} user={user && user} collections={collectionData} pinId={pinId}/>
          </div>
        </>
      )}
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={(pinDetail?.image && pinDetail?.image.url)}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                {collected ? (
                    <div className="flex bg-gray-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none">
                        Collected 
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="bg-sky-900 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                      onClick={() => setToggleCollectionShelf(true)}
                    >
                        {addingToCollection ? 'Collecting...' : 'Collect'}
                    </button>
                )}
              </div>
              <a href={pinDetail.destination} 
                target="_blank" 
                rel="noreferrer"
                onClick={((e) => e.stopPropagation())}
              >
                {pinDetail.destination?.slice(8,18)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-sky-900 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointColumnsObj}>
          {pins?.map(pin => (
              <Pin key={pin._id} pin={pin} className='w-max' />
            ))}
        </Masonry>
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </div>
  );
};


export default PinDetail;