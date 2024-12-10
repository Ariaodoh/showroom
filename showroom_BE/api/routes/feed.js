import express from 'express';
import { sanityClient, urlFor } from './sanityClient.js';

const feedRouter = express.Router();

//API sanity client All Feed GET end-point 
feedRouter.get('/', async (req, res) => {
    const query = `*[_type == "pin"] | order(_createdAt desc) {
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
          _key,
          postedBy->{
            _id,
            userName,
            image
          },
        },
      } `;
    
    try{
      const data = await sanityClient.fetch(query);

      // Process images using urlFor
      const processedData = data.map((item) => ({
        ...item,
        image: item.image?.asset
        ? { ...item.image.asset, url: urlFor(item.image) }
        : null, // Handle missing image data
      }));

      return res.json(processedData);

    } catch (error) {
        console.error('Error loading feed:', error)
        return res.status(500).json({ error: error.message});
    }

})

//API sanity client Feed by ID GET end-point 
feedRouter.get('/:filter', async (req, res) => {
    const filter = req.params.filter;
    const searchTerms = filter.split('-');
    
    
    const query = `*[_type == "pin" && title in $searchTerms || category in $searchTerms || about in $searchTerms]{
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
                _key,
                postedBy->{
                  _id,
                  userName,
                  image
                },
              },
            }`;
    //const params = searchTerm
    try{
        const data = await sanityClient.fetch(query, {searchTerms: searchTerms});


        const adjustedData = data.map((item) => ({
          ...item,
          image: item.image?.asset
          ? { ...item.image, url: urlFor(item.image) } //adjust main image with urlFor
          : null,
        }));

        res.json(adjustedData);
    
        
    } catch (error) {
        res.status(500).json({"Error from this end": error});
    }
})


export default feedRouter;
