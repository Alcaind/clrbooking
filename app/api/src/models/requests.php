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

    protected $table = 'requests';

    public function users()
    {
        $this->belongsTo('\\App\\Models\\Users', 'user_id');
    }

    public function ps()
    {
        $this->belongsTo('\\App\\Models\\Ps', 'ps_id');
    }

}