<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 25/08/2017
 * Time: 4:00 μμ
 */
session_start();
require __DIR__ . '/../src/models/apierror.php';
require __DIR__ . '/../src/Slim/Handlers/ApiError.php';
require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../src/models/users.php';
require __DIR__ . '/../src/models/roles.php';
require __DIR__ . '/../src/models/config.php';
require __DIR__ . '/../src/models/periods.php';

require __DIR__ . '/../src/models/tm.php';
require __DIR__ . '/../src/models/kat.php';
require __DIR__ . '/../src/models/item.php';
require __DIR__ . '/../src/models/rooms.php';

require __DIR__ . '/../src/models/ps.php';
require __DIR__ . '/../src/models/requests.php';
require __DIR__ . '/../src/models/roombook.php';
require __DIR__ . '/../src/models/roomitem.php';
require __DIR__ . '/../src/models/roomuse.php';
require __DIR__ . '/../src/models/usersroles.php';
require __DIR__ . '/../src/models/ucategories.php';
require __DIR__ . '/../src/models/room_category.php';


//require __DIR__ . '../src/models/Users.php';
//require __DIR__ . '../src/models/Roles.php';
//require __DIR__ . '../src/models/dp.php';
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
            //'charset'   => 'utf8',
            //'collation' => 'utf8_general_ci',
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
require __DIR__ . '/../routes/roles.php';
require __DIR__ . '/../routes/config.php';
require __DIR__ . '/../routes/periods.php';

require __DIR__ . '/../routes/tm.php';
require __DIR__ . '/../routes/item.php';
require __DIR__ . '/../routes/rooms.php';

require __DIR__ . '/../routes/kat.php';
require __DIR__ . '/../routes/ps.php';
require __DIR__ . '/../routes/requests.php';
require __DIR__ . '/../routes/roombook.php';
require __DIR__ . '/../routes/roomitem.php';
require __DIR__ . '/../routes/roomuse.php';
require __DIR__ . '/../routes/usersroles.php';
require __DIR__ . '/../routes/ucategories.php';
require __DIR__ . '/../routes/roomcategory.php';