import axios from 'axios';
import  { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';


/**
 * Basic google auth login (FE only)
 * DOCS: https://www.npmjs.com/package/@react-oauth/google
 * Guide: https://react-oauth.vercel.app/
 * 
 * */

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {

    const navigate = useNavigate();

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                <video 
                src={shareVideo}
                type="video/mp4"
                loop
                controls={false}
                muted
                autoPlay
                className="w-full h-full object-cover"
                />
                <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0  bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} alt="brand Logo" width="300px"/>
                    </div>

                    <div className="shadow-2xl">
                       <GoogleLogin
                            onSuccess={async (credentialResponse) =>{
                                const { credential } = credentialResponse;
                                if (credential) {
                                    //Decode the JWT token to extract user details 
                                    const decodeUser = jwtDecode(credential);
                                    
                                    //User session hold in local storage 
                                    const { sub, name, picture } = decodeUser;

                                    if (!sub || !name){
                                        throw new Error('Failed User Login. Try Again')
                                    }

                                    //Send data to BE api
                                    try{
                                        const response = await axios.post(`${API_URL}/user`, { sub, name, picture});
                                        if (response.status != 201){
                                            throw new Error(response);
                                        }
                                        
                                        console.log(response.status);
                                        localStorage.setItem('user', JSON.stringify(response.data));
                                        navigate('/'); 

                                    } catch (error) {
                                        console.error("Error creating user:", error );
                                        
                                    }

                                } else {
                                    console.log('No credential received');
                                }                            
                            }}
                            onError={() =>{
                                throw new Error('Login Failed')
                            }}
                       />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login