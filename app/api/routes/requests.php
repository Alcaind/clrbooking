<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:24
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $requests = \App\Models\Requests::with(['users:id,user'])->get();

    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users:id,user'])->find($id);
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($requests->toJson());
});

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
        $requests->teacher = $data['teacher'];
        $requests->class_use = $data['class_use'];
        $requests->links = $data['links'];
        $requests->fromdt = $data['fromdt'];
        $requests->todt = $data['todt'];
        $requests->protocol_id = $data['protocol_id'];
        $requests->req_status = $data['req_status'];
        $requests->fromd = $data['fromd'];
        $requests->tod = $data['tod'];
        $requests->date_index = $data['date_index'];
        $requests->save();
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
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});

$app->delete('/requests/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::find($id);
        $requests->delete();
    } catch (\Exception $e) {
        // do task when error
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->withStatus(200)->getBody()->write($requests->toJson());
});

$app->put('/requests/{id}', function ($request, $response, $args) {
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
        $requests->teacher = $data['teacher'] ?: $requests->teacher;
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->links = $data['links'] ?: $requests->links;
        $requests->fromdt = $data['fromdt'] ?: $requests->fromdt;
        $requests->todt = $data['todt'] ?: $requests->todt;
        $requests->protocol_id = $data['protocol_id'] ?: $requests->protocol_id;
        $requests->req_status = $data['req_status'] ?: $requests->req_status;
        $requests->fromd = $data['fromd'] ?: $requests->fromd;
        $requests->tod = $data['tod'] ?: $requests->tod;
        $requests->date_index = $data['date_index'] ?: $requests->date_index;
        $requests->save();
    } catch (\Exception $e) {
        return $response->withStatus(404)->getBody()->write($e->getMessage());
    }
    return $response->getBody()->write($requests->toJson());
});