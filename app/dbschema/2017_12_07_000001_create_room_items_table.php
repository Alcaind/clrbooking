<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomItemsTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'room_items';

    /**
     * Run the migrations.
     * @table room_items
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->integer('id')->nullable()->default(null);
            $table->integer('room_id')->nullable()->default(null);
            $table->integer('item_id')->nullable()->default(null);
            $table->integer('comments')->nullable()->default(null);
            $table->timestamp('dt')->nullable()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->integer('stat')->nullable()->default(null);
            $table->timestamp('from')->nullable()->default(null);
            $table->timestamp('to')->nullable()->default(null);
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
