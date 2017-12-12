<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 12:02
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/kat', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $kat = \App\Models\Kat::all();

    return $response->getBody()->write($kat->toJson());
});

$app->get('/kat/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $kat = \App\Models\Kat::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($kat->toJson());
});

$app->post('/kat', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $kat = new \App\Models\Kat();
        $kat->tm_id = $data['tm_id'];
        $kat->decr = $data['decr'];
        $kat->title = $data['title'];
        $kat->pm = $data['pm'];
        $kat->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($kat->toJson());
});

$app->delete('/kat/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $kat = \App\Models\Kat::find($id);
        $kat->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($kat->toJson());
});

$app->put('/kat/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $kat = \App\Models\Kat::find($id);
//        $kat->tm_id = $data['tm_id'] ?: $kat->tm_id;    den 8a exei prosbash
        $kat->decr = $data['decr'] ?: $kat->decr;
        $kat->title = $data['title'] ?: $kat->title;
        $kat->pm = $data['pm'] ?: $kat->pm;
        $kat->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($kat->toJson());
});