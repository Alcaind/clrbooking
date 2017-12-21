<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransfPsTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'transf_ps';

    /**
     * Run the migrations.
     * @table transf_ps
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->string('c1')->nullable()->default(null);
            $table->string('c2')->nullable()->default(null);
            $table->string('c3')->nullable()->default(null);
            $table->string('c4')->nullable()->default(null);
            $table->string('c5')->nullable()->default(null);
            $table->string('c6')->nullable()->default(null);
            $table->string('c7')->nullable()->default(null);
            $table->string('c8')->nullable()->default(null);
            $table->string('c9')->nullable()->default(null);
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
