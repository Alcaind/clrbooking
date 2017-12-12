<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:11
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/tm', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $tm = \App\Models\Tm::all();

    return $response->getBody()->write($tm->toJson());
});

$app->get('/tm/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $tm = \App\Models\Tm::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($tm->toJson());
});

$app->post('/tm', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $tm = new \App\Models\Tm();
        $tm->tm_code = $data['tm_code'];
        $tm->descr = $data['descr'];
        $tm->title = $data['title'];
        $tm->sxoli = $data['sxoli'];
        $tm->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($tm->toJson());
});

$app->delete('/tm/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $tm = \App\Models\Tm::find($id);
        $tm->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($tm->toJson());
});

$app->put('/tm/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $tm = \App\Models\Tm::find($id);

        $tm->tm_code = $data['tm_code'] ?: $tm->tm_code;
        $tm->descr = $data['descr'] ?: $tm->descr;
        $tm->title = $data['title'] ?: $tm->title;
        $tm->sxoli = $data['sxoli'] ?: $tm->sxoli;


        $tm->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($tm->toJson());
});

$app->get('/tm/{id}/kat', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $tm = \App\Models\Tm::find($id);

    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($tm->kat()->get()->toJson());
});

$app->get('/tm/{id}/users', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Tm::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($configuration->users()->get()->toJson());
});
