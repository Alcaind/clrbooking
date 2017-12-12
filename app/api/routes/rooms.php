<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/rooms', function (Request $request, Response $response) {
    //if (in_array("get", $this->jwt->scope)) {
    header("Content-Type: application/json");
    $rooms = \App\Models\Rooms::all();
    return $response->getBody()->write($rooms->toJson());
});

$app->get('/room/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($room->toJson());
});

$app->post('/room', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    try {
        $room = new \App\Models\Rooms();

        $room->name = $data['name'];
        $room->address = $data['address'];
        $room->building = $data['building'];
        $room->floor = $data['floor'];
        $room->status = $data['status'];
        $room->active = $data['active'];
        $room->destroyed = $data['destroyed'];
        $room->nonexist = $data['nonexist'];
        $room->capasity = $data['capasity'];
        $room->width = $data['width'];
        $room->height = $data['height'];
        $room->exams_capasity = $data['exams_capasity'];
        $room->capasity_categ = $data['capasity_categ'];
        $room->tm_owner = $data['name'];
        $room->dt = $data['dt'];
        $room->stat_comm = $data['stat_comm'];
        $room->conf_id = $data['conf_id'];
        $room->type = $data['type'];
        $room->use_id = $data['use_id'];
        $room->use_str = $data['use_str'];

        $room->save();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(201)->getBody()->write($room->toJson());
});

$app->delete('/room/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
        $room->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($room->toJson());
});

$app->put('/room/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    try {
        $room = \App\Models\Rooms::find($id);

        $room->name = $data['name'] ?: $room->name;;
        $room->address = $data['address'] ?: $room->address;
        $room->building = $data['building'] ?: $room->building;
        $room->floor = $data['floor'] ?: $room->floor;
        $room->status = $data['status'] ?: $room->status;
        $room->active = $data['active'] ?: $room->active;
        $room->destroyed = $data['destroyed'] ?: $room->destroyed;
        $room->nonexist = $data['nonexist'] ?: $room->nonexist;
        $room->capasity = $data['capasity'] ?: $room->capasity;
        $room->width = $data['width'] ?: $room->width;
        $room->height = $data['height'] ?: $room->height;
        $room->exams_capasity = $data['exams_capasity'] ?: $room->exams_capasity;
        $room->capasity_categ = $data['capasity_categ'] ?: $room->capasity_categ;
        $room->tm_owner = $data['name'] ?: $room->tm_owner;
        $room->dt = $data['dt'] ?: $room->dt;
        $room->stat_comm = $data['stat_comm'] ?: $room->stat_comm;
        $room->conf_id = $data['conf_id'] ?: $room->conf_id;
        $room->type = $data['type'] ?: $room->type;
        $room->use_id = $data['use_id'] ?: $room->use_id;
        $room->use_str = $data['use_str'] ?: $room->use_str;

        $room->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($room->toJson());
});



//$app->get("/room/{id}/item", function( Response $response, Request $request, $args){
//    $id = $args['id'];
//    $room = \App\Models\Rooms::find($id);
//    $ret = $room->items()->get()->toJson();
//    return $response->write(json_encode($ret, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
//}
//
//);


$app->get('/room/{id}/roombook', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Rooms::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($configuration->roombook()->get()->toJson());
});
