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

    $sql = "select id,app,parent,weight,descr from apps ORDER BY weight";
    $result = mysqli_query($db, $sql);
    $myArray = array();

    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

        if ($row['parent'] === $myArray[sizeof($myArray)-1]['id']){
            $myArray[sizeof($myArray)-1]['subapps'][] = $row;
        }else{
            $myArray[] = $row;
        }
        //print_r($row);
    }
    echo json_encode($myArray);

}

function insert($app)
{
    global $db;

    $sql = "INSERT INTO `apps` (`id`, `app`) VALUES (NULL, '$app')";
    $result = mysqli_query($db, $sql);
    get();
}

function update($data)
{
    global $db;
    $data = json_decode($data);
    //  [{col,val},{col,val}]
    $set = "update apps set ";
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

    $sql = "delete from apps where id = '$id'";
    $result = mysqli_query($db, $sql);
}

