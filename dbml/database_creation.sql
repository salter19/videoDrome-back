CREATE DATABASE videoDB;
USE videoDB;

-- Create and initially populate: categories, genres and formats
DROP TABLE IF EXISTS categories, genres, formats;

CREATE TABLE categories (
  id        INT         NOT NULL      AUTO_INCREMENT
  , title   VARCHAR(50) NOT NULL      DEFAULT 'movie'   UNIQUE
  , PRIMARY KEY (id)
);

INSERT INTO categories (title)
VALUES    
  ('movie')
  , ('music')
  , ('documentary')
  , ('tv')
;

INSERT INTO categories (title)
VALUES ('musical');

CREATE TABLE formats (
  id        INT         NOT NULL      AUTO_INCREMENT
  , title   VARCHAR(50) NOT NULL      DEFAULT 'dvd'   UNIQUE
  , PRIMARY KEY (id)
); 

INSERT INTO formats (title)
VALUES    
  ('dvd')
  , ('blu-ray')
  , ('vhs')
;

CREATE TABLE genres (
  id          INT         NOT NULL      AUTO_INCREMENT
  , title     VARCHAR(50) NOT NULL      
  , is_music  BOOLEAN     DEFAULT false
  , PRIMARY KEY (id)
); 

INSERT INTO genres (title)
VALUES    
  ('giallo')
  , ('slasher')
  , ('zombie')
  , ('psychological')
  , ('posession')
  , ('torture')
  , ('drama')
  , ('comedy')
  , ('musical')
  , ('fairytale')
  , ('scifi')
  , ('horror')
  , ('action')
  , ('adventure')
  , ('thriller')
  , ('western')
  , ('sports')
  , ('historical')
  , ('animation')
  , ('war')
;

INSERT INTO genres (title, is_music)
VALUES 
  ('metal', true)
  , ('pop', true)
  , ('rock', true)
;

-- create and initially populate tables: subtitles
CREATE TABLE subtitles (
  id      INT           NOT NULL      AUTO_INCREMENT
  , title VARCHAR(10)   UNIQUE
  , PRIMARY KEY (id)
);

INSERT INTO subtitles (title)
VALUES
  ('fi')
  , ('en')
  , ('-')
;

DROP TABLE IF EXISTS crew_titles;
CREATE TABLE crew_titles (
  id        INT           NOT NULL      AUTO_INCREMENT
  , title   VARCHAR(75)   NOT NULL
  , PRIMARY KEY (id)
);