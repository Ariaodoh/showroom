import express from 'express';
import { sanityClient, urlFor } from './sanityClient.js';
import { v4 as uuidv4} from 'uuid';

const collectionRouter = express.Router();


//End point for User Collections Creation 
collectionRouter.post("/create", async (req, res) => {
    const { title, about, imageId, userId, idea } = req.body
    

    if (!about || !title || !imageId || !userId || !idea){
        res.status(400).json({error: "Incoplete details, please complete the form correctly to create a collection"})
    };

    const doc = {
        _type: 'collection',
        title,
        about,
        idea,
        image: {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: imageId,
            },
        },
        postedBy: {
            _type: 'postedBy',
            _ref: userId,
          },
    };
    
    try {
        const result = await sanityClient.create(doc)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({error: "Error creating collection"})
    }

  });


  
  //Endpoint to Save Pins to ccollections 
  collectionRouter.patch('/add-to-collection', async (req, res) => {
    const { pinId, collectionId } = req.body
    

    try {
        await sanityClient
        .patch(collectionId)
        .setIfMissing({pinned: []})
        .insert('after', 'pinned[-1]', [
            {
                _key: uuidv4(), // Optional if schema allows
                _type: 'reference',
                _ref: pinId, 
            },
        ])
        .commit();

        res.status(200).json({message: "Added to Collection"});
    } catch (error) {
        res.status(500).json({message: "Failed to add to board"});
    }
  });


  //Endpoint to Retrieve a collections from Db
  collectionRouter.get("/", async (req, res) => {

    //const ids = req.query.ids?.split(',')
    const { userId } = req.query;
    

    if (!userId) {
        res.status(400).json({error: "Id not found "})
    }

    const query = `*[_type == "collection" && postedBy->_id match '${userId}*']`
    try {
        const result = await sanityClient.fetch(query);
        
        // Process images using urlFor
        const processedData = result.map((item) => ({
            ...item,
            image: item.image.asset._ref
            ? {...item.image.asset, url: urlFor(item.image.asset._ref) }
            : null,
        }));

        return res.status(200).json(processedData);
        
    } catch (error) {
        res.status(500).json({error: "Faiied to retrieve collection"});
    }
  });



  //Endpoint to delete collection
  collectionRouter.delete('/:id', async(req, res) => {
    const id  = req.params.id;

    try{
        await sanityClient.delete(id);
        res.status(200).json({message: 'collection deleted sucessfully'});
    } catch(error) {
        console.error('Error deleting collection:', error);
        req.status(500).json({error: 'Failed to delete collection'});
    }
});


export default collectionRouter;

