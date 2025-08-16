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
            $table->foreignId('lokasi_id')->constrained('lokasis', 'lokasi_id')->onDelete('cascade');  
            $table->string('parameter');  
            $table->float('nilai'); 
            $table->timestamp('tanggal_monitoring');  
            $table->string('sumber_data');  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitorings');
    }
};
