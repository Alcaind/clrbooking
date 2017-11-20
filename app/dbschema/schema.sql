CREATE TABLE class
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  address VARCHAR(512),
  building VARCHAR(255),
  floor INT(11),
  status INT(11) DEFAULT '0' NOT NULL,
  active INT(11),
  destroyed INT(11),
  nonexist INT(11),
  capasity INT(11),
  exams_capasity INT(11),
  width INT(11),
  height INT(11),
  capasity_categ INT(11),
  tm_owner INT(11)
);
CREATE TABLE class_book
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT(11),
  class_id INT(11),
  date INT(11),
  from_t TIME,
  to_t TIME,
  type INT(11),
  dt TIMESTAMP
);
CREATE TABLE class_items
(
  class_id INT(11),
  ieam_id INT(11),
  comments INT(11),
  dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id INT(11),
  stat INT(11),
  from_dt TIMESTAMP,
  to_dt TIMESTAMP
);
CREATE TABLE configs
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  year INT(11),
  dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status INT(11)
);
CREATE TABLE items
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  descr VARCHAR(255),
  comments VARCHAR(215)
);
CREATE TABLE kat
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  tm_id INT(11),
  decr VARCHAR(32),
  title VARCHAR(255),
  pm INT(11)
);
CREATE TABLE requests
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  req_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INT(11),
  descr LONGTEXT,
  period VARCHAR(5),
  ps_id INT(11),
  teacher VARCHAR(255),
  from_book INT(11),
  rea_stat INT(11),
  class_use VARCHAR(255),
  links VARCHAR(512),
  fromdt TIMESTAMP,
  todt TIMESTAMP
);
CREATE TABLE roles
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  role VARCHAR(255),
  descr VARCHAR(255)
);
CREATE TABLE tm
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  tm_code VARCHAR(32),
  descr VARCHAR(12),
  title VARCHAR(255),
  sxoli VARCHAR(64)
);
CREATE TABLE users
(
  id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  tm_id INT(11),
  fname VARCHAR(255),
  sname VARCHAR(255),
  phone VARCHAR(255),
  em_main VARCHAR(128),
  em_sec VARCHAR(128),
  em_pant VARCHAR(128),
  cat_id INT(11),
  comments VARCHAR(512)
);