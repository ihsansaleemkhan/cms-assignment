<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->string('title_ar')
                ->nullable()
                ->after('title');
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->string('title_ar')
                ->nullable()
                ->after('title');

            $table->longText('body_ar')
                ->nullable()
                ->after('body');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'title_ar',
                'body_ar',
            ]);
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn('title_ar');
        });
    }
};