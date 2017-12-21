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
    public $timestamps = false;
    protected $table = 'room_book';

//    public function users()             Einai users_id 'h user_id (einai ta idia kai exei ginei apla la8os??????????)
//    {
//        $this->belongsTo('\\App\\Models\\Users', 'users_id');
//    }

    public function rooms()
    {
        $this->belongsTo('\\App\\Models\\Rooms', 'room_id');
    }

}