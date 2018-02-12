<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 15:35
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

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
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
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
        $roomuse->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
//        $users->errorText = $e->getMessage();
//        $users->errorCode = $e->getCode();
//        $errormessage = explode(':', $e->getMessage())[2];
//        $errormessage = explode('(', $errormessage)[0];
//        $value = explode('\'', $errormessage)[1];
//        $key = explode('\'', $errormessage)[3];
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
//        $error->setData($e->getCode(),'διπλοεγγρεφη '.$value.' στη κολωνα '.$key);

        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($roomuse->toJson());
});

$app->delete('/roomuse/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $roomuse = \App\Models\RoomUse::find($id);
        $roomuse->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($roomuse->toJson());
});

$app->put('/roomuse/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $roomuse = \App\Models\RoomUse::find($id);
        $roomuse->synt = $data['synt'] ?: $roomuse->synt;
        $roomuse->descr = $data['descr'] ?: $roomuse->descr;
        $roomuse->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roomuse->toJson());
});