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
    try {
        $rooms = \App\Models\Rooms::with(['room_category:id,descr', 'config', 'room_use', 'tms'])->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($rooms->toJson());
});

$app->get('/rooms/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::with(['room_category:id,descr', 'config', 'room_use', 'tms'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
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
        $room->tm_owner = $data['tm_owner'];
        $room->stat_comm = $data['stat_comm'];
        $room->conf_id = $data['conf_id'];
        $room->category = $data['category'];
        $room->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($room->toJson());
});

$app->delete('/rooms/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
        $room->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
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
        $room->tm_owner = $data['tm_owner'] ?: $room->tm_owner;
        $room->stat_comm = $data['stat_comm'] ?: $room->stat_comm;
        $room->conf_id = $data['conf_id'] ?: $room->conf_id;
        $room->category = $data['category'] ?: $room->category;
        $room->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($room->toJson());
});

$app->get('/rooms/{id}/roomuse', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($room->room_use()->get()->toJson());
});

$app->delete('/rooms/{id}/roomuse/{uid}', function ($request, $response, $args) {
    $id = $args['id'];
    $uid = $args['uid'];
    try {
        $room = \App\Models\Rooms::find($id);
        $room->room_use()->detach($uid);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($room->room_use()->get()->toJson());
});

$app->post('/rooms/{id}/roomuse/{uid}', function ($request, $response, $args) {
    $uid = $args['uid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($id);
    $room->room_use()->attach($uid, $data);
    return $response->getBody()->write($room->room_use()->get()->toJson());
});

$app->put('/rooms/{id}/roomuse/{uid}', function ($request, $response, $args) {
    $uid = $args['uid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($id);
    $room->room_use()->updateExistingPivot($uid, $data);
    return $response->getBody()->write($room->room_use()->get()->toJson());
});

$app->get('/rooms/{id}/roombook', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($room->roombook()->get()->toJson());
});

$app->get('/rooms/{id}/items', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($room->items()->get()->toJson());
});

$app->delete('/rooms/{id}/items/{iid}', function ($request, $response, $args) {
    $id = $args['id'];
    $iid = $args['iid'];
    try {
        $room = \App\Models\Rooms::find($id);
        $room->items()->detach($iid);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($room->items()->get()->toJson());
});

$app->post('/rooms/{id}/items/{iid}', function ($request, $response, $args) {
    $iid = $args['iid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($id);
    $room->items()->attach($iid, $data);
    return $response->getBody()->write($room->items()->get()->toJson());
});

$app->put('/rooms/{id}/items/{iid}', function ($request, $response, $args) {
    $iid = $args['iid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($id);
    $room->items()->updateExistingPivot($iid, $data);
    return $response->getBody()->write($room->items()->get()->toJson());
});

$app->get('/rooms/{id}/tms', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($room->tms()->get()->toJson());
});

$app->delete('/rooms/{id}/tms/{tid}', function ($request, $response, $args) {
    $id = $args['id'];
    $tid = $args['tid'];
    try {
        $room = \App\Models\Rooms::find($id);
        $room->tms()->detach($tid);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($room->tms()->get()->toJson());
});

$app->post('/rooms/{id}/tms/{tid}', function ($request, $response, $args) {
    $tid = $args['tid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($id);
    $room->tms()->attach($tid, $data);
    return $response->getBody()->write($room->tms()->get()->toJson());
});

$app->put('/rooms/{id}/tms/{tid}', function ($request, $response, $args) {
    $tid = $args['tid'];
    $id = $args['id'];
    $data = $request->getParsedBody();
    $room = \App\Models\Rooms::find($id);
    $room->tms()->updateExistingPivot($tid, $data);
    return $response->getBody()->write($room->tms()->get()->toJson());
});

$app->get('/rooms/{id}/requests', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($room->requests()->get()->toJson());
});

$app->get('/rooms/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'periods:id,descr', 'admin'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->rooms()->get()->toJson());
});

$app->post('/rooms/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $requests = new \App\Models\Requests();
        $requests->req_dt = $data['req_dt'];
        $requests->user_id = $data['user_id'];
        $requests->descr = $data['descr'];
        $requests->period = $data['period'];
        $requests->ps_id = $data['ps_id'];
        $requests->class_use = $data['class_use'];
        $requests->links = $data['links'];
        $requests->fromdt = $data['fromdt'];
        $requests->todt = $data['todt'];
        $requests->protocol_id = $data['protocol_id'];
        $requests->req_status = $data['req_status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->date_index = $data['date_index'];
        $requests->admin = $data['admin'];
        $requests->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});

$app->delete('/rooms/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(200)->getBody()->write($requests->toJson());
});

$app->put('/rooms/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    print_r($data);
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->req_dt = $data['req_dt'] ?: $requests->req_dt;
        $requests->user_id = $data['user_id'] ?: $requests->user_id;
        $requests->descr = $data['descr'] ?: $requests->descr;
        $requests->period = $data['period'] ?: $requests->period;
        $requests->ps_id = $data['ps_id'] ?: $requests->ps_id;
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->links = $data['links'] ?: $requests->links;
        $requests->fromdt = $data['fromdt'] ?: $requests->fromdt;
        $requests->todt = $data['todt'] ?: $requests->todt;
        $requests->protocol_id = $data['protocol_id'] ?: $requests->protocol_id;
        $requests->req_status = $data['req_status'] ?: $requests->req_status;
        $requests->fromd = $data['fromd'] ?: $requests->fromd;
        $requests->tod = $data['tod'] ?: $requests->tod;
        $requests->date_index = $data['date_index'] ?: $requests->date_index;
        $requests->admin = $data['admin'] ?: $requests->admin;

        $requests->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/rooms/requests/users/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'periods:id,descr', 'admin'])->where('user_id', '=', $id)->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/rooms/requests/rooms/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['request_rooms:req_id,room _id', 'rooms'])->where('room_id', '=', $id)->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});



