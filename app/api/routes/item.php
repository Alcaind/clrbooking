<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 16:10
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/items', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $item = \App\Models\Items::all();
    return $response->getBody()->write($item->toJson());
});

$app->get('/items/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $item = \App\Models\Items::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($item->toJson());
});

$app->post('/items', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    try {
        $item = new \App\Models\Items();
        $item->descr = $data['descr'];
        $item->comments = $data['comments'];
        $item->code = $data['code'];
        $item->status = $data['status'];
        $item->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($item->toJson());
});

$app->delete('/items/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $item = \App\Models\Items::find($id);
        $item->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($item->toJson());
});

$app->put('/items/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    try {
        $item = \App\Models\Items::find($id);
        $item->descr = $data['descr'] ?: $item->descr;
        $item->comments = $data['comments'] ?: $item->comments;
        $item->code = $data['code'] ?: $item->code;
        $item->status = $data['status'] ?: $item->status;
        $item->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($item->toJson());
});


$app->get('/items/{id}/rooms', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $item = \App\Models\Items::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($item->rooms()->get()->toJson());
});

$app->delete('/items/{id}/rooms/{iid}', function ($request, $response, $args) {
    $id = $args['id'];
    $iid = $args['iid'];
    try {
        $item = \App\Models\Items::find($id);
        $item->rooms()->detach($iid);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($item->rooms()->get()->toJson());
});

$app->post('/items/{id}/rooms/{iid}', function ($request, $response, $args) {
    $iid = $args['iid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $item = \App\Models\Items::find($id);
    $item->rooms()->attach($iid, $data);
    return $response->getBody()->write($item->rooms()->get()->toJson());
});

$app->put('/items/{id}/rooms/{iid}', function ($request, $response, $args) {
    $iid = $args['iid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $item = \App\Models\Items::find($id);
    $item->rooms()->updateExistingPivot($iid, $data);
    return $response->getBody()->write($item->rooms()->get()->toJson());
});




