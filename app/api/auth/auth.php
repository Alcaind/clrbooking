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

    $ch = curl_init();
    $params = 'ip=' . $server['REMOTE_ADDR'] . '&agent=' . $server['HTTP_USER_AGENT'] . '&cookie=0';
    $params .= '&pswd=' . $urlParams["pswd"] . '&usr=' . $urlParams["usr"] . '&app=' . $urlParams["app"];

    curl_setopt($ch, CURLOPT_URL, 'http://www.livepraktoreio.gr/webServices/web-login-test.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    curl_close($ch);
    if (strpos($result, 'false') > -1) {
        //api('{"success":false, "from curl":"-1"}');
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($result, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }

    $curlResults = json_decode($result);
    //echo " ok /n";
    //$b62 = new Base62();
    //substr(strtr(base64_encode(hex2bin(bin2hex(random_bytes(32))), '+', '.'), 0, 44);
    //$b62 = substr(strtr(base64_encode(hex2bin(bin2hex(random_bytes(32)))), '+', '.'), 0, 44);
    //\Sodium\bin2hex(random_bytes(16)); //random_bytes(16);
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
    $urlParams = $request->getParsedBody();

    $ch = curl_init();
    $params = 'ip=' . $server['REMOTE_ADDR'] . '&agent=' . $server['HTTP_USER_AGENT'] . '&cookie=0';
    $params .= '&pswd=' . $urlParams["pswd"] . '&usr=' . $urlParams["usr"] . '&app=' . $urlParams["app"];

    curl_setopt($ch, CURLOPT_URL, 'http://www.livepraktoreio.gr/webServices/web-login-test.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    curl_close($ch);
    if (strpos($result, 'false') > -1) {
        //api('{"success":false, "from curl":"-1"}');
        return $response->withStatus(401)
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($result, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }

    $curlResults = json_decode($result);
    //echo " ok /n";
    //$b62 = new Base62();
    //substr(strtr(base64_encode(hex2bin(bin2hex(random_bytes(32))), '+', '.'), 0, 44);
    //$b62 = substr(strtr(base64_encode(hex2bin(bin2hex(random_bytes(32)))), '+', '.'), 0, 44);
    //\Sodium\bin2hex(random_bytes(16)); //random_bytes(16);
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
        "scope" => ["put", "get", "post"],
        "curlResults" => $token->curlResults
    ];

    $secret = getenv("JWT_SECRET");
    $secret = "supersecretkeyyoushouldnotcommittogithub";
    //echo $secret;
    //die();
    $token = JWT::encode($payload, $secret, "HS256");
    $data["token"] = $token;
    $data["expires"] = $future->getTimeStamp();
    //$data["user"] = $future->getTimeStamp();
    return $response->withStatus(201)
        ->withHeader("Content-Type", "application/json")
        ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
});

