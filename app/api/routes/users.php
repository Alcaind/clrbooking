<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/users', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $users = \App\Models\Users::all();

    return $response->getBody()->write($users->toJson());
});

$app->get('/users/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $users = \App\Models\Users::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($users->toJson());
});

$app->post('/users', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $users = new \App\Models\Users();
        $users->tm_id = $data['tm_id'];
        $users->fname = $data['fname'];
        $users->sname = $data['sname'];
        $users->phone = $data['phone'];
        $users->em_main = $data['em_main'];
        $users->em_sec = $data['em_sec'];
        $users->em_pant = $data['em_pant'];
        $users->cat_id = $data['cat_id'];
        $users->comments = $data['comments'];
        $users->user = $data['user'];
        $users->hash = $data['hash'];
        $users->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($users->toJson());
});

$app->delete('/users/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        \App\Models\Users::destroy($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($users->toJson());
});

$app->put('/users/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $users = \App\Models\Users::find($id);
        $users->tm_id = $data['tm_id'] ?: $users->tm_id;
        $users->fname = $data['fname'] ?: $users->fname;
        $users->sname = $data['sname'] ?: $users->sname;
        $users->phone = $data['phone'] ?: $users->phone;
        $users->em_main = $data['em_main'] ?: $users->em_main;
        $users->em_sec = $data['em_sec'] ?: $users->em_sec;
        $users->em_pant = $data['em_pant'] ?: $users->em_pant;
        $users->cat_id = $data['cat_id'] ?: $users->cat_id;
        $users->comments = $data['comments'] ?: $users->comments;
        $users->user = $data['user'] ?: $users->user;
        $users->hash = $data['hash'] ?: $users->hash;
        $users->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($users->toJson());
});

$app->post('/user/{id}/roles', function ($request, $response, $args) {
    $id = $args['id'];
    $user = \App\User::find($id);
    //$user->roles()->add('{"role":"kitsos"}');
    return $response->getBody()->write($user->roles()->get()->toJson());
});

$app->get('/user/{id}/requests', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Users::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($configuration->requests()->get()->toJson());
});

$app->get('/roombook/{id}/users', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Users::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($configuration->roombook()->get()->toJson());
});