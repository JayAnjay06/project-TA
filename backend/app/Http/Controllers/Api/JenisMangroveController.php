<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JenisMangrove;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JenisMangroveController extends Controller
{
    public function index()
    {
        $jenis = JenisMangrove::all()->map(function($item) {
            if ($item->gambar) {
                $item->gambar = url('storage/' . $item->gambar);
            }
            return $item;
        });
        return response()->json($jenis);
    }

    public function show($id)
    {
        $jenis = JenisMangrove::find($id);
        if (!$jenis) {
            return response()->json(['message' => 'Jenis mangrove tidak ditemukan'], 404);
        }

        if ($jenis->gambar) {
            $jenis->gambar = url('storage/' . $jenis->gambar);
        }

        return response()->json($jenis);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nama_ilmiah' => 'required|string',
            'nama_lokal' => 'required|string',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|max:2048' 
        ]);

        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('jenis_mangrove', 'public');
        }

        $jenis = JenisMangrove::create([
            'nama_ilmiah' => $request->nama_ilmiah,
            'nama_lokal' => $request->nama_lokal,
            'deskripsi' => $request->deskripsi,
            'gambar' => $gambarPath
        ]);

        if ($jenis->gambar) {
            $jenis->gambar = url('storage/' . $jenis->gambar);
        }

        return response()->json(['message' => 'Jenis mangrove berhasil dibuat', 'jenis' => $jenis]);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jenis = JenisMangrove::find($id);
        if (!$jenis) {
            return response()->json(['message' => 'Jenis mangrove tidak ditemukan'], 404);
        }

        $request->validate([
            'nama_ilmiah' => 'sometimes|required|string',
            'nama_lokal' => 'sometimes|required|string',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('gambar')) {
            if ($jenis->gambar && Storage::disk('public')->exists($jenis->gambar)) {
                Storage::disk('public')->delete($jenis->gambar);
            }

            $gambarPath = $request->file('gambar')->store('jenis_mangrove', 'public');
            $jenis->gambar = $gambarPath;
        }

        $jenis->nama_ilmiah = $request->nama_ilmiah ?? $jenis->nama_ilmiah;
        $jenis->nama_lokal = $request->nama_lokal ?? $jenis->nama_lokal;
        $jenis->deskripsi = $request->deskripsi ?? $jenis->deskripsi;
        $jenis->save();

        if ($jenis->gambar) {
            $jenis->gambar = url('storage/' . $jenis->gambar);
        }

        return response()->json(['message' => 'Jenis mangrove berhasil diperbarui', 'jenis' => $jenis]);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $jenis = JenisMangrove::find($id);
        if (!$jenis) {
            return response()->json(['message' => 'Jenis mangrove tidak ditemukan'], 404);
        }

        if ($jenis->gambar && Storage::disk('public')->exists($jenis->gambar)) {
            Storage::disk('public')->delete($jenis->gambar);
        }

        $jenis->delete();

        return response()->json(['message' => 'Jenis mangrove berhasil dihapus']);
    }
}
