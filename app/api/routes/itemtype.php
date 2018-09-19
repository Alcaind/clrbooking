<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 21/06/2018
 * Time: 12:47
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/itemtype', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $itemtype = \App\Models\ItemType::all();
    return $response->getBody()->write($itemtype->toJson());
});

$app->get('/itemtype/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $itemtype = \App\Models\ItemType::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($itemtype->toJson());
});

$app->post('/itemtype', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    try {
        $itemtype = new \App\Models\ItemType();
        $itemtype->descr = $data['descr'];
        $itemtype->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($itemtype->toJson());
});

$app->delete('/itemtype/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $itemtype = \App\Models\ItemType::find($id);
        $itemtype->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($itemtype->toJson());
});

$app->put('/itemtype/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    try {
        $itemtype = \App\Models\ItemType::find($id);
        $itemtype->descr = $data['descr'] ?: $itemtype->descr;
        $itemtype->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($itemtype->toJson());
});