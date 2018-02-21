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


    public function items()
    {
        return $this->belongsToMany("\\App\\Models\\Items", 'room_items', 'room_id', 'item_id')->withPivot('comments', 'stat', 'from', 'to');
    }

    public function room_use()
    {
        return $this->belongsToMany("\\App\\Models\\RoomUse", 'rooms_room_use', 'rooms_id', 'room_use_id')->withPivot('comment');
    }

    public function room_category()
    {
        return $this->belongsTo("\\App\\Models\\RoomCategory", 'category');
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

    public function config()
    {
        return $this->belongsTo('\\App\\Models\\Config', 'conf_id');
    }

    public function tms()
    {
        return $this->belongsToMany("\\App\\Models\\Tm", 'rooms_tms', 'room_id', 'tm_id')->withPivot('comments');
    }

//    public function requests()
//    {
//        try {
//            $ret = $this->hasMany('\\App\\Models\\Requests', 'user_id');
//        } catch (\Exception $e) {
//            return $e->getMessage();
//        }
//        return $ret;
//    }

}