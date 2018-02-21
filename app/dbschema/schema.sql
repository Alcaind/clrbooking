CREATE TABLE config
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  year       INT(4)     NULL,
  status     INT        NULL,
  created_at TIMESTAMP  NULL,
  updated_at TIMESTAMP  NULL,
  fromd      DATETIME   NULL,
  tod        DATETIME   NULL,
  synt       VARCHAR(9) NULL
)
  ENGINE = InnoDB;

CREATE TABLE items
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  descr      VARCHAR(255) NULL,
  comments   VARCHAR(215) NULL,
  code       VARCHAR(255) NULL,
  status     INT          NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  ENGINE = InnoDB;

CREATE TABLE kat
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  tm_id      INT          NULL,
  decr       VARCHAR(32)  NULL,
  title      VARCHAR(255) NULL,
  pm         INT          NULL
  COMMENT 'αναφέρεται ως είδος->προπτυχιακο/μεταπτυχιακο',
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  ENGINE = InnoDB;

CREATE INDEX tm___fk
  ON kat (tm_id);

CREATE TABLE periods
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  descr      VARCHAR(64)  NULL,
  synt       VARCHAR(12)  NULL,
  fromd      DATE         NULL,
  tod        DATE         NULL,
  comments   VARCHAR(255) NULL,
  conf_id    INT          NULL,
  porder     INT          NULL,
  status     INT          NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  CONSTRAINT periods_config_id_fk
  FOREIGN KEY (conf_id) REFERENCES config (id)
)
  ENGINE = InnoDB;

CREATE INDEX periods_config_id_fk
  ON periods (conf_id);

CREATE TABLE ps
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  tm_code    INT          NULL,
  tm_per     VARCHAR(255) NULL,
  pm         CHAR(3)      NULL,
  tma_code   INT          NULL,
  tma_per    VARCHAR(255) NULL,
  ps_ex      INT          NULL,
  ps_dm      INT          NULL,
  ps_km      VARCHAR(4)   NULL,
  teacher    VARCHAR(255) NULL,
  conf_id    INT          NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  ps_id      INT          NULL,
  CONSTRAINT ps_config_id_fk
  FOREIGN KEY (conf_id) REFERENCES config (id)
)
  ENGINE = InnoDB;

CREATE INDEX ps_config_id_fk
  ON ps (conf_id);

CREATE TABLE ps_stats
(
  id        INT AUTO_INCREMENT
    PRIMARY KEY,
  ps_id     INT NULL,
  diloseis  INT NULL,
  exetaseis INT NULL
)
  ENGINE = MyISAM;

CREATE INDEX ps_stats_ps_ps_id_fk
  ON ps_stats (ps_id);

CREATE TABLE request_guests
(
  id      INT AUTO_INCREMENT
    PRIMARY KEY,
  req_id  INT          NULL,
  name    VARCHAR(255) NULL,
  uni     VARCHAR(255) NULL,
  email   VARCHAR(255) NULL,
  phone   VARCHAR(255) NULL,
  comment VARCHAR(255) NULL
)
  COMMENT 'gia tilediaskepsi'
  ENGINE = MyISAM;

CREATE INDEX request_guests_requests_id_fk
  ON request_guests (req_id);

CREATE TABLE request_rooms
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  req_id     INT       NULL,
  room_id    INT       NULL,
  comment    INT       NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  teacher    INT       NULL
  COMMENT 'from users'
)
  COMMENT 'N-N requests rooms'
  ENGINE = MyISAM;

CREATE INDEX request_rooms_requests_id_fk
  ON request_rooms (req_id);

CREATE INDEX request_rooms_rooms_id_fk
  ON request_rooms (room_id);

CREATE INDEX request_rooms_users_id_fk
  ON request_rooms (teacher);

CREATE TABLE requests
(
  id          INT AUTO_INCREMENT
    PRIMARY KEY,
  req_dt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  COMMENT 'Ημερομηνία Αιτήματος',
  user_id     INT                                 NULL,
  descr       LONGTEXT                            NULL,
  period      VARCHAR(5)                          NULL,
  ps_id       INT                                 NULL,
  class_use   VARCHAR(255)                        NULL,
  links       VARCHAR(512)                        NULL,
  fromdt      TIME                                NULL,
  todt        TIME                                NULL,
  protocol_id VARCHAR(255)                        NULL,
  req_status  INT                                 NULL,
  fromd       DATE                                NULL,
  tod         DATE                                NULL,
  date_index  INT                                 NULL,
  created_at  TIMESTAMP                           NULL,
  updated_at  TIMESTAMP                           NULL,
  admin       INT                                 NULL
)
  ENGINE = InnoDB;

