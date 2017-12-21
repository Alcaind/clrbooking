<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomsTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'rooms';

    /**
     * Run the migrations.
     * @table rooms
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->string('name')->nullable()->default(null);
            $table->string('address')->nullable()->default(null);
            $table->string('building')->nullable()->default(null);
            $table->string('floor', 128)->nullable()->default(null);
            $table->string('status', 64)->default('0');
            $table->string('stat_comm')->nullable()->default(null);
            $table->integer('active')->nullable()->default(null);
            $table->string('destroyed', 4)->nullable()->default(null)->comment('Χαλασμένα καθίσματα');
            $table->string('nonexist', 4)->nullable()->default(null)->comment('Χαλασμένα έδρανα (για γραπτές εξετασεις)');
            $table->integer('capasity')->nullable()->default(null);
            $table->integer('width')->nullable()->default(null);
            $table->integer('height')->nullable()->default(null);
            $table->string('xoros')->nullable()->default(null)->comment('π.χ. \'{(10,15),(1,5),(10,15)}\'');
            $table->integer('exams_capasity')->nullable()->default(null);
            $table->string('capasity_categ', 10)->nullable()->default(null);
            $table->string('tm_owner')->nullable()->default(null);
            $table->timestamp('dt')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('conf_id')->nullable()->default(null);
            $table->integer('use_id')->nullable()->default(null);
            $table->string('type', 64)->nullable()->default(null);
            $table->string('use_str', 40)->nullable()->default(null);
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
