<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    use HasFactory;

    protected $primaryKey = 'lokasi_id';

    protected $fillable = [
        'nama_lokasi',
        'koordinat',
        'luas_area',
        'deskripsi',
        'tanggal_input'
    ];
}
