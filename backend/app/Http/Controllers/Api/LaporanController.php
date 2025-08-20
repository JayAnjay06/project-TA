<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index()
    {
        $data = Laporan::with(['user','lokasi'])->get();
        return response()->json($data);
    }

    public function show($id)
    {
        $data = Laporan::with(['user','lokasi'])->find($id);
        if(!$data) return response()->json(['message'=>'Laporan tidak ditemukan'],404);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'=>'required|exists:users,user_id',
            'lokasi_id'=>'required|exists:lokasis,lokasi_id',
            'jenis_laporan'=>'required|string',
            'tanggal_laporan'=>'required|date',
            'isi_laporan'=>'required|string'
        ]);

        $data = Laporan::create($request->all());
        return response()->json(['message'=>'Laporan berhasil dibuat','data'=>$data]);
    }

    public function update(Request $request,$id)
    {
        $data = Laporan::find($id);
        if(!$data) return response()->json(['message'=>'Laporan tidak ditemukan'],404);

        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $request->validate([
            'jenis_laporan'=>'sometimes|string',
            'tanggal_laporan'=>'sometimes|date',
            'isi_laporan'=>'sometimes|string'
        ]);

        $data->update($request->all());
        return response()->json(['message'=>'Laporan berhasil diperbarui','data'=>$data]);
    }

    public function destroy(Request $request,$id)
    {
        $data = Laporan::find($id);
        if(!$data) return response()->json(['message'=>'Laporan tidak ditemukan'],404);

        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data->delete();
        return response()->json(['message'=>'Laporan berhasil dihapus']);
    }
}
