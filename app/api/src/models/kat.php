<?php
/**
 * Created by PhpStorm.
 * User: Ifigeneia
 * Date: 11/12/2017
 * Time: 13:10
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;


class Kat extends Model
{
    public $timestamps = false;
    protected $table = 'kat';

    public function tm()
    {
        $this->belongsTo('\\App\\Models\\Tm', 'tm_id');
    }

}