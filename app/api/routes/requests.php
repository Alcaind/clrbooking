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
    $requests = \App\Models\Requests::with(['users', 'periods', 'admin', 'room_use', 'ps', 'config', 'rooms', 'tm'])->get();
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users', 'periods', 'admin', 'room_use', 'ps', 'config', 'rooms', 'tm'])->find($id);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/config/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'config', 'periods', 'admin', 'ps', 'room_use', 'rooms', 'tm'])
            ->where('conf_id', '=', $id)
            ->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError('hello');
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/users/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'periods', 'admin', 'ps', 'room_use', 'rooms', 'tm'])
            ->where('user_id', '=', $id)
            ->where('conf_id', '=', 1)
            ->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/users/{id}/config/{cid}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    $cid = $args['cid'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'periods', 'admin', 'ps', 'room_use', 'rooms', 'tm'])
            ->where('user_id', '=', $id)
            ->where('conf_id', '=', $cid)
            ->get();
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
        $requests->tm_id = $data['tm_id'];
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
    $response = $next($request, $response);
    $res = null;
    //$data = $request->getAttributes()['routeInfo'][2];
    //$data = $request->getParsedBody();
    $data = $response->getBody();
    print_r($data);

    $roombook = \App\Models\Requests::with('rooms')
        ->where('fromd', '<=', $data['fromd'])
        ->where('fromd', '>=', $data['fromd'])
//        ->where('room_id', '=', $args['rid'])
        ->get();

    $days = array('Κυριακή', 'Δευτερα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκέυη', 'Saturday');

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
                    $error->setData(818, 'Η ώρα λήξης πρέπει να είναι μεγαλύτερα από την ώρα έναρξης.');
                    return $nr->write($error->toJson());
                }

                $tmpStrFD = explode('T', $data['fromd'])[0];
                $tmpStrTD = explode('T', $data['tod'])[0];
                $tmpStrFT = explode(".", explode('T', $reqRoom['fromt'])[1])[0];
                $tmpStrTT = explode(".", explode('T', $reqRoom['tot'])[1])[0];

                if (($tmpStrFD >= $book['fromd'] || $tmpStrTD >= $book['fromd']) && $tmpStrFD <= $book['tod']) {
                    if ($room->pivot->fromt >= $tmpStrFT && $room->pivot->fromt <= $tmpStrTT) {

                        if ($room->pivot->room_id == $reqRoom['id'] && $room->pivot->date_index == $reqRoom['date_index']) {
                            if ($data['status'] == 0) {
                                $uMessage = new \App\Models\usersRequests();
                                $uMessage->from_user = $data['user_id'];
                                $uMessage->to_users = $book['user_id'];
                                $uMessage->comments = 'Αίτημα δεύσμευσης για την αίθουσα ' . $room['name'] . ', ημέρα ' . $days[$room->pivot->date_index] . ' και ώρα ' . $room->pivot->fromt . '-' . $room->pivot->tot . '. Ευχαριστώ.';
                                $uMessage->rr_id = $data['id'] ?: '';
                                $uMessage->status = 0;
                                $uMessage->save();
                            } else {
                                $nr = $response->withStatus(417);
                                $error = new ApiError();
                                $req = \App\Models\Rooms::find($reqRoom['id'])->get();
                                $error->setData(816, 'Class ' . $req->name . ' is already assigned to book.', $room);
                                return $nr->write($error->toJson());
                            }
                        }
                        if (property_exists($room->pivot, 'teacher'))
                            if ($room->pivot->teacher == $reqRoom['teacher']) {
                                $nr = $response->withStatus(417);
                                $error = new ApiError();
                                $error->setData(815, 'Ο καθηγητής ' . \App\Models\Users::find($room->pivot->teacher)->user . ' διδάσκει στην αίθουσα' . $room . '.');
                                return $nr->write($error->toJson());
                            }
                    }
                }
            }
        }
    }
    return $response;
};


