<?php
/**
 * Created by PhpStorm.
 * User: ifigeneia
 * Date: 24/11/2017
 * Time: 4:32 μμ
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Illuminate\Database\QueryException as QException;
use \App\Models\ApiError as ApiError;

$app->get('/usersrequests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $usreq = \App\Models\usersRequests::with(['roombook', 'fromuser', 'tousers'])->get();
    return $response->getBody()->write($usreq->toJson());
});


$app->get('/usersrequests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];

    $tms = array();
    $usr = \App\Models\Users::with(['tm'])->find($id);

    foreach ($usr->tm as $tm) {
        //if ($tm['config_id'] == $data['config_id'])
        array_push($tms, $tm['id']);
    }

    $users = \App\Models\TmUsers::whereIn('tm_id', $tms)->get()->toArray();
    $ju = array();
    foreach ($users as $u) {
        //if ($tm['config_id'] == $data['config_id'])
        array_push($ju, $u['user_id']);
    }
    try {
        $usreq = \App\Models\usersRequests::with(['roombook', 'fromuser', 'tousers'])
            ->whereIn('to_users', $ju)
            ->where('status', '=', 0)
            ->get();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($usreq->toJson());
});

$app->post('/usersrequests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    try {
        $usreq = new \App\Models\usersRequests();
        $usreq->from_user = $data['from_user'];
        $usreq->to_users = $data['to_users'];
        $usreq->comments = $data['comments'];
        $usreq->rr_id = $data['rr_id'];
        $usreq->to_comment = $data['to_comment'];
        $usreq->confirm = $data['confirm'];
        $usreq->status = $data['status'];
        $usreq->save();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($usreq->toJson());
});

$app->delete('/usersrequests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $usreq = \App\Models\usersRequests::find($id);
        $usreq->delete();
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($usreq->toJson());
});

$app->put('/usersrequests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();
    $req = \App\Models\Requests::find($data['rr_id']);

    $roombook = \App\Models\Requests::with('rooms')
        ->WhereBetween('fromd', [$req['fromd'], $req['tod']])
        ->orWhereBetween('tod', [$req['fromd'], $req['tod']])
        ->where('conf_id', '=', 1)
        ->where('status', '=', 1)
        //->max('priority as maxpriority')
        ->get();
    //print_r($roombook);


    try {
        $usreq = \App\Models\usersRequests::find($id);
        $usreq->from_user = $data['from_user'] ?: $usreq->from_user;
        $usreq->to_users = $data['to_users'] ?: $usreq->to_users;
        $usreq->comments = $data['comments'] ?: $usreq->comments;
        $usreq->rr_id = $data['rr_id'] ?: $usreq->rr_id;
        $usreq->to_comment = $data['to_comment'] ?: $usreq->to_comment;
        $usreq->confirm = $data['confirm'] ?: $usreq->confirm;
        $usreq->status = $data['status'];
        $usreq->rb_id = $data['rb_id'] ?: '';
        $usreq->save();

        $totalPending = \App\Models\usersRequests::where('rr_id', '=', $data['rr_id'])->get();
        $confirmed = 0;
        $canceled = 0;
        for ($i = 0; $i < $totalPending->count(); $i++) {
            if ($totalPending[$i]->status == 1) $confirmed++;
            if ($totalPending[$i]->status == -1) $canceled++;
        }
        if ($totalPending->count() == $confirmed) {
            $req->status = 1;
            //$req->priority = $roombook->maxpriority+1;
            $req->save();

            $reqIds = [];
            foreach ($totalPending as $ur) {
                $tmp = \App\Models\usersRequests::find($ur->id);
                $tmp->delete();
                $rb = \App\Models\RoomBook::find($ur->rb_id);
                $rb->status = -1;
                $rb->save();
                /*if ($req[0]['rooms_count'] == 0) {
                    $tt = \App\Models\Requests::with('rooms')->find($rb->req_id);
                    $tt->priority= -1;
                    $tt->save();
                }*/
                array_push($reqIds, $rb->req_id);
            }
            $mp = \App\Models\Requests::whereIn('id', $reqIds)->max('priority');
            echo "\n " . $req->priority . " <= " . $mp . "\n";

            if ($req->priority <= $mp) {
                echo "\n in if \n";
                $req->priority = $mp + 1;
                $req->save();
            }
        } elseif ($totalPending->count() == ($confirmed + $canceled)) {
            $req = \App\Models\Requests::find($data['rr_id']);
            $req->status = 4;
            $req->save();
        }
    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    return $response->getBody()->write($totalPending->toJson());
});


$app->get('/pendingrequests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $usreq = \App\Models\usersRequests::with(['roombook', 'fromuser', 'tousers'])
            ->where('rr_id', '=', $id)->get();

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }
    // print_r($usreq);
    return $response->getBody()->write($usreq->toJson());
});
