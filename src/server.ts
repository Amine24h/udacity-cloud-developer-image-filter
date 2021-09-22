import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
      const { image_url } = req.query;

      if (image_url == undefined) res.send(404);

      try {
        let filteredImagePath = await filterImageFromURL(image_url);
        res.download(filteredImagePath, async function(err) {
          await deleteLocalFiles([filteredImagePath])
        });
      } catch(error){
        res.status(422).send('error while filtering the image')
      }  
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();