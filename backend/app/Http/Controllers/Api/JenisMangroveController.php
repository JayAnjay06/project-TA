<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisMangrove;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JenisMangroveController extends Controller
{
    public function index()
    {
        $jenisMangroves = JenisMangrove::all();
        return response()->json($jenisMangroves);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_ilmiah' => 'required|string|max:255',
            'nama_lokal' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        if ($request->hasFile('gambar')) {
            $imagePath = $request->file('gambar')->store('images', 'public'); 
        } else {
            $imagePath = null;  
        }

        $jenisMangrove = JenisMangrove::create([
            'nama_ilmiah' => $request->nama_ilmiah,
            'nama_lokal' => $request->nama_lokal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $imagePath,  
        ]);

        return response()->json($jenisMangrove, 201);
    }

    public function show($id)
    {
        $jenisMangrove = JenisMangrove::find($id);

        if (!$jenisMangrove) {
            return response()->json(['message' => 'Jenis Mangrove not found'], 404);
        }

        return response()->json($jenisMangrove);
    }

    public function update(Request $request, $id)
    {
        $jenisMangrove = JenisMangrove::find($id);

        if (!$jenisMangrove) {
            return response()->json(['message' => 'Jenis Mangrove not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_ilmiah' => 'required|string|max:255',
            'nama_lokal' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        if ($request->hasFile('gambar')) {
            if ($jenisMangrove->gambar) {
                Storage::disk('public')->delete($jenisMangrove->gambar);  
            }

            $imagePath = $request->file('gambar')->store('images', 'public');
        } else {
            $imagePath = $jenisMangrove->gambar;
        }

        $jenisMangrove->update([
            'nama_ilmiah' => $request->nama_ilmiah,
            'nama_lokal' => $request->nama_lokal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $imagePath, 
        ]);

        return response()->json($jenisMangrove);
    }

    public function destroy($id)
    {
        $jenisMangrove = JenisMangrove::find($id);

        if (!$jenisMangrove) {
            return response()->json(['message' => 'Jenis Mangrove not found'], 404);
        }

        if ($jenisMangrove->gambar) {
            Storage::disk('public')->delete($jenisMangrove->gambar);
        }

        $jenisMangrove->delete();
        return response()->json(['message' => 'Jenis Mangrove deleted successfully']);
    }
}
