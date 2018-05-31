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


$app->post('/roombook/copyday', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    //return $response->getBody()->write(json_encode($data));
    $fd = new DateTime($data['fromd']);

    $data['ntd'] = new DateTime($data['fromd']);
    $data['ntd']->add(new DateInterval('PT24H'));
    $roombooks = \App\Models\Requests::with('rooms', 'ps')
        ->whereBetween('fromd', [$data['fromd'], $data['ntd']])
        ->orWhere(function ($query) use ($data) {
            $query->Where('fromd', '<=', date('Y-m-d', strtotime($data['fromd'])))
                ->Where('tod', '>=', date('Y-m-d', strtotime($data['fromd'])));
        })->orWhereBetween('tod', [$data['ntd'], $data['fromd']])
        ->get();

    foreach ($roombooks as $roombook) {
        try {
            $newReq = new \App\Models\Requests();
            //$newReq->req_dt = $newReq['req_dt'];
            $newReq->user_id = $roombook['user_id'];
            $newReq->descr = $roombook['descr'];
            $newReq->period = $roombook['period'];
            $newReq->ps_id = $roombook['ps_id'];
            $newReq->class_use = $roombook['class_use'];
            $newReq->links = $roombook['links'];
            $newReq->protocol_id = $roombook['protocol_id'];
            $newReq->status = 3;
            $newReq->fromd = $data['tod'];
            $dtd = new DateTime($data['tod']);
            $dtd->add(new DateInterval('PT24H'));
            $newReq->tod = $dtd;
            //$newReq->admin = $roombook['admin'];
            $newReq->conf_id = $roombook['conf_id'];
            $newReq->save();

            foreach ($roombook['rooms'] as $rb) {
                //echo 'ok for';
                //print_r($rb);
//                echo " = \n";
//                print_r(date("l", $fd->getTimestamp()));
//                echo "--------------- \n";

                if ($rb['pivot']['date_index'] == date("w", $fd->getTimestamp())) {
//                    echo 'if ok';
                    $rb['pivot']['req_id'] = $newReq['id'];
                    $rb['pivot']['id'] = null;
                    $newReq->rooms()->attach($rb['pivot']['room_id'], $rb['pivot']->toArray());
//                    print_r($rb);
                }
            }
        } catch (PDOException $e) {
            $nr = $response->withStatus(404);
            $error = new ApiError();
            $error->setData($e->getCode(), $e->getMessage(), $data);
            return $nr->write($error->toJson());
        }
    }


    return $response->withStatus(201)->getBody()->write('ok');
});

