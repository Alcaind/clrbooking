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
        get();
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
        get();
    }
}

mysqli_close($db);

function get()
{
    global $db;

    $sql = "select * from utvs";
    $result = mysqli_query($db, $sql);
    $myArray = array();
    while ($row = $result->fetch_array(MYSQL_ASSOC)) {
        $myArray[] = $row;
    }
    echo json_encode($myArray);

}

function insert($dev)
{
    global $db;
    $app = json_decode($dev);
    $sql = "INSERT INTO `utvs` (`id`, `name`, `uid`, `devid`) VALUES (NULL, '$dev->descr', '$dev->opptions', '$dev->user', '$dev->appid')";
    $result = mysqli_query($db, $sql);
    get();
}

function update($data)
{
    global $db;
    $data = json_decode($data);
    //  [{col,val},{col,val}]
    $set = "update utvs set ";
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

    $sql = "delete from utvs where id = $id";
    $result = mysqli_query($db, $sql);
}

