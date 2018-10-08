<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 15:35
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/roomuse', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roomuse = \App\Models\RoomUse::all();
    return $response->getBody()->write($roomuse->toJson());
});

$app->get('/roomuse/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roomuse = \App\Models\RoomUse::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($roomuse->toJson());
});

$app->post('/roomuse', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $roomuse = new \App\Models\RoomUse();
        $roomuse->synt = $data['synt'];
        $roomuse->descr = $data['descr'];
        $roomuse->priority = $data['priority'];
        $roomuse->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($roomuse->toJson());
});

$app->delete('/roomuse/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $roomuse = \App\Models\RoomUse::find($id);
        $roomuse->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($roomuse->toJson());
});

$app->put('/roomuse/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    // print_r($data);
    try {
        $roomuse = \App\Models\RoomUse::find($id);
        $roomuse->synt = $data['synt'] ?: $roomuse->synt;
        $roomuse->descr = $data['descr'] ?: $roomuse->descr;
        $roomuse->priority = $data['priority'] ?: $roomuse->priority;
        $roomuse->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($roomuse->toJson());
});