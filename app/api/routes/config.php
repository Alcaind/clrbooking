<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/config', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $config = \App\Models\Config::with([])->get();
    return $response->getBody()->write($config->toJson());
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
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
//        $users->errorText = $e->getMessage();
//        $users->errorCode = $e->getCode();
//        $errormessage = explode(':', $e->getMessage())[2];
//        $errormessage = explode('(', $errormessage)[0];
//        $value = explode('\'', $errormessage)[1];
//        $key = explode('\'', $errormessage)[3];
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
//        $error->setData($e->getCode(),'διπλοεγγρεφη '.$value.' στη κολωνα '.$key);

        return $nr->write($error->toJson());
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

//$app->get('/configuration/{id}/periods', function ($request, $response, $args) {
//    $id = $args['id'];
//    try {
//        $conf = \App\Models\Config::find($id);
//    } catch (\Exception $e) {
//        return $response->withStatus(404)->getBody()->write($e->getMessage());
//    }
//    return $response->getBody()->write($conf->periods()->get()->toJson());
//});