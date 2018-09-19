<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 12/12/2017
 * Time: 13:24
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Requests extends Model
{

    protected $table = 'requests';

    protected $appends = ['if_expired'];

    public function getIfExpiredAttribute()
    {
        $rdt = new \DateTime($this->req_dt);

        $rdt->add(new \DateInterval('P' . intval($this->config->req_exp_dates) . 'D'));

        $ndt = new \DateTime('now');

        return $rdt->diff($ndt)->format('%R');
        //return $ndt->format('Y-m-d') . ' - ' . $rdt->format('Y-m-d');
    }

    public function users()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'admin');
    }

    public function ps()
    {
        return $this->belongsTo('\\App\\Models\\Ps', 'ps_id');
    }

    public function rooms()
    {
        return $this->belongsToMany('\\App\\Models\\Rooms', 'request_rooms', 'req_id', 'room_id')->withPivot('id', 'comment', 'teacher', 'fromt', 'tot', 'date_index');
    }

    public function periods()
    {
        return $this->belongsTo('\\App\\Models\\Periods', 'period');
    }

    public function guests()
    {
        return $this->hasMany('\\App\\Models\\Guests', 'req_id');
    }

    public function room_use()
    {
        return $this->belongsTo('\\App\\Models\\RoomUse', 'class_use');
    }

    public function config()
    {
        return $this->belongsTo('\\App\\Models\\Config', 'conf_id');
    }

    public function tm()
    {
        return $this->belongsTo('\\App\\Models\\Tm', 'tm_id');
    }

    public function roombook()
    {
        return $this->hasMany('\\App\\Models\\RoomBook', 'req_id');
    }

    public function usersRequests()
    {
        return $this->belongsToMany('\\App\\Models\\Rooms', 'request_rooms', 'req_id', 'room_id')->withPivot('id', 'comment', 'teacher', 'fromt', 'tot', 'date_index');
    }

}