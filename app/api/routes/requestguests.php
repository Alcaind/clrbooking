<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 12:31
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/reqguests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $guests = \App\Models\Guests::with(['requests:id,descr'])->get();
    return $response->getBody()->write($guests->toJson());
});

$app->get('/reqguests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $guests = \App\Models\Guests::with(['requests:id,descr'])->find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($guests->toJson());
});

$app->post('/reqguests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $guests = new \App\Models\Guests();
        $guests->req_id = $data['req_id'];
        $guests->name = $data['name'];
        $guests->uni = $data['uni'];
        $guests->email = $data['email'];
        $guests->phone = $data['phone'];
        $guests->comment = $data['comment'];

        $guests->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($guests->toJson());
});

$app->delete('/reqguests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $guests = \App\Models\Guests::find($id);
        $guests->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($guests->toJson());
});

$app->put('/reqguests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $guests = \App\Models\Guests::find($id);

        $guests->req_id = $data['req_id'] ?: $guests->req_id;
        $guests->name = $data['name'] ?: $guests->name;
        $guests->uni = $data['uni'] ?: $guests->uni;
        $guests->email = $data['email'] ?: $guests->email;
        $guests->phone = $data['phone'] ?: $guests->phone;
        $guests->comment = $data['comment'] ?: $guests->comment;
        $guests->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($guests->toJson());
});