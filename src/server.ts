import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from "express";
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
      let image_url: string = req.query.image_url;

      if (image_url == undefined) res.send(404);

      try {
        let filteredImagePath: string = await filterImageFromURL(image_url);
        res.sendFile(filteredImagePath, async function(err) {
          await deleteLocalFiles([filteredImagePath])
        });
      } catch(error){
        res.status(422).send('error while filtering the image')
      }  
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();