CREATE INDEX requests_users_id_fk
  ON requests (user_id);

CREATE INDEX requests_users_id_fk_2
  ON requests (admin);

CREATE TABLE roles
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  role       VARCHAR(255) NULL,
  descr      VARCHAR(255) NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  ENGINE = InnoDB;

CREATE TABLE room_book
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  user_id    INT          NULL,
  date_index INT          NULL,
  fromt      TIME         NULL,
  tot        TIME         NULL,
  type       INT          NULL,
  period     INT          NULL,
  room_id    INT          NULL,
  fromd      DATE         NULL,
  tod        DATE         NULL,
  request_id INT          NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  status     INT          NULL,
  comment    VARCHAR(255) NULL,
  CONSTRAINT room_book_periods_id_fk
  FOREIGN KEY (period) REFERENCES periods (id),
  CONSTRAINT room_book_requests_id_fk
  FOREIGN KEY (request_id) REFERENCES requests (id)
)
  COMMENT 'N-N'
  ENGINE = InnoDB;

CREATE INDEX room_book_users_id_fk
  ON room_book (user_id);

CREATE INDEX room_book_periods_id_fk
  ON room_book (period);

CREATE INDEX room_book_rooms_id_fk
  ON room_book (room_id);

CREATE INDEX room_book_requests_id_fk
  ON room_book (request_id);

CREATE TABLE room_category
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  synt       VARCHAR(255)                            NOT NULL,
  descr      VARCHAR(255)                            NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL
)
  COMMENT 'Κατηγορίες αιθουσών'
  ENGINE = InnoDB;

CREATE TABLE room_items
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  item_id    INT          NULL,
  comments   VARCHAR(255) NULL,
  stat       INT          NULL,
  `from`     TIMESTAMP    NULL,
  `to`       TIMESTAMP    NULL,
  room_id    INT          NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  CONSTRAINT room_items_items_id_fk
  FOREIGN KEY (item_id) REFERENCES items (id)
)
  COMMENT 'N-N'
  ENGINE = InnoDB;

CREATE INDEX room_items_items_id_fk
  ON room_items (item_id);

CREATE INDEX room_rooms___fk
  ON room_items (room_id);

CREATE TABLE room_use
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  synt       VARCHAR(4)   NULL,
  descr      VARCHAR(255) NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  ENGINE = InnoDB;

CREATE TABLE rooms
(
  id             INT AUTO_INCREMENT
    PRIMARY KEY,
  name           VARCHAR(255)                             NULL,
  address        VARCHAR(512)                             NULL,
  building       VARCHAR(255)                             NULL,
  floor          VARCHAR(128)                             NULL,
  status         VARCHAR(64) DEFAULT '0'                  NOT NULL,
  active         INT                                      NULL,
  destroyed      VARCHAR(4)                               NULL,
  nonexist       VARCHAR(4)                               NULL,
  capasity       INT                                      NULL,
  width          INT                                      NULL,
  height         INT                                      NULL,
  xoros          VARCHAR(512) DEFAULT '{(10,15),(10,15)}' NULL,
  exams_capasity INT                                      NULL,
  capasity_categ VARCHAR(10)                              NULL,
  tm_owner       INT                                      NULL,
  stat_comm      VARCHAR(255)                             NULL,
  conf_id        INT                                      NULL,
  category       INT(64)                                  NULL,
  created_at     TIMESTAMP                                NULL,
  updated_at     TIMESTAMP                                NULL,
  CONSTRAINT rooms_config_id_fk
  FOREIGN KEY (conf_id) REFERENCES config (id),
  CONSTRAINT rooms_room_category_id_fk
  FOREIGN KEY (category) REFERENCES room_category (id)
)
  ENGINE = InnoDB;

CREATE INDEX rooms_tm_id_fk
  ON rooms (tm_owner);

CREATE INDEX rooms_config_id_fk
  ON rooms (conf_id);

CREATE INDEX rooms_room_category_id_fk
  ON rooms (category);

ALTER TABLE room_book
  ADD CONSTRAINT room_book_rooms_id_fk
FOREIGN KEY (room_id) REFERENCES rooms (id);

ALTER TABLE room_items
  ADD CONSTRAINT room_rooms___fk
FOREIGN KEY (room_id) REFERENCES rooms (id);

