--
-- File generated with SQLiteStudio v3.2.1 on dom mai 9 15:55:42 2021
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: config
DROP TABLE IF EXISTS config;

CREATE TABLE config (
    basepath VARCHAR (1000),
    id       INTEGER        PRIMARY KEY AUTOINCREMENT
);


-- Table: directory
DROP TABLE IF EXISTS directory;

CREATE TABLE directory (
    id   INTEGER PRIMARY KEY AUTOINCREMENT
                 UNIQUE,
    par  INTEGER DEFAULT (1),
    user INTEGER REFERENCES user (id) 
                 NOT NULL,
    name TEXT    NOT NULL
);


-- Table: event
DROP TABLE IF EXISTS event;

CREATE TABLE event (
    id      INTEGER  PRIMARY KEY
                     UNIQUE,
    user    INTEGER  REFERENCES user (id),
    [when]  DATETIME NOT NULL,
    [table] VARCHAR  DEFAULT user,
    type    VARCHAR  DEFAULT login
                     NOT NULL,
    content TEXT
);


-- Table: file
DROP TABLE IF EXISTS file;

CREATE TABLE file (
    id        INTEGER       PRIMARY KEY AUTOINCREMENT
                            UNIQUE,
    directory INTEGER       REFERENCES directory (id) 
                            DEFAULT (1),
    user      INTEGER       REFERENCES user (id),
    public    BOOLEAN       DEFAULT (TRUE),
    created   DATETIME      DEFAULT NOW,
    name      TEXT          NOT NULL,
    size      NUMERIC       NOT NULL,
    mime      VARCHAR (255) NOT NULL,
    title     VARCHAR (255) NOT NULL
);


-- Table: message
DROP TABLE IF EXISTS message;

CREATE TABLE message (
    id        INTEGER      PRIMARY KEY AUTOINCREMENT
                           UNIQUE,
    user_from INTEGER      REFERENCES user (id) 
                           NOT NULL,
    user_to   INTEGER      REFERENCES user (id) 
                           NOT NULL,
    cite      INTEGER      DEFAULT (0),
    created   DATETIME     DEFAULT NOW,
    viewed    DATETIME     DEFAULT NULL,
    deleted   DATETIME     DEFAULT NULL,
    type      VARCHAR (10) DEFAULT chat,
    attached  TEXT         DEFAULT "",
    content   TEXT         NOT NULL
);


-- Table: node
DROP TABLE IF EXISTS node;

CREATE TABLE node (
    id      INTEGER       PRIMARY KEY AUTOINCREMENT
                          UNIQUE,
    par     INTEGER       DEFAULT (1),
    title   VARCHAR (255) NOT NULL,
    type    VARCHAR       DEFAULT string,
    ui      VARCHAR       DEFAULT compact,
    file    TEXT          DEFAULT "",
    content TEXT          NOT NULL
);


-- Table: user
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id       INTEGER       PRIMARY KEY
                           UNIQUE,
    login    VARCHAR       NOT NULL,
    password VARCHAR       NOT NULL,
    access   INTEGER       DEFAULT (0),
    upload   INTEGER       DEFAULT (0),
    download INTEGER       DEFAULT (0),
    level    INTEGER       DEFAULT (10),
    token    VARCHAR,
    [key]    VARCHAR,
    name     VARCHAR       NOT NULL,
    socket   VARCHAR (256),
    avatar   VARCHAR (250),
    theme    VARCHAR (100) DEFAULT light
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
