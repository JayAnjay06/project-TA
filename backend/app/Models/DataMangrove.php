<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataMangrove extends Model
{
    use HasFactory;

    protected $primaryKey = 'data_id';

    protected $fillable = [
        'lokasi_id',
        'kerapatan',
        'tinggi_rata2',
        'diameter_rata2',
        'kondisi',
        'tanggal_pengamatan'
    ];

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id');
    }
}
