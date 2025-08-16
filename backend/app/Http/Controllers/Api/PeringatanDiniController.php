<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PeringatanDini;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PeringatanDiniController extends Controller
{
    public function index()
    {
        $peringatanDinis = PeringatanDini::with(['lokasi'])->get();  
        return response()->json($peringatanDinis);
    }

    public function show($id)
    {
        $peringatanDini = PeringatanDini::with(['lokasi'])->find($id); 

        if (!$peringatanDini) {
            return response()->json(['message' => 'Peringatan Dini not found'], 404);
        }

        return response()->json($peringatanDini); 
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lokasi_id' => 'required|exists:lokasis,lokasi_id', 
            'jenis_kerusakan' => 'required|string',
            'tanggal_kejadian' => 'required|date',
            'deskripsi' => 'required|string',
            'status' => 'required|in:aktif,ditangani,selesai'  
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $peringatanDini = PeringatanDini::create([
            'lokasi_id' => $request->lokasi_id,
            'jenis_kerusakan' => $request->jenis_kerusakan,
            'tanggal_kejadian' => $request->tanggal_kejadian,
            'deskripsi' => $request->deskripsi,
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Peringatan Dini created successfully',
            'peringatanDini' => $peringatanDini
        ]);
    }

    public function update(Request $request, $id)
    {
        $peringatanDini = PeringatanDini::find($id);  

        if (!$peringatanDini) {
            return response()->json(['message' => 'Peringatan Dini not found'], 404);  
        }

        $validator = Validator::make($request->all(), [
            'lokasi_id' => 'nullable|exists:lokasis,lokasi_id',
            'jenis_kerusakan' => 'nullable|string',
            'tanggal_kejadian' => 'nullable|date',
            'deskripsi' => 'nullable|string',
            'status' => 'nullable|in:aktif,ditangani,selesai'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $peringatanDini->update($request->only([
            'lokasi_id', 'jenis_kerusakan', 'tanggal_kejadian', 'deskripsi', 'status'
        ]));

        return response()->json([
            'message' => 'Peringatan Dini updated successfully',
            'peringatanDini' => $peringatanDini
        ]);
    }

    public function destroy($id)
    {
        $peringatanDini = PeringatanDini::find($id); 

        if (!$peringatanDini) {
            return response()->json(['message' => 'Peringatan Dini not found'], 404);  
        }

        $peringatanDini->delete();

        return response()->json([
            'message' => 'Peringatan Dini deleted successfully'
        ]);
    }
}
