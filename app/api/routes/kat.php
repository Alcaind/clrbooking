<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 12:02
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/kats', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $kat = \App\Models\Kat::with(['tm:id,title'])->get();
    return $response->getBody()->write($kat->toJson());
});

$app->get('/kats/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $kat = \App\Models\Kat::with(['tm:id,title'])->find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($kat->toJson());
});

$app->post('/kats', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $kat = new \App\Models\Kat();
        $kat->tm_id = $data['tm_id'];
        $kat->decr = $data['decr'];
        $kat->title = $data['title'];
        $kat->pm = $data['pm'];
        $kat->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($kat->toJson());
});

$app->delete('/kats/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $kat = \App\Models\Kat::find($id);
        $kat->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($kat->toJson());
});

$app->put('/kats/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    // print_r($data);
    try {
        $kat = \App\Models\Kat::find($id);
        $kat->tm_id = $data['tm_id'] ?: $kat->tm_id;
        $kat->decr = $data['decr'] ?: $kat->decr;
        $kat->title = $data['title'] ?: $kat->title;
        $kat->pm = $data['pm'] ?: $kat->pm;
        $kat->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($kat->toJson());
});


