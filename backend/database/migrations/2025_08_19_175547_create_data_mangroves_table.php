<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_mangroves', function (Blueprint $table) {
            $table->id('data_id');
            $table->unsignedBigInteger('lokasi_id');
            $table->integer('kerapatan');
            $table->float('tinggi_rata2');
            $table->float('diameter_rata2');
            $table->enum('kondisi', ['baik','sedang','buruk']);
            $table->date('tanggal_pengamatan');
            $table->timestamps();

            $table->foreign('lokasi_id')->references('lokasi_id')->on('lokasis')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_mangroves');
    }
};
