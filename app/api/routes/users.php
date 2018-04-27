<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Illuminate\Database\QueryException as QException;
use \App\Models\ApiError as ApiError;

$app->get('/users', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $users = \App\Models\Users::with(['ucategories:id,descr', 'roles', 'superTms', 'tm'])->get();
    return $response->getBody()->write($users->toJson());
});


$app->get('/users/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $users = \App\Models\Users::with(['ucategories:id,descr', 'roles', 'superTms', 'tm'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($users->toJson());
});


$app->post('/users', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $users = new \App\Models\Users();
        $users->fname = $data['fname'];
        $users->sname = $data['sname'];
        $users->phone = $data['phone'];
        $users->em_main = $data['em_main'];
        $users->em_sec = $data['em_sec'];
        $users->em_pant = $data['em_pant'];
        $users->cat_id = $data['cat_id'];
        $users->comments = $data['comments'];
        $users->user = $data['user'];
        $users->hash = password_hash($data['hash'], PASSWORD_DEFAULT);
        $users->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($users->toJson());
});

$app->delete('/users/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $users = \App\Models\Users::find($id);
        $users->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($users->toJson());
});

$app->put('/users/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $users = \App\Models\Users::find($id);
        $users->fname = $data['fname'] ?: $users->fname;
        $users->sname = $data['sname'] ?: $users->sname;
        $users->phone = $data['phone'] ?: $users->phone;
        $users->em_main = $data['em_main'] ?: $users->em_main;
        $users->em_sec = $data['em_sec'] ?: $users->em_sec;
        $users->em_pant = $data['em_pant'] ?: $users->em_pant;
        $users->cat_id = $data['cat_id'] ?: $users->cat_id;
        $users->comments = $data['comments'] ?: $users->comments;
        $users->user = $data['user'] ?: $users->user;
        $users->hash = password_hash($data['hash'], PASSWORD_DEFAULT) ?: $users->hash;
        $users->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($users->toJson());
});

$app->post('/users/{id}/roles/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $user = \App\Models\Users::find($id);
    $user->roles()->attach($rid, $data);
    return $response->getBody()->write($user->roles()->get()->toJson());
});

$app->put('/users/{id}/roles/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $user = \App\Models\Users::find($id);
    $user->roles()->updateExistingPivot($rid, $data);
    return $response->getBody()->write($user->roles()->get()->toJson());
});

$app->delete('/users/{id}/roles/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $user = \App\Models\Users::find($id);
    $user->roles()->detach($rid);
    return $response->getBody()->write($user->roles()->get()->toJson());
});

$app->get('/users/{id}/roles', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $user = \App\Models\Users::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($user->roles()->get()->toJson());
});

$app->get('/users/{id}/requests', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $user = \App\Models\Users::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($user->requests()->get()->toJson());
});

$app->get('/roombook/{id}/users', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Users::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($configuration->roombook()->get()->toJson());
});


$app->post('/users/{id}/tms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $user = \App\Models\Users::find($id);
    $user->tm()->attach($rid, $data);
    return $response->getBody()->write($user->tm()->get()->toJson());
});

$app->put('/users/{id}/tms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $user = \App\Models\Users::find($id);
    $user->tm()->updateExistingPivot($rid, $data);
    return $response->getBody()->write($user->tm()->get()->toJson());
});

$app->delete('/users/{id}/tms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $user = \App\Models\Users::find($id);
    $user->tm()->detach($rid);
    return $response->getBody()->write($user->tm()->get()->toJson());
});

$app->get('/users/{id}/tms', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $user = \App\Models\Users::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($user->tm()->get()->toJson());
});