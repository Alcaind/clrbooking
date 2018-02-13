<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 16:07
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/usersroles', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $usersroles = \App\Models\UsersRoles::all();

    return $response->getBody()->write($usersroles->toJson());
});

$app->get('/usersroles/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $usersroles = \App\Models\UsersRoles::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($usersroles->toJson());
});

$app->post('/usersroles', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $usersroles = new \App\Models\UsersRoles();
        $usersroles->user_id = $data['user_id'];
        $usersroles->role_id = $data['role_id'];
        $usersroles->comment = $data['comment'];
        $usersroles->exp_dt = $data['exp_dt'];
        $usersroles->status = $data['status'];
        $usersroles->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($usersroles->toJson());
});

$app->delete('/usersroles/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $usersroles = \App\Models\UsersRoles::find($id);
        $usersroles->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($usersroles->toJson());
});

$app->put('/usersroles/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $usersroles = \App\Models\UsersRoles::find($id);
        $usersroles->user_id = $data['user_id'] ?: $usersroles->user_id;
        $usersroles->role_id = $data['role_id'] ?: $usersroles->role_id;
        $usersroles->comment = $data['comment'] ?: $usersroles->comment;
        $usersroles->exp_dt = $data['exp_dt'] ?: $usersroles->exp_dt;
        $usersroles->status = $data['status'] ?: $usersroles->status;
        $usersroles->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($usersroles->toJson());
});