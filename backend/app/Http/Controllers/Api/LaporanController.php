<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaporanController extends Controller
{
    public function index()
    {
        $laporans = Laporan::with(['user', 'lokasi'])->get(); 
        return response()->json($laporans);
    }

    public function show($id)
    {
        $laporan = Laporan::with(['user', 'lokasi'])->find($id); 
        if (!$laporan) {
            return response()->json(['message' => 'Laporan not found'], 404); 
        }

        return response()->json($laporan);  
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',  
            'lokasi_id' => 'required|exists:lokasis,lokasi_id', 
            'jenis_laporan' => 'required|string',
            'tanggal_laporan' => 'required|date',
            'isi_laporan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $laporan = Laporan::create([
            'user_id' => $request->user_id,
            'lokasi_id' => $request->lokasi_id,
            'jenis_laporan' => $request->jenis_laporan,
            'tanggal_laporan' => $request->tanggal_laporan,
            'isi_laporan' => $request->isi_laporan
        ]);

        return response()->json([
            'message' => 'Laporan created successfully',
            'laporan' => $laporan
        ]);
    }

    public function update(Request $request, $id)
    {
        $laporan = Laporan::find($id);  

        if (!$laporan) {
            return response()->json(['message' => 'Laporan not found'], 404);  
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'lokasi_id' => 'nullable|exists:lokasis,lokasi_id',
            'jenis_laporan' => 'nullable|string',
            'tanggal_laporan' => 'nullable|date',
            'isi_laporan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $laporan->update($request->only([
            'user_id', 'lokasi_id', 'jenis_laporan', 'tanggal_laporan', 'isi_laporan'
        ]));

        return response()->json([
            'message' => 'Laporan updated successfully',
            'laporan' => $laporan
        ]);
    }

    public function destroy($id)
    {
        $laporan = Laporan::find($id);  

        if (!$laporan) {
            return response()->json(['message' => 'Laporan not found'], 404);  
        }

        $laporan->delete();

        return response()->json([
            'message' => 'Laporan deleted successfully'
        ]);
    }
}
