<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('edukasis', function (Blueprint $table) {
            $table->id('edukasi_id');
            $table->string('judul');
            $table->text('konten');
            $table->enum('jenis_media',['artikel','video','gambar','game']);
            $table->string('url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('edukasis');
    }
};
