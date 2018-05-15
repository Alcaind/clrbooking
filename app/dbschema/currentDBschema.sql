CREATE TABLE cleanusers
(
	id         INT DEFAULT '0' NOT NULL,
	tm_id      INT             NULL,
	fname      VARCHAR(255)    NULL,
	sname      VARCHAR(255)    NULL,
	phone      INT(255)        NULL,
	em_main    VARCHAR(128)    NULL,
	em_sec     VARCHAR(128)    NULL,
	em_pant    VARCHAR(128)    NULL,
	cat_id     INT             NULL,
	comments   VARCHAR(512)    NULL,
	user       VARCHAR(64)     NULL,
	hash       VARCHAR(255)    NULL,
	created_at TIMESTAMP       NULL,
	updated_at TIMESTAMP       NULL,
	cnt        BIGINT(21)      NOT NULL
)
	ENGINE = InnoDB;

create table config
(
	id            int auto_increment
		primary key,
	year          INT(4)     NULL,
	status        int        null,
	created_at    timestamp  null,
	updated_at    TIMESTAMP  NULL,
	fromd         DATE       NULL,
	tod           DATE       NULL,
	synt          VARCHAR(9) NULL,
	req_exp_dates INT        NULL
)
	ENGINE = InnoDB
;

create table items
(
	id         int auto_increment
		primary key,
	descr      varchar(255) null,
	comments   varchar(215) null,
	code       varchar(255) null,
	status     int          null,
	created_at timestamp    null,
	updated_at timestamp    null
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

CREATE TABLE params
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
	name       VARCHAR(255)                            NULL,
	value      LONGTEXT                                NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL
)
	ENGINE = InnoDB;

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
	tma_code   VARCHAR(12)  NULL,
	tma_per    varchar(255) null,
	ps_ex      int          null,
	ps_dm      int          null,
	ps_km      varchar(4)   null,
	conf_id    int          null,
	created_at timestamp    null,
	updated_at TIMESTAMP    NULL,
	CONSTRAINT ps_config_id_fk
	FOREIGN KEY (conf_id) REFERENCES config (id)
)
	ENGINE = InnoDB;

CREATE INDEX ps_config_id_fk
	ON ps (conf_id);

CREATE TABLE ps_double
(
	c1  VARCHAR(255)    NULL,
	c2  VARCHAR(255)    NULL,
	c3  VARCHAR(255)    NULL,
	c4  VARCHAR(255)    NULL,
	c5  VARCHAR(255)    NULL,
	c6  VARCHAR(255)    NULL,
	c7  VARCHAR(255)    NULL,
	c8  VARCHAR(255)    NULL,
	c9  VARCHAR(255)    NULL,
	c10 VARCHAR(255)    NULL,
	c11 VARCHAR(255)    NULL,
	c12 VARCHAR(255)    NULL,
	c13 VARCHAR(255)    NULL,
	id  INT DEFAULT '0' NOT NULL,
	cnt BIGINT(21)      NOT NULL
)
	ENGINE = InnoDB;

CREATE TABLE ps_double_met
(
	c1  VARCHAR(255)    NULL,
	c2  VARCHAR(255)    NULL,
	c3  VARCHAR(255)    NULL,
	c4  VARCHAR(255)    NULL,
	c5  VARCHAR(255)    NULL,
	c6  VARCHAR(255)    NULL,
	c7  VARCHAR(255)    NULL,
	c8  VARCHAR(255)    NULL,
	c9  VARCHAR(255)    NULL,
	c10 VARCHAR(255)    NULL,
	c11 VARCHAR(255)    NULL,
	c12 VARCHAR(255)    NULL,
	c13 VARCHAR(255)    NULL,
	id  INT DEFAULT '0' NOT NULL,
	cnt BIGINT(21)      NOT NULL
)
	ENGINE = InnoDB;

CREATE TABLE ps_met
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
	c10 VARCHAR(255) NULL,
	c11 VARCHAR(255) NULL,
	c12 VARCHAR(255) NULL,
	c13 VARCHAR(255) NULL,
	id  INT AUTO_INCREMENT
		PRIMARY KEY
)
	ENGINE = InnoDB;

