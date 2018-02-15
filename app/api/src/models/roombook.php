<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:46
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class RoomBook extends Model
{

    protected $table = 'room_book';

    public function rooms()
    {
        $this->belongsTo('\\App\\Models\\Rooms', 'room_id');
    }

    public function users()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'user_id');
    }

    public function requests()
    {
        return $this->belongsTo('\\App\\Models\\Requests', 'request_id');
    }



}