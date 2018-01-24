<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:11
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$app->get('/ucategories', function (Request $request, Response $response) {
    header("Content-Type: application/json");
    $cats = \App\Models\Ucategories::all();
    return $response->getBody()->write($cats->toJson());
});

