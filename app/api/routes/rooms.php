<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;

$app->get('/rooms', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $rooms = \App\Models\Rooms::with(['room_category:id,descr', 'config', 'room_use'])->get();
    return $response->getBody()->write($rooms->toJson());
});

$app->get('/rooms/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::with(['room_category:id,descr', 'config', 'room_use'])->find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($room->toJson());
});


$app->post('/rooms', function (Request $request, Response $response) {
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
        $room->xoros = $data['xoros'];
        $room->exams_capasity = $data['exams_capasity'];
        $room->capasity_categ = $data['capasity_categ'];
        $room->tm_owner = $data['name'];
        $room->stat_comm = $data['stat_comm'];
        $room->conf_id = $data['conf_id'];
        $room->category = $data['category'];
        $room->use_id = $data['use_id'];
        $room->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($room->toJson());
});

$app->delete('/rooms/{id}', function ($request, $response, $args) {
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

$app->put('/rooms/{id}', function ($request, $response, $args) {
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
        $room->xoros = $data['xoros'] ?: $room->xoros;
        $room->exams_capasity = $data['exams_capasity'] ?: $room->exams_capasity;
        $room->capasity_categ = $data['capasity_categ'] ?: $room->capasity_categ;
        $room->tm_owner = $data['name'] ?: $room->tm_owner;
        $room->stat_comm = $data['stat_comm'] ?: $room->stat_comm;
        $room->conf_id = $data['conf_id'] ?: $room->conf_id;
        $room->category = $data['category'] ?: $room->category;
        $room->use_id = $data['use_id'] ?: $room->use_id;
        $room->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($room->toJson());
});


$app->get('/rooms/{id}/usages', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::with(['room_use'])->find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($room->toJson());
});

$app->post('/rooms/{id}/usages', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $id = $args['id'];
    $room = \App\Models\Rooms::find($id);
    try {
        $room->room_use()->attach($data);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($room->toJson());
});

$app->delete('/rooms/{rid}/usages/{uid}', function ($request, $response, $args) {
    $rid = $args['rid'];
    $uid = $args['uid'];
    try {
        $room = \App\Models\Rooms::find($rid);
        $room->room_use()->detach($uid);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($room->toJson());
});
$app->post('/rooms/{rid}/usages/{uid}', function ($request, $response, $args) {
    $uid = $args['uid'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($rid);
    $room->room_use()->attach($uid, $data);
    return $response->getBody()->write($room->room_use()->get()->toJson());
});

$app->put('/rooms/{rid}/usages/{uid}', function ($request, $response, $args) {
    $uid = $args['uid'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($rid);
    $room->room_use()->updateExistingPivot($uid, $data);
    return $response->getBody()->write($room->room_use()->get()->toJson());
});

$app->get('/rooms/{id}/roombook', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Rooms::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($configuration->roombook()->get()->toJson());
});


$app->get('/rooms/{id}/items', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $item = \App\Models\Rooms::with('items')->find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($item->toJson());
});

$app->post('/rooms/{id}/items', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $id = $args['id'];
    $room = \App\Models\Rooms::find($id);
    try {
        $room->items()->attach($data);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from POST'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($room->toJson());
});

$app->delete('/rooms/{rid}/items/{iid}', function ($request, $response, $args) {
    $rid = $args['rid'];
    $iid = $args['iid'];
    try {
        $room = \App\Models\Rooms::find($rid);
        $room->items()->detach($iid);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage('Error from delete'));
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($room->items()->get()->toJson());
});
$app->post('/rooms/{rid}/items/{iid}', function ($request, $response, $args) {
    $iid = $args['iid'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($rid);
    $room->items()->attach($iid, $data);
    return $response->getBody()->write($room->items()->get()->toJson());
});

$app->put('/rooms/{rid}/items/{iid}', function ($request, $response, $args) {
    $iid = $args['iid'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($rid);
    $room->items()->updateExistingPivot($iid, $data);
    return $response->getBody()->write($room->items()->get()->toJson());
});

$app->get('/rooms/{id}/tms', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $configuration = \App\Models\Rooms::find($id);
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($configuration->tms()->get()->toJson());
});