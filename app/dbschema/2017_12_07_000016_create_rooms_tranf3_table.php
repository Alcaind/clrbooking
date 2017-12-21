<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomsTranf3Table extends Migration
{
    /**
     * Schema table name to migrate
     * @var string
     */
    public $set_schema_table = 'rooms_tranf3';

    /**
     * Run the migrations.
     * @table rooms_tranf3
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
            $table->string('c10')->nullable()->default(null);
            $table->string('c11')->nullable()->default(null);
            $table->string('c12')->nullable()->default(null);
            $table->string('c13')->nullable()->default(null);
            $table->string('c14')->nullable()->default(null);
            $table->string('c15')->nullable()->default(null);
            $table->string('c16')->nullable()->default(null);
            $table->string('c17')->nullable()->default(null);
            $table->string('c18')->nullable()->default(null);
            $table->string('c19')->nullable()->default(null);
            $table->string('c20')->nullable()->default(null);
            $table->string('c21')->nullable()->default(null);
            $table->string('c22')->nullable()->default(null);
            $table->string('c23')->nullable()->default(null);
            $table->string('c24')->nullable()->default(null);
            $table->string('c25')->nullable()->default(null);
            $table->string('c26')->nullable()->default(null);
            $table->string('c27')->nullable()->default(null);
            $table->string('c28')->nullable()->default(null);
            $table->string('c29')->nullable()->default(null);
            $table->string('c30')->nullable()->default(null);
            $table->string('c31')->nullable()->default(null);
            $table->string('c32')->nullable()->default(null);
            $table->string('c33')->nullable()->default(null);
            $table->string('c34')->nullable()->default(null);
            $table->string('c35')->nullable()->default(null);
            $table->string('c36')->nullable()->default(null);
            $table->string('c37')->nullable()->default(null);
            $table->string('c38')->nullable()->default(null);
            $table->string('c39')->nullable()->default(null);
            $table->string('c40')->nullable()->default(null);
            $table->string('c41')->nullable()->default(null);
            $table->string('c42')->nullable()->default(null);
            $table->string('c43')->nullable()->default(null);
            $table->string('c44')->nullable()->default(null);
            $table->string('c45')->nullable()->default(null);
            $table->string('c46')->nullable()->default(null);
            $table->string('c47')->nullable()->default(null);
            $table->string('c48')->nullable()->default(null);
            $table->string('c49')->nullable()->default(null);
            $table->string('c50')->nullable()->default(null);
            $table->string('c51')->nullable()->default(null);
            $table->string('c52')->nullable()->default(null);
            $table->string('c53')->nullable()->default(null);
            $table->string('c54')->nullable()->default(null);
            $table->string('c55')->nullable()->default(null);
            $table->string('c56')->nullable()->default(null);
            $table->string('c57')->nullable()->default(null);
            $table->string('c58')->nullable()->default(null);
            $table->string('c59')->nullable()->default(null);
            $table->string('c60')->nullable()->default(null);
            $table->string('c61')->nullable()->default(null);
            $table->string('c62')->nullable()->default(null);
            $table->string('c63')->nullable()->default(null);
            $table->string('c64')->nullable()->default(null);
            $table->string('c65')->nullable()->default(null);
            $table->string('c66')->nullable()->default(null);
            $table->string('c67')->nullable()->default(null);
            $table->string('c68')->nullable()->default(null);
            $table->string('c69')->nullable()->default(null);
            $table->string('c70')->nullable()->default(null);
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
