<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 16/02/2018
 * Time: 11:33
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Guests extends Model
{
    protected $table = 'request_guests';

    public function requests()
    {
        return $this->hasMany('\\App\\Models\\Requests', 'req_id');
    }
}