create table config
(
	id int auto_increment
		primary key,
	year int(4) null,
	status int null,
	created_at timestamp null,
	updated_at timestamp null,
	fromd date null,
	tod date null,
	synt varchar(9) null,
	req_exp_dates int null
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
	pm int null comment 'αναφέρεται ως είδος->προπτυχιακο/μεταπτυχιακο',
	created_at timestamp null,
	updated_at timestamp null
)
engine=InnoDB
;

create index tm___fk
	on kat (tm_id)
;

create table params
(
	id int auto_increment
		primary key,
	name varchar(255) null,
	value longtext null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null
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
	updated_at timestamp null,
	constraint per_conf_id_fk
		foreign key (conf_id) references config (id)
)
engine=InnoDB
;

create index per_id_fk
	on periods (conf_id)
;

create table ps
(
	id int auto_increment
		primary key,
	tm_code int null,
	tm_per varchar(255) null,
	pm char(3) null,
	tma_code varchar(12) null,
	tma_per varchar(255) null,
	ps_ex int null,
	ps_dm int null,
	ps_km varchar(4) null,
	conf_id int null,
	created_at timestamp null,
	updated_at timestamp null,
	ps_code int null,
	constraint ps_config_id_fk
		foreign key (conf_id) references config (id)
)
engine=InnoDB
;

create index ps_config_id_fk
	on ps (conf_id)
;

create table ps_errors
(
	id int default '0' not null,
	c1 varchar(255) null,
	c2 varchar(255) null,
	c3 varchar(255) null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
	c9 varchar(255) null,
	c10 varchar(255) null,
	c11 varchar(255) null,
	c12 varchar(255) null,
	c13 varchar(255) null,
	c14 varchar(255) null,
	c15 varchar(255) null,
	c16 varchar(255) null,
	c17 varchar(255) null,
	c18 varchar(255) null,
	c19 varchar(255) null,
	c20 varchar(255) null,
	c21 varchar(255) null,
	c22 varchar(255) null,
	c23 varchar(255) null,
	c24 varchar(255) null,
	c25 varchar(255) null,
	c26 varchar(255) null,
	c27 varchar(255) null,
	c28 varchar(255) null,
	c29 varchar(255) null,
	c30 varchar(255) null,
	c31 varchar(255) null,
	c32 varchar(255) null,
	c34 varchar(255) null,
	c35 varchar(255) null,
	c36 varchar(255) null,
	c37 varchar(255) null,
	c38 varchar(255) null,
	c39 varchar(255) null,
	c40 varchar(255) null,
	c41 varchar(255) null,
	c42 varchar(255) null,
	c43 varchar(255) null,
	c44 varchar(255) null,
	c45 varchar(255) null,
	c46 varchar(255) null,
	c47 varchar(255) null
)
engine=InnoDB
;

create table ps_stats
(
	id int auto_increment
		primary key,
	ps_id int null,
	diloseis int null,
	exetaseis int null,
	created_at timestamp null,
	updated_at timestamp null
)
engine=MyISAM
;

create index ps_stats_ps_ps_id_fk
	on ps_stats (ps_id)
;

create table ps_teachers
(
	id int auto_increment
		primary key,
	ps_id int null,
	user_id int null,
	comment varchar(255) null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	constraint ps_t_ps_id_fk
		foreign key (ps_id) references ps (id)
)
engine=InnoDB
;

create index ps_t_ps_id_fk
	on ps_teachers (ps_id)
;

create index ps_t_users_id_fk
	on ps_teachers (user_id)
;

create table ps_trans
(
	id int auto_increment
		primary key,
	c1 varchar(255) null,
	c2 varchar(255) null,
	c3 varchar(255) null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
	c9 varchar(255) null,
	c10 varchar(255) null,
	c11 varchar(255) null,
	c12 varchar(255) null,
	c13 varchar(255) null,
	c14 varchar(255) null,
	c15 varchar(255) null,
	c16 varchar(255) null,
	c17 varchar(255) null,
	c18 varchar(255) null,
	c19 varchar(255) null,
	c20 varchar(255) null,
	c21 varchar(255) null,
	c22 varchar(255) null,
	c23 varchar(255) null,
	c24 varchar(255) null,
	c25 varchar(255) null,
	c26 varchar(255) null,
	c27 varchar(255) null,
	c28 varchar(255) null,
	c29 varchar(255) null,
	c30 varchar(255) null,
	c31 varchar(255) null,
	c32 varchar(255) null,
	c34 varchar(255) null,
	c35 varchar(255) null,
	c36 varchar(255) null,
	c37 varchar(255) null,
	c38 varchar(255) null,
	c39 varchar(255) null,
	c40 varchar(255) null,
	c41 varchar(255) null,
	c42 varchar(255) null,
	c43 varchar(255) null,
	c44 varchar(255) null,
	c45 varchar(255) null,
	c46 varchar(255) null,
	c47 varchar(255) null
)
engine=InnoDB
;

