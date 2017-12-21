<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRequestsTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'requests';

    /**
     * Run the migrations.
     * @table requests
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->dateTime('req_dt')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('user_id')->nullable()->default(null);
            $table->longText('descr')->nullable()->default(null);
            $table->string('period', 5)->nullable()->default(null);
            $table->integer('ps_id')->nullable()->default(null)->comment('ma8ima apo ps');
            $table->string('teacher')->nullable()->default(null);
            $table->integer('from_book')->nullable()->default(null)->comment('an einai apo akyrosi edo fainetai se poia anaferete');
            $table->integer('req_stat')->nullable()->default(null);
            $table->string('class_use')->nullable()->default(null);
            $table->string('links')->nullable()->default(null);
            $table->timestamp('fromdt')->nullable()->default(null);
            $table->timestamp('todt')->nullable()->default(null);
            $table->string('protocol_id')->nullable()->default(null);
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
