<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chatbot extends Model
{
    use HasFactory;

    protected $primaryKey = 'chatbot_id';

    protected $fillable = [
        'sender',
        'message',
        'reply_to',
    ];

    public function replies()
    {
        return $this->hasMany(Chatbot::class, 'reply_to');
    }

    public function parent()
    {
        return $this->belongsTo(Chatbot::class, 'reply_to');
    }
}
