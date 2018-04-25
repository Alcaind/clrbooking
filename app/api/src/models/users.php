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

    protected $table = 'users';

    public function roles()
    {
        return $this->belongsToMany('\\App\\Models\\Roles', 'users_roles', 'user_id', 'role_id')->withPivot('comment', 'exp_dt', 'status');
    }

    public function tm()
    {
        return $this->belongsTo('\\App\\Models\\Tm', 'tm_id');
    }

    public function tmsUser()
    {
        return $this->belongsToMany('\\App\\Models\\Tm', 'tm_users', 'user_id', 'tm_id')->withPivot('comments');
    }
//
//    public function teacher()
//    {
//        return $this->belongsToMany('\\App\\Models\\Ps', 'ps_teacher','tm_id', 'user_id')->withPivot ('comment');
//    }

    public function superTms()
    {
        return $this->hasMany('\\App\\Models\\Tm', 'supervisor');
    }

    public function ucategories()
    {
        return $this->belongsTo('\\App\\Models\\Ucategories', 'cat_id');
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

    public function roombook()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\RoomBook', 'teacher');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }

}