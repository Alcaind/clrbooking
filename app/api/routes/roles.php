<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/roles', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");
    $roles = \App\Models\Roles::all();
    return $response->getBody()->write($roles->toJson());
});

$app->get('/role/{id}', function (Request $request, Response $response, $args) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roles = \App\Models\Roles::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
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
    try {
        $role = new \App\Models\Roles();
        $role->role = $data['role'];
        $role->descr = $data['descr'];
        $role->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($role->toJson());
});

$app->delete('/role/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $role = \App\Models\Roles::find($id);
        $role->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }

    return $response->withStatus(200)->getBody()->write($role->toJson());
});

$app->put('/role/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    try {
        $role = \App\Models\Roles::find($id);
        $role->role = $data['role'] ?: $role->role;
        $role->descr = $data['descr'] ?: $role->descr;
        $role->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($role->toJson());
});

$app->get('/usersRole/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $role = \App\Models\Roles::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($role->users()->get()->toJson());
});

