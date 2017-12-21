<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 06/12/2017
 * Time: 5:30 μμ
 */
namespace App\Exceptions;

use \Illuminate\Contracts\Debug\ExceptionHandler as ExceptionHandler;

class Handler implements  ExceptionHandler {
    public function report(\Exception $e) {
        throw $e;
    }

    public function render($request, \Exception $e) {
        throw $e;
    }

    public function renderForConsole($output, \Exception $e) {
        throw $e;
    }
}