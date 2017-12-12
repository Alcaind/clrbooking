<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 10:46
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Ps extends Model
{
    public $timestamps = false;
    protected $table = 'ps';

    public function config()
    {
        $this->belongsTo('\\App\\Models\\Config', 'conf_id');
    }
}