<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edukasi extends Model
{
    use HasFactory;

    protected $table = 'edukasis'; 
    protected $primaryKey = 'edukasi_id';

    protected $fillable = [
        'judul', 
        'konten', 
        'jenis_media', 
        'url'
    ];
}
