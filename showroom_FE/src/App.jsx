import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLoaderData, useNavigate, useRouteLoaderData} from 'react-router-dom';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collectionData, setCollectionData] = useState(null);

  return (
    <CollectionContext.Provider value={{ collectionData, setCollectionData }}>
      {children}
    </CollectionContext.Provider>
  );
};


CollectionProvider.propTypes = {
  children: PropTypes.node,
};

// Hook for consuming the context
export const useCollectionContext = () => useContext(CollectionContext);

export async function fetchData() {

  let USER;

  try{
    const user = localStorage.getItem('user');
    USER = user ? JSON.parse(user) : null;

    if (!USER) {
      console.log('User Session ended, login required')
      localStorage.removeItem('user');
    }

  } catch (error) {
    console.error ('Failed to parse user data', error);
    localStorage.removeItem('user'); //clears problematic key user key
    
  }
  
  return USER;
};

  
const App = () => {
  const User = useLoaderData();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);


  useEffect(() => {
    //Exit if timeleft is 0
    if (timeLeft <= 0 ) return;

    //Start interval to decrease time every second 
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    //Cleanup the interval on component unmount or when the countdown expires 
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (!User) {
      navigate('/login')
    }

  }, [User, navigate]);


  const errorFallback = ({ error, resetErrorBoundary }) => {
    return (
      <div className='grid gap-4 mt-10 place-content-center h-48'>
      <h1 className='text-2xl font-semibold'>Oops! Something went wrong</h1>
      { timeLeft === 0 ? (
        <button 
        type="button"
        className='bottom-3 right-3 p-3 text-white rounded-full bg-sky-900 text-lg cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
        onClick={resetErrorBoundary}>Try again</button>
      ) : (
        <div className='grid gap-4 mt-10 place-content-center rounded-full text-white bg-sky-700 bottom-3 right-3 p-3'>
          Try again in {timeLeft} seconds
        </div>
      )};
    </div>
  )};

  return(
    <ErrorBoundary
      FallbackComponent={errorFallback}
      onReset={() => {
        window.location.reload();
        const user = useRouteLoaderData('root');
        if (!user) {
          navigate('/login')
        }  
      }}
    >
        <Outlet/>
    </ErrorBoundary>
  ) 
};


export default App;
