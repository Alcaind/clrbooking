<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 11:48
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/periods', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $periods = \App\Models\Periods::all();

    return $response->getBody()->write($periods->toJson());
});

$app->get('/periods/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $periods = \App\Models\Periods::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($periods->toJson());
});

$app->post('/periods', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $periods = new \App\Models\Periods();
        $periods->descr = $data['descr'];
        $periods->synt = $data['synt'];
        $periods->fromd = $data['fromd'];
        $periods->tod = $data['tod'];
        $periods->comments = $data['comments'];
        $periods->conf_id = $data['conf_id'];
        $periods->porder = $data['porder'];
        $periods->status = $data['status'];
        $periods->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($periods->toJson());
});

$app->delete('/periods/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $periods = \App\Models\Periods::find($id);
        $periods->delete();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($periods->toJson());
});

$app->put('/periods/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $periods = \App\Models\Periods::find($id);
        $periods->descr = $data['descr'] ?: $periods->descr;
        $periods->synt = $data['synt'] ?: $periods->synt;
        $periods->fromd = $data['fromd'] ?: $periods->fromd;
        $periods->tod = $data['tod'] ?: $periods->tod;
        $periods->comments = $data['comments'] ?: $periods->comments;
        $periods->conf_id = $data['conf_id'] ?: $periods->status;
        $periods->porder = $data['porder'] ?: $periods->order;
        $periods->status = $data['status'] ?: $periods->status;
        $periods->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($periods->toJson());
});