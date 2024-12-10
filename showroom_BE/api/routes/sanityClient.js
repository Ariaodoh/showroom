import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { config } from "dotenv";

config();

export const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: process.env.SANITY_API_VERSION,
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const builder = imageUrlBuilder(sanityClient)

//Helper function to generate image URLs with width adjustment
export function urlFor(source){
    return builder.image(source).width(250).url(); //Set width to 250px
}