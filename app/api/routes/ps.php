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

$app->get('/ps', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    try {
        $ps = \App\Models\Ps::with('config', 'users')->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ps->toJson());
});


$app->get('/ps/conf/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $ps = \App\Models\Ps::with('config', 'users', 'tm')
            ->where('conf_id', '=', $id)
            ->orderBy('id', 'desc')
            ->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ps->toJson());
});

//$app->get('/ps/conf/{id}', function (Request $request, Response $response, $args) {
//    $cid = $args['id'];
//    try {
//        $ps = \App\Models\Ps::with('tm')->where('conf_id', '=', $cid)->get();
//    } catch (PDOException $e) {
//        $nr = $response->withStatus(404);
//        $error = new ApiError();
//        $error->setData($e->getCode(), $e->getMessage(), $cid);
//        return $nr->write($error->toJson());
//    }
//    return $response->getBody()->write($ps->toJson());
//});




$app->get('/ps/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $ps = \App\Models\Ps::with('config', 'users')->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ps->toJson());
});

$app->get('/ps/user/{uid}/config/{cid}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $uid = $args['uid'];
    $tms = array();
    $user = \App\Models\Users::with('tm')->find($uid);
    foreach ($user->tm as $tm) {
        array_push($tms, $tm->id);
    }
    $cid = $args['cid'];
    try {
        $ps = \App\Models\Ps::with('tm')
            ->where('conf_id', '=', $cid)
            ->whereHas('tm', function ($q) use ($tms) {
                $q->whereIn('id', $tms);
            })->get();

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
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
        $ps->conf_id = $data['conf_id'];
        $ps->ps_code = $data['ps_code'];
        $ps->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($ps->toJson());
});

$app->delete('/ps/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $ps = \App\Models\Ps::find($id);
        $ps->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($ps->toJson());
});

$app->put('/ps/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
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
        $ps->conf_id = $data['conf_id'] ?: $ps->conf_id;
        $ps->ps_code = $data['ps_code'];
//        $ps->registers = $data['registers'] ?: $ps->registers;
//        $ps->exams = $data['exams']?: $ps->exams;
        $ps->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ps->toJson());
});

$app->get('/ps/{id}/users', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $ps = \App\Models\Ps::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ps->users()->get()->toJson());
});
$app->post('/ps/{id}/users/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $ps = \App\Models\Ps::find($id);
    $ps->users()->attach($rid, $data);
    return $response->getBody()->write($ps->users()->get()->toJson());
});

$app->put('/ps/{id}/users/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $ps = \App\Models\Ps::find($id);
    $ps->users()->updateExistingPivot($rid, $data);
    return $response->getBody()->write($ps->users()->get()->toJson());
});

$app->delete('/ps/{id}/users/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $ps = \App\Models\Ps::find($id);
    $ps->users()->detach($rid);
    return $response->getBody()->write($ps->users()->get()->toJson());
});

