<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/testapi', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");

    return $response->getBody()->write("{'msg':'all Done !!'}");
});

$app->post('/dp/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    $user = \App\Models\Users::find($id);

    header("Content-Type: application/json");
    return $response->getBody()->write($user->toJson());

});

$app->post('/new_users', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    $bd = $request->getParsedBody();

    $user = \App\Models\Users::find($id);

    header("Content-Type: application/json");
    return $response->getBody()->write($user->toJson());

});

$app->put('/dp', function (Request $request, Response $response) {
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

$app->post('/user_roles/{id}/', function ($request, $response, $args) {
    $id = $args['id'];
    $user = App\User::find($id);

    $roles = $user->roles();

    return $response->getBody()->write($roles->toJson());
});