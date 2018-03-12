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
    protected $table = 'room_book';

    public function room()
    {
        return $this->belongsTo('\\App\\Models\\Rooms');
    }

}