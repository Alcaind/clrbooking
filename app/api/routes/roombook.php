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

$app->get('/roombook', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roombook = \App\Models\RoomBook::with('requests', 'rooms', 'users')->get();
    return $response->getBody()->write($roombook->toJson());
});

$app->get('/roombook/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roombook = \App\Models\RoomBook::with('requests', 'rooms', 'users')->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($roombook->toJson());
});
/**
 * returns the calendar from the given dates
 */
$app->post('/roombook/dates', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    //return $response->getBody()->write(json_encode($data));
    $roombook = \App\Models\Requests::with('rooms', 'ps')
        ->whereBetween('fromd', [$data['fromd'], $data['tod']])
        ->orWhere(function ($query) use ($data) {
            $query->Where('fromd', '<=', date('Y-m-d', strtotime($data['fromd'])))
                ->Where('tod', '>=', date('Y-m-d', strtotime($data['fromd'])));
        })->orWhereBetween('tod', [$data['tod'], $data['fromd']])
        ->get();
    return $response->getBody()->write($roombook->toJson());
});

$app->post('/roombook/view/by/course', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    //return $response->getBody()->write(json_encode($data));
    $roombook = \App\Models\Requests::with('rooms', 'ps')
        ->whereIn('ps_id', $data['ps'])
        ->where(function ($query) use ($data) {
            $query->orWhereBetween('fromd', [$data['fromd'], $data['tod']])
                ->orWhereBetween('tod', [$data['tod'], $data['fromd']])
                ->orWhere(function ($query) use ($data) {
                    $query->Where('fromd', '<=', date('Y-m-d', strtotime($data['fromd'])))
                        ->Where('tod', '>=', date('Y-m-d', strtotime($data['fromd'])));
                });
        })
        ->get();
    return $response->getBody()->write($roombook->toJson());
});
$app->post('/roombook/view/by/room', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    //return $response->getBody()->write(json_encode($data));
    $roombook = \App\Models\Requests::with('rooms', 'ps')
        ->whereHas('rooms', function ($query) use ($data) {
            $query->whereIn('room_id', $data['rooms']);
        })
        ->where(function ($query) use ($data) {
            $query->orWhereBetween('fromd', [$data['fromd'], $data['tod']])
                ->orWhereBetween('tod', [$data['tod'], $data['fromd']])
                ->orWhere(function ($query) use ($data) {
                    $query->Where('fromd', '<=', date('Y-m-d', strtotime($data['fromd'])))
                        ->Where('tod', '>=', date('Y-m-d', strtotime($data['fromd'])));
                });
        })->get();
    //return $response->getBody()->write($roombook);
    return $response->getBody()->write($roombook->toJson());
});