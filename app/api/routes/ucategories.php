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


$app->get('/userscategories', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $ucategories = \App\Models\Ucategories::with(['users'])->get();
    return $response->getBody()->write($ucategories->toJson());

});

$app->get('/userscategories/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $ucategories = \App\Models\Ucategories::with(['users'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ucategories->toJson());
});

$app->post('/userscategories', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $ucategories = new \App\Models\Ucategories();
        $ucategories->descr = $data['descr'];
        $ucategories->comment = $data['comment'];
        $ucategories->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($ucategories->toJson());
});

$app->delete('/userscategories/{id}', function ($request, $response, $args) {
    $id = $args['id'];

    try {
        $ucategories = \App\Models\Ucategories::find($id);
        $ucategories->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($ucategories->toJson());
});

$app->put('/userscategories/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    //print_r($data);
    try {
        $ucategories = \App\Models\Ucategories::find($id);

        $ucategories->descr = $data['descr'] ?: $ucategories->descr;
        $ucategories->comment = $data['comment'] ?: $ucategories->comment;
        $ucategories->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($ucategories->toJson());
});

//-------------------------

$app->get('/users/userscategories/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $users = \App\Models\Users::with(['ucategories', 'tm'])
            ->where('cat_id', '=', $id)
            ->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($users->toJson());
});
