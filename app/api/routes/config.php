<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/config', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $config = \App\Models\Config::all();
    return $response->getBody()->write($config->toJson());
});

$app->get('/config/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $config = \App\Models\Config::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
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
        $config->fromd = $data['fromd'];
        $config->tod = $data['tod'];
        $config->synt = $data['synt'];
        $config->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($config->toJson());
});

$app->delete('/config/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $config = \App\Models\Config::find($id);
        $config->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
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
        $config->fromd = $data['fromd'] ?: $config->fromd;
        $config->tod = $data['tod'] ?: $config->tod;
        $config->synt = $data['synt'] ?: $config->synt;
        $config->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($config->toJson());
});
