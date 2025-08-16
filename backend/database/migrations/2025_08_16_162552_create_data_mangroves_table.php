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
            $table->foreignId('lokasi_id')->constrained('lokasis', 'lokasi_id')->onDelete('cascade');  
            $table->foreignId('jenis_id')->constrained('jenis_mangroves', 'jenis_id')->onDelete('cascade'); 
            $table->integer('kerapatan'); 
            $table->float('tinggi_rata2'); 
            $table->float('diameter_rata2'); 
            $table->enum('kondisi', ['baik', 'sedang', 'buruk']); 
            $table->date('tanggal_pengamatan');  
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_mangroves');
    }
};
