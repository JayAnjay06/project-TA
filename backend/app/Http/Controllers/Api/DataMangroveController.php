<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataMangrove;
use Illuminate\Http\Request;

class DataMangroveController extends Controller
{
    public function index()
    {
        $data = DataMangrove::with('lokasi')->get();
        return response()->json($data);
    }

    public function show($id)
    {
        $data = DataMangrove::with('lokasi')->find($id);
        if (!$data) return response()->json(['message'=>'Data mangrove tidak ditemukan'],404);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $request->validate([
            'lokasi_id'=>'required|exists:lokasis,lokasi_id',
            'kerapatan'=>'required|integer',
            'tinggi_rata2'=>'required|numeric',
            'diameter_rata2'=>'required|numeric',
            'kondisi'=>'required|in:baik,sedang,buruk',
            'tanggal_pengamatan'=>'required|date'
        ]);

        $data = DataMangrove::create($request->all());
        return response()->json(['message'=>'Data mangrove berhasil dibuat','data'=>$data]);
    }

    public function update(Request $request,$id)
    {
        if ($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = DataMangrove::find($id);
        if (!$data) return response()->json(['message'=>'Data mangrove tidak ditemukan'],404);

        $request->validate([
            'lokasi_id'=>'sometimes|exists:lokasis,lokasi_id',
            'kerapatan'=>'sometimes|integer',
            'tinggi_rata2'=>'sometimes|numeric',
            'diameter_rata2'=>'sometimes|numeric',
            'kondisi'=>'sometimes|in:baik,sedang,buruk',
            'tanggal_pengamatan'=>'sometimes|date'
        ]);

        $data->update($request->all());
        return response()->json(['message'=>'Data mangrove berhasil diperbarui','data'=>$data]);
    }

    public function destroy(Request $request,$id)
    {
        if ($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = DataMangrove::find($id);
        if (!$data) return response()->json(['message'=>'Data mangrove tidak ditemukan'],404);

        $data->delete();
        return response()->json(['message'=>'Data mangrove berhasil dihapus']);
    }
}
