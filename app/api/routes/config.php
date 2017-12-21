<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/configs', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $configs = \App\Models\Config::all();

    return $response->getBody()->write($configs->toJson());
});

$app->get('/config/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $config = \App\Models\Config::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($config->toJson());
});

$app->post('/config', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $config = new \App\Models\Config();
        $config->year = $data['year'];
        $config->status = $data['status'];
        $config->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($config->toJson());
});

$app->delete('/config/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $config = \App\Models\Config::find($id);
        $config->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($config->toJson());
});

$app->put('/config/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $config = \App\Models\Config::find($id);
        $config->year = $data['year'] ?: $config->year;
        $config->status = $data['status'] ?: $config->status;
        $config->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($config->toJson());
});

$app->get('/config/{id}/periods', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $conf = \App\Models\Config::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($conf->periods()->get()->toJson());
});