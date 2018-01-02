<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 16:07
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Items extends Model
{
    public $timestamps = false;
    protected $table = 'items';

}