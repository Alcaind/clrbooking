<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:05
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Tm extends Model
{

    protected $table = 'tm';

    public function kat()
    {
        $this->hasMany('\\App\\Models\\Kat', 'tm_id');;
    }

    public function users()
    {
        $this->hasMany('\\App\\Models\\Users', 'tm_id');
    }

    public function rooms()
    {
        $this->hasMany('\\App\\Models\\Rooms', 'tm_owner');
    }

}