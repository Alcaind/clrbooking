<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 16:10
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/item', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $item = \App\Models\Items::all();

    return $response->getBody()->write($item->toJson());
});

$app->get('/item/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $item = \App\Models\Items::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($item->toJson());
});

$app->post('/item', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    try {
        $item = new \App\Models\Items();
        $item->descr = $data['descr'];
        $item->comments = $data['comments'];
        $item->code = $data['code'];
        $item->status = $data['status'];
        $item->save();
    } catch (\Exception $e) {
        // TODO task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($item->toJson());
});

$app->delete('/item/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $item = \App\Models\Items::find($id);
        $item->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($item->toJson());
});

$app->put('/item/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    try {
        $item = \App\Models\Items::find($id);

        $item->descr = $data['descr'] ?: $item->descr;
        $item->comments = $data['title'] ?: $item->comments;
        $item->code = $data['sxoli'] ?: $item->code;
        $item->status = $data['tm_code'] ?: $item->status;


        $item->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($item->toJson());
});

