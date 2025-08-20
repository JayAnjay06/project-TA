<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitorings', function (Blueprint $table) {
            $table->id('monitoring_id');
            $table->unsignedBigInteger('lokasi_id');
            $table->string('parameter');
            $table->float('nilai');
            $table->dateTime('tanggal_monitoring');
            $table->string('sumber_data');
            $table->timestamps();

            $table->foreign('lokasi_id')->references('lokasi_id')->on('lokasis')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitorings');
    }
};
