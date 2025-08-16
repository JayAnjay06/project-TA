<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peringatan_dinis', function (Blueprint $table) {
            $table->id('peringatan_id'); 
            $table->foreignId('lokasi_id')->constrained('lokasis', 'lokasi_id')->onDelete('cascade');  
            $table->string('jenis_kerusakan');  
            $table->timestamp('tanggal_kejadian'); 
            $table->text('deskripsi');  
            $table->enum('status', ['aktif', 'ditangani', 'selesai']);
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peringatan_dinis');
    }
};
