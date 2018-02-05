<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:10
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class RoomUse extends Model
{
    protected $table = 'room_use';

    public function rooms()
    {
        $this->belongsToMany('\\App\\Models\\Rooms', 'rooms_room_use', 'rooms_use_id', 'rooms_id')->withPivot('comment');
    }
}