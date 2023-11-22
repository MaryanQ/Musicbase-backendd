import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import artistsRouter from "./Routes/artists.js";
import tracksRouter from "./Routes/tracks.js";
import albumsRouter from "./Routes/albums.js";

const app = express();
const port = process.env.PORT || 3000;

import bodyParser from "body-parser";
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());
dotenv.config();

app.use(async (req, res, next) => {
  try {
    // Fetch data here from your database
    const artists = await artists.find();
    const tracks = await tracks.find();
    const albums = await albums.find();

    // Set fetched data to be available globally in the app
    // For example:
    res.locals.artists = artists;
    res.locals.tracks = tracks;
    res.locals.albums = albums;
    next();
  } catch (error) {
    // Handle errors if data fetching fails
    console.error("Error fetching data:", error);
    next(error);
  }
});

app.use("/artists", artistsRouter);
app.use("/tracks", tracksRouter);
app.use("/albums", albumsRouter);

app.get("/", (req, res) => {
  res.send("appp virekrrrrr");
});

app.listen(port, () => {
  console.log(`https://musicbasee.azurewebsites.net/`);
});
