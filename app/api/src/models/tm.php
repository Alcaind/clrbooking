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
    public $timestamps = false;
    protected $table = 'tm';

    public function kat()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\Kat', 'tm_id');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }

    public function users()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\Users', 'tm_id');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }

}