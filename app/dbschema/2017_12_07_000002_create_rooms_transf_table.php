<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomsTransfTable extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'rooms_transf';

    /**
     * Run the migrations.
     * @table rooms_transf
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable($this->set_schema_table)) return;
        Schema::create($this->set_schema_table, function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->string('c1');
            $table->string('c2');
            $table->string('c3');
            $table->string('c4');
            $table->string('c5');
            $table->string('c6');
            $table->string('c7');
            $table->string('c8');
            $table->string('c10');
            $table->string('c11');
            $table->string('c12');
            $table->string('c13');
            $table->integer('column_13')->nullable()->default(null);
            $table->integer('column_14')->nullable()->default(null);
            $table->integer('column_15')->nullable()->default(null);
            $table->integer('column_16')->nullable()->default(null);
            $table->integer('column_17')->nullable()->default(null);
            $table->integer('column_18')->nullable()->default(null);
            $table->integer('column_19')->nullable()->default(null);
            $table->integer('column_20')->nullable()->default(null);
            $table->integer('column_21')->nullable()->default(null);
            $table->integer('column_22')->nullable()->default(null);
            $table->integer('column_23')->nullable()->default(null);
            $table->integer('column_24')->nullable()->default(null);
            $table->integer('column_25')->nullable()->default(null);
            $table->integer('column_26')->nullable()->default(null);
            $table->integer('column_27')->nullable()->default(null);
            $table->integer('column_28')->nullable()->default(null);
            $table->integer('column_29')->nullable()->default(null);
            $table->integer('column_30')->nullable()->default(null);
            $table->integer('column_31')->nullable()->default(null);
            $table->integer('column_32')->nullable()->default(null);
            $table->integer('column_33')->nullable()->default(null);
            $table->integer('column_34')->nullable()->default(null);
            $table->integer('column_35')->nullable()->default(null);
            $table->integer('column_36')->nullable()->default(null);
            $table->integer('column_37')->nullable()->default(null);
            $table->integer('column_38')->nullable()->default(null);
            $table->integer('column_39')->nullable()->default(null);
            $table->integer('column_40')->nullable()->default(null);
            $table->integer('column_41')->nullable()->default(null);
            $table->integer('column_42')->nullable()->default(null);
            $table->integer('column_43')->nullable()->default(null);
            $table->integer('column_44')->nullable()->default(null);
            $table->integer('column_45')->nullable()->default(null);
            $table->integer('column_46')->nullable()->default(null);
            $table->integer('column_47')->nullable()->default(null);
            $table->integer('column_48')->nullable()->default(null);
            $table->integer('column_49')->nullable()->default(null);
            $table->integer('column_50')->nullable()->default(null);
            $table->integer('column_51')->nullable()->default(null);
            $table->integer('column_52')->nullable()->default(null);
            $table->integer('column_53')->nullable()->default(null);
            $table->integer('column_54')->nullable()->default(null);
            $table->integer('column_55')->nullable()->default(null);
            $table->integer('column_56')->nullable()->default(null);
            $table->integer('column_57')->nullable()->default(null);
            $table->integer('column_58')->nullable()->default(null);
            $table->integer('column_59')->nullable()->default(null);
            $table->integer('column_60')->nullable()->default(null);
            $table->integer('column_61')->nullable()->default(null);
            $table->integer('column_62')->nullable()->default(null);
            $table->integer('column_63')->nullable()->default(null);
            $table->integer('column_64')->nullable()->default(null);
            $table->integer('column_65')->nullable()->default(null);
            $table->integer('column_66')->nullable()->default(null);
            $table->integer('column_67')->nullable()->default(null);
            $table->integer('column_68')->nullable()->default(null);
            $table->integer('column_69')->nullable()->default(null);
            $table->integer('column_70')->nullable()->default(null);
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
