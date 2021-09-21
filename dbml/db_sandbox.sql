-- INSERT INTO table(c1, c2, ...) 
-- VALUES 
--     (v11, v12),
--     (v11, v12),
--     (v11, v12);

INSERT INTO countries(name) 
VALUES 
    ('finland')
    ,('usa')
    ,('great britain')
    ,('germany')
    ,('spain')
    ,('new zealand')
    ,('italy')
    ,('france')
    ,('portugal')
    ,('hong kong')
    ,('china')
;

INSERT INTO crew_titles(title)
VALUES
    ('actor')
    ,('director')
    ,('writer')
    ,('producer')
;

INSERT INTO genres(title)
VALUES
    ('horror')
    ,('comedy')
    ,('action')
    ,('drama')
    ,('adventure')
    ,('scifi')
    ,('thriller')
    ,('musical')
    ,('fairytale')
    ,('animation')
    ,('anime')
    ,('giallo')
;

INSERT INTO movies(category, name, release_year, country_of_origin, subtitle, genre, genre_2, format_1)
VALUES
    (1, 'Matrix', 1999, 2, 1, 6, 3, 3)
;

-- ALTER TABLE table DROP FOREIGN KEY constraint_name;
-- ALTER TABLE table DROP KEY column_name;
-- ALTER TABLE table DROP COLUMN column_name;