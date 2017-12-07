<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePeriodsTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'periods';

    /**
     * Run the migrations.
     * @table periods
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->string('descr', 64)->nullable()->default(null);
            $table->string('synt', 12)->nullable()->default(null);
            $table->date('fromd')->nullable()->default(null);
            $table->date('tod')->nullable()->default(null);
            $table->string('comments')->nullable()->default(null);
            $table->integer('conf_id')->nullable()->default(null);
            $table->integer('order')->nullable()->default(null);
            $table->integer('status')->nullable()->default(null);
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
