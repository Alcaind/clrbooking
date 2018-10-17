<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:11
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
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

$app->get('/publicroombook/{id}', function (Request $request, Response $response, $args) {
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
    $roombook = \App\Models\Requests::with('rooms', 'ps', 'tm')
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
    $roombook = \App\Models\Requests::with('rooms', 'ps', 'tm')
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
    $roombook = \App\Models\Requests::with('rooms', 'ps', 'tm')
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
    $dd = new DateTime($data['dd']);

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
                if ($rb['pivot']['date_index'] == date("w", $fd->getTimestamp())) {
                    $rb['pivot']['req_id'] = $newReq['id'];
                    $rb['pivot']['id'] = null;
                    $newReq->rooms()->attach($rb['pivot']['room_id'], $rb['pivot']->toArray());
                }
            }
        } catch (PDOException $e) {
            $nr = $response->withStatus(404);
            $error = new ApiError();
            $error->setData($e->getCode(), $e->getMessage(), $data);
            return $nr->write($error->toJson());
        }
    }
//    return $response->withStatus(201)->getBody()->write('ok');
    return $response->withStatus(201)->getBody()->write($roombooks->toJson());
});

$app->post('/roombook/copyperiod', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();

    //print_r($data);

    $periods = \App\Models\Periods::whereIn('id', [$data['fromP']['id'], $data['toP']['id']])->get();

    $roombooks = \App\Models\Requests::with('rooms')
        ->whereIn('class_use', [4, 12])
        ->where('period', '=', $data['fromP']['id'])
        ->get();

    $s_fromd = $periods[0]->fromd;
    $s_tod = $periods[0]->tod;
    $d_fromd = $periods[1]->fromd;
    $d_tod = $periods[1]->tod;

    $sfromd = new DateTime(($s_fromd));
    $stod = new DateTime(($s_tod));
    $dfromd = new DateTime(($d_fromd));
    $dtod = new DateTime(($d_tod));

    $tmp = $sfromd->diff($dfromd);
    // print_r($tmp->format('%a'));

    foreach ($roombooks as $roombook) {
        try {
            $newReq = new \App\Models\Requests();
            if ($roombook['class_use'] == "4") {
                $newReq->fromd = $d_fromd;
                $newReq->tod = $d_tod;
            } else {
                $nfd = new DateTime($roombook->fromd);
                $nfd->add(new DateInterval('P' . $sfromd->diff($dfromd)->format('%a') . 'D'));
                $newReq->fromd = $nfd->format('Y-m-d');
                $nfd->add(new DateInterval('P1D'));
                $newReq->tod = $nfd->format('Y-m-d');
            }

            $newReq->user_id = $roombook['user_id'];
            $newReq->descr = $roombook['descr'];
            $newReq->period = $data['toP']['id'];
            $newReq->ps_id = null;
            $newReq->class_use = $roombook['class_use'];
            $newReq->links = $roombook['links'];
            $newReq->protocol_id = $roombook['protocol_id'];
            $newReq->status = 5;
            $newReq->conf_id = $data['toP']['conf_id'];
            $newReq->tm_id = $roombook['tm_id'];
            $newReq->save();

            foreach ($roombook['rooms'] as $rb) {
                $rb['pivot']['req_id'] = $newReq['id'];
                $rb['pivot']['id'] = null;
                $rb['pivot']['teacher'] = null;
                $newReq->rooms()->attach($rb['pivot']['room_id'], $rb['pivot']->toArray());
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

$app->post('/checkpending', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $pendings = \App\Models\Requests::where('conf_id', '=', $data['config']['id'])
        ->whereIn('status', [0, 5])
        ->get();
    /*} else {
        $pendings = \App\Models\Requests::where('conf_id','=', $data['config']['id'])
            ->whereIn('status',[0,5])
            ->where('if_expired', '=', true)
            ->get();
    }*/
    return $response->getBody()->write($pendings->toJson());
});

$app->put('/checkpending/expired', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $pendings = \App\Models\Requests::where('conf_id', '=', $data['config']['id'])
        ->whereIn('status', [0, 5])
        ->get();
    foreach ($pendings as $p) {
        if ($p->if_expired == "+") {
            $p->delete();
        }
    }
    return $response->getBody()->write("ok");
});


$app->post('/holiday', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $roombook = $request->getParsedBody();
    try {
        $newReq = new \App\Models\Requests();
        $newReq->req_dt = new DateTime();
        $newReq->user_id = $roombook['user_id'];
        $newReq->descr = $roombook['descr'];
        $newReq->period = null;
        $newReq->ps_id = $roombook['ps_id'];
        $newReq->class_use = $roombook['class_use'];
        $newReq->links = $roombook['links'];
        $newReq->protocol_id = $roombook['protocol_id'];
        $newReq->status = $roombook['status'];
        $newReq->fromd = $roombook['fromd'];
        $newReq->tod = $roombook['tod'];
        $newReq->admin = $roombook['admin'];
        $newReq->conf_id = $roombook['conf_id'];
        $newReq->tm_id = $roombook['tm_id'];
        $newReq->priority = $roombook['priority'];
        $newReq->save();

        $startingIndex = substr($roombook['date_index'], 0, 1) * 1;
        for ($i = 0; $i < 7; $i++) {
            foreach ($roombook['pivot'] as $rb) {
                if (sizeof(explode(strval(($startingIndex + $i) % 7), $roombook['date_index'])) > 1) {
                    $rb['date_index'] = ($startingIndex + $i) % 7;
                    $newReq->rooms()->attach($rb['room_id'], $rb);
                }
            }
        }

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage(), $roombook);
        return $nr->write($error->toJson());
    }

    return $response->withStatus(201)->getBody()->write('ok');
    //  return $response->withStatus(201)->getBody()->write($roombook);
});




//$app->post('/sendEmail', function (Request $request, Response $response) {
//    header("Content-Type: application/json");
//    $data = $request->getParsedBody();
//
//    $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
//    try {
//        //Server settings
//        $mail->SMTPDebug = 2;                                 // Enable verbose debug output
//        $mail->isSMTP();                                      // Set mailer to use SMTP
//        $mail->Host = 'smtp.office365.com';  // Specify main and backup SMTP servers
//        $mail->SMTPAuth = true;                               // Enable SMTP authentication
//        $mail->Username = 'pant-rooms@panteion.gr';                 // SMTP username
//        $mail->Password = 'Rooms_pant1!';                           // SMTP password
//        $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
//        //$mail->Port = 443;                                    // TCP port to connect to
//        $mail->Port = 587;                                    // TCP port to connect to
//
//        //Recipients
//        $mail->setFrom('pant-rooms@panteion.gr', 'Mailer');
//        $mail->addAddress('vmanol09@gmail.com', 'vmanol');     // Add a recipient
//        /*$mail->addReplyTo('info@example.com', 'Information');
//        $mail->addCC('cc@example.com');
//        $mail->addBCC('bcc@example.com');*/
//
//        //Attachments
//        //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
//
//        //Content
//        $mail->isHTML(true);                                  // Set email format to HTML
//        $mail->Subject = 'testing';
//        $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
//        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
//
//        $mail->send();
//        return $response->withStatus(201)->getBody()->write('ok');
//    } catch (Exception $e) {
//        echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
//        return $response->withStatus(409)->getBody()->write('Message could not be sent. Mailer Error: '+$mail->ErrorInfo);
//    }
//
//
//
//});