CREATE TABLE rooms_room_use
(
  id          INT AUTO_INCREMENT
    PRIMARY KEY,
  rooms_id    INT                                     NOT NULL,
  room_use_id INT                                     NOT NULL,
  comment     VARCHAR(255)                            NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL,
  CONSTRAINT room_use__index
  UNIQUE (rooms_id, room_use_id),
  CONSTRAINT rooms_room_use_rooms_id_fk
  FOREIGN KEY (rooms_id) REFERENCES rooms (id),
  CONSTRAINT rooms_room_use_room_use_id_fk
  FOREIGN KEY (room_use_id) REFERENCES room_use (id)
)
  COMMENT 'N-N για χρήση αιθουσών'
  ENGINE = InnoDB;

CREATE INDEX rooms_room_use_room_use_id_fk
  ON rooms_room_use (room_use_id);

CREATE TABLE rooms_tms
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  tm_id      INT                                     NOT NULL,
  room_id    INT                                     NOT NULL,
  comments   VARCHAR(225)                            NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL,
  CONSTRAINT rooms_tms_rooms_id_fk
  FOREIGN KEY (room_id) REFERENCES rooms (id)
)
  COMMENT 'N-N table rooms tmhmata'
  ENGINE = InnoDB;

CREATE INDEX rooms_tms_tm_id_fk
  ON rooms_tms (tm_id);

CREATE INDEX rooms_tms_rooms_id_fk
  ON rooms_tms (room_id);

CREATE TABLE tm
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  tm_code    VARCHAR(32)  NULL,
  descr      VARCHAR(12)  NULL,
  title      VARCHAR(255) NULL,
  sxoli      VARCHAR(64)  NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  ENGINE = InnoDB;

ALTER TABLE kat
  ADD CONSTRAINT tm___fk
FOREIGN KEY (tm_id) REFERENCES tm (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE rooms
  ADD CONSTRAINT rooms_tm_id_fk
FOREIGN KEY (tm_owner) REFERENCES tm (id);

ALTER TABLE rooms_tms
  ADD CONSTRAINT rooms_tms_tm_id_fk
FOREIGN KEY (tm_id) REFERENCES tm (id);

CREATE TABLE transf_ps
(
  c1 VARCHAR(255) NULL,
  c2 VARCHAR(255) NULL,
  c3 VARCHAR(255) NULL,
  c4 VARCHAR(255) NULL,
  c5 VARCHAR(255) NULL,
  c6 VARCHAR(255) NULL,
  c7 VARCHAR(255) NULL,
  c8 VARCHAR(255) NULL,
  c9 VARCHAR(255) NULL
)
  COMMENT 'tmp'
  ENGINE = MyISAM;

CREATE TABLE ucategories
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  descr      VARCHAR(255) NULL,
  comment    VARCHAR(255) NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  COMMENT 'user categories'
  ENGINE = InnoDB;

CREATE TABLE users
(
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  tm_id      INT          NULL,
  fname      VARCHAR(255) NULL,
  sname      VARCHAR(255) NULL,
  phone      INT(255)     NULL,
  em_main    VARCHAR(128) NULL,
  em_sec     VARCHAR(128) NULL,
  em_pant    VARCHAR(128) NULL,
  cat_id     INT          NULL,
  comments   VARCHAR(512) NULL,
  user       VARCHAR(64)  NULL,
  hash       VARCHAR(255) NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  CONSTRAINT users_tm_id_fk
  FOREIGN KEY (tm_id) REFERENCES tm (id),
  CONSTRAINT users_ucategories_id_fk
  FOREIGN KEY (cat_id) REFERENCES ucategories (id)
)
  ENGINE = InnoDB;

CREATE INDEX users_tm_id_fk
  ON users (tm_id);

CREATE INDEX users_ucategories_id_fk
  ON users (cat_id);

ALTER TABLE requests
  ADD CONSTRAINT requests_users_id_fk
FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE requests
  ADD CONSTRAINT requests_users_id_fk_2
FOREIGN KEY (admin) REFERENCES users (id);

ALTER TABLE room_book
  ADD CONSTRAINT room_book_users_id_fk
FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE users_roles
(
  user_id    INT          NULL,
  role_id    INT          NULL,
  comment    VARCHAR(255) NULL,
  exp_dt     TIMESTAMP    NULL,
  status     INT          NULL,
  id         INT AUTO_INCREMENT
    PRIMARY KEY,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  CONSTRAINT users_roles_users_id_fk
  FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT users_roles_roles_id_fk
  FOREIGN KEY (role_id) REFERENCES roles (id)
)
  COMMENT 'N-N'
  ENGINE = InnoDB;

CREATE INDEX users_roles_users_id_fk
  ON users_roles (user_id);

CREATE INDEX users_roles_roles_id_fk
  ON users_roles (role_id);

