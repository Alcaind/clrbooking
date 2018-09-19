<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 16:07
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Items extends Model
{

    protected $table = 'items';


    public function rooms()
    {
        return $this->belongsToMany("\\App\\Models\\Rooms", 'room_items', 'item_id', 'room_id')->withPivot('comments', 'stat', 'from', 'to');
    }

    public function itemtype()
    {
        return $this->belongsTo('\\App\\Models\\ItemType', 'type_id');
    }

}