<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Config extends Model
{
    protected $table = 'config';

    public function rooms()
    {
        return $this->hasMany('\\App\\Models\\Rooms', 'conf_id');
    }

    public function periods()
    {
        return $this->hasMany('\\App\\Models\\Periods', 'conf_id');
    }

    public function ps()
    {
        return $this->hasMany('\\App\\Models\\Ps', 'conf_id');
    }

    public function requests()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\Requests', 'conf_id');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }


}