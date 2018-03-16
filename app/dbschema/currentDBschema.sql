create table config
(
	id int auto_increment
		primary key,
	year int null,
	status int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
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
engine=InnoDB
;

create table kat
(
	id int auto_increment
		primary key,
	tm_id int null,
	decr varchar(32) null,
	title varchar(255) null,
	pm int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

create table periods
(
	id int auto_increment
		primary key,
	descr varchar(64) null,
	synt varchar(12) null,
	fromd date null,
	tod date null,
	comments varchar(255) null,
	conf_id int null,
	porder int null,
	status int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

create table ps
(
	id int auto_increment
		primary key,
	tm_code int null,
	tm_per varchar(255) null,
	pm char(3) default 'ΠΡΟ' null,
	tma_code int null,
	tma_per varchar(255) null,
	ps_ex int null,
	ps_dm int null,
	ps_km varchar(4) null,
	teacher varchar(255) null,
	conf_id int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

create table requests
(
  id          int auto_increment
		primary key,
  req_dt      timestamp default CURRENT_TIMESTAMP not null,
  user_id     int                                 null,
  descr       longtext                            null,
  period      varchar(5)                          null,
  ps_id       int                                 null,
  teacher     varchar(255)                        null,
  class_use   varchar(255)                        null,
  links       varchar(512)                        null,
  fromt       TIME                                NULL,
  tot         TIME                                NULL,
  protocol_id varchar(255)                        null,
  status      INT                                 NULL,
  fromd       date                                null,
  tod         date                                null,
  date_index  int                                 null,
  created_at  timestamp                           null,
  updated_at  timestamp                           null
)
engine=InnoDB
;

create table roles
(
	id int auto_increment
		primary key,
	role varchar(255) null,
	descr varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

create table room_book
(
	id int auto_increment
		primary key,
	user_id int null,
	date_index int null,
	fromt time null,
	tot time null,
	type int null,
	period int null,
	room_id int null,
	fromd date null,
	tod date null,
	request_id int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
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
comment 'Κατηγορίες αιθουσών' engine=InnoDB
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
		foreign key (item_id) references items (id)
)
engine=InnoDB
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
engine=InnoDB
;

create table rooms
(
	id int auto_increment
		primary key,
	name varchar(255) null,
	address varchar(512) null,
	building varchar(255) null,
	floor varchar(128) null,
	status varchar(64) default '0' not null,
	active int null,
	destroyed varchar(4) null,
	nonexist varchar(4) null,
	capasity int null,
	width int null,
	height int null,
	xoros varchar(512) default '{(10,15),(10,15)}' null,
	exams_capasity int null,
	capasity_categ varchar(10) null,
	tm_owner varchar(255) null,
	stat_comm varchar(255) null,
	conf_id int null,
	category int(64) null,
	use_id int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

alter table room_items
	add constraint room_rooms___fk
		foreign key (room_id) references rooms (id)
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
		unique (rooms_id, room_use_id),
	constraint rooms_room_use_rooms_id_fk
		foreign key (rooms_id) references rooms (id),
	constraint rooms_room_use_room_use_id_fk
		foreign key (room_use_id) references room_use (id)
)
comment 'N-N για χρήση αιθουσών' engine=InnoDB
;

create index rooms_room_use_room_use_id_fk
	on rooms_room_use (room_use_id)
;

create table rooms_tms
(
	id int auto_increment
		primary key,
	tm_id int not null,
	room_id int not null,
	comments varchar(225) null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null
)
comment 'N-N table rooms tmhmata' engine=InnoDB
;

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
engine=InnoDB
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
comment 'user categories' engine=InnoDB
;

create table users
(
	id int auto_increment
		primary key,
	tm_id int null,
	fname varchar(255) null,
	sname varchar(255) null,
	phone int(255) null,
	em_main varchar(128) null,
	em_sec varchar(128) null,
	em_pant varchar(128) null,
	cat_id int null,
	comments varchar(512) null,
	user varchar(64) null,
	hash varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

create table users_roles
(
	user_id int null,
	role_id int null,
	comment varchar(255) null,
	exp_dt timestamp null,
	status int null,
	id int auto_increment
		primary key,
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

