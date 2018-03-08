<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 15:35
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/roomcategory', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roomcategory = \App\Models\RoomCategory::all();

    return $response->getBody()->write($roomcategory->toJson());
});

$app->get('/roomcategory/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roomcategory = \App\Models\RoomCategory::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roomcategory->toJson());
});

$app->post('/roomcategory', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $roomcategory = new \App\Models\RoomCategory();
        $roomcategory->synt = $data['synt'];
        $roomcategory->descr = $data['descr'];
        $roomcategory->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($roomcategory->toJson());
});

$app->delete('/roomcategory/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $roomcategory = \App\Models\RoomCategory::find($id);
        $roomcategory->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($roomcategory->toJson());
});

$app->put('/roomcategory/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $roomcategory = \App\Models\RoomCategory::find($id);
        $roomcategory->synt = $data['synt'] ?: $roomcategory->synt;
        $roomcategory->descr = $data['descr'] ?: $roomcategory->descr;
        $roomcategory->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roomcategory->toJson());
});