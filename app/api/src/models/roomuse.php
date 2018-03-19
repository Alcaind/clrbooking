<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 15:35
 */

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class RoomUse extends Model
{

    protected $table = 'room_use';

    public function requests()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\Requests', 'class_use');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }
}