<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lokasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LokasiController extends Controller
{
    public function index()
    {
        $lokasis = Lokasi::all();
        return response()->json($lokasis);
    }

    public function show($id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi not found'], 404);
        }

        return response()->json($lokasi);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lokasi' => 'required|string',
            'koordinat' => 'required|string',  
            'luas_area' => 'required|numeric',
            'deskripsi' => 'nullable|string',
            'tanggal_input' => 'required|date',
            'user_id' => 'required|exists:users,id',  
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $lokasi = Lokasi::create([
            'nama_lokasi' => $request->nama_lokasi,
            'koordinat' => $request->koordinat, 
            'luas_area' => $request->luas_area,
            'deskripsi' => $request->deskripsi,
            'tanggal_input' => $request->tanggal_input,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Lokasi created successfully',
            'lokasi' => $lokasi
        ]);
    }

    public function update(Request $request, $id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_lokasi' => 'nullable|string',
            'koordinat' => 'nullable|string', 
            'luas_area' => 'nullable|numeric',
            'deskripsi' => 'nullable|string',
            'tanggal_input' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $lokasi->update($request->only(['nama_lokasi', 'koordinat', 'luas_area', 'deskripsi', 'tanggal_input', 'user_id']));

        return response()->json([
            'message' => 'Lokasi updated successfully',
            'lokasi' => $lokasi
        ]);
    }

    public function destroy($id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi not found'], 404);
        }

        $lokasi->delete();

        return response()->json([
            'message' => 'Lokasi deleted successfully'
        ]);
    }
}
