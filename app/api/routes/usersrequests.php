<?php
/**
 * Created by PhpStorm.
 * User: ifigeneia
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Illuminate\Database\QueryException as QException;
use \App\Models\ApiError as ApiError;

$app->get('/usersrequests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $usreq = \App\Models\usersRequests::with(['roombook', 'fromusers', 'tousers'])->get();
    return $response->getBody()->write($usreq->toJson());
});


$app->get('/usersrequests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $usreq = \App\Models\usersRequests::with(['roombook', 'fromusers', 'tousers'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($usreq->toJson());
});


$app->post('/usersrequests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $usreq = new \App\Models\usersRequests();
        $usreq->from_user = $data['from_user'];
        $usreq->to_users = $data['to_users'];
        $usreq->comments = $data['comments'];
        $usreq->rr_id = $data['rr_id'];
        $usreq->to_comment = $data['to_comment'];
        $usreq->confirm = $data['confirm'];
        $usreq->status = $data['status'];
        $usreq->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($usreq->toJson());
});

$app->delete('/usersrequests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $usreq = \App\Models\usersRequests::find($id);
        $usreq->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($usreq->toJson());
});

$app->put('/usersrequests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $usreq = \App\Models\usersRequests::find($id);
        $usreq->from_user = $data['from_user'] ?: $usreq->from_user;
        $usreq->to_users = $data['to_users'] ?: $usreq->to_users;
        $usreq->comments = $data['comments'] ?: $usreq->comments;
        $usreq->rr_id = $data['rr_id'] ?: $usreq->rr_id;
        $usreq->to_comment = $data['to_comment'] ?: $usreq->to_comment;
        $usreq->confirm = $data['confirm'] ?: $usreq->confirm;
        $usreq->status = $data['status'] ?: $usreq->status;
        $usreq->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($usreq->toJson());
});
