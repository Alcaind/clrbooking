<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersRolesTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'users_roles';

    /**
     * Run the migrations.
     * @table users_roles
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->integer('user_id')->nullable()->default(null);
            $table->integer('role_id')->nullable()->default(null);
            $table->string('comment')->nullable()->default(null);
            $table->timestamp('exp_dt')->nullable()->default(null);
            $table->timestamp('dt')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('status')->nullable()->default(null);
            $table->increments('id');

            $table->index(["role_id"], 'users_roles_roles_id_fk');

            $table->index(["user_id"], 'users_roles_users_id_fk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
     public function down()
     {
       Schema::dropIfExists($this->set_schema_table);
     }
}
