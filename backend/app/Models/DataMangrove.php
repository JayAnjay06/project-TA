<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataMangrove extends Model
{
    use HasFactory;

    protected $table = 'data_mangroves'; 
    protected $primaryKey = 'data_id';  

    protected $fillable = [
        'lokasi_id', 
        'jenis_id', 
        'kerapatan', 
        'tinggi_rata2', 
        'diameter_rata2', 
        'kondisi', 
        'tanggal_pengamatan', 
        'user_id'
    ];

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id');
    }

    public function jenis()
    {
        return $this->belongsTo(JenisMangrove::class, 'jenis_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
