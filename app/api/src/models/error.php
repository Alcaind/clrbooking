<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

class ApiError
{
    public $errorCode = '';
    public $errorMessage = '';

    public function __invoke($code, $msg)
    {
        $this->errorCode = $code;
        $this->errorMessage = $msg;
    }

    public function toJson()
    {
        return ['type' => '',
            'code' => $this->errorCode,
            'message' => $this->errorMessage];
    }


}