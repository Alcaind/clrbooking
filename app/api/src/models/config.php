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

//    public function periods()
//    {
//        try {
//            $ret = $this->hasMany('\\App\\Models\\Periods', 'conf_id');
//        } catch (\Exception $e) {
//            return $e->getMessage();
//        }
//        return $ret;
//    }

//    public function ps()
//    {
//        try {
//            $ret = $this->hasOne('\\App\\Models\\Ps', 'conf_id');
//            //print_r($ret);
//        } catch (\Exception $e) {
//            return $e->getMessage();
//        }
//        return $ret;
//    }
}