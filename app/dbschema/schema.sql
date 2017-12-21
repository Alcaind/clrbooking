create table config
(
	id int not null auto_increment
		primary key,
	year int null,
	dt timestamp default CURRENT_TIMESTAMP null,
	status int null
)
;

comment on column config.year is 'Έτος ισχύος'
;

create table items
(
	id int not null auto_increment
		primary key,
	descr varchar(255) null,
	comments varchar(215) null,
	code varchar(255) null,
	status int null
)
;

comment on table items is 'Εξοπλισμός'
;

create table kat
(
	id int not null auto_increment
		primary key,
	tm_id int null,
	decr varchar(32) null,
	title varchar(255) null,
	pm int null
)
;

comment on table kat is 'katey8inseis tmimaton'
;

create table periods
(
	id int not null auto_increment
		primary key,
	descr varchar(64) null,
	synt varchar(12) null,
	fromd date null,
	tod date null,
	comments varchar(255) null,
	conf_id int null,
	`order` int null,
	status int null
)
;

comment on table periods is 'Ορισμός περιόδων έτους'
;

create table ps
(
	id int not null auto_increment
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
	conf_id int null
)
;

create table requests
(
	id int not null auto_increment
		primary key,
	req_dt datetime default CURRENT_TIMESTAMP null,
	user_id int null,
	descr longtext null,
	period varchar(5) null,
	ps_id int null,
	teacher varchar(255) null,
	from_book int null,
	class_use varchar(255) null,
	links varchar(512) null,
	fromdt timestamp null,
	todt timestamp null,
	protocol_id varchar(255) null,
	req_stat int null
)
;

comment on column requests.ps_id is 'ma8ima apo ps'
;

comment on column requests.from_book is 'an einai apo akyrosi edo fainetai se poia anaferete'
;

create table roles
(
	id int not null auto_increment
		primary key,
	role varchar(255) null,
	descr varchar(255) null
)
;

create table room_book
(
	id int not null auto_increment
		primary key,
	user_id int null,
	date_index int null,
	fromt time null,
	tot time null,
	type int null,
	dt timestamp null,
	period int null,
	room_id int null
)
;

create index class_book_class_id_fk
	on room_book (room_id)
;

create index class_book_users_id_fk
	on room_book (user_id)
;

comment on column room_book.date_index is 'Ποια μέρα (1-7) είναι η δεσμευση'
;

comment on column room_book.type is '0 - syxnotita
1 - memonomeni'
;

create table room_items
(
	id int null,
	item_id int null,
	comments int null,
	dt timestamp default CURRENT_TIMESTAMP null,
	stat int null,
	`from` timestamp null,
	`to` timestamp null,
	room_id int null
)
;

comment on table room_items is 'τρεχον εξοπλισμός αίθουσας'
;

create table room_use
(
	id int not null auto_increment
		primary key,
	synt varchar(4) null,
	descr varchar(255) null,
	column_4 int null
)
;

comment on table room_use is 'χρήσεις αιθουσων'
;

create table rooms
(
	id int not null auto_increment
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
	dt timestamp default CURRENT_TIMESTAMP null,
	stat_comm varchar(255) null,
	conf_id int null,
	type varchar(64) null,
	use_id int null,
	use_str varchar(40) null
)
;

comment on column rooms.destroyed is 'Χαλασμένα καθίσματα'
;

comment on column rooms.nonexist is 'Χαλασμένα έδρανα (για γραπτές εξετασεις)'
;

comment on column rooms.xoros is 'π.χ. '{(10,15),(1,5),(10,15)}''
;

create table rooms_tranf3
(
	c1 varchar(255) null,
	c2 varchar(255) null,
	c3 varchar(255) null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
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
	c70 varchar(255) null
)
;

create table rooms_transf
(
	c1 varchar(255) not null,
	c2 varchar(255) not null,
	c3 varchar(255) not null,
	c4 varchar(255) not null,
	c5 varchar(255) not null,
	c6 varchar(255) not null,
	c7 varchar(255) not null,
	c8 varchar(255) not null,
	c10 varchar(255) not null,
	c11 varchar(255) not null,
	c12 varchar(255) not null,
	c13 varchar(255) not null,
	column_13 int null,
	column_14 int null,
	column_15 int null,
	column_16 int null,
	column_17 int null,
	column_18 int null,
	column_19 int null,
	column_20 int null,
	column_21 int null,
	column_22 int null,
	column_23 int null,
	column_24 int null,
	column_25 int null,
	column_26 int null,
	column_27 int null,
	column_28 int null,
	column_29 int null,
	column_30 int null,
	column_31 int null,
	column_32 int null,
	column_33 int null,
	column_34 int null,
	column_35 int null,
	column_36 int null,
	column_37 int null,
	column_38 int null,
	column_39 int null,
	column_40 int null,
	column_41 int null,
	column_42 int null,
	column_43 int null,
	column_44 int null,
	column_45 int null,
	column_46 int null,
	column_47 int null,
	column_48 int null,
	column_49 int null,
	column_50 int null,
	column_51 int null,
	column_52 int null,
	column_53 int null,
	column_54 int null,
	column_55 int null,
	column_56 int null,
	column_57 int null,
	column_58 int null,
	column_59 int null,
	column_60 int null,
	column_61 int null,
	column_62 int null,
	column_63 int null,
	column_64 int null,
	column_65 int null,
	column_66 int null,
	column_67 int null,
	column_68 int null,
	column_69 int null,
	column_70 int null
)
;

create table rooms_transf2
(
	c1 varchar(255) null,
	c2 varchar(255) null,
	c3 varchar(255) null,
	c4 varchar(255) null,
	c5 varchar(255) null,
	c6 varchar(255) null,
	c7 varchar(255) null,
	c8 varchar(255) null,
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
	c70 varchar(255) null
)
;

create table tm
(
	id int not null auto_increment
		primary key,
	tm_code varchar(32) null,
	descr varchar(12) null,
	title varchar(255) null,
	sxoli varchar(64) null
)
;

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
;

comment on table transf_ps is 'tmp'
;

create table users
(
	id int not null auto_increment
		primary key,
	tm_id int null,
	fname varchar(255) null,
	sname varchar(255) null,
	phone varchar(255) null,
	em_main varchar(128) null,
	em_sec varchar(128) null,
	em_pant varchar(128) null,
	cat_id int null,
	comments varchar(512) null,
	user varchar(64) null,
	hash varchar(255) null
)
;

create table users_roles
(
	user_id int null,
	role_id int null,
	comment varchar(255) null,
	exp_dt timestamp null,
	dt timestamp default CURRENT_TIMESTAMP null,
	status int null,
	id int not null auto_increment
		primary key
)
;

create index users_roles_roles_id_fk
	on users_roles (role_id)
;

create index users_roles_users_id_fk
	on users_roles (user_id)
;

