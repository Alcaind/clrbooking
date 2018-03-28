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
        ->where('fromd', '>=', $data['fromd'])->where('fromd', '<=', $data['tod'])
        ->orWhere(function ($query) use ($data) {
            $query->where('tod', '<=', $data['tod'])->where('tod', '>=', $data['fromd']);
        })->get();
    return $response->getBody()->write($roombook->toJson());
});


//$app->post('/roombook', function (Request $request, Response $response) {
//    header("Content-Type: application/json");
//    $data = $request->getParsedBody();
//    try {
//        $roombook = new \App\Models\RoomBook();
//        $roombook->user_id = $data['user_id'];
//        $roombook->date_index = $data['date_index'];
//        $roombook->fromt = $data['fromt'];
//        $roombook->tot = $data['tot'];
//        $roombook->type = $data['type'];
//        $roombook->period = $data['period'];
//        $roombook->room_id = $data['room_id'];
//        $roombook->fromd = $data['fromd'];
//        $roombook->tod = $data['tod'];
//        $roombook->request_id = $data['request_id'];
//        $roombook->status = $data['status'];
//        $roombook->comment = $data['comment'];
//        $roombook->save();
//    } catch (PDOException $e) {
//        $nr = $response->withStatus(404);
//        $error = new ApiError();
//        $error->setData($e->getCode(), $e->getMessage());
//        return $nr->write($error->toJson());
//    }
//    return $response->withStatus(201)->getBody()->write($roombook->toJson());
//});
//
//$app->delete('/roombook/{id}', function ($request, $response, $args) {
//    $id = $args['id'];
//    try {
//        $roombook = \App\Models\RoomBook::find($id);
//        $roombook->delete();
//    } catch (\Exception $e) {
//        return $response->withStatus(404)->getBody()->write($e->getMessage());
//    }
//    return $response->withStatus(200)->getBody()->write($roombook->toJson());
//});
//
//$app->put('/roombook/{id}', function ($request, $response, $args) {
//    $id = $args['id'];
//    $data = $request->getParsedBody();
//    try {
//        $roombook = \App\Models\RoomBook::find($id);
//
//        $roombook->user_id = $data['user_id'] ?: $roombook->user_id;
//        $roombook->date_index = $data['date_index'] ?: $roombook->date_index;
//        $roombook->fromt = $data['fromt'] ?: $roombook->fromt;
//        $roombook->tot = $data['tot'] ?: $roombook->tot;
//        $roombook->type = $data['type'] ?: $roombook->type;
//        $roombook->period = $data['period'] ?: $roombook->period;
//        $roombook->room_id = $data['room_id'] ?: $roombook->room_id;
//        $roombook->fromd = $data['fromd'] ?: $roombook->fromd;
//        $roombook->tod = $data['tod'] ?: $roombook->tod;
//        $roombook->request_id = $data['request_id'] ?: $roombook->request_id;
//        $roombook->status = $data['status'] ?: $roombook->status;
//        $roombook->comment = $data['comment'] ?: $roombook->comment;
//        $roombook->save();
//    } catch (\Exception $e) {
//        return $response->withStatus(404)->getBody()->write($e->getMessage());
//    }
//    return $response->getBody()->write($roombook->toJson());
//});