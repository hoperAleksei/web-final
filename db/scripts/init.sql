-- SQLite init tables script

DROP TABLE IF EXISTS departure_city;

CREATE TABLE IF NOT EXISTS departure_city
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

DROP TABLE IF EXISTS arrival_country;

CREATE TABLE IF NOT EXISTS arrival_country
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

DROP TABLE IF EXISTS resort;

CREATE TABLE IF NOT EXISTS resort
(
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    name               TEXT    NOT NULL,
    arrival_country_id INTEGER NOT NULL,
    FOREIGN KEY (arrival_country_id)
        REFERENCES arrival_country (id)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS hotel;

CREATE TABLE IF NOT EXISTS hotel
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    stars     INTEGER NOT NULL CHECK ( stars >= 1 AND stars <= 5 ),
    resort_id INTEGER NOT NULL,
    FOREIGN KEY (resort_id)
        REFERENCES resort (id)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS tour;

CREATE TABLE IF NOT EXISTS tour
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    days      INTEGER NOT NULL CHECK ( days >= 1 ),
    cost      INTEGER NOT NULL CHECK ( cost >= 0 ),
    date      DATE    NOT NULL,
    meal_type TEXT    NOT NULL CHECK ( meal_type IN ('BB', 'HB', 'FB', 'AI', 'OB') ),
    count     INTEGER NOT NULL CHECK ( count >= 0 ),
    city_id   INTEGER NOT NULL,
    hotel_id  INTEGER NOT NULL,
    FOREIGN KEY (city_id)
        REFERENCES departure_city (id)
        ON DELETE CASCADE,
    FOREIGN KEY (hotel_id)
        REFERENCES hotel (id)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS ticket;

CREATE TABLE IF NOT EXISTS ticket
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    cost       INTEGER NOT NULL CHECK ( cost >= 0 ),
    buyer_name TEXT,
    buyer_id   TEXT,
    tour_id    INTEGER NOT NULL,
    FOREIGN KEY (tour_id)
        REFERENCES tour (id)
        ON DELETE CASCADE
);

DROP TRIGGER IF EXISTS update_tour_count;

CREATE TRIGGER update_tour_count
    AFTER INSERT
    ON ticket
BEGIN
    UPDATE tour SET count = count - 1 WHERE id = NEW.tour_id;
END;
