import { useState } from 'react';
import { Outlet, useRouteLoaderData } from 'react-router-dom';


import { Navbar } from '../component';


const  Pins = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const user = useRouteLoaderData("root");

  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user} />
      </div>    
      <div className='h-full'>
        <Outlet context={{searchTerm, setSearchTerm}}/>
      </div>  
    </div>
  );
};

export default Pins