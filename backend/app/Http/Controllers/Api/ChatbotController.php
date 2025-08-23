<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class ChatbotController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo', // bisa diganti gpt-4o-mini
                'messages' => [
                    ['role' => 'system', 'content' => 'Kamu adalah asisten cerdas untuk aplikasi MMIC tentang mangrove.'],
                    ['role' => 'user', 'content' => $request->message],
                ],
            ]);

            return response()->json([
                'success' => true,
                'question' => $request->message,
                'answer' => $response->choices[0]->message->content,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
