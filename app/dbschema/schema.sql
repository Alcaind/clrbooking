create table class
(
	id int not null auto_increment
		primary key,
	name varchar(255) null,
	address varchar(512) null,
	building varchar(255) null,
	floor int null,
	status int default '0' not null,
	active int null,
	destroyed int null,
	nonexist int null,
	capasity int null,
	exams_capasity int null,
	width int null,
	height int null,
	capasity_categ int null,
	tm_owner int null
)
;

create table class_book
(
	id int not null auto_increment
		primary key,
	user_id int null,
	class_id int null,
	date int null,
	fromt time null,
	tot time null,
	type int null,
	dt timestamp null
)
;

create index class_book_class_id_fk
	on class_book (class_id)
;

create index class_book_users_id_fk
	on class_book (user_id)
;

comment on column class_book.date is 'Ποια μέρα (1-7) είναι η δεσμευση'
;

comment on column class_book.type is '0 - syxnotita
1 - memonomeni'
;

create table class_items
(
	class_id int null,
	ieam_id int null,
	comments int null,
	dt timestamp default CURRENT_TIMESTAMP null,
	id int null,
	stat int null,
	`from` timestamp null,
	`to` timestamp null
)
;

comment on table class_items is 'τρεχον εξοπλισμός αίθουσας'
;

create table configs
(
	id int not null auto_increment
		primary key,
	year int null,
	dt timestamp default CURRENT_TIMESTAMP null,
	status int null
)
;

create table items
(
	id int not null auto_increment
		primary key,
	descr varchar(255) null,
	comments varchar(215) null
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
	rea_stat int null,
	class_use varchar(255) null,
	links varchar(512) null,
	fromdt timestamp null,
	todt timestamp null
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
	comments varchar(512) null
)
;

