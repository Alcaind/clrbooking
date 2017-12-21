<?php
//print_r($_SERVER);
//echo "\n\n".$_SERVER['HTTP_CF_CONNECTING_IP'];
//echo "\n\n".$_SERVER['HTTP_COOKIE'];
//echo "\n\n".$_SERVER['HTTP_USER_AGENT'];
//return;

include 'dbconf.php';
$db = $dblink;

if (!$_REQUEST["pswd"] || !$_REQUEST["usr"]){
    api('{"success":false with no credentials}');
    return;
}

$usr = $_REQUEST['usr'];
$pswd = $_REQUEST['pswd'];

$sql = "select * from users where user_n = $usr and pswd = $pswd";
$result = mysqli_query($db, $sql);
$myArray = array();
while ($row = $result->fetch_object(MYSQLI_ASSOC)) {
    $myArray[] = $row;
}

if ($row) {

}

echo json_encode($myArray);

$params='ip='.$_SERVER['REMOTE_ADDR'].'&agent='.$_SERVER['HTTP_USER_AGENT'].'&cookie=0';
$params.='&pswd='.$_REQUEST["pswd"].'&usr='.$_REQUEST["usr"].'&app='.$_REQUEST["app"];

api(json_decode($result));

function api($data) {
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');
    $data=array('success'=>$data, 'tst'=>"lola");
    echo json_encode($data);
}