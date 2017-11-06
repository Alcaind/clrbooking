<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 25/08/2017
 * Time: 5:53 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/options', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");
    $sql = "select * from appoptions";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->query($sql);
        $options = $stm->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($options);
    } catch (PDOException $e) {
        echo '{"error": {"text":' . $e->getMessage() . '}}';
    }
    /*} else {
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->jwt, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }*/
});

$app->get('/options/{user}', function (Request $request, Response $response) {
    /*if (!in_array("get", $this->jwt->scope)) {
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->jwt, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }*/
    //$decoded = $request->getAttribute("dmt");

    header("Content-Type: application/json");
    $user = $request->getAttribute('user');

    $sql = "select * from appoptions where uid = '$user'";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->query($sql);
        $options = $stm->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($options);
    } catch (PDOException $e) {
        echo '{"error": {"text":' . $e->getMessage() . '}}';
    }
});

$app->post('/options', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    $descr = $data['descr'];
    $options = $data['options'];
    $user = $data['user'];
    $appid = $data['appid'];

    $sql = "INSERT INTO `appoptions` (`id`, `descr`, `options`, `uid`, `appid`) VALUES (NULL, :descr, :options, :usr, :appid)";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->prepare($sql);
        $stm->bindParam(':descr', $descr);
        $stm->bindParam(':options', $options);
        $stm->bindParam(':usr', $user);
        $stm->bindParam(':appid', $appid);
        $stm->execute();
        echo '{"notice":{"text":"Option Added"},"id":"' . $db->lastInsertId() . '"}';
    } catch (PDOException $e) {
        echo '{"error": {"text":"' . $e->getMessage() . '"}}';
    }
});

$app->put('/options/{id}', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $id = $request->getAttribute('id');

    $descr = $data['descr'];
    $options = $data['options'];
    $user = $data['user'];
    $appid = $data['appid'];
    //$id = $data['id'];

    $sql = "update `appoptions` set `descr` = :descr, `options` = :options, `uid` = :usr, `appid` = :appid where `id` = :id";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->prepare($sql);
        $stm->bindParam(':descr', $descr);
        $stm->bindParam(':options', $options);
        $stm->bindParam(':usr', $user);
        $stm->bindParam(':appid', $appid);
        $stm->bindParam(':id', $id);

        $stm->execute();
        echo '{"notice":{"text":"Option Updated"}}';
    } catch (PDOException $e) {
        echo '{"error": {"text":"' . $e->getMessage() . '"}}';
    }
});

$app->delete('/options/{id}', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $id = $request->getAttribute('id');

    $sql = "delete from appoptions where id = $id";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->query($sql);
        $stm->execute();
        $db = null;
        echo '{"notice": {"text":"Option Deleted"}}';
    } catch (PDOException $e) {
        echo '{"error": {"text":' . $e->getMessage() . '}}';
    }
});

