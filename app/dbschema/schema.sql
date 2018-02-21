-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2018 at 10:28 AM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clrbooking`
--

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `id`         INT(11)   NOT NULL,
  `year`       INT(11)        DEFAULT NULL,
  `status`     INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id`         INT(11)   NOT NULL,
  `descr`      VARCHAR(255)   DEFAULT NULL,
  `comments`   VARCHAR(215)   DEFAULT NULL,
  `code`       VARCHAR(255)   DEFAULT NULL,
  `status`     INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kat`
--

CREATE TABLE `kat` (
  `id`         INT(11)   NOT NULL,
  `tm_id`      INT(11)        DEFAULT NULL,
  `decr`       VARCHAR(32)    DEFAULT NULL,
  `title`      VARCHAR(255)   DEFAULT NULL,
  `pm`         INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `periods`
--

CREATE TABLE `periods` (
  `id`         INT(11)   NOT NULL,
  `descr`      VARCHAR(64)    DEFAULT NULL,
  `synt`       VARCHAR(12)    DEFAULT NULL,
  `fromd`      DATE           DEFAULT NULL,
  `tod`        DATE           DEFAULT NULL,
  `comments`   VARCHAR(255)   DEFAULT NULL,
  `conf_id`    INT(11)        DEFAULT NULL,
  `porder`     INT(11)        DEFAULT NULL,
  `status`     INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ps`
--

