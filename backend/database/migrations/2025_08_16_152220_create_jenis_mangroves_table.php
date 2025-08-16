<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jenis_mangroves', function (Blueprint $table) {
            $table->id('jenis_id');
            $table->string('nama_ilmiah'); 
            $table->string('nama_lokal'); 
            $table->text('deskripsi'); 
            $table->string('gambar')->nullable(); 
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('jenis_mangroves');
    }
};