CREATE TABLE ps_new_trans
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
	c10 VARCHAR(255) NULL,
	c11 VARCHAR(255) NULL,
	c12 VARCHAR(255) NULL,
	c13 VARCHAR(255) NULL
)
	ENGINE = InnoDB;

CREATE TABLE ps_stats
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
	ps_id      INT       NULL,
	diloseis   INT       NULL,
	exetaseis  INT       NULL,
	created_at TIMESTAMP NULL,
	updated_at timestamp null
)
	ENGINE = MyISAM;

CREATE INDEX ps_stats_ps_ps_id_fk
	ON ps_stats (ps_id);

CREATE TABLE ps_teachers
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
	ps_id      INT                                     NULL,
	user_id    INT                                     NULL,
	comment    VARCHAR(255)                            NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL,
	CONSTRAINT ps_teachers_ps_id_fk
	FOREIGN KEY (ps_id) REFERENCES ps (id)
)
	ENGINE = InnoDB;

CREATE INDEX ps_teachers_ps_id_fk
	ON ps_teachers (ps_id);

CREATE INDEX ps_teachers_users_id_fk
	ON ps_teachers (user_id);

CREATE TABLE ps_trans
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
	c10 VARCHAR(255) NULL,
	c11 VARCHAR(255) NULL,
	c12 VARCHAR(255) NULL,
	c13 VARCHAR(255) NULL,
	id  INT AUTO_INCREMENT
		PRIMARY KEY
)
	ENGINE = InnoDB;

CREATE TABLE ps_trans_check
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
	c10 VARCHAR(255) NULL,
	c11 VARCHAR(255) NULL,
	c12 VARCHAR(255) NULL,
	c13 VARCHAR(255) NULL
)
	ENGINE = InnoDB;

CREATE TABLE ps_vas
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
	c10 VARCHAR(255) NULL,
	c11 VARCHAR(255) NULL,
	c12 VARCHAR(255) NULL,
	c13 VARCHAR(255) NULL,
	id  INT AUTO_INCREMENT
		PRIMARY KEY
)
	ENGINE = InnoDB;

CREATE TABLE req_transf
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
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
	c70 VARCHAR(255) NULL,
	c71 VARCHAR(255) NULL,
	c72 VARCHAR(255) NULL,
	c73 VARCHAR(255) NULL,
	c74 VARCHAR(255) NULL,
	c75 VARCHAR(255) NULL,
	c76 VARCHAR(255) NULL,
	c77 VARCHAR(255) NULL,
	c78 VARCHAR(255) NULL,
	id  INT AUTO_INCREMENT
		PRIMARY KEY
)
	ENGINE = InnoDB;

CREATE TABLE req_transf_clean_c8
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
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
	c70 VARCHAR(255) NULL,
	c71 VARCHAR(255) NULL,
	c72 VARCHAR(255) NULL,
	c73 VARCHAR(255) NULL,
	c74 VARCHAR(255) NULL,
	c75 VARCHAR(255) NULL,
	c76 VARCHAR(255) NULL,
	c77 VARCHAR(255) NULL,
	c78 VARCHAR(255) NULL
)
	ENGINE = InnoDB;

CREATE TABLE req_transf_exams
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
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
	c70 VARCHAR(255) NULL,
	c71 VARCHAR(255) NULL,
	c72 VARCHAR(255) NULL,
	c73 VARCHAR(255) NULL,
	c74 VARCHAR(255) NULL,
	c75 VARCHAR(255) NULL,
	c76 VARCHAR(255) NULL,
	c77 VARCHAR(255) NULL,
	c78 VARCHAR(255) NULL,
	id  INT AUTO_INCREMENT
		PRIMARY KEY
)
	ENGINE = InnoDB;

CREATE TABLE req_transf_tmp
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
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
	c70 VARCHAR(255) NULL,
	c71 VARCHAR(255) NULL,
	c72 VARCHAR(255) NULL,
	c73 VARCHAR(255) NULL,
	c74 VARCHAR(255) NULL,
	c75 VARCHAR(255) NULL
)
	ENGINE = InnoDB;

