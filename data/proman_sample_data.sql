--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---
DROP TABLE IF EXISTS board_columns CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

---
--- insert data
---

INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');

INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

CREATE TABLE board_columns
(
    board_id int,
    status_id int
);
ALTER TABLE ONLY board_columns
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

-- ALTER TABLE ONLY board_columns
--     ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

INSERT INTO board_columns (board_id, status_id) VALUES (1, 1), (1, 2), (1, 3), (1, 4);
INSERT INTO board_columns (board_id, status_id) VALUES (2, 1), (2, 2), (2, 3), (2, 4);


create unique index statuses_title_uindex
    on statuses (title);



create table users
(
    id       serial
        constraint users_pk
            primary key,
    username varchar,
    password varchar not null
);

create unique index users_id_uindex
    on users (id);

create unique index users_username_uindex
    on users (username);

