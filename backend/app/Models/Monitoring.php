<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Monitoring extends Model
{
    use HasFactory;

    protected $table = 'monitorings';
    protected $primaryKey = 'monitoring_id'; 

    protected $fillable = [
        'lokasi_id',
        'parameter',
        'nilai',
        'tanggal_monitoring',
        'sumber_data'
    ];

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id');
    }
}