CREATE TABLE req_transf_vas
(
	c1  VARCHAR(255) NULL,
	c2  VARCHAR(255) NULL,
	c3  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL,
	c5  VARCHAR(255) NULL,
	c6  VARCHAR(255) NULL,
	c7  VARCHAR(255) NULL,
	c8  VARCHAR(255) NULL,
	c9  VARCHAR(255) NULL,
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
	c70 VARCHAR(255) NULL,
	c71 VARCHAR(255) NULL,
	c72 VARCHAR(255) NULL,
	c73 VARCHAR(255) NULL,
	c74 VARCHAR(255) NULL,
	c75 VARCHAR(255) NULL,
	c76 VARCHAR(255) NULL,
	c77 VARCHAR(255) NULL,
	c78 VARCHAR(255) NULL
)
	ENGINE = InnoDB;

CREATE TABLE request_guests
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
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

CREATE TABLE request_rooms
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
	req_id     INT          NULL,
	room_id    INT          NULL,
	comment    VARCHAR(255) NULL,
	created_at TIMESTAMP    NULL,
	updated_at TIMESTAMP    NULL,
	teacher    INT          NULL
	COMMENT 'from users',
	fromt      TIME         NULL,
	tot        TIME         NULL,
	date_index INT          NULL
)
	COMMENT 'N-N requests rooms'
	ENGINE = MyISAM;

CREATE INDEX request_rooms_requests_id_fk
	ON request_rooms (req_id);

CREATE INDEX request_r_id_fk
	ON request_rooms (room_id);

CREATE INDEX request_teacher_fk
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
	protocol_id VARCHAR(255)                       NULL,
	status      INT                                NULL,
	fromd       DATE                               NULL,
	tod         DATE                               NULL,
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
	id         int auto_increment
		primary key,
	role       varchar(255) null,
	descr      varchar(255) null,
	created_at timestamp    null,
	updated_at timestamp    null
)
	ENGINE = InnoDB
;

create table room_category
(
	id         int auto_increment
		primary key,
	synt       varchar(255)                            not null,
	descr      varchar(255)                            null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null
)
	COMMENT 'Κατηγορίες αιθουσών'
	ENGINE = InnoDB
;

