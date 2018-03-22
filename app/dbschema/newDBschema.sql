create table config
(
  id         INT AUTO_INCREMENT
		primary key,
  year       INT(4)     NULL,
  status     INT        NULL,
  created_at TIMESTAMP  NULL,
  updated_at TIMESTAMP  NULL,
  fromd      DATE       NULL,
  tod        DATE       NULL,
  synt       VARCHAR(9) NULL
)
  ENGINE = InnoDB
;

create table items
(
	id int auto_increment
		primary key,
	descr varchar(255) null,
	comments varchar(215) null,
	code varchar(255) null,
	status int null,
	created_at timestamp null,
	updated_at timestamp null
)
  ENGINE = InnoDB
;

create table kat
(
  id         INT AUTO_INCREMENT
		primary key,
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

create table periods
(
  id         INT AUTO_INCREMENT
		primary key,
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

create table ps
(
  id         INT AUTO_INCREMENT
		primary key,
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

create table ps_stats
(
  id         INT AUTO_INCREMENT
		primary key,
  ps_id      INT       NULL,
  diloseis   INT       NULL,
  exetaseis  INT       NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
)
  ENGINE = MyISAM;

CREATE INDEX ps_stats_ps_ps_id_fk
  ON ps_stats (ps_id);

create table request_guests
(
  id         INT AUTO_INCREMENT
		primary key,
  req_id     INT          NULL,
  name       VARCHAR(255) NULL,
  uni        VARCHAR(255) NULL,
  email      VARCHAR(255) NULL,
  phone      VARCHAR(255) NULL,
  comment    VARCHAR(255) NULL,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL
)
  COMMENT 'gia tilediaskepsi'
  ENGINE = MyISAM;

CREATE INDEX request_guests_requests_id_fk
  ON request_guests (req_id);

create table request_rooms
(
  id         int auto_increment
		primary key,
  req_id     int          null,
  room_id    int          null,
  comment    VARCHAR(255) NULL,
  created_at timestamp    null,
  updated_at timestamp    null,
  teacher    int          null comment 'from users'
)
  COMMENT 'N-N requests rooms'
  ENGINE = MyISAM;

CREATE INDEX request_rooms_requests_id_fk
  ON request_rooms (req_id);

CREATE INDEX request_rooms_rooms_id_fk
  ON request_rooms (room_id);

CREATE INDEX request_rooms_users_id_fk
  ON request_rooms (teacher);

create table requests
(
  id          INT AUTO_INCREMENT
		primary key,
  req_dt      DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
  COMMENT 'Ημερομηνία Αιτήματος',
  user_id     INT                                NULL,
  descr       LONGTEXT                           NULL,
  period      VARCHAR(5)                         NULL,
  ps_id       INT                                NULL,
  class_use   VARCHAR(255)                       NULL,
  links       VARCHAR(512)                       NULL,
  fromt       TIME                               NULL,
  tot         TIME                               NULL,
  protocol_id VARCHAR(255)                       NULL,
  status      INT                                NULL,
  fromd       DATE                               NULL,
  tod         DATE                               NULL,
  date_index  INT                                NULL,
  created_at  TIMESTAMP                          NULL,
  updated_at  TIMESTAMP                          NULL,
  admin       INT                                NULL,
  conf_id     INT                                NULL,
  CONSTRAINT requests_ps_id_fk
  FOREIGN KEY (ps_id) REFERENCES ps (id),
  CONSTRAINT requests_config_id_fk
  FOREIGN KEY (conf_id) REFERENCES config (id)
    ON UPDATE CASCADE
)
  ENGINE = InnoDB;

CREATE INDEX requests_users_id_fk
  ON requests (user_id);

CREATE INDEX requests_ps_id_fk
  ON requests (ps_id);

CREATE INDEX requests_users_id_fk_2
  ON requests (admin);

CREATE INDEX requests_config_id_fk
  ON requests (conf_id);

create table roles
(
	id int auto_increment
		primary key,
	role varchar(255) null,
	descr varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null
)
  ENGINE = InnoDB
;

create table room_book
(
  id         INT AUTO_INCREMENT
		primary key,
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
  teacher    INT          NULL,
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

CREATE INDEX room_book_users_id_fk_2
  ON room_book (teacher)
;

create table room_category
(
	id int auto_increment
		primary key,
	synt varchar(255) not null,
	descr varchar(255) null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null
)
  COMMENT 'Κατηγορίες αιθουσών'
  ENGINE = InnoDB
;

create table room_items
(
	id int auto_increment
		primary key,
	item_id int null,
	comments varchar(255) null,
	stat int null,
	`from` timestamp null,
	`to` timestamp null,
	room_id int null,
	created_at timestamp null,
	updated_at timestamp null,
	constraint room_items_items_id_fk
  FOREIGN KEY (item_id) REFERENCES items (id)
)
  COMMENT 'N-N'
  ENGINE = InnoDB
;

create index room_items_items_id_fk
	on room_items (item_id)
;

create index room_rooms___fk
	on room_items (room_id)
;

create table room_use
(
  id         int auto_increment
		primary key,
  synt       varchar(4)   null,
  descr      varchar(255) null,
  created_at timestamp    null,
  updated_at TIMESTAMP    NULL,
  priority   INT          NULL
)
  ENGINE = InnoDB
;

create table rooms
(
  id             INT AUTO_INCREMENT
		primary key,
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

alter table room_items
	add constraint room_rooms___fk
FOREIGN KEY (room_id) REFERENCES rooms (id)
;

create table rooms_room_use
(
	id int auto_increment
		primary key,
	rooms_id int not null,
	room_use_id int not null,
	comment varchar(255) null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	constraint room_use__index
  UNIQUE (rooms_id, room_use_id),
	constraint rooms_room_use_rooms_id_fk
  FOREIGN KEY (rooms_id) REFERENCES rooms (id),
	constraint rooms_room_use_room_use_id_fk
  FOREIGN KEY (room_use_id) REFERENCES room_use (id)
)
  COMMENT 'N-N για χρήση αιθουσών'
  ENGINE = InnoDB
;

create index rooms_room_use_room_use_id_fk
	on rooms_room_use (room_use_id)
;

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

CREATE TABLE rooms_tranf3
(
  c1  VARCHAR(255) NULL,
  c2  VARCHAR(255) NULL,
  c3  VARCHAR(255) NULL,
  c4  VARCHAR(255) NULL,
  c5  VARCHAR(255) NULL,
  c6  VARCHAR(255) NULL,
  c7  VARCHAR(255) NULL,
  c8  VARCHAR(255) NULL,
  c10 VARCHAR(255) NULL,
  c11 VARCHAR(255) NULL,
  c12 VARCHAR(255) NULL,
  c13 VARCHAR(255) NULL,
  c14 VARCHAR(255) NULL,
  c15 VARCHAR(255) NULL,
  c16 VARCHAR(255) NULL,
  c17 VARCHAR(255) NULL,
  c18 VARCHAR(255) NULL,
  c19 VARCHAR(255) NULL,
  c20 VARCHAR(255) NULL,
  c21 VARCHAR(255) NULL,
  c22 VARCHAR(255) NULL,
  c23 VARCHAR(255) NULL,
  c24 VARCHAR(255) NULL,
  c25 VARCHAR(255) NULL,
  c26 VARCHAR(255) NULL,
  c27 VARCHAR(255) NULL,
  c28 VARCHAR(255) NULL,
  c29 VARCHAR(255) NULL,
  c30 VARCHAR(255) NULL,
  c31 VARCHAR(255) NULL,
  c32 VARCHAR(255) NULL,
  c33 VARCHAR(255) NULL,
  c34 VARCHAR(255) NULL,
  c35 VARCHAR(255) NULL,
  c36 VARCHAR(255) NULL,
  c37 VARCHAR(255) NULL,
  c38 VARCHAR(255) NULL,
  c39 VARCHAR(255) NULL,
  c40 VARCHAR(255) NULL,
  c41 VARCHAR(255) NULL,
  c42 VARCHAR(255) NULL,
  c43 VARCHAR(255) NULL,
  c44 VARCHAR(255) NULL,
  c45 VARCHAR(255) NULL,
  c46 VARCHAR(255) NULL,
  c47 VARCHAR(255) NULL,
  c48 VARCHAR(255) NULL,
  c49 VARCHAR(255) NULL,
  c50 VARCHAR(255) NULL,
  c51 VARCHAR(255) NULL,
  c52 VARCHAR(255) NULL,
  c53 VARCHAR(255) NULL,
  c54 VARCHAR(255) NULL,
  c55 VARCHAR(255) NULL,
  c56 VARCHAR(255) NULL,
  c57 VARCHAR(255) NULL,
  c58 VARCHAR(255) NULL,
  c59 VARCHAR(255) NULL,
  c60 VARCHAR(255) NULL,
  c61 VARCHAR(255) NULL,
  c62 VARCHAR(255) NULL,
  c63 VARCHAR(255) NULL,
  c64 VARCHAR(255) NULL,
  c65 VARCHAR(255) NULL,
  c66 VARCHAR(255) NULL,
  c67 VARCHAR(255) NULL,
  c68 VARCHAR(255) NULL,
  c69 VARCHAR(255) NULL,
  c70 VARCHAR(255) NULL
)
  ENGINE = MyISAM;

create table tm
(
	id int auto_increment
		primary key,
	tm_code varchar(32) null,
	descr varchar(12) null,
	title varchar(255) null,
	sxoli varchar(64) null,
	created_at timestamp null,
	updated_at timestamp null
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

create table transf_ps
(
	c1 varchar(255) null,
	c2 varchar(255) null,
	c3 varchar(255) null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
	c9 varchar(255) null
)
  COMMENT 'tmp'
  ENGINE = MyISAM
;

create table ucategories
(
	id int auto_increment
		primary key,
	descr varchar(255) null,
	comment varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null
)
  COMMENT 'user categories'
  ENGINE = InnoDB
;

create table users
(
  id         INT AUTO_INCREMENT
		primary key,
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

ALTER TABLE room_book
  ADD CONSTRAINT room_book_users_id_fk_2
FOREIGN KEY (teacher) REFERENCES users (id);

create table users_roles
(
  user_id    INT          NULL,
  role_id    INT          NULL,
  comment    VARCHAR(255) NULL,
  exp_dt     TIMESTAMP    NULL,
  status     INT          NULL,
  id         INT AUTO_INCREMENT
		primary key,
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