$app->post('/requests/userrequest', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    //header("Content-Type: html/text");
    $data = $request->getParsedBody();
    $myData = $request->getParsedBody();
    $errors = array();
    try {
        $requests = new \App\Models\Requests();
        $requests->req_dt = $data['req_dt'];
        $requests->user_id = $data['user_id'];
        $requests->descr = $data['descr'] ?: '';
        $requests->period = $data['period'] ?: '';
        $requests->ps_id = $data['ps_id'] ?: null;
        $requests->class_use = $data['class_use'] ?: '';
        //$requests->links = $data['links']?:'';
        $requests->status = $data['status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->conf_id = $data['conf_id'];
        $requests->tm_id = $data['tm_id'];
        $requests->save();

        $data['id'] = $requests['id'];

        $roombook = \App\Models\Requests::with('rooms')
//            /*->whereHas('rooms', function ($query)  use ($data) {
//                /*$query->where('conf_id', '=', property_exists('$data', 'conf_id') ? $data['conf_id'] : json_decode(\App\Models\Config::where('status', '=', 1)*/
//                $rm = array();
//               // $di = array();
//                foreach ($data['rooms'] as $reqRoom) {
//                    array_push($rm, $reqRoom['id']);
//                    //array_push($di, $reqRoom['date_index']);
//                    }
//                $query->where('id', 'in', $rm);
//            })
            ->WhereBetween('fromd', [$data['fromd'], $data['tod']])
            ->orWhereBetween('tod', [$data['fromd'], $data['tod']])
            //->where('date_index','=',$data[])
            ->where('conf_id', '=', 1)
            ->where('status', '=', 1)
            ->get();

        foreach ($roombook as $book) {
            foreach ($book->rooms()->get() as $room) {

                $cntRoom = 0;
                foreach ($data['rooms'] as $reqRoom) {
                    $fromt = new DateTime($myData['pivot'][$cntRoom]['fromt']);
                    $tot = new DateTime($myData['pivot'][$cntRoom++]['tot']);
                    if ($data['status'] == 3) continue;
                    if ($fromt->diff($tot)->invert == 1) {
                        $nr = $response->withStatus(418);
                        $error = new ApiError();
                        $requests->delete();
                        $error->setData(818, 'Η ώρα λήξης πρέπει να είναι μεγαλύτερη από την ώρα έναρξης.', $requests);
                        return $nr->write($error->toJson());
                    }

                    $tmpStrFD = explode('T', $data['fromd'])[0];
                    $tmpStrTD = explode('T', $data['tod'])[0];
//                    $tmpStrFT = explode(".", explode('T', $reqRoom['fromt'])[1])[0];
//                    $tmpStrTT = explode(".", explode('T', $reqRoom['tot'])[1])[0];


                    if (($tmpStrFD >= $book['fromd'] || $tmpStrTD > $book['fromd']) && $tmpStrFD < $book['tod']) {
                        if ((new DateTime($room->pivot->tot) > $fromt && new DateTime($room->pivot->tot) < $tot) ||
                            (new DateTime($room->pivot->fromt) > $fromt && new DateTime($room->pivot->fromt) < $tot) ||
                            (new DateTime($room->pivot->fromt) == $fromt) ||
                            (new DateTime($room->pivot->tot) > $tot && new DateTime($room->pivot->fromt) < $tot) ||
                            (new DateTime($room->pivot->fromt) < $fromt && new DateTime($room->pivot->tot) > $tot)) {
                            if ($room->pivot->room_id == $reqRoom['id'] && $room->pivot->date_index == $reqRoom['date_index']) {
                                if ($data['status'] == 0) {
                                    $uMessage = new \App\Models\usersRequests();
                                    $uMessage->from_user = $data['user_id'];
                                    $uMessage->to_users = $book['user_id'];
                                    $uMessage->comments = 'Αίτημα δεύσμευσης για την αίθουσα ' . $room['name'] . ', ημέρα ' . $room->pivot->date_index . ' και ώρα ' . $room->pivot->fromt . '-' . $room->pivot->tot . '. Ευχαριστώ.';
                                    $uMessage->rr_id = $data['id'] ?: '';
                                    $uMessage->status = 0;
                                    $uMessage->save();
                                }

                                $tt = new stdClass();
                                $tt->fromRoom = $reqRoom;
                                $tt->toRoom = $room;

                                array_push($errors, $tt);

                            }
                            if (property_exists($room->pivot, 'teacher'))
                                if ($room->pivot->teacher == $reqRoom['teacher']) {

                                    array_push($errors, \App\Models\Users::find($room->pivot->teacher)->user);
                                    /*$nr = $response->withStatus(417);
                                    $error = new ApiError();
                                    $error->setData(815, 'Teacher ' . \App\Models\Users::find($room->pivot->teacher)->user . ' is already assigned to another room.', $room);
                                    return $nr->write($error->toJson());*/
                                }
                        }
                    }
                }
            }
        }

        if (sizeof($errors) == 0 && $data['status'] != 3) {
            $requests->status = 1;
            $requests->save();
        }

        //$attachArray = array();
        //$deletedRows = \App\Models\RoomBook::where('req_id', '=', $requests['id'])->delete();
        for ($i = 0; $i < sizeof($data['pivot']); $i++) {
            //$attachArray["'" + $data['rooms'][$i]['id'] + "'"] = $data['pivot'][$i];
            $rb = new \App\Models\RoomBook();
            $rb->req_id = $requests['id'];
            $rb->room_id = $data['rooms'][$i]['id'];
            $rb->comment = $data['pivot'][$i]['comment'];
            $rb->teacher = $data['pivot'][$i]['teacher'];
            $rb->fromt = $data['pivot'][$i]['fromt'];
            $rb->tot = $data['pivot'][$i]['tot'];
            $rb->date_index = $data['pivot'][$i]['date_index'];
            $rb->save();
        }
        //$requests->rooms()->delete() attach($attachArray);

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage(), $data);
        return $nr->write($error->toJson());
    }
    if (sizeof($errors) != 0) {
        $nr = $response->withStatus(417);
        $error = new ApiError();
        //$req = \App\Models\Rooms::find($reqRoom['id'])->get();
        $error->setData(816, 'Σφάλματα αίτησης ', $errors);
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});//->add($checkUserRequestRules);

