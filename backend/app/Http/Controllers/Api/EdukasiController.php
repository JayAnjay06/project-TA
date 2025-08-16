<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Edukasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EdukasiController extends Controller
{
    public function index()
    {
        $edukasis = Edukasi::all(); 
        return response()->json($edukasis);
    }

    public function show($id)
    {
        $edukasi = Edukasi::find($id);  
        if (!$edukasi) {
            return response()->json(['message' => 'Edukasi not found'], 404);  
        }

        return response()->json($edukasi);  
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
            'konten' => 'required|string',
            'jenis_media' => 'required|in:artikel,video,gambar,game',  
            'url' => 'nullable|url',  
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $edukasi = Edukasi::create([
            'judul' => $request->judul,
            'konten' => $request->konten,
            'jenis_media' => $request->jenis_media,
            'url' => $request->url,
        ]);

        return response()->json([
            'message' => 'Edukasi created successfully',
            'edukasi' => $edukasi
        ]);
    }

    public function update(Request $request, $id)
    {
        $edukasi = Edukasi::find($id);  

        if (!$edukasi) {
            return response()->json(['message' => 'Edukasi not found'], 404);  
        }

        $validator = Validator::make($request->all(), [
            'judul' => 'nullable|string',
            'konten' => 'nullable|string',
            'jenis_media' => 'nullable|in:artikel,video,gambar,game',
            'url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400); 
        }

        $edukasi->update($request->only([
            'judul', 'konten', 'jenis_media', 'url'
        ]));

        return response()->json([
            'message' => 'Edukasi updated successfully',
            'edukasi' => $edukasi
        ]);
    }

    public function destroy($id)
    {
        $edukasi = Edukasi::find($id); 

        if (!$edukasi) {
            return response()->json(['message' => 'Edukasi not found'], 404);  
        }

        $edukasi->delete();

        return response()->json([
            'message' => 'Edukasi deleted successfully'
        ]);
    }
}
