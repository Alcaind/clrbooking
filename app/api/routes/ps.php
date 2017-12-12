<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 12:31
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app->get('/ps', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $ps = \App\Models\Ps::all();

    return $response->getBody()->write($ps->toJson());
});

$app->get('/ps/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $ps = \App\Models\Ps::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($ps->toJson());
});

$app->post('/ps', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $ps = new \App\Models\Ps();
        $ps->tm_code = $data['tm_code'];
        $ps->tm_per = $data['tm_per'];
        $ps->pm = $data['pm'];
        $ps->tma_code = $data['tma_code'];
        $ps->tma_per = $data['tma_per'];
        $ps->ps_ex = $data['ps_ex'];
        $ps->ps_dm = $data['ps_dm'];
        $ps->ps_km = $data['ps_km'];
        $ps->teacher = $data['teacher'];
        $ps->conf_id = $data['conf_id'];
        $ps->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($ps->toJson());
});

$app->delete('/ps/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $ps = \App\Models\Ps::find($id);
        $ps->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($ps->toJson());
});

$app->put('/ps/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $ps = \App\Models\Ps::find($id);

        $ps->tm_code = $data['tm_code'] ?: $ps->tm_code;
        $ps->tm_per = $data['tm_per'] ?: $ps->tm_per;
        $ps->pm = $data['pm'] ?: $ps->pm;
        $ps->tma_code = $data['tma_code'] ?: $ps->tma_code;
        $ps->tma_per = $data['tma_per'] ?: $ps->tma_per;
        $ps->ps_ex = $data['ps_ex'] ?: $ps->ps_ex;
        $ps->ps_dm = $data['ps_dm'] ?: $ps->ps_dm;
        $ps->ps_km = $data['ps_km'] ?: $ps->ps_km;
        $ps->teacher = $data['teacher'] ?: $ps->teacher;
        $ps->conf_id = $data['conf_id '] ?: $ps->conf_id;
        $ps->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($ps->toJson());
});