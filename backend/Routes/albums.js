import { Router } from "express";
import dbConfig from "../db-connect.js";
import mysql from "mysql2";

import { v4 as uuidv4 } from "uuid";

const albumsRouter = Router();

albumsRouter.get("/", async (request, response) => {
  const queryString = /*sql*/ `
    SELECT * FROM artists, albums 
    WHERE albums.id = artists.id
    ORDER BY albums.title;`; // sql query

  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.json(results);
    }
  });
});

albumsRouter.get("/:id", (request, response) => {
  const id = request.params.id;
  const queryString = /*sql */ `
        SELECT
            albums.title AS albumTitle,
            tracks.id AS trackId,
            tracks.name AS trackTitle,
            tracks.release_date AS releaseDate,
            album_tracks.position
        FROM albums
        JOIN album_tracks
            ON albums.id = album_tracks.album_id
        JOIN tracks
            ON tracks.id = album_tracks.track_id
        WHERE albums.id = ?
        ORDER BY albums.title, album_tracks.position;`;
  const values = [id];

  dbConfig.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      if (results.length > 0) {
        const album = {
          title: results[0].albumTitle,
          tracks: results.map((track) => {
            return {
              id: track.trackId,
              title: track.trackTitle,
              releaseDate: track.releaseDate,
              position:
                track.position !== null ? track.position : "Not specified", // Provide a default value,
            };
          }),
        };
        response.json(album);
      }
    }
  });
});

albumsRouter.post("/", (req, res) => {
  const album = req.body;
  const albumId = uuidv4(); // Assuming you have uuidv4 defined correctly

  const insertAlbumQuery = `
    INSERT INTO albums (title, image, release_date)
    VALUES (?, ?, ?)
  `;
  const albumValues = [album.title, album.image, album.release_date];

  dbConfig.query(insertAlbumQuery, albumValues, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error adding album" });
    }

    const insertalbumtracksQuery = `
      INSERT INTO album_tracks (album_id, track_id)
      VALUES (?, ?)
    `;
    const albumtracksValues = [
      albumId, // Assuming you have the artist ID available here
      album.track_id,
    ];

    dbConfig.query(
      insertalbumtracksQuery,
      albumtracksValues,
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Error adding album artists" });
        }

        console.log(`Album added as ${albumId}`);
        res.json(results);
      }
    );
  });
});

albumsRouter.put("/", (req, res) => {
  console.log(req.body);
  const { id, title, image, release_date } = req.body;
  const query = /*SQL*/ `UPDATE albums SET title = ?, image = ?, release_date = ? WHERE id = ?`;
  const values = [title, image, release_date, id];
  //title, image, release_date
  dbConfig.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
});

albumsRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query1 = /*SQL*/ `DELETE FROM album_tracks WHERE albumId = ?;`;
  const query2 = /*SQL*/ `DELETE FROM album_artists WHERE albumId = ?;`;
  const query3 = /*SQL*/ `DELETE FROM albums WHERE id = ?;`;
  const values = [id];

  dbConfig.query(query1, values, (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Album ${id} deleted from album_tracks`);

      dbConfig.query(query2, values, (error, results, fields) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Album ${id} deleted from album_artists`);

          dbConfig.query(query3, values, (error, results, fields) => {
            if (error) {
              console.log(error);
            } else {
              console.log(`Album ${id} deleted`);
              res.json(results);
            }
          });
        }
      });
    }
  });
});
export default albumsRouter;
