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

//use Illuminate\Database\Capsule\Manager as DB;
//use db;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


$app->get('/requests', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $requests = \App\Models\Requests::with(['users', 'periods', 'admin', 'room_use', 'ps', 'config', 'rooms', 'tm'])
        ->orderBy('id', 'desc')
        ->get();
    return $response->getBody()->write($requests->toJson());
});

$app->get('/requests/{id}', function (Request $request, Response $response, $args) {
    header("Content-Type: application/json");
    $id = $args['id'];
    try {
        $requests = \App\Models\Requests::with(['users', 'periods', 'admin', 'room_use', 'ps', 'config', 'rooms', 'tm', 'guests'])->find($id);
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
        $requests = \App\Models\Requests::with(['users', 'config', 'periods', 'admin', 'ps', 'room_use', 'rooms', 'tm'])
            ->where('conf_id', '=', $id)
            ->orderBy('id', 'desc')->get();
//        ->limit(30)->offset(30)
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
        $requests = \App\Models\Requests::with(['users', 'periods', 'admin', 'ps', 'room_use', 'rooms', 'tm'])
            ->where('user_id', '=', $id)
            ->where('conf_id', '=', 1)
            ->orderBy('id', 'desc')
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
    $tms = array();
    $usr = \App\Models\Users::with(['tm'])->find($id);
    //print_r($usr->toJson());

    foreach ($usr->tm as $tm) {
        //if ($tm['config_id'] == $data['config_id'])
        array_push($tms, $tm['id']);
    }

    try {
        $requests = \App\Models\Requests::with(['users:id,user', 'periods', 'admin', 'ps', 'room_use', 'rooms', 'tm'])
            ->where('conf_id', '=', $cid)
            ->whereHas('tm', function ($query) use ($tms) {
                $query->whereIn('id', $tms);
            })
            ->orderBy('fromd', 'desc')
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
        $requests = $room->requests()->join('users AS admin', 'requests.admin', '=', 'admin.id')->with(['users', 'periods', 'admin', 'room_use', 'ps', 'config', 'rooms', 'tm'])
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
        $requests->req_dt = null;
        //$requests->req_dt = new DateTime('now');
        //$requests->req_dt = $requests->req_dt->getTimestamp();
        //print_r($requests->req_dt);
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
        $requests->priority = $data['priority'];
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
    // print_r($data);

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
                                $error->setData(816, 'Η αίθουσα ' . $req->name . ' είναι ήδη καταχωρημένη σε άλλη δέσμευση.', $room);
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
    $data = $request->getParsedBody();
    $myData = $request->getParsedBody();
    $errors = array();
    try {
        $requests = new \App\Models\Requests();
        $requests->req_dt = null;
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
        $requests->priority = $data['priority'];
        $requests->save();
        $data['id'] = $requests['id'];
        $mydb = new db();
        $pdo = $mydb->connect();
        $errors = array();
        $query = $pdo->prepare('SELECT * from requests WHERE conf_id = 8  AND status in (1,5)  AND ((fromd BETWEEN ? AND ?) OR (tod BETWEEN ? AND ?)) OR (? BETWEEN fromd and tod)');
        $query->execute([explode('T', $data['fromd'])[0], explode('T', $data['tod'])[0], explode('T', $data['fromd'])[0], explode('T', $data['tod'])[0], explode('T', $data['fromd'])[0]]);

        while ($book = $query->fetch(PDO::FETCH_ASSOC)) {

            $rooms = \App\Models\RoomBook::where('req_id', '=', $book['id'])->get();
            $tm = \App\Models\Tm::find($book['tm_id']);

            foreach ($rooms as $room) {

                $roomname = \App\Models\Rooms::find($room['room_id']);
                $ps = \App\Models\Ps::find($data['ps_id']);
                $cntRoom = 0;
                foreach ($data['rooms'] as $reqRoom) {
                    $fromt = new DateTime($myData['pivot'][$cntRoom]['fromt']);
                    $tot = new DateTime($myData['pivot'][$cntRoom++]['tot']);
                    if ($data['status'] == 3 || $book['status'] == 4) continue;
                    if ($fromt->diff($tot)->invert == 1) {
                        $nr = $response->withStatus(418);
                        $error = new ApiError();
                        $requests->delete();
                        $error->setData(818, 'Η ώρα λήξης πρέπει να είναι μεγαλύτερη από την ώρα έναρξης.', $requests);
                        return $nr->write($error->toJson());
                    }

                    $tmpStrFD = explode('T', $data['fromd'])[0];
                    $tmpStrTD = explode('T', $data['tod'])[0];

                    if (($tmpStrFD >= $book['fromd'] || $tmpStrTD > $book['fromd']) && $tmpStrFD < $book['tod']) {
                        if ((new DateTime($room->tot) > $fromt && new DateTime($room->tot) < $tot) ||
                            (new DateTime($room->fromt) > $fromt && new DateTime($room->fromt) < $tot) ||
                            (new DateTime($room->fromt) == $fromt) || (new DateTime($room->tot) == $tot) ||
                            (new DateTime($room->tot) > $tot && new DateTime($room->fromt) < $tot) ||
                            (new DateTime($room->fromt) < $fromt && new DateTime($room->tot) > $tot)) {

                            if ($room->room_id == $reqRoom['id'] && $room->date_index == $reqRoom['date_index']) {
//                                && ($data['priority'] < $book['priority'] || $data['priority'] == $book['priority'])
                                if ($data['status'] == 0) {
                                    $uMessage = new \App\Models\usersRequests();
                                    $uMessage->from_user = $data['user_id'];
                                    $uMessage->to_users = $tm->supervisor;
//                                    ".$ps->tms_code."
                                    $formatedMessage = "Υπάρχει σύγκρουση αιτημάτων μεταξύ της αίτησης σας (Μάθημα:  - Αίθουσα :" . " " . $roomname->name . ", ημέρα" . " " . getDateString($room->date_index) . " " . "και ώρα" . " " . $room->fromt . "-" . $room->tot . " " . "για τις ημν/νιες από" . " " . $tmpStrFD . " " . "εως" . $tmpStrTD;
                                    $formatedMessage .= ") και της αίτησης (Αίθουσα :" . " " . $roomname->name . ", ημέρα" . " " . getDateString($room->date_index) . " " . "και ώρα" . " " . $fromt->format('H:i') . " - " . $tot->format('H:i') . " " . "για τις ημν/νιες από" . " " . $book["fromd"] . " " . "εως" . " " . $book["tod"];
                                    $formatedMessage .= ") link: http://roombookings.panteion.gr/#/usercreaterequests/" . $book["id"];
                                    $formatedMessage .= " " . "Σχόλια αιτήματος:" . " " . $data['descr'];
                                    //$uMessage->comments = 'Αίτημα δεύσμευσης για την αίθουσα ' . $room['name'] . ', ημέρα ' . getDateString($room->date_index) . ' και ώρα ' . $room->pivot->fromt . '-' . $room->pivot->tot . '. Ευχαριστώ.';
                                    $uMessage->comments = $formatedMessage;
                                    $uMessage->rr_id = $data['id'] ?: '';
                                    $uMessage->rb_id = $room->id ?: '';
                                    $uMessage->status = 0;
                                    $uMessage->save();
                                    // $this->mailer('df', 'df', $uMessage->comments, $room);
                                    $tt = new stdClass();
                                    $tt->fromRoom = $reqRoom;
                                    $tt->toRoom = $room;
                                    $u = \App\Models\Users::find($tm->supervisor);
                                    // sendEmail(array('to' => [$u->em_main, $u->em_sec, $u->em_pant], 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
                                    array_push($errors, $tt);
                                }

                            } elseif ($data['priority'] > $book['priority']) {
                                $requests->priority++;
                            }
                            if ($room->room_id != $reqRoom['id'] && $room->date_index == $reqRoom['date_index']) {
                                foreach ($data['pivot'] as $dataTeacher) {
                                    if ($room->teacher && $dataTeacher['teacher'] && $dataTeacher['teacher'] != '' && ($room->teacher == $dataTeacher['teacher'])) {
                                        array_push($errors, \App\Models\Users::find($room->teacher)->user);
                                        $nr = $response->withStatus(417);
                                        $error = new ApiError();
                                        //$requests->delete();
//                                       $requests->status = 5;
//                                        $requests->save();
                                        $ps = \App\Models\Ps::find($book['ps_id']);
                                        $error->setData(815, 'Ο καθηγητής' . ' ' . \App\Models\Users::find($room->teacher)->sname . ' ' . \App\Models\Users::find($room->teacher)->fname . ' ' . 'υπάρχει ήδη καταχωρημένος στην αίθουσας' . ' ' . $roomname->name . ', μάθημα ' . $ps->tma_code . ' ' . $ps->tma_per . ' και ώρες ' . $room->fromt . '-' . $room->tot, $dataTeacher);
                                        return $nr->write($error->toJson());
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
        if (sizeof($errors) == 0) {
            if ($data['status'] != 3 && $data['class_use'] != 12) $requests->status = 1;
            if ($data['class_use'] === 12 && $data['status'] != 3 && !$data['ps_id']) $requests->status = 5;
            if ($data['class_use'] === 12 && $data['status'] != 3 && $data['ps_id']) $requests->status = 1;
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
        //   print_r($data['guests']);
        foreach ($data['guests'] as $guest) {
            $guest = (array)$guest;
        }
        //  print_r($data['guests']);

        $u = \App\Models\Users::with(['tm'])->find($data['user_id']);

        if ($requests->class_use == 7 && sizeof($errors) <> 0) {
            $requests['status'] = 0;
            $requests->save();
            //  $requests['priority'] = $data->class_use['priority'];
            $uMessage = new \App\Models\usersRequests();
            //$uMessage->to_users = [];
            $uMessage->from_user = $data['user_id'];

            $uMessage->to_users = $room->users[0]->id;
            $emCnt = 0;
            if ($room->users) for ($i = 1; $i < sizeof($room->users); $i++) {
                if ($room->users[$i]->em_main) $uMessage->to_users[$emCnt++] = $room->users[$i]->em_main;
                if ($room->users[$i]->em_sec) $uMessage->to_users[$emCnt++] = $room->users[$i]->em_sec;
                if ($room->users[$i]->em_pant) $uMessage->to_users[$emCnt++] = $room->users[$i]->em_pant;
            }
            //$uMessage->to_users = $room->users[0]->id;

            $formatedMessage = "Ο χρήστης " . $u->sname . ' ' . $u->fname . "ζητάει την αίθουσα : " . $room['name'] . ", ημέρα " . getDateString($room->date_index) . ' και ώρα  ' . $room->fromt . '-' . $room->tot . ' για τις ημν/νιες από ' . $tmpStrFD . ' εως ' . $tmpStrTD;
            $formatedMessage .= ') link: http://roombookings.panteion.gr/#/usercreaterequests/' . $book["id"];
            $formatedMessage .= ' Σχόλια αιτήματος: ' . $data['descr'];
            $uMessage->comments = $formatedMessage;
            $uMessage->rr_id = $data['id'] ?: '';
            $uMessage->rb_id = $room->id ?: '';
            $uMessage->status = 0;
            $uMessage->save();
            $tt = new stdClass();
            $tt->fromRoom = $reqRoom;
            $tt->toRoom = $room;
            // print_r($uMessage);

            //sendEmail(array('to' => $uMessage->to_users, 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
        }


        foreach ($data['rooms'] as $room) {
            $ifexists = false;
            foreach ($u['tm'] as $utm) {
                if ($utm['default_tm_sel'] == $room['tm']['default_tm_sel']) {
                    $ifexists = true;
                }
            }
            if ($ifexists == false && $room['tm']['id'] && $room['tm']['id'] != '') {
                $requests->status = 0;
                $requests->save();

                $uMessage = new \App\Models\usersRequests();
                $tmpStrFD = explode('T', $data['fromd'])[0];
                $tmpStrTD = explode('T', $data['tod'])[0];
                $uMessage->from_user = $data['user_id'];
                $uMessage->to_users = $room['tm']['supervisor'];

                $formatedMessage = "Ο χρήστης " . $u->sname . ' ' . $u->fname . "ζητάει την αίθουσα : " . $room['name'] . ", ημέρα " . getDateString($data['pivot'][0]['date_index']) . ' και ώρα  ' . $data['pivot'][0]['fromt'] . '-' . $data['pivot'][0]['tot'] . ' για τις ημν/νιες από ' . $tmpStrFD . ' εως ' . $tmpStrTD;
                $formatedMessage .= ') link: http://roombookings.panteion.gr/#/usercreaterequests/' . $data["id"];
                $formatedMessage .= ' Σχόλια αιτήματος: ' . $data['descr'];
                $uMessage->comments = $formatedMessage;
                $uMessage->rr_id = $data['id'] ?: '';
                $uMessage->rb_id = '';
                $uMessage->status = 0;
                $uMessage->save();
                $tt = new stdClass();
                $tt->fromRoom = $room;
                $tt->toRoom = $room;
                $u = \App\Models\Users::find($tm->supervisor);
                // sendEmail(array('to' => [$u->em_main, $u->em_sec, $u->em_pant], 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
                array_push($errors, $tt);
            }
        }

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
        $error->setData(816, 'Σφάλματα αίτησης. Απεστάλει μήνυμα έγκρισης!', $errors);
        return $nr->write($error->toJson());
    }
    return $response->withStatus(201)->getBody()->write($requests->toJson());
});//->add($checkUserRequestRules);

function sendEmail($data)
{
    //print_r($data);
    $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
    try {
        //Server settings
        $mail->CharSet = 'UTF-8';
        $mail->SMTPDebug = 0;                                 // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.office365.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'pant-rooms@panteion.gr';                 // SMTP username
        $mail->Password = 'Rooms_pant1!';                           // SMTP password
        $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
        //$mail->Port = 443;                                    // TCP port to connect to
        $mail->Port = 587;                                    // TCP port to connect to

        //Recipients
        $mail->setFrom('pant-rooms@panteion.gr', 'Mailer');

        $mail->addAddress($data['to'][0], '');     // Add a recipient
//        for ($i=1; $i<sizeof($data['to']); $i++) {
//            $mail->addCC($data['to'][i]);
//        }

        if ($data['to'][1]) $mail->addCC($data['to'][1]);
        if ($data['to'][2]) $mail->addCC($data['to'][2]);

        /*$mail->addReplyTo('info@example.com', 'Information');
        $mail->addCC('cc@example.com');
        $mail->addBCC('bcc@example.com');*/

        //Attachments
        //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

        //Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = $data['subj'];
        $mail->Body = $data['body'];
        $mail->send();
        return true;
    } catch (Exception $e) {
        return 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
    }

}

function getDateString($day)
{
    $days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    return $days[$day];
}

$app->put('/requests/userrequest', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $data = $request->getParsedBody();
    $myData = $request->getParsedBody();
    $mydb = new db();
    $pdo = $mydb->connect();
    $errors = array();
    $query = $pdo->prepare('SELECT * from requests WHERE conf_id = 8 AND status in (1,5) and id != ? AND ((fromd BETWEEN ? AND ?) OR (tod BETWEEN ? AND ?)) OR (? BETWEEN fromd and tod)');
    $query->execute([$data['id'], explode('T', $data['fromd'])[0], explode('T', $data['tod'])[0], explode('T', $data['fromd'])[0], explode('T', $data['tod'])[0], explode('T', $data['fromd'])[0]]);

    try {

        $requests = \App\Models\Requests::find($data['id']);
        $urs = \App\Models\usersRequests::where('rr_id', $data['id'])->get();
        foreach ($urs as $ur) {
            $ur->delete();
        }

        while ($book = $query->fetch(PDO::FETCH_ASSOC)) {
            $rooms = \App\Models\RoomBook::where('req_id', '=', $book['id'])->get();
            $tm = \App\Models\Tm::find($book['tm_id']);

            foreach ($rooms as $room) {
                $roomname = \App\Models\Rooms::find($room['room_id']);
                $cntRoom = 0;
                foreach ($data['rooms'] as $reqRoom) {
                    $fromt = new DateTime($myData['pivot'][$cntRoom]['fromt']);
                    $tot = new DateTime($myData['pivot'][$cntRoom++]['tot']);
                    if ($data['status'] == 3 || $book['status'] == 4) continue;
                    if ($fromt->diff($tot)->invert == 1) {
                        $nr = $response->withStatus(418);
                        $error = new ApiError();
                        $requests->delete();
                        $error->setData(818, 'Η ώρα λήξης πρέπει να είναι μεγαλύτερη από την ώρα έναρξης.', $requests);
                        return $nr->write($error->toJson());
                    }

                    $tmpStrFD = explode('T', $data['fromd'])[0];
                    $tmpStrTD = explode('T', $data['tod'])[0];

                    if (($tmpStrFD >= $book['fromd'] || $tmpStrTD > $book['fromd']) && $tmpStrFD < $book['tod']) {
                        if ((new DateTime($room->tot) > $fromt && new DateTime($room->tot) < $tot) ||
                            (new DateTime($room->tot) > $tot && new DateTime($room->fromt) < $tot) ||
                            (new DateTime($room->fromt) > $fromt && new DateTime($room->fromt) < $tot) ||
                            (new DateTime($room->fromt) == $fromt) || (new DateTime($room->tot) == $tot) ||
                            (new DateTime($room->fromt) < $fromt && new DateTime($room->tot) > $tot)) {

//                            echo "\n";
//                            print_r($fromt);
//                            echo '-';
//                            print_r($tot);
//                            echo '/';
//                            print_r((new DateTime($room->fromt)));
//                            echo '-';
//                            print_r((new DateTime($room->tot)));
//                            echo ' == ';
//                            print_r((new DateTime($room->tot)) == $tot);
//                            echo "\n";
//                            print_r($data['status']);

                            if ($room->room_id == $reqRoom['id'] && $room->date_index == $reqRoom['date_index']) {
//                                && ($data['priority'] < $book['priority'] || $data['priority'] == $book['priority'])
                                if ($data['status'] == 0 && $book['id'] != $data['id']) {
                                    $uMessage = new \App\Models\usersRequests();
                                    $uMessage->from_user = $data['user_id'];
                                    $uMessage->to_users = $tm->supervisor;
                                    $formatedMessage = "Υπάρχει σύγκρουση αιτημάτων μεταξύ της αίτησης σας (Αίθουσα :" . " " . $roomname->name . ", ημέρα" . " " . getDateString($room->date_index) . " " . "και ώρα" . " " . $room->fromt . "-" . $room->tot . " " . "για τις ημν/νιες από" . " " . $tmpStrFD . " " . "εως" . $tmpStrTD;
                                    $formatedMessage .= ") και της αίτησης (Αίθουσα :" . " " . $roomname->name . ", ημέρα" . " " . getDateString($room->date_index) . " " . "και ώρα" . " " . $fromt->format('H:i') . " - " . $tot->format('H:i') . " " . "για τις ημν/νιες από" . " " . $book["fromd"] . " " . "εως" . " " . $book["tod"];
                                    $formatedMessage .= ") link: http://roombookings.panteion.gr/#/usercreaterequests/" . $book["id"];
                                    $formatedMessage .= " " . "Σχόλια αιτήματος:" . " " . $data['descr'];
                                    //$uMessage->comments = 'Αίτημα δεύσμευσης για την αίθουσα ' . $room['name'] . ', ημέρα ' . getDateString($room->pivot->date_index) . ' και ώρα ' . $room->pivot->fromt . '-' . $room->pivot->tot . '. Ευχαριστώ.';
                                    $uMessage->comments = $formatedMessage;
                                    $uMessage->rr_id = $data['id'] ?: '';
                                    $uMessage->rb_id = $room['id'] ?: '';
                                    $uMessage->status = 0;
                                    $uMessage->save();

                                    $tt = new stdClass();
                                    $tt->fromRoom = $reqRoom;
                                    $tt->toRoom = $room;

                                    $u = \App\Models\Users::find($tm->supervisor);
                                    // sendEmail(array('to' => [$u->em_main, $u->em_sec, $u->em_pant], 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
                                    array_push($errors, $tt);

                                }
                            } elseif ($data['priority'] > $book['priority']) {
                                $requests->priority++;
                            }
                            if ($room->room_id != $reqRoom['id'] && $room->date_index == $reqRoom['date_index'] && $book['id'] != $data['id']) {
                                foreach ($data['pivot'] as $dataTeacher) {
                                    if ($room->teacher && $dataTeacher['teacher'] && $dataTeacher['teacher'] != '' && ($room->teacher == $dataTeacher['teacher'])) {
                                        array_push($errors, \App\Models\Users::find($room->teacher)->user);
                                        $nr = $response->withStatus(417);
                                        $error = new ApiError();
                                        //$requests->delete();
//                                        $requests->status = 5;
//                                        $requests->save();
                                        $ps = \App\Models\Ps::find($book['ps_id']);
                                        $error->setData(815, 'Ο καθηγητής' . ' ' . \App\Models\Users::find($room->teacher)->sname . ' ' . \App\Models\Users::find($room->teacher)->fname . ' ' . 'υπάρχει ήδη καταχωρημένος στην αίθουσας' . ' ' . $roomname->name . ', μάθημα ' . $ps->tma_code . ' ' . $ps->tma_per . ' και ώρες ' . $room->fromt . '-' . $room->tot, $dataTeacher);
                                        return $nr->write($error->toJson());
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
        $data['id'] = $requests->id;
        $requests->status = $data['status'];

        if (sizeof($errors) == 0) {
            if ($data['status'] != 3 && $data['class_use'] != 12) $requests->status = 1;
            if ($data['class_use'] == 12 && $data['status'] != 3 && $data['ps_id'] == null) $requests->status = 5;
            if ($data['class_use'] == 12 && $data['status'] != 3 && $data['ps_id'] != null) $requests->status = 1;
        }
        $requests->tm_id = $data['tm_id'];
        $requests->save();


        foreach ($data['rooms'] as $room) {
            $ifexists = false;
            foreach ($u['tm'] as $utm) {
                if ($utm['default_tm_sel'] == $room['tm']['default_tm_sel']) {
                    $ifexists = true;
                }
            }
            if ($ifexists == false && $room['tm']['id'] && $room['tm']['id'] != '') {
                $requests->status = 0;
                $requests->save();

                $uMessage = new \App\Models\usersRequests();
                $tmpStrFD = explode('T', $data['fromd'])[0];
                $tmpStrTD = explode('T', $data['tod'])[0];
                $uMessage->from_user = $data['user_id'];
                $uMessage->to_users = $room['tm']['supervisor'];

                $formatedMessage = "Ο χρήστης " . $u->sname . ' ' . $u->fname . "ζητάει την αίθουσα : " . $room['name'] . ", ημέρα " . getDateString($data['pivot'][0]['date_index']) . ' και ώρα  ' . $data['pivot'][0]['fromt'] . '-' . $data['pivot'][0]['tot'] . ' για τις ημν/νιες από ' . $tmpStrFD . ' εως ' . $tmpStrTD;
                $formatedMessage .= ') link: http://roombookings.panteion.gr/#/usercreaterequests/' . $data["id"];
                $formatedMessage .= ' Σχόλια αιτήματος: ' . $data['descr'];
                $uMessage->comments = $formatedMessage;
                $uMessage->rr_id = $data['id'] ?: '';
                $uMessage->rb_id = '';
                $uMessage->status = 0;
                $uMessage->save();
                $tt = new stdClass();
                $tt->fromRoom = $room;
                $tt->toRoom = $room;
                $u = \App\Models\Users::find($tm->supervisor);
                // sendEmail(array('to' => [$u->em_main, $u->em_sec, $u->em_pant], 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
                array_push($errors, $tt);
            }
        }


    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage(), $data);
        return $nr->write($error->toJson());
        //return $nr->write('error');
    }
    if (sizeof($errors) != 0) {
        $nr = $response->withStatus(417);
        $error = new ApiError();
        $error->setData(816, 'Σφάλματα αίτησης. Απεστάλει μήνυμα έγκρισης!', $errors);
        return $nr->write($error->toJson());
        //return $nr->write('error');
    }

    return $response->withStatus(201)->getBody()->write($requests->toJson());
    //return $response->withStatus(201)->getBody()->write('ok');
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
        //$requests->req_dt = $data['req_dt'] ?: $requests->req_dt;
        $requests->user_id = $data['user_id'] ?: $requests->user_id;
        $requests->descr = $data['descr'] ?: $requests->descr;
        $requests->period = $data['period'] ?: $requests->period;
        $requests->ps_id = $data['ps_id'] ?: $requests->ps_id;
        $requests->class_use = $data['class_use'] ?: $requests->class_use;
        $requests->links = $data['links'] ?: $requests->links;
        $requests->protocol_id = $data['protocol_id'] ?: $requests->protocol_id;
        $requests->status = $data['status'];
        $requests->fromd = $data['fromd'] ?: $requests->fromd;
        $requests->tod = $data['tod'] ?: $requests->tod;
        $requests->admin = $data['admin'] ?: '1';
        $requests->conf_id = $data['conf_id'] ?: $requests->conf_id;
        $requests->tm_id = $data['tm_id'] ?: $requests->tm_id;
        $requests->priority = $data['priority'] ?: $requests->priority;
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
                $error->setData(818, 'Η ώρα λήξης πρέπει να είνα μεγαλύτερη από την ώρα έναρξης.');
                return $nr->write($error->toJson());
            }

            if (($req->fromd >= $book['fromd'] || $req->tod >= $book['fromd']) && $req->fromd <= $book['tod']) {
                if ($room->pivot->fromt >= $book['fromt'] && $room->pivot->fromt <= $book['tot']) {

                    if ($room->pivot->room_id == $args['rid'] && $room->pivot->date_index == $data['date_index']) {
                        $nr = $response->withStatus(417);
                        $error = new ApiError();
                        $error->setData(816, 'Η αίθουσα' . ' ' . \App\Models\Rooms::find($args['rid'])->name . ' ' . 'είναι ήδη καταχωρημένη σε άλλη δέσμευση.');
                        return $nr->write($error->toJson());
                    }
                    if ($room->pivot->teacher == $data['teacher']) {
                        $nr = $response->withStatus(417);
                        $error = new ApiError();
                        $error->setData(815, 'Ο καθηγητής' . ' ' . \App\Models\Users::find($room->pivot->teacher)->user . 'υπάρχει ήδη καταχωρημένος σε άλλη δέσμευση αίθουσας.');
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

    $rb = new \App\Models\RoomBook();
    $rb->req_id = $id;
    $rb->room_id = $rid;
    $rb->comment = $data['comment'];
    $rb->teacher = $data['teacher'];
    $rb->fromt = $data['fromt'];
    $rb->tot = $data['tot'];
    $rb->date_index = $data['date_index'];
    $rb->save();

    //$requests->rooms()->attach($rid, $data);
    return $response->getBody()->write($requests->rooms()->get()->toJson());
})->add($checkReqRooms);

$app->put('/requests/rooms/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    // print_r($data);
    try {
        $rb = \App\Models\RoomBook::find($id);
        $rb->room_id = $data['room_id'];
        $rb->comment = $data['comment'];
        $rb->teacher = $data['teacher'];
        $rb->fromt = $data['fromt'];
        $rb->tot = $data['tot'];
        $rb->date_index = $data['date_index'];
        $rb->save();
        // echo "\n".$rb->fromt." - ". $rb->tot."\n";

    } catch (PDOException $e) {
        $nr = $response->withStatus(404);
        $error = new ApiError();
        $error->setData($e->getCode(), $e->getMessage());
        return $nr->write($error->toJson());
    }

    $requests = \App\Models\Requests::find($rb->req_id);

    return $response->getBody()->write($requests->rooms()->get()->toJson());
});
//->add($checkReqRooms)

//$app->put('/tstrequests/rooms/{id}', function ($request, $response, $args) {
//    $id = $args['id'];
//    $data = $request->getParsedBody();
//
//    // print_r($data);
//    try {
//        $rb = \App\Models\RoomBook::find($id);
//        $rb->room_id = $data['room_id'];
//        $rb->comment = $data['comment'];
//        $rb->teacher = $data['teacher'];
//        $rb->fromt = $data['fromt'];
//        $rb->tot = $data['tot'];
//        $rb->date_index = $data['date_index'];
//        $rb->save();
//        // echo "\n".$rb->fromt." - ". $rb->tot."\n";
//
//    } catch (PDOException $e) {
//        $nr = $response->withStatus(404);
//        $error = new ApiError();
//        $error->setData($e->getCode(), $e->getMessage());
//        return $nr->write($error->toJson());
//    }
//
//    $requests = \App\Models\Requests::find($rb->req_id);
//
//    return $response->getBody()->write($requests->rooms()->get()->toJson());
//});

$app->put('/requests/{id}/{ps}', function ($request, $response, $args) {
    $id = $args['id'];
    $ps = $args['ps'];
    $data = $request->getParsedBody();

    $rb = \App\Models\Requests::find($id);
    $rb->ps_id = $ps;
    $rb->save();

    return $response->getBody()->write($rb->toJson());
});

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


$app->post('/requests/copyday', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $reqArray = $request->getParsedBody();
    print_r($reqArray);

    $errors = array();
    try {

        foreach ($reqArray as $data) {
            $myData = $data;

            $requests = new \App\Models\Requests();
            $requests->req_dt = null;
            $requests->user_id = $data['user_id'];
            $requests->descr = $data['descr'] ?: '';
            $requests->period = $data['period'] ?: '';
            $requests->ps_id = $data['ps_id'] ?: null;
            $requests->class_use = $data['class_use'] ?: '';
            //$requests->links = $data['links']?:'';
            $requests->status = $data['status'];
            $requests->fromd = $data['fromd'];
            $requests->tod = $data['tod'];
            $requests->conf_id = $data['config']['id'];
            $requests->tm_id = $data['tm_id'];
            $requests->priority = $data['priority'];
            $requests->save();

            $data['id'] = $requests['id'];

            $mydb = new db();
            $pdo = $mydb->connect();
            $errors = array();
            $query = $pdo->prepare('SELECT * from requests WHERE conf_id = 1 AND status in (1,5)  AND ((fromd BETWEEN ? AND ?) OR (tod BETWEEN ? AND ?)) OR (? BETWEEN fromd and tod)');
            $query->execute([explode('T', $data['fromd'])[0], explode('T', $data['tod'])[0], explode('T', $data['fromd'])[0], explode('T', $data['tod'])[0], explode('T', $data['fromd'])[0]]);

            while ($book = $query->fetch(PDO::FETCH_ASSOC)) {

                $rooms = \App\Models\RoomBook::where('req_id', '=', $book['id'])->get();
                $tm = \App\Models\Tm::find($book['tm_id']);

                foreach ($rooms as $room) {

                    $roomname = \App\Models\Rooms::find($room['room_id']);
                    $cntRoom = 0;
                    foreach ($data['rooms'] as $reqRoom) {
                        $fromt = new DateTime($myData['pivot'][$cntRoom]['fromt']);
                        $tot = new DateTime($myData['pivot'][$cntRoom++]['tot']);
                        if ($data['status'] == 3 || $book['status'] == 4) continue;
                        if ($fromt->diff($tot)->invert == 1) {
                            $nr = $response->withStatus(418);
                            $error = new ApiError();
                            $requests->delete();
                            $error->setData(818, 'Η ώρα λήξης πρέπει να είναι μεγαλύτερη από την ώρα έναρξης.', $requests);
                            return $nr->write($error->toJson());
                        }

                        $tmpStrFD = explode('T', $data['fromd'])[0];
                        $tmpStrTD = explode('T', $data['tod'])[0];

                        if (($tmpStrFD >= $book['fromd'] || $tmpStrTD > $book['fromd']) && $tmpStrFD < $book['tod']) {
                            if ((new DateTime($room->tot) > $fromt && new DateTime($room->tot) < $tot) ||
                                (new DateTime($room->fromt) > $fromt && new DateTime($room->fromt) < $tot) ||
                                (new DateTime($room->fromt) == $fromt) ||
                                (new DateTime($room->tot) > $tot && new DateTime($room->fromt) < $tot) ||
                                (new DateTime($room->fromt) < $fromt && new DateTime($room->tot) > $tot)) {

                                if ($room->room_id == $reqRoom['id'] && $room->date_index == $reqRoom['date_index'] && ($data['priority'] < $book['priority'] || $data['priority'] == $book['priority'])) {

                                    if ($data['status'] == 0) {
                                        $uMessage = new \App\Models\usersRequests();
                                        $uMessage->from_user = $data['user_id'];
                                        $uMessage->to_users = $tm->supervisor;
                                        $formatedMessage = "Υπάρχει σύγκρουση αιτημάτων μεταξύ της αίτησης σας (Αίθουσα :" . " " . $roomname->name . ", ημέρα" . " " . getDateString($room->date_index) . " " . "και ώρα" . " " . $room->fromt . "-" . $room->tot . " " . "για τις ημν/νιες από" . " " . $tmpStrFD . " " . "εως" . $tmpStrTD;
                                        $formatedMessage .= ") και της αίτησης (Αίθουσα :" . " " . $roomname->name . ", ημέρα" . " " . getDateString($room->date_index) . " " . "και ώρα" . " " . $fromt->format('H:i') . " - " . $tot->format('H:i') . " " . "για τις ημν/νιες από" . " " . $book["fromd"] . " " . "εως" . " " . $book["tod"];
                                        $formatedMessage .= ") link: http://roombookings.panteion.gr/#/usercreaterequests/" . $book["id"];
                                        $formatedMessage .= " " . "Σχόλια αιτήματος:" . " " . $data['descr'];
                                        //$uMessage->comments = 'Αίτημα δεύσμευσης για την αίθουσα ' . $room['name'] . ', ημέρα ' . getDateString($room->date_index) . ' και ώρα ' . $room->pivot->fromt . '-' . $room->pivot->tot . '. Ευχαριστώ.';
                                        $uMessage->comments = $formatedMessage;
                                        $uMessage->rr_id = $data['id'] ?: '';
                                        $uMessage->rb_id = $room->id ?: '';
                                        $uMessage->status = 0;
                                        $uMessage->save();
                                        // $this->mailer('df', 'df', $uMessage->comments, $room);
                                        $tt = new stdClass();
                                        $tt->fromRoom = $reqRoom;
                                        $tt->toRoom = $room;
                                        $u = \App\Models\Users::find($tm->supervisor);
                                        //  sendEmail(array('to' => [$u->em_main, $u->em_sec, $u->em_pant], 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
                                        array_push($errors, $tt);
                                    }

                                } elseif ($data['priority'] > $book['priority']) {
                                    $requests->priority++;
                                }
                                foreach ($data['pivot'] as $dataTeacher) {
                                    if ($room->teacher && $dataTeacher['teacher'] && $dataTeacher['teacher'] != '' && ($room->teacher == $dataTeacher['teacher'])) {
                                        array_push($errors, \App\Models\Users::find($room->teacher)->user);
                                        $nr = $response->withStatus(417);
                                        $error = new ApiError();
                                        $requests->delete();
                                        $error->setData(815, 'Ο καθηγητής' . ' ' . \App\Models\Users::find($room->teacher)->sname . ' ' . \App\Models\Users::find($room->teacher)->fname . ' ' . 'υπάρχει ήδη καταχωρημένος σε άλλη δέσμευση αίθουσας.', $room);
                                        return $nr->write($error->toJson());
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (sizeof($errors) == 0) {
                if ($data['status'] != 3 && $data['class_use'] != 12) $requests->status = 1;
                if ($data['class_use'] === 12 && $data['status'] != 3 && !$data['ps_id']) $requests->status = 5;
                if ($data['class_use'] === 12 && $data['status'] != 3 && $data['ps_id']) $requests->status = 1;
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
            //   print_r($data['guests']);
            foreach ($data['guests'] as $guest) {
                $guest = (array)$guest;
            }
            //  print_r($data['guests']);

            if ($requests->class_use == 7 && sizeof($errors) <> 0) {
                $requests['status'] = 0;
                $requests->save();
                //  $requests['priority'] = $data->class_use['priority'];
                $uMessage = new \App\Models\usersRequests();
                //$uMessage->to_users = [];
                $uMessage->from_user = $data['user_id'];

                $uMessage->to_users = $room->users[0]->id;
                $emCnt = 0;
                if ($room->users) for ($i = 1; $i < sizeof($room->users); $i++) {
                    if ($room->users[$i]->em_main) $uMessage->to_users[$emCnt++] = $room->users[$i]->em_main;
                    if ($room->users[$i]->em_sec) $uMessage->to_users[$emCnt++] = $room->users[$i]->em_sec;
                    if ($room->users[$i]->em_pant) $uMessage->to_users[$emCnt++] = $room->users[$i]->em_pant;
                }
                //$uMessage->to_users = $room->users[0]->id;

                $u = \App\Models\Users::find($data['user_id']);
                $formatedMessage = "Ο χρήστης " . $u->sname . ' ' . $u->fname . "ζητάει την αίθουσα : " . $room['name'] . ", ημέρα " . getDateString($room->date_index) . ' και ώρα  ' . $room->fromt . '-' . $room->tot . ' για τις ημν/νιες από ' . $tmpStrFD . ' εως ' . $tmpStrTD;
                $formatedMessage .= ') link: http://roombookings.panteion.gr/#/usercreaterequests/' . $book["id"];
                $formatedMessage .= ' Σχόλια αιτήματος: ' . $data['descr'];
                $uMessage->comments = $formatedMessage;
                $uMessage->rr_id = $data['id'] ?: '';
                $uMessage->rb_id = $room->id ?: '';
                $uMessage->status = 0;
                $uMessage->save();

                $tt = new stdClass();
                $tt->fromRoom = $reqRoom;
                $tt->toRoom = $room;
                // print_r($uMessage);

                //sendEmail(array('to' => $uMessage->to_users, 'subj' => 'Αίτημα Δέσμευσης Αίθουσας', 'body' => $uMessage->comments,));
            }
        }

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
        $error->setData(816, 'Σφάλματα αίτησης', $errors);
        return $nr->write($error->toJson());
    }
//    return $response->withStatus(201)->getBody()->write($requests->toJson());
    return $response->withStatus(201)->getBody()->write('wtf');

});



