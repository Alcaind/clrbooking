<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/05/2018
 * Time: 13:30
 */

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class usersRequests extends Model
{
    protected $table = 'users_requests';

    public function fromuser()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'from_user');
    }

    public function tousers()
    {
        return $this->belongsTo('\\App\\Models\\Users', 'to_users');
    }

//    public function tms()
//    {
//        return $this->belongsTo('\\App\\Models\\Tm', 'tm_users', 'user_id', 'to_users')->withPivot( 'tm_id');
//    }

    public function roombook()
    {
        return $this->belongsTo('\\App\\Models\\RoomBook', 'rr_id');
    }
}