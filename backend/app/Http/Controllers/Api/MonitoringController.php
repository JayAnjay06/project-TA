<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Monitoring;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    public function index()
    {
        $data = Monitoring::with('lokasi')->get();
        return response()->json($data);
    }

    public function show($id)
    {
        $data = Monitoring::with('lokasi')->find($id);
        if (!$data) return response()->json(['message'=>'Monitoring tidak ditemukan'],404);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') return response()->json(['message'=>'Unauthorized'],403);

        $request->validate([
            'lokasi_id'=>'required|exists:lokasis,lokasi_id',
            'parameter'=>'required|string',
            'nilai'=>'required|numeric',
            'tanggal_monitoring'=>'required|date',
            'sumber_data'=>'required|string'
        ]);

        $data = Monitoring::create($request->all());
        return response()->json(['message'=>'Monitoring berhasil dibuat','data'=>$data]);
    }

    public function update(Request $request,$id)
    {
        if ($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = Monitoring::find($id);
        if (!$data) return response()->json(['message'=>'Monitoring tidak ditemukan'],404);

        $request->validate([
            'lokasi_id'=>'sometimes|exists:lokasis,lokasi_id',
            'parameter'=>'sometimes|string',
            'nilai'=>'sometimes|numeric',
            'tanggal_monitoring'=>'sometimes|date',
            'sumber_data'=>'sometimes|string'
        ]);

        $data->update($request->all());
        return response()->json(['message'=>'Monitoring berhasil diperbarui','data'=>$data]);
    }

    public function destroy(Request $request,$id)
    {
        if ($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = Monitoring::find($id);
        if (!$data) return response()->json(['message'=>'Monitoring tidak ditemukan'],404);

        $data->delete();
        return response()->json(['message'=>'Monitoring berhasil dihapus']);
    }
}
