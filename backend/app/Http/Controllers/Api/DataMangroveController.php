<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataMangrove;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DataMangroveController extends Controller
{
    public function index()
    {
        $dataMangroves = DataMangrove::with(['lokasi', 'jenis', 'user'])->get();  
        return response()->json($dataMangroves);
    }

    public function show($id)
    {
        $dataMangrove = DataMangrove::with(['lokasi', 'jenis', 'user'])->find($id); 

        if (!$dataMangrove) {
            return response()->json(['message' => 'Data Mangrove not found'], 404);  
        }

        return response()->json($dataMangrove);  
    }

    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'lokasi_id' => 'required|exists:lokasis,lokasi_id',  
            'jenis_id' => 'required|exists:jenis_mangroves,jenis_id', 
            'kerapatan' => 'required|integer',
            'tinggi_rata2' => 'required|numeric',
            'diameter_rata2' => 'required|numeric',
            'kondisi' => 'required|in:baik,sedang,buruk',
            'tanggal_pengamatan' => 'required|date',
            'user_id' => 'required|exists:users,id',  
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400); 
        }

        // Menyimpan data mangrove
        $dataMangrove = DataMangrove::create([
            'lokasi_id' => $request->lokasi_id,
            'jenis_id' => $request->jenis_id,
            'kerapatan' => $request->kerapatan,
            'tinggi_rata2' => $request->tinggi_rata2,
            'diameter_rata2' => $request->diameter_rata2,
            'kondisi' => $request->kondisi,
            'tanggal_pengamatan' => $request->tanggal_pengamatan,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Data Mangrove created successfully',
            'dataMangrove' => $dataMangrove
        ]);
    }

    public function update(Request $request, $id)
    {
        $dataMangrove = DataMangrove::find($id);

        if (!$dataMangrove) {
            return response()->json(['message' => 'Data Mangrove not found'], 404);  
        }

        $validator = Validator::make($request->all(), [
            'lokasi_id' => 'nullable|exists:lokasis,lokasi_id',
            'jenis_id' => 'nullable|exists:jenis_mangroves,jenis_id',
            'kerapatan' => 'nullable|integer',
            'tinggi_rata2' => 'nullable|numeric',
            'diameter_rata2' => 'nullable|numeric',
            'kondisi' => 'nullable|in:baik,sedang,buruk',
            'tanggal_pengamatan' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $dataMangrove->update($request->only([
            'lokasi_id', 'jenis_id', 'kerapatan', 'tinggi_rata2', 
            'diameter_rata2', 'kondisi', 'tanggal_pengamatan', 'user_id'
        ]));

        return response()->json([
            'message' => 'Data Mangrove updated successfully',
            'dataMangrove' => $dataMangrove
        ]);
    }

    public function destroy($id)
    {
        $dataMangrove = DataMangrove::find($id);  

        if (!$dataMangrove) {
            return response()->json(['message' => 'Data Mangrove not found'], 404);  
        }

        $dataMangrove->delete();

        return response()->json([
            'message' => 'Data Mangrove deleted successfully'
        ]);
    }
}
