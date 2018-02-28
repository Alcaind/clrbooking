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

$app->get('/psstats', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $psstat = \App\Models\Stats::with(['ps:id,ps_id'])->get();
    return $response->getBody()->write($psstat->toJson());
});

$app->get('/psstats/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $psstat = \App\Models\Stats::with(['ps:id,ps_id'])->find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($psstat->toJson());
});

$app->post('/psstats', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $psstat = new \App\Models\Stats();
        $psstat->ps_id = $data['ps_id'];
        $psstat->diloseis = $data['diloseis'];
        $psstat->exetaseis = $data['exetaseis'];

        $psstat->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($psstat->toJson());
});

$app->delete('/psstats/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $psstat = \App\Models\Stats::find($id);
        $psstat->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($psstat->toJson());
});

$app->put('/psstats/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $psstat = \App\Models\Stats::find($id);

        $psstat->ps_id = $data['ps_id '] ?: $psstat->ps_id;
        $psstat->diloseis = $data['diloseis'] ?: $psstat->diloseis;
        $psstat->exetaseis = $data['exetaseis '] ?: $psstat->exetaseis;
        $psstat->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($psstat->toJson());
});