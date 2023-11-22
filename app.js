import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Update import paths in app.js
import artistsRouter from "./Routes/artists.js";
import tracksRouter from "./Routes/tracks.js";
import albumsRouter from "./Routes/albums.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/artists", artistsRouter);
app.use("/tracks", tracksRouter);
app.use("/albums", albumsRouter);

app.get("/", (req, res) => {
  res.send("appp virekrrrrr");
});

app.listen(port, () => {
  console.log(`
musicbaseee.azurewebsites.net`);
});
