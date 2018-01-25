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

    public function SetData($code, $msg)
    {
        $this->errorCode = $code;
        $this->errorMessage = $msg;
    }

    public function toJson()
    {
        $returnMessage = $this->libraryErrorMsg();
        return json_encode(['errorType' => '', 'errorCode' => $this->errorCode, 'errorText' => $returnMessage]);
    }

    protected function libraryErrorMsg()
    {
        $errormessage = explode(':', $this->errorMessage)[2];
        $errormessage = explode('(', $errormessage)[0];
        return $this->dictionary($errormessage);
    }

    protected function dictionary($errorstring)
    {
        $returnString = '';
        switch (explode(' ', $errorstring)[1]) {
            case '1062':
                $value = explode('\'', $errorstring)[1];
                $key = explode('\'', $errorstring)[3];
                $returnString = 'διπλοεγγρεφη ' . $value . ' στη κολωνα ' . $key;
                break;
            case '1063':
                break;
            case '1065':
                break;
            default:
                $value = explode('\'', $errorstring)[1];
                $key = explode('\'', $errorstring)[3];
                $returnString = 'default -> "' . $errorstring . '""';
                break;
        }

        return $returnString;
    }
}