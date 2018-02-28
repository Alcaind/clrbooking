<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 16/02/2018
 * Time: 11:16
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Stats extends Model
{
    protected $table = 'ps_stats';


    public function ps()
    {
        return $this->hasMany('\\App\\Models\\Stats', 'ps_id');
    }
}