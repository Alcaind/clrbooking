<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:24
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $requests = \App\Models\Requests::all();

    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->post('/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $requests = new \App\Models\Requests();
        $requests->req_dt = $data['req_dt'];
        $requests->user_id = $data['user_id'];
        $requests->descr = $data['descr'];
        $requests->period = $data['period'];
        $requests->ps_id = $data['ps_id'];
        $requests->teacher = $data['teacher'];
        $requests->from_book = $data['from_book'];
        $requests->class_use = $data['class_use'];
        $requests->links = $data['links'];
        $requests->fromdt = $data['fromdt'];
        $requests->todt = $data['todt'];
        $requests->protocol_id = $data['protocol_id'];
        $requests->req_stat = $data['req_stat'];
        $requests->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});

$app->delete('/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($requests->toJson());
});

$app->put('/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->req_dt = $data['req_dt'] ?: $requests->req_dt;
        $requests->user_id = $data['user_id'] ?: $requests->user_id;
        $requests->descr = $data['descr'] ?: $requests->descr;
        $requests->period = $data['period'] ?: $requests->period;
        $requests->ps_id = $data['ps_id'] ?: $requests->ps_id;
        $requests->teacher = $data['teacher'] ?: $requests->teacher;
        $requests->from_book = $data['from_book'] ?: $requests->from_book;
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->links = $data['links'] ?: $requests->links;
        $requests->fromdt = $data['fromdt'] ?: $requests->fromdt;
        $requests->todt = $data['todt'] ?: $requests->todt;
        $requests->protocol_id = $data['protocol_id'] ?: $requests->protocol_id;
        $requests->req_stat = $data['req_stat'] ?: $requests->req_stat;
        $requests->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($requests->toJson());
});