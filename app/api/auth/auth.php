<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 30/08/2017
 * Time: 1:26 μμ
 */

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Firebase\JWT\JWT;
use Tuupola\Base62;

$app->post("/token", function (Request $request, Response $response) {
    $now = new DateTime();
    $server = $request->getServerParams();
    $urlParams = $request->getParsedBody();
    $ret = new stdClass();

    //$params = 'ip=' . $server['REMOTE_ADDR'] . '&agent=' . $server['HTTP_USER_AGENT'] . '&cookie=0';
    //$params .= '&pswd=' . $urlParams["pswd"] . '&usr=' . $urlParams["usr"] . '&app=' . $urlParams["app"];

    $pswd= $urlParams["pswd"];
    $usr= $urlParams["usr"];

    $sql = "select * from users";
    try {
        $db = new db();
        $db = $db->connect();
        $stm = $db->query($sql);
        $user = $stm->fetchAll(PDO::FETCH_OBJ);
        //$db = null;
        $ret->user = $user;
        $sql = "select * from users_roles WHERE user_id = $user->id";
        $stm = $db->query($sql);
        $roles = $stm->fetchAll(PDO::FETCH_OBJ);
        $ret->roles = $roles;
    } catch (PDOException $e) {
        return $response->withStatus(444)
            ->withHeader("Content-Type", "application/json")
            //->write(json_encode($result, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
            ->write("lola");
    }

    $curlResults = json_decode($ret);
    $a = '';
    for ($i = 0; $i < 16; $i++) $a .= mt_rand(0, 9);

    $jti = (new Base62)->encode($a);
    $secret = getenv("JWT_SECRET");
    $secret = "supersecretkeyyoushouldnotcommittogithub";

    $future = new DateTime("now +10 hours");
    $payload = [
        "iat" => $now->getTimeStamp(),
        "exp" => $future->getTimeStamp(),
        "jti" => $jti,
        "sub" => $server["PHP_AUTH_USER"],
        "curlResults" => $curlResults
    ];

    $refreshToken = [];
    $refreshToken["token"] = JWT::encode($payload, $secret, "HS256");
    $refreshToken["expires"] = $future->getTimeStamp();

    $future = new DateTime("now +1 hour");

    $payload = [
        "iat" => $now->getTimeStamp(),
        "exp" => $future->getTimeStamp(),
        "jti" => $jti,
        "sub" => $server["PHP_AUTH_USER"],
        "scope" => ["put", "get", "post"],
        "curlResults" => $curlResults,
        "refresh-token" => $refreshToken
    ];

    $token = JWT::encode($payload, $secret, "HS256");
    $data["token"] = $token;
    $data["expires"] = $future->getTimeStamp();
    //$data["user"] = $future->getTimeStamp();
    return $response->withStatus(201)
        ->withHeader("Content-Type", "application/json")
        ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
});

$app->post("/login", function (Request $request, Response $response) {
    $now = new DateTime();
    $server = $request->getServerParams();
    $a = '';
    for ($i = 0; $i < 16; $i++) $a .= mt_rand(0, 9);

    $jti = (new Base62)->encode($a);
    $secret = getenv("JWT_SECRET"); //TODO : na valoume to secret sto ENV kai na to pairnoume apo ekei ...
    $secret = "supersecretkeyyoushouldnotcommittogithub";

    $future = new DateTime("now +10 hours");
    $payload = [
        "iat" => $now->getTimeStamp(),
        "exp" => $future->getTimeStamp(),
        "jti" => $jti
    ];

    $refreshToken = [];
    $refreshToken["token"] =  JWT::encode($payload, $secret, "HS256");
    $refreshToken["expires"] = $future->getTimeStamp();

    $future = new DateTime("now +1 hour");

    $payload = [
        "iat" => $now->getTimeStamp(),
        "exp" => $future->getTimeStamp(),
        "jti" => $jti,
        "sub" => $server["PHP_AUTH_USER"],
        "scope" => ["put", "get", "post"],
        "refresh-token" => $refreshToken
    ];

    $token = JWT::encode($payload, $secret, "HS256");
    $data["token"] = $token;
    $data["expires"] = $future->getTimeStamp();
    //$data["user"] = $future->getTimeStamp();
    return $response->withStatus(201)
        ->withHeader("Content-Type", "application/json")
        ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
});

$app->post("/refresh-token", function (Request $request, Response $response) {
    $now = new DateTime();
    $future = new DateTime("now +1 hour");
    $server = $request->getServerParams();
    $token = $request->getParsedBody()['refreshToken'];

    $a = '';
    for ($i = 0; $i < 16; $i++) $a .= mt_rand(0, 9);

    $jti = (new Base62)->encode($a);

    $payload = [
        "iat" => $now->getTimeStamp(),
        "exp" => $future->getTimeStamp(),
        "jti" => $jti,
        "sub" => $server["PHP_AUTH_USER"],
        "scope" => ["put", "get", "post"]
    ];

    $secret = getenv("JWT_SECRET");
    $secret = "supersecretkeyyoushouldnotcommittogithub";
    $token = JWT::encode($payload, $secret, "HS256");
    $data["token"] = $token;
    $data["expires"] = $future->getTimeStamp();
    return $response->withStatus(201)
        ->withHeader("Content-Type", "application/json")
        ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
});