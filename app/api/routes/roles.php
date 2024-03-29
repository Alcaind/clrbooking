<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/roles', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roles = \App\Models\Roles::all();
    return $response->getBody()->write($roles->toJson());
});

$app->get('/roles/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roles = \App\Models\Roles::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($roles->toJson());
});

$app->post('/roles', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $roles = new \App\Models\Roles();
        $roles->role = $data['role'];
        $roles->descr = $data['descr'];
        $roles->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($roles->toJson());
});

$app->delete('/roles/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $role = \App\Models\Roles::find($id);
        $role->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($role->toJson());
});

$app->put('/roles/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    try {
        $role = \App\Models\Roles::find($id);
        $role->role = $data['role'] ?: $role->role;
        $role->descr = $data['descr'] ?: $role->descr;
        $role->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($role->toJson());
});

$app->get('/roles/{id}/users', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $role = \App\Models\Roles::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($role->users()->get()->toJson());
});

$app->post('/roles/{id}/users/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $role = \App\Models\Roles::find($id);
    $role->users()->attach($rid, $data);
    return $response->getBody()->write($role->users()->get()->toJson());
});

$app->put('/roles/{id}/users/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $role = \App\Models\Roles::find($id);
    $role->users()->updateExistingPivot($rid, $data);
    return $response->getBody()->write($role->users()->get()->toJson());
});

$app->delete('/roles/{id}/users/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $role = \App\Models\Roles::find($id);
    $role->users()->detach($rid);
    return $response->getBody()->write($role->users()->get()->toJson());
});
