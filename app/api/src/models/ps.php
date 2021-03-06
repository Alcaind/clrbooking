<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 10:46
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Ps extends Model
{

    protected $table = 'ps';

    public function config()
    {
        return $this->belongsTo('\\App\\Models\\Config', 'conf_id');
    }

    public function requests()
    {
        try {
            $ret = $this->hasMany('\\App\\Models\\Requests', 'ps_id');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
        return $ret;
    }

    public function stats()
    {
        return $this->hasOne('\\App\\Models\\Stats', 'ps_id');
    }

    public function tm()
    {
        return $this->belongsTo("\\App\\Models\\Tm", 'tm_code');
    }

    public function users()
    {
        return $this->belongsToMany("\\App\\Models\\Users", 'ps_teachers', 'ps_id', 'user_id')->withPivot('comment');
    }
}