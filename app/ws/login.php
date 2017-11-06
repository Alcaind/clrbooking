<?php

$memcache = new Memcache;
$memcache->connect('127.0.0.1', 11211) or die ("Could not connect to memcache server");
$data = $memcache->get($_SERVER['REMOTE_ADDR']);

//print_r($_SERVER);
//echo "\n\n".$_SERVER['HTTP_CF_CONNECTING_IP'];
//echo "\n\n".$_SERVER['HTTP_COOKIE'];
//echo "\n\n".$_SERVER['HTTP_USER_AGENT'];
//return;

if ($data) {
    api($data);
    return;
}

if (!$_REQUEST["pswd"] || !$_REQUEST["usr"]){
    api('{"success":false with no credentials}');
    return;
}

$ch = curl_init();
$params='ip='.$_SERVER['REMOTE_ADDR'].'&agent='.$_SERVER['HTTP_USER_AGENT'].'&cookie=0';
$params.='&pswd='.$_REQUEST["pswd"].'&usr='.$_REQUEST["usr"].'&app='.$_REQUEST["app"];

curl_setopt($ch,CURLOPT_URL, 'http://www.livepraktoreio.gr/webServices/web-login-test.php');
curl_setopt($ch,CURLOPT_POST, true);
curl_setopt($ch,CURLOPT_POSTFIELDS, $params);
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);
//echo "from CURL.....";
if (strpos($result,'false')>-1) {
    api('{"success":false, "from curl":"-1"}');
    return;
}

//$data = $memcache->get($_SERVER['REMOTE_ADDR']);
api(json_decode($result));
//api("from CURL.....");

function api($data) {

    /*$approle = null;
    switch($_REQUEST["app"]){
        case 'basket':
            $approle ='lp4000_basket';
            break;
        case 'kino':
            $approle ='lp4000_kino';
            break;
        case 'livescore':
            $approle ='lp4000_livescore';
            break;
        case 'synolikokouponi':
            $approle ='lp4000_synoliko';
            break;
        case 'nikitriastili':
            $approle ='lp4000_nikitria';
            break;
        case 'liveapodoseis':
            $approle ='lp4000_apodoseis';
            break;
        case 'numGames':
            $approle ='lp4000_paixnidia';
            break;
        case 'admin':
            $approle ='agent';
            break;
        default:
            $approle = null;
    }


    if (!$approle || strpos(json_encode($data), $approle) === false){
        $data=array('success'=>'{"success":false}');
        echo json_encode($data);
        return;
    }*/

    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');
    $data=array('success'=>$data, 'tst'=>"lola");
    echo json_encode($data);
}
