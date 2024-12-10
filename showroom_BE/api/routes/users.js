import express from 'express';
import { sanityClient, urlFor } from './sanityClient.js';
import { v4 as uuidv4} from 'uuid';

const userRouter = express.Router();


//API sanity endpoint to retrieve user diplay banner 
userRouter.get("/dp", async (req, res) => {
    const { userId } = req.query;
    

    if (!userId){
        return res.status(400).json({error: "User Id required"})
    }

    const query = `*[ _type == 'displayPic' && postedBy->_id == '${userId}*'] | order(_createdAt desc)`;

    try {
        const result = await sanityClient.fetch(query);
        
        return res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({error: "Failed to fetch user display picture"})
    }
});


//API endpoint to upload/ add user display picture
userRouter.post("/edit-dp", async (req, res) => {
    const { imageId, userId, imageUrl } = req.body;
   

    if (!userId || !imageId || !imageUrl){
       return res.status(400).json({error: "user id and display image required "})
    }

    try {
        await sanityClient
            .patch(userId)
            .setIfMissing({ displayPic: [] }) //ensure 'displayPic' field exists
            .append('displayPic', [
                {
                    _key: uuidv4(),
                    _type: 'image',
                    asset: {
                        _ref: imageId,
                        }
                }
            ])
            .commit();
        
        
        return res.status(201).json({mssage: "Display picture saved!"})  
            
    } catch (error) {
        return res.status(500).json({error: "Failed to update display picture"});

    }
})

//API sanity client user POST end-point
userRouter.post("/", async (req, res) => {
    const { sub, name, picture } = req.body;

    if (!sub || !name || !picture){
        return res.status(400).json({error: "Incomplete User details"})
    }

    const user = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
    };

    try {
        const result = await sanityClient.createIfNotExists(user);
        
        return res.status(201).json(result);
        

    } catch (error){
        console.error("Error creating User:", error);
        return res.status(500).json({error: "Failed to create User"})
    }
});

//API sanity client user GET end-point 
userRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const query = '*[_type == "user" && _id == $id][0]';
    const params = { id }
    try{
        const result = await sanityClient.fetch(query, params);

        if (result.displayPic){

            const adjustedData = {
            ...result,
            urlRef: result.displayPic?.[0].asset?._ref
            ? { ...result.displayPic[0], asset: urlFor(result.displayPic?.[0].asset?._ref)} //adjust main image with urlFor
            : null,
          };
          
          return res.status(200).json(adjustedData)
        }
        
       // return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
})



//API sanity client GET end-point for All users
userRouter.get('/users', async (req, res) => {
    const query = `*[_type == "user"] | order(_createdAt desc) {
    _id,
    username
}`;
    try{
        const result = await sanityClient.fetch(query);
          
          return res.status(200).json(result)
       // return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
})



export default userRouter;