create table req_transf
(
	c1 varchar(255) null,
	c2 varchar(255) null,
	c3 varchar(255) null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
	c9 varchar(255) null,
	c10 varchar(255) null,
	c11 varchar(255) null,
	c12 varchar(255) null,
	c13 varchar(255) null,
	c14 varchar(255) null,
	c15 varchar(255) null,
	c16 varchar(255) null,
	c17 varchar(255) null,
	c18 varchar(255) null,
	c19 varchar(255) null,
	c20 varchar(255) null,
	c21 varchar(255) null,
	c22 varchar(255) null,
	c23 varchar(255) null,
	c24 varchar(255) null,
	c25 varchar(255) null,
	c26 varchar(255) null,
	c27 varchar(255) null,
	c28 varchar(255) null,
	c29 varchar(255) null,
	c30 varchar(255) null,
	c31 varchar(255) null,
	c32 varchar(255) null,
	c33 varchar(255) null,
	c34 varchar(255) null,
	c35 varchar(255) null,
	c36 varchar(255) null,
	c37 varchar(255) null,
	c38 varchar(255) null,
	c39 varchar(255) null,
	c40 varchar(255) null,
	c41 varchar(255) null,
	c42 varchar(255) null,
	c43 varchar(255) null,
	c44 varchar(255) null,
	c45 varchar(255) null,
	c46 varchar(255) null,
	c47 varchar(255) null,
	c48 varchar(255) null,
	c49 varchar(255) null,
	c50 varchar(255) null,
	c51 varchar(255) null,
	c52 varchar(255) null,
	c53 varchar(255) null,
	c54 varchar(255) null,
	c55 varchar(255) null,
	c56 varchar(255) null,
	c57 varchar(255) null,
	c58 varchar(255) null,
	c59 varchar(255) null,
	c60 varchar(255) null,
	c61 varchar(255) null,
	c62 varchar(255) null,
	c63 varchar(255) null,
	c64 varchar(255) null,
	c65 varchar(255) null,
	c66 varchar(255) null,
	c67 varchar(255) null,
	c68 varchar(255) null,
	c69 varchar(255) null,
	c70 varchar(255) null,
	c71 varchar(255) null,
	c72 varchar(255) null,
	c73 varchar(255) null,
	c74 varchar(255) null,
	c75 varchar(255) null,
	c76 varchar(255) null,
	c77 varchar(255) null,
	c78 varchar(255) null,
	id int auto_increment
		primary key
)
engine=InnoDB
;

create table request_guests
(
	id int auto_increment
		primary key,
	req_id int null,
	name varchar(255) null,
	uni varchar(255) null,
	email varchar(255) null,
	phone varchar(255) null,
	comment varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null
)
comment 'gia tilediaskepsi' engine=MyISAM
;

create index r_g_id_fk
	on request_guests (req_id)
;

create table request_rooms
(
	id int auto_increment
		primary key,
	req_id int null,
	room_id int null,
	comment varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null,
	teacher int null comment 'from users',
	fromt time null,
	tot time null,
	date_index int null
)
comment 'N-N requests rooms' engine=MyISAM
;

create index req_r___fk
	on request_rooms (req_id)
;

create index r_r_u_id_fk
	on request_rooms (teacher)
;

create table requests
(
	id int auto_increment
		primary key,
	req_dt datetime default CURRENT_TIMESTAMP not null comment 'Ημερομηνία Αιτήματος',
	user_id int null,
	descr longtext null,
	period varchar(5) null,
	ps_id int null,
	class_use varchar(255) null,
	links varchar(512) null,
	protocol_id varchar(255) null,
	status int null,
	fromd date null,
	tod date null,
	created_at timestamp null,
	updated_at timestamp null,
	admin int null,
	conf_id int null,
	constraint requests_ps_id_fk
		foreign key (ps_id) references ps (id),
	constraint r_con_id_fk
		foreign key (conf_id) references config (id)
			on update cascade
)
engine=InnoDB
;

create index r_users_id_fk
	on requests (user_id)
;

create index r_ps_id_fk
	on requests (ps_id)
;

create index r_users_id_fk_2
	on requests (admin)
;

create index r_config_id_fk
	on requests (conf_id)
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
	`from` date null,
	`to` date null,
	room_id int null,
	created_at timestamp null,
	updated_at timestamp null,
	constraint room_items_items_id_fk
		foreign key (item_id) references items (id)
)
comment 'N-N' engine=InnoDB
;