$app->put('/requests/userrequest', function (Request $request, Response $response) {

    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $myData = $request->getParsedBody();
    $errors = array();
    $roombook = \App\Models\Requests::with('rooms', 'tm')
//            /*->whereHas('rooms', function ($query)  use ($data) {
//                /*$query->where('conf_id', '=', property_exists('$data', 'conf_id') ? $data['conf_id'] : json_decode(\App\Models\Config::where('status', '=', 1)*/
//                $rm = array();
//               // $di = array();
//                foreach ($data['rooms'] as $reqRoom) {
//                    array_push($rm, $reqRoom['id']);
//                    //array_push($di, $reqRoom['date_index']);
//                    }
//                $query->where('id', 'in', $rm);
//            })
        ->WhereBetween('fromd', [$data['fromd'], $data['tod']])
        ->orWhereBetween('tod', [$data['fromd'], $data['tod']])
        //->where('date_index','=',$data[])
        ->where('conf_id', '=', 1)
        ->where('status', '=', 1)
        ->where('id', '!=', $data['id'])
        ->get();
    try {
        //$requests = new \App\Models\Requests();


        $requests = \App\Models\Requests::find($data['id']);

        if ($data['status'] == 3) {
            if ($requests->status == 0) {
                $urs = \App\Models\usersRequests::where('rr_id', $data['id'])->get();
                foreach ($urs as $ur) {
                    $ur->delete();
                }
            }
        }

        foreach ($roombook as $book) {
            foreach ($book->rooms()->get() as $room) {

                $cntRoom = 0;
                foreach ($data['rooms'] as $reqRoom) {
                    $fromt = new DateTime($myData['pivot'][$cntRoom]['fromt']);
                    $tot = new DateTime($myData['pivot'][$cntRoom++]['tot']);

                    if ($data['status'] == 3) continue;
                    if ($fromt->diff($tot)->invert == 1) {
                        $nr = $response->withStatus(418);
                        $error = new ApiError();
                        $requests->delete();
                        $error->setData(818, 'Η ώρα λήξης πρέπει να είναι μεγαλύτερη από την ώρα έναρξης.', $requests);
                        return $nr->write($error->toJson());
                    }

                    $tmpStrFD = explode('T', $data['fromd'])[0];
                    $tmpStrTD = explode('T', $data['tod'])[0];
//                    $tmpStrFT = explode(".", explode('T', $reqRoom['fromt'])[1])[0];
//                    $tmpStrTT = explode(".", explode('T', $reqRoom['tot'])[1])[0];


                    if (($tmpStrFD >= $book['fromd'] || $tmpStrTD > $book['fromd']) && $tmpStrFD < $book['tod']) {
                        if ((new DateTime($room->pivot->tot) > $fromt && new DateTime($room->pivot->tot) < $tot) ||
                            (new DateTime($room->pivot->tot) > $tot && new DateTime($room->pivot->fromt) < $tot) ||
                            (new DateTime($room->pivot->fromt) > $fromt && new DateTime($room->pivot->fromt) < $tot) ||
                            (new DateTime($room->pivot->fromt) == $fromt) ||
                            (new DateTime($room->pivot->fromt) < $fromt && new DateTime($room->pivot->tot) > $tot)) {
                            if ($room->pivot->room_id == $reqRoom['id'] && $room->pivot->date_index == $reqRoom['date_index']) {
                                if ($data['status'] == 0 && $book['id'] !== $data['id']) {
                                    $uMessage = new \App\Models\usersRequests();
                                    $uMessage->from_user = $data['user_id'];
                                    $uMessage->to_users = $book['user_id'];
                                    $uMessage->comments = 'Αίτημα δεύσμευσης για την αίθουσα ' . $room['name'] . ', ημέρα ' . $room->pivot->date_index . ' και ώρα ' . $room->pivot->fromt . '-' . $room->pivot->tot . '. Ευχαριστώ.';
                                    $uMessage->rr_id = $data['id'] ?: '';
                                    $uMessage->status = 0;
                                    $uMessage->save();
                                }

                                $tt = new stdClass();
                                $tt->fromRoom = $reqRoom;
                                $tt->toRoom = $room;

                                array_push($errors, $tt);

                            }
                            if (property_exists($room->pivot, 'teacher'))
                                if ($room->pivot->teacher == $reqRoom['teacher']) {

                                    array_push($errors, \App\Models\Users::find($room->pivot->teacher)->user);
                                    /*$nr = $response->withStatus(417);
                                    $error = new ApiError();
                                    $error->setData(815, 'Teacher ' . \App\Models\Users::find($room->pivot->teacher)->user . ' is already assigned to another room.', $room);
                                    return $nr->write($error->toJson());*/
                                }
                        }
                    }
                }
            }
        }

        if (sizeof($errors) == 0 && $data['status'] != 3) {
            $requests->status = 1;
            //$requests->save();
        }

        //$attachArray = array();
        $deletedRows = \App\Models\RoomBook::where('req_id', '=', $requests['id'])->delete();
        for ($i = 0; $i < sizeof($data['pivot']); $i++) {
            //$attachArray["'" + $data['rooms'][$i]['id'] + "'"] = $data['pivot'][$i];
            $rb = new \App\Models\RoomBook();
            $rb->req_id = $requests['id'];
            $rb->room_id = $data['rooms'][$i]['id'];
            $rb->comment = $data['pivot'][$i]['comment'];
            $rb->teacher = $data['pivot'][$i]['teacher'];
            $rb->fromt = $data['pivot'][$i]['fromt'];
            $rb->tot = $data['pivot'][$i]['tot'];
            $rb->date_index = $data['pivot'][$i]['date_index'];
            $rb->save();
        }
        //$requests->rooms()->delete() attach($attachArray);

        $requests->req_dt = $data['req_dt'];
        $requests->user_id = $data['user_id'];
        $requests->descr = $data['descr'] ?: '';
        $requests->period = $data['period'] ?: '';
        $requests->ps_id = $data['ps_id'] ?: null;
        $requests->class_use = $data['class_use'] ?: '';
        //$requests->links = $data['links']?:'';
        $requests->status = $data['status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->conf_id = $data['conf_id'];
        $data['id'] = $requests['id'];
        $requests->status = $data['status'];
        $requests->tm_id = $data['tm_id'];
        $requests->save();

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage(), $data);
        return $nr->write($error->toJson());
    }
    if (sizeof($errors) != 0) {
        $nr = $response->withStatus(417);
        $error = new ApiError();
        $error->setData(816, 'Σφάλματα αίτησης ', $errors);
        return $nr->write($error->toJson());
    }

    return $response->withStatus(201)->getBody()->write($requests->toJson());

    /*header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $requests = \App\Models\Requests::find($data['id']);
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
        for ($i = 0; $i < sizeof($data['rooms']); $i++) {
            $attachArray[$data['rooms'][$i]['room_id']] = $data['pivot'][$i];
        }
        $requests->rooms()->sync($attachArray);
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());*/
});//->add($checkUserRequestRules);

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
        $requests->tm_id = $data['tm_id'] ?: $requests->tm_id;
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
