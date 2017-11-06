<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 02/08/2017
 * Time: 1:07 μμ
 */

include 'dbconf.php';

$db = $dblink;

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET': {
        get($_REQUEST['data']);
        break;
    }
    case 'PUT': {
        insert($_REQUEST['data']);
        break;
    }
    case 'DELETE': {
        delete($_REQUEST['data']);
        break;
    }
    case 'PATCH': {
        update($_REQUEST['data']);
        break;
    }

    default: {
        get($_REQUEST['data']);
    }
}

mysqli_close($db);

function get($data)
{
    global $db;

    $data = json_decode($data);
    $sql = "select * from appoptions where uid = '$data->user'";
    $result = mysqli_query($db, $sql);
    $myArray = array();
    while ($row = $result->fetch_array(MYSQL_ASSOC)) {
        $myArray[] = $row;
    }
    echo json_encode($myArray);
}

function insert($app)
{
    global $db;
    $app = json_decode($app);
    //print_r($app);
    $sql = "INSERT INTO `appoptions` (`id`, `descr`, `options`, `uid`, `appid`) VALUES (NULL, '$app->descr', '".json_encode($app->options)."', '$app->user', '$app->appId')";
    $result = mysqli_query($db, $sql);
    get(json_encode($app));
}

function update($data)
{
    global $db;
    $data = json_decode($data);
    //  [{col,val},{col,val}]
    $set = "update appoptions set ";
    $columns = "";
    for ($i = 0; $i < sizeof($data); $i++) {
        $columns .= $data[i]->col . "='" . $data[i]->val . "', ";
    }
    $columns = substr($columns, 0, sizeof($columns) - 1);

    $sql = $set . ' ' . $columns;
    $result = mysqli_query($db, $sql);
}

function delete($id)
{
    global $db;

    $sql = "delete from appoptions where id = $id";
    $result = mysqli_query($db, $sql);
}

