<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peringatans', function (Blueprint $table) {
            $table->id('peringatan_id');
            $table->unsignedBigInteger('lokasi_id');
            $table->string('jenis_kerusakan');
            $table->dateTime('tanggal_kejadian');
            $table->text('deskripsi');
            $table->enum('status',['aktif','ditangani','selesai']);
            $table->timestamps();

            $table->foreign('lokasi_id')->references('lokasi_id')->on('lokasis')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peringatans');
    }
};
