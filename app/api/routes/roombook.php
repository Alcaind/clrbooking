<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:45
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/roombook', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roombook = \App\Models\RoomBook::all();

    return $response->getBody()->write($roombook->toJson());
});

$app->get('/roombook/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $roombook = \App\Models\RoomBook::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roombook->toJson());
});

$app->post('/roombook', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $roombook = new \App\Models\RoomBook();
        $roombook->user_id = $data['user_id'];
        $roombook->date_index = $data['date_index'];
        $roombook->fromt = $data['fromt'];
        $roombook->tot = $data['tot'];
        $roombook->type = $data['type'];
        $roombook->period = $data['period'];
        $roombook->room_id = $data['room_id'];
        $roombook->fromd = $data['fromd'];
        $roombook->tod = $data['tod'];
        $roombook->request_id = $data['request_id'];
        $roombook->save();
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
    return $response->withStatus(201)->getBody()->write($roombook->toJson());
});
$app->delete('/roombook/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $roombook = \App\Models\RoomBook::find($id);
        $roombook->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($roombook->toJson());
});

$app->put('/roombook/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $roombook = \App\Models\RoomBook::find($id);
        $roombook->user_id = $data['user_id'] ?: $roombook->user_id;
        $roombook->date_index = $data['date_index'] ?: $roombook->date_index;
        $roombook->fromt = $data['fromt'] ?: $roombook->fromt;
        $roombook->tot = $data['tot'] ?: $roombook->tot;
        $roombook->type = $data['type'] ?: $roombook->type;
        $roombook->period = $data['period'] ?: $roombook->period;
        $roombook->room_id = $data['room_id'] ?: $roombook->room_id;
        $roombook->fromd = $data['fromd'] ?: $roombook->fromd;
        $roombook->tod = $data['tod'] ?: $roombook->tod;
        $roombook->request = $data['request_id'] ?: $roombook->request_id;
        $roombook->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($roombook->toJson());
});