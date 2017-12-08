<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/role', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");
    $tbl = $this->get('db')->table('roles');
    $roles = \App\Models\Roles::all();
    return $response->getBody()->write($roles->toJson());
});

$app->post('/role', function (Request $request, Response $response) {
    /*if (!in_array("get", $this->jwt->scope)) {
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($this->jwt, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }*/
    //$decoded = $request->getAttribute("dmt");

    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $role = new \App\Models\Roles();

    $role->role = $data['role'];
    $role->descr = $data['descr'];

    $role->save();

    return $response->withStatus(201)->getBody()->write($role->toJson());
});

$app->delete('/role/{id}/', function($request, $response, $args) {
    $id = $args['id'];
    $role = \App\Models\Roles::find($id);
    $role->delete();

    return $response->withStatus(200);
});

$app->put('/role/{id}/', function($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    $role = \App\Models\Roles::find($id);
    $role->role = $data['role'] ?: $role->role;
    $role->descr = $data['descr'] ?: $role->descr;

    $dev->save();

    return $response->getBody()->write($dev->toJson());
});