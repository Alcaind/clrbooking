<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:24
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;


$app->get('/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $requests = \App\Models\Requests::with(['users:id,user'])->get();

    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user'])->find($id);
    } catch (\Exception $e) {
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
        $requests->class_use = $data['class_use'];
        $requests->links = $data['links'];
        $requests->fromdt = $data['fromdt'];
        $requests->todt = $data['todt'];
        $requests->protocol_id = $data['protocol_id'];
        $requests->req_status = $data['req_status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->date_index = $data['date_index'];
        $requests->admin = $data['admin'];
        $requests->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});

$app->delete('/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->delete();
    } catch (\Exception $e) {
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
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->links = $data['links'] ?: $requests->links;
        $requests->fromdt = $data['fromdt'] ?: $requests->fromdt;
        $requests->todt = $data['todt'] ?: $requests->todt;
        $requests->protocol_id = $data['protocol_id'] ?: $requests->protocol_id;
        $requests->req_status = $data['req_status'] ?: $requests->req_status;
        $requests->fromd = $data['fromd'] ?: $requests->fromd;
        $requests->tod = $data['tod'] ?: $requests->tod;
        $requests->date_index = $data['date_index'] ?: $requests->date_index;
        $requests->admin = $data['admin'] ?: $requests->admin;

        $requests->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->post('/requests/{id}/rooms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $requests = \App\Models\Requests::find($id);
    $requests->rooms()->attach($rid, $data);
    return $response->getBody()->write($requests->rooms()->get()->toJson());
});

$app->put('/requests/{id}/rooms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $requests = \App\Models\Requests::find($id);
    $requests->rooms()->updateExistingPivot($rid, $data);
    return $response->getBody()->write($requests->rooms()->get()->toJson());
});

$app->delete('/requests/{id}/rooms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $requests = \App\Models\Requests::find($id);
    $requests->rooms()->detach($rid);
    return $response->getBody()->write($requests->rooms()->get()->toJson());
});

$app->get('/requests/{id}/rooms', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($requests->rooms()->get()->toJson());
});
