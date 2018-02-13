<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 14:07
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/roomitem', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roomitem = \App\Models\RoomItem::all();

    return $response->getBody()->write($roomitem->toJson());
});

$app->get('/roomitem/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roomitem = \App\Models\RoomItem::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roomitem->toJson());
});

$app->post('/roomitem', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $roomitem = new \App\Models\RoomItem();
        $roomitem->item_id = $data['item_id'];
        $roomitem->comments = $data['comments'];
        $roomitem->stat = $data['stat'];
        $roomitem->from = $data['from'];
        $roomitem->to = $data['to'];
        $roomitem->room_id = $data['room_id'];
        $roomitem->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($roomitem->toJson());
});

$app->delete('/roomitem/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $roomitem = \App\Models\RoomItem::find($id);
        $roomitem->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($roomitem->toJson());
});

$app->put('/roomitem/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $roomitem = \App\Models\RoomItem::find($id);
        $roomitem->item_id = $data['item_id'] ?: $roomitem->item_id;
        $roomitem->comments = $data['comments'] ?: $roomitem->comments;
        $roomitem->stat = $data['stat'] ?: $roomitem->stat;
        $roomitem->from = $data['from'] ?: $roomitem->from;
        $roomitem->to = $data['to'] ?: $roomitem->to;
        $roomitem->room_id = $data['room_id'] ?: $roomitem->room_id;
        $roomitem->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roomitem->toJson());
});