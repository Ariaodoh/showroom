import { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import { categories } from '../utils/data';
import Spinner from './Spinner';

const API_URL = import.meta.env.VITE_API_URL;

const CreatePin = () => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();
  const user = useRouteLoaderData("root");
  
  const uploadImage = async (e) => {
    const  selectedFile = e.target.files[0];
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(`${API_URL}/pin/asset-upload`, formData);

        if (response.status != 201) {
          throw new Error(response)
        }

        
        setImageAsset(response.data);
        setLoading(false);

      } catch (error) {
        console.error("File upload failed", error.message || error)
      }
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const savePin = async () => {

    const imageId = imageAsset?._id;
    const userId = user?._id;

    if (title && about && destination && imageAsset?._id && category) {

      try {
        const response = await axios.post(`${API_URL}/pin/create-pin`, {title, about, destination, imageId, category, userId });

        if (response.status != 201 ) {
          throw new Error('Error uploading post:', response)
        }

        if (response.status === 201){
          navigate('/'); 
        }
         
        window.location.reload();

      } catch (error) {
        console.error("File upload Pin", error.message)
      }

    } else {
        setFields(true);

        setTimeout(() => {
          setFields(false);
        }, 
        2000 );
      }
  };
  

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please include all fields</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading & (
              <Spinner/>
            )}
            {
              wrongImageType && (
                <p>Wrong file type.</p>
              )
            }
            {!imageAsset ? (
              <label>
                <div className='flex flex-col item-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload/>
                    </p>
                    <p className='text-lg'>Upload your image</p>
                  </div>

                  <p className='mt-32 text-gray-400'>
                    Recommedation: Use file types: JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input 
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className='w-0 h-0' 
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img 
                  src={imageAsset?.url} 
                  alt="uploaded-pic"
                  className='h-full w-full' 
                />
                <button
                  type="button"
                  className='absolute bottom-3 right-3 p-3 reounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete/>
                </button>
              </div>
            )} 
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Add your post title'
              className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
            />
            {user && (
              <div className='flex gap-2 mt-2 items-center bg-white rounded-lg'>
                <img 
                  src={user.image} 
                  alt="user-profile" 
                />
                <p className='font-bold'>{user.name}</p>
              </div>
            )}
            <input 
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder='Add a post description'
              className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2' 
            />
            <input 
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder='Add your website link'
              className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
            />
            <div className="flex flex-col">
              <div>
                <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Post Category</p>
                <select
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                >
                  <option value="others" className="sm:text-bg bg-white">Select Category</option>
                  {categories.map((item) => (
                    <option className="text-base border-0 outline-none capitalize bg-white text-black " key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end items-end mt-5">
                <button
                  type="button"
                  onClick={savePin}
                  className="bg-sky-900 text-white font-bold p-2 rounded-full w-28 outline-none"
                >
                  Save Pin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CreatePin;
