<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 02/09/2017
 * Time: 6:09 μμ
 */

use Slim\Handlers\ApiError;

$container = $app->getContainer();
$container["errorHandler"] = function ($container) {
    return new Slim\Handlers\Error($container["logger"]);
};

$container["phpErrorHandler"] = function ($container) {
    return $container["errorHandler"];
};

$container["notFoundHandler"] = function ($container) {
    return new Slim\Handlers\NotFound();
};