create table room_items
(
	id         int auto_increment
		primary key,
	item_id    int          null,
	comments   varchar(255) null,
	stat       int          null,
	`from`     DATE         NULL,
	`to`       DATE         NULL,
	room_id    int          null,
	created_at timestamp    null,
	updated_at timestamp    null,
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
	synt           VARCHAR(255)                             NULL,
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

alter table room_items
	add constraint room_rooms___fk
FOREIGN KEY (room_id) REFERENCES rooms (id)
;

create table rooms_room_use
(
	id          int auto_increment
		primary key,
	rooms_id    int                                     not null,
	room_use_id int                                     not null,
	comment     varchar(255)                            null,
	created_at  timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at  timestamp default '0000-00-00 00:00:00' not null,
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

create table rooms_tms
(
	id         int auto_increment
		primary key,
	tm_id      int                                     not null,
	room_id    int                                     not null,
	comments   varchar(225)                            null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
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

CREATE TABLE teacher_tmp2
(
	c12 VARCHAR(255) NULL,
	fn  TEXT         NULL,
	ln  VARCHAR(255) NULL,
	c4  VARCHAR(255) NULL
)
	ENGINE = InnoDB;

create table tm
(
	id         int auto_increment
		primary key,
	tm_code    varchar(32)  null,
	descr      varchar(12)  null,
	title      varchar(255) null,
	sxoli      varchar(64)  null,
	created_at timestamp    null,
	updated_at TIMESTAMP    NULL,
	supervisor INT          NULL
)
	ENGINE = InnoDB;

CREATE INDEX tm_users_id_fk
	ON tm (supervisor);

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

CREATE TABLE tm_users
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
	user_id    INT                                     NULL,
	tm_id      INT                                     NULL,
	comments   VARCHAR(255)                            NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL
)
	ENGINE = InnoDB;

CREATE INDEX tm_users_users_id_fk
	ON tm_users (user_id);

CREATE INDEX tm_users_tm_id_fk
	ON tm_users (tm_id);

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

create table ucategories
(
	id         int auto_increment
		primary key,
	descr      varchar(255) null,
	comment    varchar(255) null,
	created_at timestamp    null,
	updated_at timestamp    null
)
	COMMENT 'user categories'
	ENGINE = InnoDB
;

create table users
(
	id         int auto_increment
		primary key,
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
	CONSTRAINT users_ucategories_id_fk
	FOREIGN KEY (cat_id) REFERENCES ucategories (id)
)
	ENGINE = InnoDB;

CREATE INDEX users_ucategories_id_fk
	ON users (cat_id);

ALTER TABLE ps_teachers
	ADD CONSTRAINT ps_teachers_users_id_fk
FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE requests
	ADD CONSTRAINT requests_users_id_fk
FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE requests
	ADD CONSTRAINT requests_users_id_fk_2
FOREIGN KEY (admin) REFERENCES users (id);

ALTER TABLE tm
	ADD CONSTRAINT tm_users_id_fk
FOREIGN KEY (supervisor) REFERENCES users (id);

ALTER TABLE tm_users
	ADD CONSTRAINT tm_users_users_id_fk
FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE users_bkp
(
	id         INT DEFAULT '0' NOT NULL,
	tm_id      int             null,
	fname      varchar(255)    null,
	sname      varchar(255)    null,
	phone      int(255)        null,
	em_main    varchar(128)    null,
	em_sec     varchar(128)    null,
	em_pant    varchar(128)    null,
	cat_id     int             null,
	comments   varchar(512)    null,
	user       varchar(64)     null,
	hash       varchar(255)    null,
	created_at timestamp       null,
	updated_at timestamp       null
)
	ENGINE = InnoDB;

CREATE TABLE users_requests
(
	id         INT AUTO_INCREMENT
		PRIMARY KEY,
	from_user  INT             NULL,
	to_users   INT             NULL,
	comments   VARCHAR(255)    NULL,
	rr_id      INT             NULL,
	to_comment VARCHAR(255)    NULL,
	confirm    TINYINT(1)      NULL,
	status     INT DEFAULT '0' NULL,
	created_at TIMESTAMP       NULL,
	updated_at TIMESTAMP       NULL,
	CONSTRAINT users_requests_users_id_fk
	FOREIGN KEY (from_user) REFERENCES users (id),
	CONSTRAINT users_requests_users_id_fk_2
	FOREIGN KEY (to_users) REFERENCES users (id)
)
	ENGINE = InnoDB;

CREATE INDEX users_requests_users_id_fk
	ON users_requests (from_user);

CREATE INDEX users_requests_users_id_fk_2
	ON users_requests (to_users);

create table users_roles
(
	user_id    int          null,
	role_id    int          null,
	comment    varchar(255) null,
	exp_dt     timestamp    null,
	status     int          null,
	id         int auto_increment
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

CREATE TABLE users_vas
(
	c10 VARCHAR(255) NULL,
	c11 VARCHAR(255) NULL
)
	ENGINE = InnoDB;

CREATE TABLE userscheck
(
	id         INT DEFAULT '0' NOT NULL,
	tm_id      INT             NULL,
	fname      VARCHAR(255)    NULL,
	sname      VARCHAR(255)    NULL,
	phone      INT(255)        NULL,
	em_main    VARCHAR(128)    NULL,
	em_sec     VARCHAR(128)    NULL,
	em_pant    VARCHAR(128)    NULL,
	cat_id     INT             NULL,
	comments   VARCHAR(512)    NULL,
	user       VARCHAR(64)     NULL,
	hash       VARCHAR(255)    NULL,
	created_at timestamp       null,
	updated_at timestamp       null
)
	ENGINE = InnoDB
;