create index room_i_id_fk
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
	updated_at timestamp null,
	priority int null
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
	tm_owner int null,
	stat_comm varchar(255) null,
	conf_id int null,
	category int(64) null,
	created_at timestamp null,
	updated_at timestamp null,
	synt varchar(255) null,
	constraint rooms_config_id_fk
		foreign key (conf_id) references config (id),
	constraint rooms_r_cat_id_fk
		foreign key (category) references room_category (id)
)
engine=InnoDB
;

create index rooms_tm_id_fk
	on rooms (tm_owner)
;

create index rooms_config_id_fk
	on rooms (conf_id)
;

create index rooms_cat_id_fk
	on rooms (category)
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

create index rooms_use_id_fk
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
	updated_at timestamp default '0000-00-00 00:00:00' not null,
	constraint rooms_tms_id_fk
		foreign key (room_id) references rooms (id)
)
comment 'N-N table rooms tmhmata' engine=InnoDB
;

create index rooms_tms_tm_id_fk
	on rooms_tms (tm_id)
;

create index r_tms_rooms_id_fk
	on rooms_tms (room_id)
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
	updated_at timestamp null,
	supervisor int null,
	ku_code char(3) null,
	ku_per varchar(255) null,
	mku_code char(3) null,
	mku_per varchar(255) null,
	pro_met int default '0' null,
	mp_code char(3) null,
	mp_per varchar(255) null
)
engine=InnoDB
;

create index tm_users_id_fk
	on tm (supervisor)
;

alter table kat
	add constraint tm___fk
		foreign key (tm_id) references tm (id)
			on update cascade on delete cascade
;

alter table rooms
	add constraint rooms_tm_id_fk
		foreign key (tm_owner) references tm (id)
;

alter table rooms_tms
	add constraint rooms_tms_tm_id_fk
		foreign key (tm_id) references tm (id)
;

create table tm_trans
(
	id int auto_increment
		primary key,
	c1 varchar(255) not null,
	c2 varchar(255) not null,
	c3 varchar(255) not null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
	c9 varchar(255) null,
	c10 varchar(255) null,
	c11 varchar(255) null,
	c12 varchar(255) null,
	c13 varchar(255) null,
	c14 varchar(255) null,
	c15 varchar(255) null,
	c16 varchar(255) null,
	c17 varchar(255) null,
	c18 varchar(255) null,
	c19 varchar(255) null,
	c20 varchar(255) null
)
engine=InnoDB
;

create table tm_users
(
	id int auto_increment
		primary key,
	user_id int null,
	tm_id int null,
	comments varchar(255) null,
	created_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	updated_at timestamp default '0000-00-00 00:00:00' not null
)
engine=InnoDB
;

create index tm_users_id_fk
	on tm_users (user_id)
;

create index tm_users_tm_id_fk
	on tm_users (tm_id)
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
	fname varchar(255) null,
	sname varchar(255) null,
	phone varchar(255) null,
	em_main varchar(128) null,
	em_sec varchar(128) null,
	em_pant varchar(128) null,
	cat_id int null,
	comments varchar(512) null,
	user varchar(64) null,
	hash varchar(255) null,
	created_at timestamp null,
	updated_at timestamp null,
	constraint users_ucategories_id_fk
		foreign key (cat_id) references ucategories (id)
)
engine=InnoDB
;

create index users_uc_id_fk
	on users (cat_id)
;

alter table ps_teachers
	add constraint ps_teachers_users_id_fk
		foreign key (user_id) references users (id)
;

alter table requests
	add constraint requests_users_id_fk
		foreign key (user_id) references users (id)
;

alter table requests
	add constraint requests_users_id_fk_2
		foreign key (admin) references users (id)
;

alter table tm
	add constraint tm_users_id_fk
		foreign key (supervisor) references users (id)
;

alter table tm_users
	add constraint tm_users_users_id_fk
		foreign key (user_id) references users (id)
;

create table users_requests
(
	id int auto_increment
		primary key,
	from_user int null,
	to_users int null,
	comments varchar(255) null,
	rr_id int null,
	to_comment varchar(255) null,
	confirm tinyint(1) null,
	status int default '0' null,
	created_at timestamp null,
	updated_at timestamp null,
	constraint users_requests_users_id_fk
		foreign key (from_user) references users (id),
	constraint users_requests_users_id_fk_2
		foreign key (to_users) references users (id)
)
engine=InnoDB
;

create index users_r_id_fk
	on users_requests (from_user)
;

create index users_r_id_fk_2
	on users_requests (to_users)
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
	updated_at timestamp null,
	constraint users_roles_users_id_fk
		foreign key (user_id) references users (id),
	constraint users_roles_roles_id_fk
		foreign key (role_id) references roles (id)
)
comment 'N-N' engine=InnoDB
;

create index users_roles_id_fk
	on users_roles (user_id)
;

create index users_roles_id_fk
	on users_roles (role_id)
;