import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Update import paths in app.js
import artistsRouter from "./backend/Routes/artists.js";
import tracksRouter from "./backend/Routes/tracks.js";
import albumsRouter from "./backend/Routes/albums.js";

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
  console.log(`App running on http://localhost:${port}`);
});
