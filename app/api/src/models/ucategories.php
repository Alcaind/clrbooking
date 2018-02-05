<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 07/12/2017
 * Time: 3:56 μμ
 */

namespace App\Models;

use  \Illuminate\Database\Eloquent\Model as Model;

class Ucategories extends Model
{

    protected $table = 'ucategories';

    public function users()
    {
        return $this->hasMany('\\App\\Models\\Users', 'cat_id');
    }
}