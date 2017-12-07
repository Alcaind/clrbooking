<?php
/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 06/12/2017
 * Time: 5:23 μμ
 */

namespace App;

use  \Illuminate\Database\Eloquent\Model as Model;

class Users extends Model {
    protected $table = 'users';

    public function getRoles()
    {
        return $this->belongsTo('App\users_roles');
    }
}