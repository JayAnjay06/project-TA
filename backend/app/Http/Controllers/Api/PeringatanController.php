<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Peringatan;
use Illuminate\Http\Request;

class PeringatanController extends Controller
{
    public function index()
    {
        $data = Peringatan::with('lokasi')->get();
        return response()->json($data);
    }

    public function show($id)
    {
        $data = Peringatan::with('lokasi')->find($id);
        if(!$data) return response()->json(['message'=>'Peringatan tidak ditemukan'],404);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $request->validate([
            'lokasi_id'=>'required|exists:lokasis,lokasi_id',
            'jenis_kerusakan'=>'required|string',
            'tanggal_kejadian'=>'required|date',
            'deskripsi'=>'required|string',
            'status'=>'required|in:aktif,ditangani,selesai'
        ]);

        $data = Peringatan::create($request->all());
        return response()->json(['message'=>'Peringatan berhasil dibuat','data'=>$data]);
    }

    public function update(Request $request,$id)
    {
        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = Peringatan::find($id);
        if(!$data) return response()->json(['message'=>'Peringatan tidak ditemukan'],404);

        $request->validate([
            'lokasi_id'=>'sometimes|exists:lokasis,lokasi_id',
            'jenis_kerusakan'=>'sometimes|string',
            'tanggal_kejadian'=>'sometimes|date',
            'deskripsi'=>'sometimes|string',
            'status'=>'sometimes|in:aktif,ditangani,selesai'
        ]);

        $data->update($request->all());
        return response()->json(['message'=>'Peringatan berhasil diperbarui','data'=>$data]);
    }

    public function destroy(Request $request,$id)
    {
        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = Peringatan::find($id);
        if(!$data) return response()->json(['message'=>'Peringatan tidak ditemukan'],404);

        $data->delete();
        return response()->json(['message'=>'Peringatan berhasil dihapus']);
    }
}
