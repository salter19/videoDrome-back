-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2021-01-02T10:57:01.434Z

DROP TABLE IF EXITS categories, formats, genres, subtitles
                    , crew_titles, crew_members, countries
                    , distributors, movies;

CREATE TABLE `categories` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(50) UNIQUE NOT NULL
);

CREATE TABLE `formats` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(50) UNIQUE NOT NULL DEFAULT "dvd"
);

CREATE TABLE `genres` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(50) UNIQUE NOT NULL,
  `is_music` boolean DEFAULT false
);

CREATE TABLE `subtitles` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(10) UNIQUE NOT NULL
);

CREATE TABLE `crew_titles` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(75) NOT NULL
);

CREATE TABLE `crew_members` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `movie_id` integer NOT NULL,
  `crew_title` integer NOT NULL,
  `last_name` varchar(100),
  `first_name` varchar(100)
);

CREATE TABLE `countries` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `distributors` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `movies` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `category` integer NOT NULL,
  `name` varchar(255) NOT NULL,
  `release_year` integer NOT NULL,
  `country_of_origin` integer NOT NULL,
  `country_of_origin_2` integer,
  `subtitle` integer NOT NULL,
  `subtitle_2` integer,
  `genre` integer NOT NULL,
  `genre_2` integer,
  `format_1` integer NOT NULL,
  `format_2` integer
);

ALTER TABLE `crew_members` ADD FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

ALTER TABLE `crew_members` ADD FOREIGN KEY (`crew_title`) REFERENCES `crew_titles` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`category`) REFERENCES `categories` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`country_of_origin`) REFERENCES `countries` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`country_of_origin_2`) REFERENCES `countries` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`distributor`) REFERENCES `distributors` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`subtitle`) REFERENCES `subtitles` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`subtitle_2`) REFERENCES `subtitles` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`genre`) REFERENCES `genres` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`genre_2`) REFERENCES `genres` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`format_1`) REFERENCES `formats` (`id`);

ALTER TABLE `movies` ADD FOREIGN KEY (`format_2`) REFERENCES `formats` (`id`);

DROP TABLE IF EXISTS crew_members, movies, genres;

