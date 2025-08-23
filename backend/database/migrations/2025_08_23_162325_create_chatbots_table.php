<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chatbots', function (Blueprint $table) {
            $table->id('chatbot_id');
            $table->string('sender');
            $table->text('message');
            $table->unsignedBigInteger('reply_to')->nullable();
            $table->timestamps();
            
            $table->foreign('reply_to')->references('chatbot_id')->on('chatbots')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chatbots');
    }
};
