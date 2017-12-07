<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 27/11/2017
 * Time: 2:50 μμ
 */

include "db.php";

$pdo = new db();
$pdo = $pdo->connect();

$user = "vmanol";
$hash = password_hash("killerbee", PASSWORD_DEFAULT);

$status = $pdo->exec(
    "INSERT INTO `users` (`id`, `tm_id`, `fname`, `sname`, `phone`, `em_main`, `em_sec`, `em_pant`, `cat_id`, `comments`, `user_n`, `pswd`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '".$user."', '".$hash."')"
);