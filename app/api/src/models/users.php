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
}