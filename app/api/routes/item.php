<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 16:10
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

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
        // do task when error
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
    return $response->withStatus(201)->getBody()->write($item->toJson());
});

$app->delete('/items/{id}', function ($request, $response, $args) {
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

