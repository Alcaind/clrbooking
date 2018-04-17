<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:24
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \App\Models\ApiError as ApiError;


$app->get('/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $requests = \App\Models\Requests::with(['users', 'periods:id,descr', 'admin', 'room_use:id,synt', 'ps', 'config', 'rooms'])->get();
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users', 'periods:id,descr', 'admin', 'room_use:id,synt', 'ps', 'config', 'rooms'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/users/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'periods:id,descr', 'admin', 'ps', 'room_use', 'rooms'])->where('user_id', '=', $id)->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/rooms/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $room = \App\Models\Rooms::find($id);
        $requests = $room->requests()->join('users AS admin', 'requests.admin', '=', 'admin.id')
            ->get();
        /*$requests = $this->container->db->table('requests')
            ->join('request_rooms', 'requests.id', '=', 'request_rooms.req_id')
            ->join('users AS admin', 'requests.admin', '=', 'admin.id')
            ->where('request_rooms.room_id', '=', $id)
            ->select('requests.*', 'admin.*')
            ->get();*/
        //$requests = \App\Models\Requests::with(['request_rooms:req_id,room _id', 'rooms','admin'])->where('room_id', '=', $id)->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$checkRequestRules = function ($request, $response, $next) {
    //$response->getBody()->write('BEFORE');
    $res = null;
    $data = $request->getParsedBody();
    $res = \App\Models\Requests::where('fromd', '=', $data['fromd'])->get();
    if (sizeof($res) > 0) {
        $nr = $response->withStatus(417);
        $error = new ApiError();
        $error->setData(815, 'Already Booked for ' . $data['fromd'] . ' day.');
        return $nr->write($error->toJson());
    }

    $response = $next($request, $response);
    //$response->getBody()->write('AFTER');
    return $response;
};

$app->post('/requests', function (Request $request, Response $response) {
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
        $requests->protocol_id = $data['protocol_id'];
        $requests->status = $data['status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->admin = $data['admin'];
        $requests->conf_id = $data['conf_id'];
        $requests->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});


$checkUserRequestRules = function ($request, $response, $next) {
    $res = null;
    //$data = $request->getAttributes()['routeInfo'][2];
    $data = $request->getParsedBody();
    //print_r($data);

    $roombook = \App\Models\Requests::with('rooms')
        ->where('fromd', '<=', $data['fromd'])
        ->where('fromd', '>=', $data['fromd'])
//        ->where('room_id', '=', $args['rid'])
        ->get();

    //$response->getBody()->write($roombook->toJson());
    foreach ($roombook as $book) {
        foreach ($book->rooms()->get() as $room) {
            foreach ($data['rooms'] as $reqRoom) {
                $fromt = new DateTime($reqRoom['fromt']);
                $tot = new DateTime($reqRoom['tot']);
                //print_r( $fromt->diff($tot)->invert);
                if ($fromt->diff($tot)->invert == 1) {
                    $nr = $response->withStatus(418);
                    $error = new ApiError();
                    $error->setData(818, 'To time must be greater than from time.');
                    return $nr->write($error->toJson());
                }

                $tmpStrFD = explode('T', $data['fromd'])[0];
                $tmpStrTD = explode('T', $data['tod'])[0];
                $tmpStrFT = explode(".", explode('T', $reqRoom['fromt'])[1])[0];
                $tmpStrTT = explode(".", explode('T', $reqRoom['tot'])[1])[0];


                if (($tmpStrFD >= $book['fromd'] || $tmpStrTD >= $book['fromd']) && $tmpStrFD <= $book['tod']) {
                    if ($room->pivot->fromt >= $tmpStrFT && $room->pivot->fromt <= $tmpStrTT) {

                        if ($room->pivot->room_id == $reqRoom['id'] && $room->pivot->date_index == $reqRoom['date_index']) {
                            $nr = $response->withStatus(417);
                            $error = new ApiError();
                            $req = \App\Models\Rooms::find($reqRoom['id'])->get();
                            $error->setData(816, 'Class ' . $req->name . ' is already assigned to book.', $room);
                            return $nr->write($error->toJson());
                        }
                        if ($room->pivot->teacher == $reqRoom['teacher']) {
                            $nr = $response->withStatus(417);
                            $error = new ApiError();
                            $error->setData(815, 'Teacher ' . \App\Models\Users::find($room->pivot->teacher)->user . ' is already assigned to another room.', $room);
                            return $nr->write($error->toJson());
                        }
                    }
                }
            }
        }
    }

    $response = $next($request, $response);
    return $response;
};


$app->post('/requests/userrequest', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $requests = new \App\Models\Requests();
        $requests->req_dt = $data['req_dt'];
        $requests->user_id = $data['user_id'];
        $requests->descr = $data['descr'] ?: '';
        $requests->period = $data['period'] ?: '';
        $requests->ps_id = $data['ps_id'];
        $requests->class_use = $data['class_use'] ?: '';
        //$requests->links = $data['links']?:'';
        $requests->status = $data['status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->conf_id = $data['conf_id'];
        $requests->save();

        $attachArray = array();
        for ($i = 0; $i < sizeof($data['pivot']); $i++) {
            $attachArray["'" + $data['rooms'][$i]['id'] + "'"] = $data['pivot'][$i];
        }
        $requests->rooms()->attach($attachArray);

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
})->add($checkUserRequestRules);

$app->put('/requests/userrequest', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $requests = new \App\Models\Requests();
        $requests->req_dt = $data['req_dt'] ?: $requests->req_dt;
        $requests->user_id = $data['user_id'] ?: $requests->user_id;
        $requests->descr = $data['descr'] ?: $requests->descr;
        $requests->period = $data['period'] ?: $requests->period;
        $requests->ps_id = $data['ps_id'] ?: $requests->ps_id;
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->status = $data['status'] ?: $requests->status;
        $requests->fromd = $data['fromd'] ?: $requests->fromd;
        $requests->tod = $data['tod'] ?: $requests->tod;
        $requests->conf_id = $data['conf_id'] ?: $requests->conf_id;
        $requests->save();

        $attachArray = array();
        for ($i = 0; $i < sizeof($data[rooms]); $i++) {
            $attachArray[$data[rooms][$i]['room_id']] = $data[rooms][$i];
        }
        $requests->rooms()->sync($attachArray);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});

