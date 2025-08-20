<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lokasi;
use Illuminate\Http\Request;

class LokasiController extends Controller
{
    public function index()
    {
        $lokasi = Lokasi::all();
        return response()->json($lokasi);
    }

    public function show($id)
    {
        $lokasi = Lokasi::find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }
        return response()->json($lokasi);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nama_lokasi' => 'required|string',
            'koordinat' => 'required|string',
            'luas_area' => 'required|numeric',
            'deskripsi' => 'nullable|string',
            'tanggal_input' => 'nullable|date'
        ]);

        $lokasi = Lokasi::create([
            'nama_lokasi' => $request->nama_lokasi,
            'koordinat' => $request->koordinat,
            'luas_area' => $request->luas_area,
            'deskripsi' => $request->deskripsi,
            'tanggal_input' => $request->tanggal_input ?? now()
        ]);

        return response()->json(['message' => 'Lokasi berhasil dibuat', 'lokasi' => $lokasi]);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lokasi = Lokasi::find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }

        $request->validate([
            'nama_lokasi' => 'sometimes|required|string',
            'koordinat' => 'sometimes|required|string',
            'luas_area' => 'sometimes|required|numeric',
            'deskripsi' => 'nullable|string',
            'tanggal_input' => 'nullable|date'
        ]);

        $lokasi->update([
            'nama_lokasi' => $request->nama_lokasi ?? $lokasi->nama_lokasi,
            'koordinat' => $request->koordinat ?? $lokasi->koordinat,
            'luas_area' => $request->luas_area ?? $lokasi->luas_area,
            'deskripsi' => $request->deskripsi ?? $lokasi->deskripsi,
            'tanggal_input' => $request->tanggal_input ?? $lokasi->tanggal_input,
        ]);

        return response()->json(['message' => 'Lokasi berhasil diperbarui', 'lokasi' => $lokasi]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lokasi = Lokasi::find($id);
        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }

        $lokasi->delete();
        return response()->json(['message' => 'Lokasi berhasil dihapus']);
    }
}
