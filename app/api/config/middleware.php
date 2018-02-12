<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 02/09/2017
 * Time: 6:01 μμ
 */
include __DIR__ . "/../src/Response/UnauthorizedResponse.php";

use App\Token;
use Crell\ApiProblem\ApiProblem;
use Gofabian\Negotiation\NegotiationMiddleware; //Gofabian\Negotiation\NegotiationMiddleware;
use Micheh\Cache\CacheUtil; // Micheh\Cache\CacheUtil;
use Slim\Middleware\HttpBasicAuthentication;
use Slim\Middleware\JwtAuthentication;
use Tuupola\Middleware\Cors;
use Response\UnauthorizedResponse; //Response\UnauthorizedResponse;
use Slim\Middleware\HttpBasicAuthentication\PdoAuthenticator;
use Slim\Middleware\HttpBasicAuthentication\AuthenticatorInterface;


class ClrAuthenticator implements AuthenticatorInterface
{
    private $options;
    private $pdo;

    public function __construct(array $options = [])
    {
        /* Default options. */
        $this->pdo = new db();
        $this->pdo = $this->pdo->connect();
        $this->options = [
            "table" => "users",
            "user" => "user",
            "hash" => "hash"
        ];
        if ($options) {
            $this->options = array_merge($this->options, $options);
        }
    }

    public function __invoke(array $arguments)
    {
        $user = $arguments["user"];
        $password = $arguments["password"];

        $sql = "SELECT * FROM users WHERE user = '".$user."'";
        $statement = $this->pdo->prepare($sql);
        $statement->execute();

        if ($user = $statement->fetch(\PDO::FETCH_ASSOC)) {
            return password_verify($password, $user[$this->options["hash"]]);
        }
        return false;
    }
}

$container = $app->getContainer();

$container["HttpBasicAuthentication"] = function ($container) {
    return new HttpBasicAuthentication([
        "path" => ["/token", "/login"],
        //"ignore" => ["/token", "/info", "/trackDev", "/login"],
        //"relaxed" => ["192.168.50.52", "127.0.0.1", "localhost"],
        //"passthrough" => ["/api/public/token", "/api/token"],
        "secure" => false,
        "error" => function ($request, $response, $arguments) {
            return new UnauthorizedResponse($arguments["message"], 401);
        },
        "callback" => function ($request, $response, $arguments) {
            //print_r($arguments);
        },
        "realm" => "Protected",
        "authenticator" => new ClrAuthenticator([
            "table" => "users",
            "user" => "user",
            "hash" => "hash"
        ]),
        "users" => ["tt" => "tt"],
        "environment" => "REDIRECT_HTTP_AUTHORIZATION"
    ]);
};

$container["token"] = function ($container) {
    return new Token;
};


$container["JwtAuthentication"] = function ($container) {
    return new JwtAuthentication([
        "path" => "/",
        //"ignore" => ["/api/public/token"],
        //"secret" => getenv("JWT_SECRET"),
        "secret" => "supersecretkeyyoushouldnotcommittogithub", //TODO : na mpei to super secret key sto ENV to leitourgikou
        "logger" => $container["logger"],
        "attribute" => false,
        "secure" => false,
        //"relaxed" => ["192.168.50.52", "127.0.0.1", "localhost"],
        "passthrough" => ["/api/newuser"],
        "rules" => [
            new Slim\Middleware\JwtAuthentication\RequestPathRule([
                "path" => "/",
                "passthrough" => ["/token", "/trackDev", "/login"]
            ]),
            new \Slim\Middleware\JwtAuthentication\RequestMethodRule([
                "passthrough" => ["OPTIONS"]
            ])
        ],
        "error" => function ($request, $response, $arguments) {
            //print_r($request);
            return new Response\UnauthorizedResponse($arguments["message"], 401);
        },
        "before" => function ($request, $response, $arguments) use ($container) {
            $container["token"]->hydrate($arguments["decoded"]);
        }
    ]);
};

$container["Cors"] = function ($container) {
    return new Cors([
        "logger" => $container["logger"],
        "origin" => ["*"],
        "methods" => ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "headers.allow" => ["Authorization", "If-Match", "If-Unmodified-Since"],
        "headers.expose" => ["Authorization", "Etag"],
        "credentials" => true,
        "cache" => 60,
        "error" => function ($request, $response, $arguments) {
            return new UnauthorizedResponse($arguments["message"], 401);
        }
    ]);
};

$container["Negotiation"] = function ($container) {
    return new NegotiationMiddleware([
        "accept" => ["application/json"]
    ]);
};

$app->add("HttpBasicAuthentication");
$app->add("JwtAuthentication");
$app->add("Cors");
$app->add("Negotiation");

$container["cache"] = function ($container) {
    return new CacheUtil;
};
