<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporans', function (Blueprint $table) {
        $table->id('laporan_id');
        $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade'); 
        $table->foreignId('lokasi_id')->constrained('lokasis', 'lokasi_id')->onDelete('cascade');  
        $table->string('jenis_laporan'); 
        $table->date('tanggal_laporan');  
        $table->text('isi_laporan'); 
        $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};
