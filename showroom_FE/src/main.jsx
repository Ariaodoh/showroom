//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App, { CollectionProvider, fetchData } from './App.jsx'
import Home from './container/Home.jsx'
import Login from './component/Login.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Pins from './container/Pins.jsx'
import UserProfile from './component/UserProfile.jsx'
import Feed from './component/Feed.jsx'
import Search from './component/Search.jsx'
import PinDetail from './component/PinDetail.jsx'
import CreatePin from './component/CreatePin.jsx'
import CreateCategory from './component/CreateCategory.jsx'



const  router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    loader: fetchData,
    Component: App,
    children: [
      {
        path: 'login',
        Component: Login,
      },
      {
        path: '/',
        id: 'parent',
        //loader: fetchCollections,
        Component: Home,
        children:[
          {
            path:'/user-profile/:userId',
            Component: UserProfile,
          },
          {
            path: '/',
            Component: Pins,
            children:[
              {
                path: '/' ,
                Component: Feed,
              },
              {
                path: '/category/:filter',
                Component: Feed,
              },
              {
                path: '/category/create',
                Component: CreateCategory,
              },
              {
                path: '/pin-detail/:pinId', 
                Component: PinDetail,
              },
              {
                path: '/create-pin',
                Component: CreatePin,
              },
              {
                path: '/search',
                Component: Search,
              },
            ]
          }
        ]
      },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <GoogleOAuthProvider clientId = {`${import.meta.env.VITE_GOOGLE_API_TOKEN}`}>
      <CollectionProvider>
        <RouterProvider router={router}/>
      </CollectionProvider>
    </GoogleOAuthProvider>
  //</StrictMode>,
)

