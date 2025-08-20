<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lokasis', function (Blueprint $table) {
            $table->id('lokasi_id');
            $table->string('nama_lokasi');
            $table->string('koordinat');
            $table->float('luas_area');
            $table->text('deskripsi')->nullable();
            $table->timestamp('tanggal_input')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lokasis');
    }
};
