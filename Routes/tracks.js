import { Router } from "express";
import dbConfig from "../db-connect.js";
import mysql from "mysql2";
import { v4 as uuidv4 } from "uuid";
const tracksRouter = Router();

// READ all tracks
tracksRouter.get("/", async (request, response) => {
  const queryString = /*sql*/ `
  SELECT *
      FROM tracks
      JOIN artists_tracks ON tracks.id = artists_tracks.track_id
      JOIN artists ON artists_tracks.artist_id = artists.id
      ORDER BY artists.name;
      `;

  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

// GET Endpoint "/tracks/:id" - get one track
tracksRouter.get("/:id", (request, response) => {
  const id = request.params.id;
  const queryString = /*sql */ `
   SELECT *
FROM artists
JOIN artists_tracks ON artists.id = artists_tracks.artist_id
JOIN tracks ON artists_tracks.track_id = tracks.id
WHERE tracks.id = ?;

  `;

  const values = [id];
  dbConfig.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results[0]);
    }
  });
});

tracksRouter.post("/", async (req, res) => {
  const track = req.body;
  const trackId = uuidv4();

  const insertTrackQuery = `
    INSERT INTO tracks (title, id)
    VALUES (?, ?);
  `;
  const trackValues = [track.title, trackId];

  dbConfig.query(insertTrackQuery, trackValues, (error, trackResults) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error adding track" });
    }

    const insertArtistTrackQuery = `
      INSERT INTO artists_tracks (artist_id, track_id)
      VALUES (?, ?);
    `;
    const artistTrackValues = [track.artist_id, trackId];

    dbConfig.query(
      insertArtistTrackQuery,
      artistTrackValues,
      (error, artistTrackResults) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Error adding artist track" });
        }

        const insertAlbumTrackQuery = `
        INSERT INTO albums_tracks (album_id, track_id)
        VALUES (?, ?);
      `;
        const albumTrackValues = [track.album_id, trackId];

        dbConfig.query(
          insertAlbumTrackQuery,
          albumTrackValues,
          (error, albumTrackResults) => {
            if (error) {
              console.log(error);
              return res
                .status(500)
                .json({ error: "Error adding album track" });
            }

            console.log(`Track added as ${trackId}`);
            res.json({ trackResults, artistTrackResults, albumTrackResults });
          }
        );
      }
    );
  });
});

tracksRouter.put("/:id", (request, response) => {
  try {
    const track_id = request.params.id;
    const { title, release_date, length } = request.body;

    if (!title) {
      return response.status(400).json({ error: "trackName is required" });
    }

    const updateQuery = /*sql*/ `
      UPDATE tracks
      SET title = ?, release_date = ?, length = ?
      WHERE id = ?;
    `;

    dbConfig.query(
      updateQuery,
      [title, release_date, length, track_id],
      (updateErr) => {
        if (updateErr) {
          console.log(updateErr);
          return response.status(500).json({
            error: "An error occurred while updating the track",
          });
        } else {
          return response.status(200).json({
            track_id,
            message: "Track updated successfully",
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

tracksRouter.delete("/:id", (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  const query1 = /*SQL*/ `
  DELETE FROM artists_tracks WHERE track_id = ?;
  `;
  //title, release_date, length
  const query2 = /*SQL*/ `
  DELETE FROM albums_tracks  WHERE track_id = ?;
  `;
  const query3 = /*SQL*/ `
  DELETE FROM tracks WHERE id = ?;
  `;
  const values = [id];

  dbConfig.query(query1, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Track ${id} deleted from album_tracks`);
    }
  });
  dbConfig.query(query2, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Track ${id} deleted from artist_tracks`);
    }
  });
  dbConfig.query(query3, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Track ${id} deleted`);
      res.json(results);
    }
  });
});

export default tracksRouter;
