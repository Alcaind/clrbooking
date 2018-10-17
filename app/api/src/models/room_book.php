<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 08/03/2018
 * Time: 16:18
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class RoomBook extends Model
{
//    protected $casts = [
//        'date_index' => 'integer',
//    ];

    protected $table = 'request_rooms';

    public function rooms()
    {
        return $this->belongsTo('\\App\\Models\\Rooms', 'room_id');
    }

    public function requests()
    {
        return $this->belongsTo('\\App\\Models\\Requests', 'req_id');
    }

    public function users()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'teacher');
    }

}