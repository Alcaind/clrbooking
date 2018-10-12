<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:11
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/tms', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $tm = \App\Models\Tm::with('supervisor', 'ps', 'users')->get();
    return $response->getBody()->write($tm->toJson());
});

$app->get('/tm', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $tm = \App\Models\Tm::with('supervisor', 'users')->get();
    return $response->getBody()->write($tm->toJson());
});

$app->get('/tms/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $tm = \App\Models\Tm::with('supervisor', 'ps', 'users')->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($tm->toJson());
});

$app->post('/tms/ps', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $tt = $data['id'];
    try {
        $ps = \App\Models\Ps::with('tm')->where('conf_id', '=', $tt)->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage(), $data);
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ps->toJson());
});


$app->post('/user/tms', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $tms = array();
    foreach ($data as $tm) {
        array_push($tms, $tm['id']);
    }
    try {
        $tm = \App\Models\Tm::with('supervisor')
            ->whereIn('id', $tms)->get();

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($tm->toJson());
});

$app->post('/tms', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $tm = new \App\Models\Tm();
        $tm->tm_code = $data['tm_code'];
        $tm->descr = $data['descr'];
        $tm->title = $data['title'];
        $tm->sxoli = $data['sxoli'];
        $tm->supervisor = $data['supervisor'];
        $tm->ku_code = $data['ku_code'];
        $tm->ku_per = $data['ku_per'];
        $tm->mku_code = $data['mku_code'];
        $tm->mku_per = $data['mku_per'];
        $tm->pro_met = $data['pro_met'];
        $tm->mp_code = $data['mp_code'];
        $tm->mp_per = $data['mp_per'];
        $tm->default_tm_sel = null;

        $dtms = \App\Models\Tm::where('tm_code', '=', $data['tm_code'])->where('ku_code', '=', '000')->get();
        foreach ($dtms as $dtm) {
            $tm->default_tm_sel = $dtm['default_tm_sel'] ?: '';
        }

        if (!$tm->default_tm_sel) {
            $tm->save();
            $tm->default_tm_sel = $tm->id;
        }

        // $tm->default_tm_sel = $data['default_tm_sel'];


        $tm->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($tm->toJson());
});

$app->delete('/tms/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $tm = \App\Models\Tm::find($id);
        $tm->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($tm->toJson());
});

$app->put('/tms/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    try {
        $tm = \App\Models\Tm::find($id);
        $tm->tm_code = $data['tm_code'] ?: $tm->tm_code;
        $tm->descr = $data['descr'] ?: $tm->descr;
        $tm->title = $data['title'] ?: $tm->title;
        $tm->sxoli = $data['sxoli'] ?: $tm->sxoli;
        $tm->supervisor = $data['supervisor'] ?: $tm->supervisor;
        $tm->ku_code = $data['ku_code'] ?: null;
        $tm->ku_per = $data['ku_per'] ?: null;
        $tm->mku_code = $data['mku_code'] ?: null;
        $tm->mku_per = $data['mku_per'] ?: null;
        $tm->pro_met = $data['pro_met'] ?: null;
        $tm->mp_code = $data['mp_code'] ?: null;
        $tm->mp_per = $data['mp_per'] ?: null;
        $dtms = \App\Models\Tm::where('tm_code', '=', $data['tm_code'])->get();
        foreach ($dtms as $dtm) {
            $tm->default_tm_sel = $dtm->default_tm_sel ?: null;
        }
        $tm->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($tm->toJson());
});


