<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Rooms extends Model
{
    protected $table = 'rooms';
    public $timestamps = false;

    public function items()
    {
        return $this->belongsToMany("\\App\\Models\\Items", 'room_items', 'item_id', 'room_id');
    }

}