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
    public $timestamps = false;
    protected $table = 'roles';

    public function users()
    {
        //return "lola";
        try {
            $ret = $this->belongsToMany('\\App\\Models\\Users', 'users_roles', 'role_id', 'user_id')->withPivot('comment', 'exp_dt', 'dt', 'status');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }
}