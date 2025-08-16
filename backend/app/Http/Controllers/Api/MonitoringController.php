<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Monitoring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MonitoringController extends Controller
{
    public function index()
    {
        $monitorings = Monitoring::with(['lokasi'])->get();  
        return response()->json($monitorings);
    }

    public function show($id)
    {
        $monitoring = Monitoring::with(['lokasi'])->find($id); 

        if (!$monitoring) {
            return response()->json(['message' => 'Monitoring data not found'], 404);  
        }

        return response()->json($monitoring);  
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lokasi_id' => 'required|exists:lokasis,lokasi_id', 
            'parameter' => 'required|string',
            'nilai' => 'required|numeric',
            'tanggal_monitoring' => 'required|date',
            'sumber_data' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $monitoring = Monitoring::create([
            'lokasi_id' => $request->lokasi_id,
            'parameter' => $request->parameter,
            'nilai' => $request->nilai,
            'tanggal_monitoring' => $request->tanggal_monitoring,
            'sumber_data' => $request->sumber_data
        ]);

        return response()->json([
            'message' => 'Monitoring data created successfully',
            'monitoring' => $monitoring
        ]);
    }

    public function update(Request $request, $id)
    {
        $monitoring = Monitoring::find($id); 

        if (!$monitoring) {
            return response()->json(['message' => 'Monitoring data not found'], 404);  
        }

        $validator = Validator::make($request->all(), [
            'lokasi_id' => 'nullable|exists:lokasis,lokasi_id',
            'parameter' => 'nullable|string',
            'nilai' => 'nullable|numeric',
            'tanggal_monitoring' => 'nullable|date',
            'sumber_data' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);  
        }

        $monitoring->update($request->only([
            'lokasi_id', 'parameter', 'nilai', 'tanggal_monitoring', 'sumber_data'
        ]));

        return response()->json([
            'message' => 'Monitoring data updated successfully',
            'monitoring' => $monitoring
        ]);
    }

    public function destroy($id)
    {
        $monitoring = Monitoring::find($id);  

        if (!$monitoring) {
            return response()->json(['message' => 'Monitoring data not found'], 404);  
        }

        $monitoring->delete();

        return response()->json([
            'message' => 'Monitoring data deleted successfully'
        ]);
    }
}
