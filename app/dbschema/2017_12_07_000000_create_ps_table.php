<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePsTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'ps';

    /**
     * Run the migrations.
     * @table ps
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->integer('tm_code')->nullable()->default(null);
            $table->string('tm_per')->nullable()->default(null);
            $table->char('pm', 3)->nullable()->default('ΠΡΟ');
            $table->integer('tma_code')->nullable()->default(null);
            $table->string('tma_per')->nullable()->default(null);
            $table->integer('ps_ex')->nullable()->default(null);
            $table->integer('ps_dm')->nullable()->default(null);
            $table->string('ps_km', 4)->nullable()->default(null);
            $table->string('teacher')->nullable()->default(null);
            $table->integer('conf_id')->nullable()->default(null);
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
