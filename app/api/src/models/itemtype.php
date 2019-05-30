<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 21/06/2018
 * Time: 12:48
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class ItemType extends Model
{
    protected $table = 'item_type';

//    public
//    function rooms()
//    {
//        return $this->belongsToMany("\\App\\Models\\Rooms", 'room_items', 'item_id', 'room_id')->withPivot('comments', 'stat', 'from', 'to');
//    }


    public function items()
    {
        return $this->hasMany('\\App\\Models\\Items', 'type_id');
    }
}