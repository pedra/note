--
-- File generated with SQLiteStudio v3.2.1 on dom mai 9 15:52:45 2021
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

INSERT INTO config (basepath, id) VALUES ('C:\Projetos', 1);

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

INSERT INTO directory (id, par, user, name) VALUES (1, 1, 1, 'Magic');
INSERT INTO directory (id, par, user, name) VALUES (2, 1, 1, 'Imagens');
INSERT INTO directory (id, par, user, name) VALUES (3, 1, 1, 'Vídeos');
INSERT INTO directory (id, par, user, name) VALUES (4, 1, 1, 'Documentos');

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

INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (1, 1, 2, 0, 1617493112588, NULL, NULL, 'chat', '', '{"text":"Olá, mundo!","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (2, 1, 2, 0, 1617493460023, NULL, NULL, 'chat', '', '{"text":"Outra mensagem do Chat","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (3, 1, 2, 0, 1617493526603, NULL, NULL, 'chat', '', '{"text":"mais um teste","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (4, 1, 2, 0, 1617493867880, NULL, NULL, 'chat', '', '{"text":"Será que funciona, agora?","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (5, 1, 2, 0, 1617494009329, NULL, NULL, 'chat', '', '{"text":"Última??","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (6, 1, 2, 0, 1617494704354, NULL, NULL, 'chat', '', '{"text":"Acho que vai funcionar, agora!","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (7, 1, 2, 0, 1617494881868, NULL, NULL, 'chat', '', '{"text":"Olá, mundo!!! Segunda mensagem!","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (8, 1, 2, 0, 1617495106295, NULL, NULL, 'chat', '', '{"text":"Hi, peaple!","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (9, 1, 2, 0, 1617495151104, NULL, NULL, 'chat', '', '{"text":"asçaisjdl lsadkja~lkd jasdlkj asdlij","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (10, 1, 2, 0, 1617495265095, NULL, NULL, 'chat', '', '{"text":"Outro teste...","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (11, 1, 2, 0, 1617496346608, NULL, NULL, 'chat', '', '{"text":"Teste final de hoje!","attached":0,"cite":0}');
INSERT INTO message (id, user_from, user_to, cite, created, viewed, deleted, type, attached, content) VALUES (12, 1, 2, 0, 1619725396407, NULL, NULL, 'chat', '', '{"text":"Testando chat","attached":0,"cite":0}');

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

INSERT INTO node (id, par, title, type, ui, file, content) VALUES (1, 1, 'Bem Vindo!', 'string', 'conpact', '[]', 'Bem vindo ao sistema Magic!');

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

INSERT INTO user (id, login, password, access, upload, download, level, token, "key", name, socket, avatar, theme) VALUES (1, 'prbr@ymail.com', 'Ab123456', 14, 0, 0, 1, 'kohj2kun', '', 'Bill Rocha', '', '/img/u/avatar.png', 'light');
INSERT INTO user (id, login, password, access, upload, download, level, token, "key", name, socket, avatar, theme) VALUES (2, 'rosangela@email.com', 'Ab123456', 0, 0, 0, 10, 'knan0ze2', '', 'Rosangela Silva', NULL, '/img/u/avatar.png', 'light');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
