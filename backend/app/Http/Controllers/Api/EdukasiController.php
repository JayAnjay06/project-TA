<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Edukasi;
use Illuminate\Http\Request;

class EdukasiController extends Controller
{
    public function index()
    {
        $data = Edukasi::all();
        return response()->json($data);
    }

    public function show($id)
    {
        $data = Edukasi::find($id);
        if(!$data) return response()->json(['message'=>'Edukasi tidak ditemukan'],404);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $request->validate([
            'judul'=>'required|string',
            'konten'=>'required|string',
            'jenis_media'=>'required|in:artikel,video,gambar,game',
            'url'=>'nullable|string'
        ]);

        $data = Edukasi::create($request->all());
        return response()->json(['message'=>'Edukasi berhasil dibuat','data'=>$data]);
    }

    public function update(Request $request,$id)
    {
        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = Edukasi::find($id);
        if(!$data) return response()->json(['message'=>'Edukasi tidak ditemukan'],404);

        $request->validate([
            'judul'=>'sometimes|string',
            'konten'=>'sometimes|string',
            'jenis_media'=>'sometimes|in:artikel,video,gambar,game',
            'url'=>'nullable|string'
        ]);

        $data->update($request->all());
        return response()->json(['message'=>'Edukasi berhasil diperbarui','data'=>$data]);
    }

    public function destroy(Request $request,$id)
    {
        if($request->user()->role !== 'admin') 
            return response()->json(['message'=>'Unauthorized'],403);

        $data = Edukasi::find($id);
        if(!$data) return response()->json(['message'=>'Edukasi tidak ditemukan'],404);

        $data->delete();
        return response()->json(['message'=>'Edukasi berhasil dihapus']);
    }
}
