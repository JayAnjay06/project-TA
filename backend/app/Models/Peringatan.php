<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peringatan extends Model
{
    use HasFactory;

    protected $primaryKey = 'peringatan_id';

    protected $fillable = [
        'lokasi_id',
        'jenis_kerusakan',
        'tanggal_kejadian',
        'deskripsi',
        'status'
    ];

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class,'lokasi_id');
    }
}
