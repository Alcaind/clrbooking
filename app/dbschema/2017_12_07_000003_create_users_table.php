<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'users';

    /**
     * Run the migrations.
     * @table users
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->integer('tm_id')->nullable()->default(null);
            $table->string('fname')->nullable()->default(null);
            $table->string('sname')->nullable()->default(null);
            $table->string('phone')->nullable()->default(null);
            $table->string('em_main', 128)->nullable()->default(null);
            $table->string('em_sec', 128)->nullable()->default(null);
            $table->string('em_pant', 128)->nullable()->default(null);
            $table->integer('cat_id')->nullable()->default(null);
            $table->string('comments')->nullable()->default(null);
            $table->string('user', 64)->nullable()->default(null);
            $table->string('hash')->nullable()->default(null);
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
