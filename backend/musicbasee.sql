create database  musicbaseee;

use musicbaseee;

-- Create tables
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
     genre VARCHAR(50),
    image VARCHAR(255),
    birthdate DATE,
    gender VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS tracks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    length VARCHAR(8)
);

CREATE TABLE IF NOT EXISTS artists_tracks (
    artist_id INT,
    track_id INT,
    PRIMARY KEY (artist_id, track_id),
    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

CREATE TABLE IF NOT EXISTS albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    release_date DATE
);

CREATE TABLE IF NOT EXISTS albums_tracks (
    album_id INT,
    track_id INT,
    position INT,
    PRIMARY KEY (album_id, track_id),
    FOREIGN KEY (album_id) REFERENCES albums(id),
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- Insert initial data
INSERT INTO artists (name, genre, image, birthdate, gender) VALUES
    ('Adele', 'Pop', 'https://upload.wikimedia.org/wikipedia/commons/5/52/Adele_for_Vogue_in_2021.png', '1988-05-05', 'Female'),
    ('Ed Sheeran', 'Pop', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/500px-Ed_Sheeran-6886_%28cropped%29.jpg', '1991-02-17', 'Male'),
    ('Beyoncé', 'R&B', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/500px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png', '1981-09-04', 'Female'),
    ('Miley Cyrus', 'Pop', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Miley_Cyrus_Primavera19_-226_%2848986293772%29_%28cropped%29.jpg/500px-Miley_Cyrus_Primavera19_-226_%2848986293772%29_%28cropped%29.jpg', '1992-11-23', 'Female');

INSERT INTO tracks (title, release_date, length) VALUES
    ('Hello', '2015-10-23', '4:55'),
    ('Shape of You', '2017-01-06', '3:53'),
    ('Crazy in Love', '2003-05-20', '3:56'),
    ('Send My Love', '2016-05-16', '3:43'),
    ('When We Were Young', '2015-11-17', '4:50'),
    ('Castle on the Hill', '2017-01-06', '4:21'),
    ('Galway Girl', '2017-01-06', '2:53'),
    ('Naughty Girl', '2003-06-24', '3:28'),
    ('Baby Boy', '2003-06-24', '4:05'),
    ('Flowers', '2023-01-12', '3:20'),
    ('River', '2023-03-10', '2:42'),
    ('You', '2020-03-10', '2:59'),
    ('Easy on Me', '2021-10-15', '3:44');

INSERT INTO artists_tracks (artist_id, track_id) VALUES
    (1, 1),
    (1, 13),
    (1, 4),
    (1, 5),
    (3, 3),
    (3, 8),
    (3, 9),
    (2, 2),
    (2, 6),
    (2, 7),
    (4, 10),
    (4, 11),
    (4, 12);

INSERT INTO albums (title, image, release_date) VALUES
    ('twentyfive','https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png' ,'2015-11-20'),
    ('Divide','https://www.relacs.dk/wp-content/uploads/2017/06/ed-sheeran-divide.jpg', '2017-03-03'),
    ('Dangerously in Love','https://i.insider.com/645c457bd391de0019bd79b1?width=700', '2003-06-24'),
    ('Flowers','https://images.kerrangcdn.com/Avril-Lavigne-Love-Sux-album-cover.jpg?auto=compress&fit=crop&w=1008', '2023-03-10'),
    ('thirty', 'https://i.insider.com/645c457bd391de0019bd79b1?width=700','2021-11-19');



INSERT INTO albums_tracks (album_id, track_id, position) VALUES
    (1, 1, 1),
    (1, 4, 2),
    (1, 5, 4),
    (5, 13, 2),
    (3, 3, 1),
    (3, 8, 2),
    (3, 9, 3),
    (2, 2, 4),
    (2, 6, 2),
    (2, 7, 6),
    (4, 10, 1),
    (4, 11, 7),
    (4, 12, 5);

-- Query to get albums and their tracks with artist info
SELECT albums.title AS album_title,
       tracks.title AS track_title,
       artists.name AS artist_name
FROM albums
INNER JOIN albums_tracks ON albums.id = albums_tracks.album_id
INNER JOIN tracks ON albums_tracks.track_id = tracks.id
INNER JOIN artists_tracks ON tracks.id = artists_tracks.track_id
INNER JOIN artists ON artists_tracks.artist_id = artists.id;

ALTER TABLE artists_tracks
DROP FOREIGN KEY artists_tracks_ibfk_1;

ALTER TABLE artists_tracks
ADD CONSTRAINT artists_tracks_ibfk_1 FOREIGN KEY (artist_id)
    REFERENCES artists (id)
    ON DELETE CASCADE;