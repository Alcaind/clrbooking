<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/users', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    /*header("Content-Type: application/json");
    $sql = "select * from users";
    try {

        $db = new db();
        $db = $db->connect();
        $stm = $db->query($sql);
        $stm = $this->pdo->query($sql);
        $options = $stm->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($options);
    } catch (PDOException $e) {
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($e, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        //echo '{"error": {"text":' . $e->getMessage() . '}}';
    }*/

    return $response->getBody()->write(Users::all()->toJson());
});

$app->get('/users/{user}', function (Request $request, Response $response) {
    /*if (!in_array("get", $this->jwt->scope)) {
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->jwt, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }*/
    //$decoded = $request->getAttribute("dmt");

    header("Content-Type: application/json");
    $user = $request->getAttribute('user');
    $sql = "select * from users where user = '".$user."'";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->query($sql);
        $options = $stm->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($options);
    } catch (PDOException $e) {
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($e, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        //echo '{"error": {"text":' . $e->getMessage() . '}}';
    }
});

$app->post('/users', function (Request $request, Response $response) {
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
