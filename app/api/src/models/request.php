<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:24
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Requests extends Model
{
    public $timestamps = false;
    protected $table = 'requests';

}