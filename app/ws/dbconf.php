<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 02/08/2017
 * Time: 1:04 μμ
 */
/*
$dbhost    = 'localhost';
$dbname    = 'betanalysiSite';
$dbuser    = 'bet_user';
$dbpass   = 'b3t@N@Lys15_U53R';
*/
// connection to soccerbox_srvs

$dbhost = 'localhost';
$dbname = 'classrooms';
$dbuser = 'root';
$dbpass = '';

$dblink = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
