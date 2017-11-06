<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 25/08/2017
 * Time: 5:53 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/devices', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");
    $sql = "select * from udevs";
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

$app->get('/devices/{user}', function (Request $request, Response $response) {
    /*if (in_array("get", $this->jwt->scope)) {
        return;
    }*/
    //$decoded = $request->getAttribute("dmt");

    header("Content-Type: application/json");
    $user = $request->getAttribute('user');

    $sql = "select * from udevs where uid = '$user'";
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

$app->post('/devices', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    //INSERT INTO `udevs` (`id`, `name`, `uid`, `devid`, `default_option`) VALUES (NULL, 'LG 512', 'agent', '2312-321-093', '5');

    $descr = $data['name'];
    $user = $data['user'];
    $devid = $data['devid'];
    $defaultOption = $data['default_option'];

    $sql = "INSERT INTO `udevs` (`id`, `name`, `uid`, `devid`, `default_option`) VALUES (NULL, :descr, :usr, :devid, :do)";
    //$sql = "INSERT INTO `appoptions` (`id`, `descr`, `options`, `uid`, `appid`) VALUES (NULL, :descr, :options, :usr, :appid)";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->prepare($sql);
        $stm->bindParam(':descr', $descr);
        $stm->bindParam(':devid', $devid);
        $stm->bindParam(':usr', $user);
        $stm->bindParam(':do', $defaultOption);
        $stm->execute();
        echo '{"notice":{"text":"Device Added"},"id":"' . $db->lastInsertId() . '"}';
    } catch (PDOException $e) {
        echo '{"error": {"text":"' . $e->getMessage() . '"}}';
    }
});

$app->post('/trackDev', function (Request $request, Response $response) {
    header("Content-Type: application/json");

    $data = $request->getParsedBody();
    $dataTrack = [
        "body" => $request->getParsedBody(),
        "server" => $request->getServerParams(),
        "query" => $request->getQueryParams(),
        "cookie" => $request->getCookieParams()
    ];

    $descr = $data['name'];
    $user = $data['user'];
    $devid = $data['devid'];
    $defaultOption = $data['default_option'];
    $tmppParam = "lola";

    $sql = "INSERT INTO `devtrack` (`id`, `dev`, `ip`, `options`) VALUES (NULL, :dev, :ip, :opt)";
    //$sql = "INSERT INTO `udevs` (`id`, `name`, `uid`, `devid`, `default_option`) VALUES (NULL, :descr, :usr, :devid, :do)";
    //$sql = "INSERT INTO `appoptions` (`id`, `descr`, `options`, `uid`, `appid`) VALUES (NULL, :descr, :options, :usr, :appid)";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->prepare($sql);
        $stm->bindParam(':dev', $tmppParam);
        $stm->bindParam(':ip', $tmppParam);
        $stm->bindParam(':opt', $tmppParam);
        $stm->execute();
        echo json_encode($dataTrack);
    } catch (PDOException $e) {
        echo '{"error": {"text":"' . $e->getMessage() . '"}}';
    }
});

$app->put('/devices/{id}', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $id = $request->getAttribute('id');

    $descr = $data['name'];
    $user = $data['user'];
    $devid = $data['devid'];
    $defaultOption = $data['default_option'];
    //$id = $data['id'];

    $sql = "update `udevs` set `name` = :descr, `uid` = :usr, `devid` = :devid,  `default_option` = :do where id = :id";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->prepare($sql);
        $stm->bindParam(':descr', $descr);
        $stm->bindParam(':do', $defaultOption);
        $stm->bindParam(':usr', $user);
        $stm->bindParam(':devid', $devid);
        $stm->bindParam(':id', $id);

        $stm->execute();
        echo '{"notice":{"text":"Option Updated"}}';
    } catch (PDOException $e) {
        echo '{"error": {"text":"' . $e->getMessage() . '"}}';
    }
});

$app->delete('/devices/{id}', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $id = $request->getAttribute('id');

    $sql = "delete from udevs where id = $id";
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

$app->get('/devices/{id}/{col}/{data}', function (Request $request, Response $response) {
    /*if (in_array("get", $this->jwt->scope)) {
        return;
    }*/
    //$decoded = $request->getAttribute("dmt");

    header("Content-Type: application/json");
    $id = $request->getAttribute('id');
    $col = $request->getAttribute('col');
    $data = $request->getAttribute('data');


    $sql = "update udevs set " . $col . " = :d  where id = :id";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->prepare($sql);
        $stm->bindParam(':d', $data);
        $stm->bindParam(':id', $id);
        $db = null;
        echo json_encode($options);
    } catch (PDOException $e) {
        echo '{"error": {"text":' . $e->getMessage() . '}}';
    }
});