CREATE TABLE `ps` (
  `id`         INT(11)   NOT NULL,
  `tm_code`    INT(11)        DEFAULT NULL,
  `tm_per`     VARCHAR(255)   DEFAULT NULL,
  `pm`         CHAR(3)        DEFAULT 'ΠΡΟ',
  `tma_code`   INT(11)        DEFAULT NULL,
  `tma_per`    VARCHAR(255)   DEFAULT NULL,
  `ps_ex`      INT(11)        DEFAULT NULL,
  `ps_dm`      INT(11)        DEFAULT NULL,
  `ps_km`      VARCHAR(4)     DEFAULT NULL,
  `teacher`    VARCHAR(255)   DEFAULT NULL,
  `conf_id`    INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id`          INT(11)   NOT NULL,
  `req_dt`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id`     INT(11)            DEFAULT NULL,
  `descr`       LONGTEXT,
  `period`      VARCHAR(5)         DEFAULT NULL,
  `ps_id`       INT(11)            DEFAULT NULL,
  `teacher`     VARCHAR(255)       DEFAULT NULL,
  `class_use`   VARCHAR(255)       DEFAULT NULL,
  `links`       VARCHAR(512)       DEFAULT NULL,
  `fromdt`      TIME               DEFAULT NULL,
  `todt`        TIME               DEFAULT NULL,
  `protocol_id` VARCHAR(255)       DEFAULT NULL,
  `req_status`  INT(11)            DEFAULT NULL,
  `fromd`       DATE               DEFAULT NULL,
  `tod`         DATE               DEFAULT NULL,
  `date_index`  INT(11)            DEFAULT NULL,
  `created_at`  TIMESTAMP NULL     DEFAULT NULL,
  `updated_at`  TIMESTAMP NULL     DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id`         INT(11)   NOT NULL,
  `role`       VARCHAR(255)   DEFAULT NULL,
  `descr`      VARCHAR(255)   DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id`             INT(11)     NOT NULL,
  `name`           VARCHAR(255)         DEFAULT NULL,
  `address`        VARCHAR(512)         DEFAULT NULL,
  `building`       VARCHAR(255)         DEFAULT NULL,
  `floor`          VARCHAR(128)         DEFAULT NULL,
  `status`         VARCHAR(64) NOT NULL DEFAULT '0',
  `active`         INT(11)              DEFAULT NULL,
  `destroyed`      VARCHAR(4)           DEFAULT NULL,
  `nonexist`       VARCHAR(4)           DEFAULT NULL,
  `capasity`       INT(11)              DEFAULT NULL,
  `width`          INT(11)              DEFAULT NULL,
  `height`         INT(11)              DEFAULT NULL,
  `xoros`          VARCHAR(512)         DEFAULT '{(10,15),(10,15)}',
  `exams_capasity` INT(11)              DEFAULT NULL,
  `capasity_categ` VARCHAR(10)          DEFAULT NULL,
  `tm_owner`       VARCHAR(255)         DEFAULT NULL,
  `stat_comm`      VARCHAR(255)         DEFAULT NULL,
  `conf_id`        INT(11)              DEFAULT NULL,
  `category`       INT(64)              DEFAULT NULL,
  `use_id`         INT(11)              DEFAULT NULL,
  `created_at`     TIMESTAMP   NULL     DEFAULT NULL,
  `updated_at`     TIMESTAMP   NULL     DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rooms_room_use`
--

CREATE TABLE `rooms_room_use` (
  `id`          INT(11)   NOT NULL,
  `rooms_id`    INT(11)   NOT NULL,
  `room_use_id` INT(11)   NOT NULL,
  `comment`     VARCHAR(255)       DEFAULT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COMMENT ='N-N για χρήση αιθουσών';

-- --------------------------------------------------------

--
-- Table structure for table `rooms_tms`
--

CREATE TABLE `rooms_tms` (
  `id`         INT(11)   NOT NULL,
  `tm_id`      INT(11)   NOT NULL,
  `room_id`    INT(11)   NOT NULL,
  `comments`   VARCHAR(225)       DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COMMENT ='N-N table rooms tmhmata';

-- --------------------------------------------------------

--
-- Table structure for table `room_book`
--

CREATE TABLE `room_book` (
  `id`         INT(11)   NOT NULL,
  `user_id`    INT(11)        DEFAULT NULL,
  `date_index` INT(11)        DEFAULT NULL,
  `fromt`      TIME           DEFAULT NULL,
  `tot`        TIME           DEFAULT NULL,
  `type`       INT(11)        DEFAULT NULL,
  `period`     INT(11)        DEFAULT NULL,
  `room_id`    INT(11)        DEFAULT NULL,
  `fromd`      DATE           DEFAULT NULL,
  `tod`        DATE           DEFAULT NULL,
  `request_id` INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `room_category`
--

CREATE TABLE `room_category` (
  `id`         INT(11)      NOT NULL,
  `synt`       VARCHAR(255) NOT NULL,
  `descr`      VARCHAR(255)          DEFAULT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT '0000-00-00 00:00:00'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COMMENT ='Κατηγορίες αιθουσών';

-- --------------------------------------------------------

--
-- Table structure for table `room_items`
--

CREATE TABLE `room_items` (
  `id`         INT(11)   NOT NULL,
  `item_id`    INT(11)        DEFAULT NULL,
  `comments`   VARCHAR(255)   DEFAULT NULL,
  `stat`       INT(11)        DEFAULT NULL,
  `from`       TIMESTAMP NULL DEFAULT NULL,
  `to`         TIMESTAMP NULL DEFAULT NULL,
  `room_id`    INT(11)        DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `room_use`
--

CREATE TABLE `room_use` (
  `id`         INT(11)   NOT NULL,
  `synt`       VARCHAR(4)     DEFAULT NULL,
  `descr`      VARCHAR(255)   DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm`
--

CREATE TABLE `tm` (
  `id`         INT(11)   NOT NULL,
  `tm_code`    VARCHAR(32)    DEFAULT NULL,
  `descr`      VARCHAR(12)    DEFAULT NULL,
  `title`      VARCHAR(255)   DEFAULT NULL,
  `sxoli`      VARCHAR(64)    DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ucategories`
--

CREATE TABLE `ucategories` (
  `id`         INT(11)   NOT NULL,
  `descr`      VARCHAR(255)   DEFAULT NULL,
  `comment`    VARCHAR(255)   DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COMMENT ='user categories';

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id`         INT(11)   NOT NULL,
  `tm_id`      INT(11)        DEFAULT NULL,
  `fname`      VARCHAR(255)   DEFAULT NULL,
  `sname`      VARCHAR(255)   DEFAULT NULL,
  `phone`      INT(255)       DEFAULT NULL,
  `em_main`    VARCHAR(128)   DEFAULT NULL,
  `em_sec`     VARCHAR(128)   DEFAULT NULL,
  `em_pant`    VARCHAR(128)   DEFAULT NULL,
  `cat_id`     INT(11)        DEFAULT NULL,
  `comments`   VARCHAR(512)   DEFAULT NULL,
  `user`       VARCHAR(64)    DEFAULT NULL,
  `hash`       VARCHAR(255)   DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users_roles`
--

CREATE TABLE `users_roles` (
  `user_id`    INT(11)        DEFAULT NULL,
  `role_id`    INT(11)        DEFAULT NULL,
  `comment`    VARCHAR(255)   DEFAULT NULL,
  `exp_dt`     TIMESTAMP NULL DEFAULT NULL,
  `status`     INT(11)        DEFAULT NULL,
  `id`         INT(11)   NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kat`
--
ALTER TABLE `kat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `periods`
--
ALTER TABLE `periods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ps`
--
ALTER TABLE `ps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms_room_use`
--
ALTER TABLE `rooms_room_use`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_use__index` (`rooms_id`, `room_use_id`),
  ADD KEY `rooms_room_use_room_use_id_fk` (`room_use_id`);

--
-- Indexes for table `rooms_tms`
--
ALTER TABLE `rooms_tms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_book`
--
ALTER TABLE `room_book`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_category`
--
ALTER TABLE `room_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_items`
--
ALTER TABLE `room_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_items_items_id_fk` (`item_id`),
  ADD KEY `room_rooms___fk` (`room_id`);

--
-- Indexes for table `room_use`
--
ALTER TABLE `room_use`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tm`
--
ALTER TABLE `tm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ucategories`
--
ALTER TABLE `ucategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_roles`
--
ALTER TABLE `users_roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT for table `kat`
--
ALTER TABLE `kat`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 6;

--
-- AUTO_INCREMENT for table `periods`
--
ALTER TABLE `periods`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 6;

--
-- AUTO_INCREMENT for table `ps`
--
ALTER TABLE `ps`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 917;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 12;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 86;

--
-- AUTO_INCREMENT for table `rooms_room_use`
--
ALTER TABLE `rooms_room_use`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 39;

--
-- AUTO_INCREMENT for table `rooms_tms`
--
ALTER TABLE `rooms_tms`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT for table `room_book`
--
ALTER TABLE `room_book`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_category`
--
ALTER TABLE `room_category`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT for table `room_items`
--
ALTER TABLE `room_items`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT for table `room_use`
--
ALTER TABLE `room_use`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT for table `tm`
--
ALTER TABLE `tm`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 10;

--
-- AUTO_INCREMENT for table `ucategories`
--
ALTER TABLE `ucategories`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT for table `users_roles`
--
ALTER TABLE `users_roles`
  MODIFY `id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rooms_room_use`
--
ALTER TABLE `rooms_room_use`
  ADD CONSTRAINT `rooms_room_use_room_use_id_fk` FOREIGN KEY (`room_use_id`) REFERENCES `room_use` (`id`),
  ADD CONSTRAINT `rooms_room_use_rooms_id_fk` FOREIGN KEY (`rooms_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `room_items`
--
ALTER TABLE `room_items`
  ADD CONSTRAINT `room_items_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `room_rooms___fk` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
