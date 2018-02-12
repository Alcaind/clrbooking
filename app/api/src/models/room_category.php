<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:10
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class RoomCategory extends Model
{
    protected $table = 'room_category';

    public function rooms()
    {
        $this->hasMany('\\App\\Models\\Rooms', 'category');
    }
}