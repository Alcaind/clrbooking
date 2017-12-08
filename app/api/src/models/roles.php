<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Roles extends Model {
    protected $table = 'roles';
    public $timestamps = false;

    public function getUsers () {
        return $this->belongsToMany('App\Models\Users', 'users_roles', 'user_id', 'role_id');
    }
}