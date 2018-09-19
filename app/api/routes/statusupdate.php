<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 16/05/2018
 * Time: 11:11
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/statusupdate', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $config = \App\Models\Config::all();
    $request = \App\Models\Requests::all();
    $res = array($config->toJson(), $request->toJson());
    return $response->getBody()->write(json_encode($res));
});

$app->get('/statusupdate/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $request = \App\Models\Requests::with(['config'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($request->toJson());
});


$checkDatesForUpdate = function ($request, $response, $next) {
    $req = null;
    $date = new DateTime('now', new DateTimeZone('Europe/Athens'));

    $data = $request->getParsedBody();
    $request = \App\Models\Requests::where('req_dt', '=', $data['req_dt'])->get();

    $config = \App\Models\Config::all();

    $cnt = 0;
    foreach ($request as $req) {
        $req_dt = new DateTime($req['req_dt']);

        $final = date_add($req_dt, date_interval_create_from_date_string($config->req_exp_dates));

        if (date_diff($final, [$req_dt])) {
            $req->status = $data['2'];
            $cnt++;
//            $nr = $response->withStatus(400);
//            $error = new ApiError();
//            $error->setData(840, "'.$cnt. requests updated'");
//            return $nr->write($error->toJson());
        }
    }
    $response = $next($request, $response);
    return $response;
};