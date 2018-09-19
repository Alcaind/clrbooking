<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:05
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Tm extends Model
{

    protected $table = 'tm';

    public function kat()
    {
        return $this->hasMany('\\App\\Models\\Kat', 'tm_id');
    }

    public function Users()
    {
        return $this->belongsToMany('\\App\\Models\\Users', 'tm_users', 'tm_id', 'user_id')->withPivot('comments', 'defaultTm');
    }

    public function supervisor()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'supervisor');
    }

    public function rooms()
    {
        return $this->belongsToMany("\\App\\Models\\Rooms", 'rooms_tms', 'tm_id', 'room_id')->withPivot('comments');
    }

    public function ps()
    {
        return $this->hasMany("\\App\\Models\\Ps", 'tm_code');
    }

}