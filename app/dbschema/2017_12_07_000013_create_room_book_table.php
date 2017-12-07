<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomBookTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'room_book';

    /**
     * Run the migrations.
     * @table room_book
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->increments('id');
            $table->integer('user_id')->nullable()->default(null);
            $table->integer('room_id')->nullable()->default(null);
            $table->integer('date_index')->nullable()->default(null)->comment('Ποια μέρα (1-7) είναι η δεσμευση');
            $table->time('fromt')->nullable()->default(null);
            $table->time('tot')->nullable()->default(null);
            $table->integer('type')->nullable()->default(null)->comment('0 - syxnotita
1 - memonomeni');
            $table->timestamp('dt')->nullable()->default(null);
            $table->integer('period')->nullable()->default(null);

            $table->index(["user_id"], 'class_book_users_id_fk');

            $table->index(["room_id"], 'class_book_class_id_fk');
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
