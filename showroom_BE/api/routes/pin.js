import express from 'express';
import { sanityClient, urlFor } from './sanityClient.js';
import { v4 as uuidv4} from 'uuid';
import multer from "multer";

const pinRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage});


//User Created Pin Retrieval Endpoint
pinRouter.get("/user-created", async (req, res) => {
    const { userId } = req.query;

    const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
        image{
          asset->{
            url
          }
        },
        _id,
        destination,
        postedBy->{
          _id,
          userName,
          image
        },
        save[]{
          postedBy->{
            _id,
            userName,
            image
          },
        },
      }`;

    try {
    const userCreatePosts = await sanityClient.fetch(query);

    // Process images using urlFor
    const processedData = userCreatePosts.map((item) => ({
        ...item,
        image: item.image?.asset
        ? { ...item.image.asset, url: urlFor(item.image) }
        : null, // Handle missing image data
    }));

    res.status(200).json(processedData);
   

    } catch (error) {
    res.status(500).json({message: error});
    }
});



//User Saved Pin Retrieval Endpoint
pinRouter.get("/user-saved", async (req, res) => {
    const { userId }  = req.query;

    const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
        image{
          asset->{
            url
          }
        },
        _id,
        destination,
        postedBy->{
          _id,
          userName,
          image
        },
        save[]{
          postedBy->{
            _id,
            userName,
            image
          },
        },
    }`;

    try {
    const userSavedPosts = await sanityClient.fetch(query);

    // Process images using urlFor
    const processedData = userSavedPosts.map((item) => ({
        ...item,
        image: item.image?.asset
        ? { ...item.image.asset, url: urlFor(item.image) }
        : null, // Handle missing image data
    }));

    res.status(200).json(processedData);
    

    } catch (error) {
    res.status(500).json({message: error});
    }
});



//User Collectiom Retrieval Endpoint
pinRouter.get("/collected-pins", async (req, res) => {
  const { searchTerm }  = req.query;
  const searchTokens = searchTerm?.split(',');
 
  

  const query = `*[_type == 'pin' && _id in $searchTokens ] | order(_createdAt desc) {
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
  }`;

  try {

    if (!Array.isArray(searchTokens) || searchTokens.length === 0) {
      throw new Error('searchTokens must be a non-empty array.');
    }

    const result = await sanityClient.fetch(query, { searchTokens });

    // Process images using urlFor
    const processedData = result.map((item) => ({
        ...item,
        image: item.image?.asset
        ? { ...item.image.asset, url: urlFor(item.image) }
        : null, // Handle missing image data
  }));

  res.status(200).json(processedData);
 

  } catch (error) {
  res.status(500).json({message: error});
  }
});



//Pin Detail Retrieval Endpoint
pinRouter.get("/:id", async(req, res) => {
    const pinId = req.params.id;

    const query = `*[_type == "pin" && _id == '${pinId}']{
        image{
          asset->{
            url
          }
        },
        _id,
        title, 
        about,
        category,
        destination,
        postedBy->{
            _id,
            userName,
            image
        },
        save[]{
            postedBy->{
                _id,
                userName,
                image
            },
        },
        comments[]{
            comment,
            _key,
            postedBy->{
                _id,
                userName,
                image
            },
        }
      }`;

      try {
        const pinAssetDocs = await sanityClient.fetch(query);

        // Process images using urlFor
        const processedData = pinAssetDocs.map((item) => ({
            ...item,
            image: item.image?.asset
            ? { ...item.image.asset, url: urlFor(item.image) }
            : null, // Handle missing image data
        }));


        res.status(200).json(processedData);
        

      } catch (error){
        res.status(500).json({message: error});
      }
});



//Pin Asset Upload endpoint
pinRouter.post("/asset-upload", upload.single("file"), async(req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({message: "No file provided"});
        }

        const uploadedAsset = await sanityClient.assets.upload("image", req.file.buffer,{
            filename: req.file.originalname,
        });
        
        res.status(201).json(uploadedAsset);

    } catch (error) {
        
        res.status(500).json({message: "File upload failed", error: error.message});
    }
});



//Create Pin in Sanity DB POST endpoint
pinRouter.post("/create-pin", async(req, res) => {
    const { title, about, destination, imageId, category, userId } = req.body;

    if (!title || !about || !destination || !imageId || !category || !userId) {
        return res.status(400).json({error: "Incomplete Data"});
    }

    const pinDoc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageId,
          },
        },
        userId: userId,
        postedBy: {
          _type: 'postedBy',
          _ref: userId,
        },
        category,
      };

    try {
    const result = await sanityClient.create(pinDoc);
    
    return res.status(201).json(result);
    } catch (error){
        console.error("Error creating Pin:", error);
        return res.status(500).json({error: "Failed to create Pin"})
    }
});



//Pin Delete endpoint
pinRouter.delete('/:id', async(req, res) => {
    const id  = req.params.id;

    try{
        await sanityClient.delete(id);
        res.status(200).json({message: 'Post deleted sucessfully'});
    } catch(error) {
        console.error('Error deleting post:', error);
        req.status(500).json({error: 'Failed to delete post'});
    }
});



//Sanity server endpoint for user Saved Pins
pinRouter.patch('/save-pin', async (req, res) => {
    const { postId, userId } = req.body;

    if(!postId || !userId ) {
        console.error('Post Id and User Infromation required:', userId, postId)
        return res.status(400).json({error: ' Post Id and User Infromation required'});
    }

    try {
        await sanityClient
        .patch(postId)
        .setIfMissing({ save: [] }) //ensure 'save' field exists
        .insert('after', 'save[-1]', [
            {
                _key: uuidv4(),
                userId: userId,
                postedBy: {
                    _type: "postedBy",
                    _ref: userId,
                },
            },
        ])
        .commit();

        res.status(200).json({message: 'Post saved successfully'});
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'An error occurred while saving the post'});
    }
});



//Pin Comment Upload PATCH Endpoint
pinRouter.patch("/add-comment", async (req, res) => {
    const { pinId , comment, userId } = req.body;
    

    if (!pinId || !comment || !userId ) {
        return res.status(400).json({error: ' Comment and and pinId required'});
    }

    try {
        await sanityClient
        .patch(pinId)
        .setIfMissing({comments: []})
        .insert('after', 'comments[-1]', [
            { 
                comment, 
                _key: uuidv4(), 
                postedBy: {
                    _type: 'postedBy', 
                    _ref: userId}
            }
        ])
        .commit();

        res.status(200).json({message: "Comment Save!"})

    } catch (error) {
        res.status(500).json('Failed to save comment:', error)
    }
})

export default pinRouter;