<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Users extends Model {
    public $timestamps = false;
    protected $table = 'users';

    public function roles()
    {
        return $this->belongsToMany('\\App\\Models\\Roles', 'users_roles', 'role_id', 'user_id');
    }

    public function tm()
    {
        $this->belongsTo('\\App\\Models\\Tm', 'tm_id');
    }

    public function requests()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\Requests', 'user_id');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }

//    public function roombook()            Einai users_id 'h user_id (einai ta idia kai exei ginei apla la8os??????????)
//    {
//        try {
//            $ret = $this->hasMany('\\App\\Models\\RoomBook', 'users_id');
//        } catch (\Exception $e) {
//            return $e->getMessage();
//        }
//        return $ret;
//    }

}