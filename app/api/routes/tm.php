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
//        ->whereHas('ps', function ($query) {
//            /*$query->where('conf_id', '=', property_exists('$data', 'conf_id') ? $data['conf_id'] : json_decode(\App\Models\Config::where('status', '=', 1)*/
//            $query->where('conf_id', '=', 1);
    //       })
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

//(SQL: select * from `ps`, tm
//where `tm`.`id` = `ps`.`tm_code` and `conf_id` = 1)

$app->post('/tms/ps', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    //print_r($data['id']);
    $tt = $data['id'];
    //return $response->getBody()->write(json_encode($data));

    try {

        $ps = \App\Models\Ps::with('tm')->where('conf_id', '=', $tt)->get();
//        $tm = \App\Models\Tm::with('supervisor', 'ps')
//            ->whereHas('ps', function ($query)  use ($data) {
//                /*$query->where('conf_id', '=', property_exists('$data', 'conf_id') ? $data['conf_id'] : json_decode(\App\Models\Config::where('status', '=', 1)*/
//                $query->where('conf_id', '=', $data['id']);
//            });
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
    //$id = $args['id'];
    $data = $request->getParsedBody();
    $tms = array();
    foreach ($data as $tm) {
        //if ($tm['config_id'] == $data['config_id'])
        array_push($tms, $tm['id']);
    }
    // print_r($tms);
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
        $tm->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($tm->toJson());
});

$app->get('/tms/{id}/kat', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $tm = \App\Models\Tm::find($id);

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($tm->kat()->get()->toJson());
});