$app->delete('/requests/{id}', function ($request, $response, $args) {
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

$app->put('/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->req_dt = $data['req_dt'] ?: $requests->req_dt;
        $requests->user_id = $data['user_id'] ?: $requests->user_id;
        $requests->descr = $data['descr'] ?: $requests->descr;
        $requests->period = $data['period'] ?: $requests->period;
        $requests->ps_id = $data['ps_id'] ?: $requests->ps_id;
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->links = $data['links'] ?: $requests->links;
        $requests->protocol_id = $data['protocol_id'] ?: $requests->protocol_id;
        $requests->status = $data['status'] ?: $requests->status;
        $requests->fromd = $data['fromd'] ?: $requests->fromd;
        $requests->tod = $data['tod'] ?: $requests->tod;
        $requests->admin = $data['admin'] ?: $requests->admin;
        $requests->conf_id = $data['conf_id'] ?: $requests->conf_id;
        $requests->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$checkReqRooms = function ($request, $response, $next) {
    $res = null;
    $args = $request->getAttributes()['routeInfo'][2];
    $req = \App\Models\Requests::with('rooms')->find($args['id']);
    $data = $request->getParsedBody();

    $roombook = \App\Models\Requests::with('rooms')
        ->where('fromd', '<=', $req->fromd)
        ->where('fromd', '>=', $req->fromd)
//        ->where('room_id', '=', $args['rid'])
        ->get();

    //$response->getBody()->write($roombook->toJson());
    foreach ($roombook as $book) {
        foreach ($book->rooms()->get() as $room) {
            $fromt = new DateTime($data['fromt']);
            $tot = new DateTime($data['tot']);
            //print_r( $fromt->diff($tot)->invert);
            if ($fromt->diff($tot)->invert == 1) {
                $nr = $response->withStatus(418);
                $error = new ApiError();
                $error->setData(818, 'To time must be greater than from time.');
                return $nr->write($error->toJson());
            }

            if (($req->fromd >= $book['fromd'] || $req->tod >= $book['fromd']) && $req->fromd <= $book['tod']) {
                if ($room->pivot->fromt >= $book['fromt'] && $room->pivot->fromt <= $book['tot']) {

                    if ($room->pivot->room_id == $args['rid'] && $room->pivot->date_index == $data['date_index']) {
                        $nr = $response->withStatus(417);
                        $error = new ApiError();
                        $error->setData(816, 'Class ' . \App\Models\Rooms::find($args['rid'])->name . ' is already assigned to book.');
                        return $nr->write($error->toJson());
                    }
                    if ($room->pivot->teacher == $data['teacher']) {
                        $nr = $response->withStatus(417);
                        $error = new ApiError();
                        $error->setData(815, 'Teacher ' . \App\Models\Users::find($room->pivot->teacher)->user . ' is already assigned to another room.');
                        return $nr->write($error->toJson());
                    }
                }
            }
        }
    }

    $response = $next($request, $response);
    return $response;
};

$app->post('/requests/{id}/rooms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $requests = \App\Models\Requests::find($id);
    $requests->rooms()->attach($rid, $data);
    return $response->getBody()->write($requests->rooms()->get()->toJson());
})->add($checkReqRooms);

$app->put('/requests/{id}/rooms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    $data = $request->getParsedBody();
    $requests = \App\Models\Requests::find($id);
    $requests->rooms()->updateExistingPivot($rid, $data);
    return $response->getBody()->write($requests->rooms()->get()->toJson());
})->add($checkReqRooms);

$app->delete('/requests/{id}/rooms/{rid}', function ($request, $response, $args) {
    $id = $args['id'];
    $rid = $args['rid'];
    \App\Models\RoomBook::find($rid)->delete();
    return $response->getBody()->write(\App\Models\Requests::find($id)->rooms()->get()->toJson());
});

$app->get('/requests/{id}/rooms', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->rooms()->get()->toJson());
});

$app->get('/requests/{id}/guests', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->guests()->get()->toJson());
});
