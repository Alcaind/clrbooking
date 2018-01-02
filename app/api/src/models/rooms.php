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
        return $this->belongsToMany("\\App\\Models\\Items", 'room_items', 'room_id', 'item_id');
    }

    public function periods()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\RoomBook', 'room_id');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }

}