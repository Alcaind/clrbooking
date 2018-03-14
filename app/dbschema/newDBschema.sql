create table config
(
	id         int auto_increment
		primary key,
	year       INT(4)     NULL,
	status     int        null,
	created_at timestamp  null,
	updated_at timestamp  null,
	fromd      datetime   null,
	tod        DATETIME   NULL,
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
	id         int auto_increment
		primary key,
	tm_id      int          null,
	decr       varchar(32)  null,
	title      varchar(255) null,
	pm         INT          NULL
	COMMENT 'αναφέρεται ως είδος->προπτυχιακο/μεταπτυχιακο',
	created_at timestamp    null,
	updated_at timestamp    null
)
	ENGINE = InnoDB;

CREATE INDEX tm___fk
	ON kat (tm_id);

create table periods
(
	id         int auto_increment
		primary key,
	descr      varchar(64)  null,
	synt       varchar(12)  null,
	fromd      date         null,
	tod        date         null,
	comments   varchar(255) null,
	conf_id    int          null,
	porder     int          null,
	status     int          null,
	created_at timestamp    null,
	updated_at TIMESTAMP    NULL,
	CONSTRAINT periods_config_id_fk
	FOREIGN KEY (conf_id) REFERENCES config (id)
)
	ENGINE = InnoDB;

CREATE INDEX periods_config_id_fk
	ON periods (conf_id);

create table ps
(
	id         int auto_increment
		primary key,
	tm_code    int          null,
	tm_per     varchar(255) null,
	pm         CHAR(3)      NULL,
	tma_code   int          null,
	tma_per    varchar(255) null,
	ps_ex      int          null,
	ps_dm      int          null,
	ps_km      varchar(4)   null,
	teacher    varchar(255) null,
	conf_id    int          null,
	created_at timestamp    null,
	updated_at timestamp    null,
	ps_id      INT          NULL,
	CONSTRAINT ps_config_id_fk
	FOREIGN KEY (conf_id) REFERENCES config (id)
)
	ENGINE = InnoDB;

CREATE INDEX ps_config_id_fk
	ON ps (conf_id);

create table ps_stats
(
	id         int auto_increment
		primary key,
	ps_id      int       null,
	diloseis   int       null,
	exetaseis  INT       NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL
)
	ENGINE = MyISAM;

CREATE INDEX ps_stats_ps_ps_id_fk
	ON ps_stats (ps_id);

create table request_guests
(
	id         int auto_increment
		primary key,
	req_id     int          null,
	name       varchar(255) null,
	uni        varchar(255) null,
	email      varchar(255) null,
	phone      varchar(255) null,
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
	id int auto_increment
		primary key,
	req_id int null,
	room_id int null,
	comment int null,
	created_at timestamp null,
	updated_at timestamp null,
	teacher int null comment 'from users'
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
	id          int auto_increment
		primary key,
	req_dt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
	COMMENT 'Ημερομηνία Αιτήματος',
	user_id     int                                 null,
	descr       longtext                            null,
	period      varchar(5)                          null,
	ps_id       int                                 null,
	class_use   varchar(255)                        null,
	links       varchar(512)                        null,
	fromdt      time                                null,
	todt        time                                null,
	protocol_id varchar(255)                        null,
	req_status  int                                 null,
	fromd       date                                null,
	tod         date                                null,
	date_index  int                                 null,
	created_at  timestamp                           null,
	updated_at  timestamp                           null,
	admin       int                                 null
)
	ENGINE = InnoDB;

CREATE INDEX requests_users_id_fk
	ON requests (user_id);

CREATE INDEX requests_users_id_fk_2
	ON requests (admin);

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
	id         int auto_increment
		primary key,
	user_id    int          null,
	date_index int          null,
	fromt      time         null,
	tot        time         null,
	type       int          null,
	period     int          null,
	room_id    int          null,
	fromd      date         null,
	tod        date         null,
	request_id int          null,
	created_at timestamp    null,
	updated_at timestamp    null,
	status     int          null,
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
	id int auto_increment
		primary key,
	synt varchar(4) null,
	descr varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null
)
	ENGINE = InnoDB
;

create table rooms
(
	id             int auto_increment
		primary key,
	name           varchar(255)                             null,
	address        varchar(512)                             null,
	building       varchar(255)                             null,
	floor          varchar(128)                             null,
	status         varchar(64) default '0' not null,
	active         int                                      null,
	destroyed      varchar(4)                               null,
	nonexist       varchar(4)                               null,
	capasity       int                                      null,
	width          int                                      null,
	height         int                                      null,
	xoros          varchar(512) default '{(10,15),(10,15)}' null,
	exams_capasity int                                      null,
	capasity_categ varchar(10)                              null,
	tm_owner       INT                                      NULL,
	stat_comm      varchar(255)                             null,
	conf_id        int                                      null,
	category       int(64)                                  null,
	created_at     timestamp                                null,
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
	id         int auto_increment
		primary key,
	tm_id      int          null,
	fname      varchar(255) null,
	sname      varchar(255) null,
	phone      int(255)     null,
	em_main    varchar(128) null,
	em_sec     varchar(128) null,
	em_pant    varchar(128) null,
	cat_id     int          null,
	comments   varchar(512) null,
	user       varchar(64)  null,
	hash       varchar(255) null,
	created_at timestamp    null,
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
	user_id    int          null,
	role_id    int          null,
	comment    varchar(255) null,
	exp_dt     timestamp    null,
	status     int          null,
	id         int auto_increment
		primary key,
	created_at timestamp    null,
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

