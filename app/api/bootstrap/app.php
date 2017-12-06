<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 25/08/2017
 * Time: 4:00 μμ
 */
session_start();
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../config/db.php';

//$dotenv = new Dotenv\Dotenv(__DIR__);
//$dotenv->load();

$app = new \Slim\App([
    'settings' => [
        'displayErrorDetails' => true,
        "addContentLengthHeader" => false,
        'determineRouteBeforeAppMiddleware' => false,
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'clrbooking',
            'username' => 'lpadmin',
            'password' => 'OKEcmRv1UAa0Fqrb',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => ''
        ]
    ]
]);

$container = $app->getContainer();

$container["jwt"] = function ($container) {
    return new StdClass;
};

$container['phpErrorHandler'] = function ($container) {
    return function ($request, $response, $error) use ($container) {
        return $container['response']
            ->withStatus(500)
            ->withHeader('Content-Type', 'text/html')
            ->write('Something went wrong!');
    };
};

require __DIR__ . "/../config/dependencies.php";
require __DIR__ . "/../config/handlers.php";
require __DIR__ . "/../config/middleware.php";

require __DIR__ . "/../auth/auth.php";
require __DIR__ . "/../routes/devices.php";
require __DIR__ . '/../routes/routes.php';
require __DIR__ . '/../routes/options.php';
require __DIR__ . '/../routes/users.php';
