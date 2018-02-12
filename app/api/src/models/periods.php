<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Periods extends Model
{

    protected $table = 'periods';

    public function config()
    {
        $this->belongsTo('\\App\\Models\\Config', 'conf_id');
    }
}