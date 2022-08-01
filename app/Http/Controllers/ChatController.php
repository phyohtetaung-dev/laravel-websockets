<?php

namespace App\Http\Controllers;

use App\Events\SendChatMessage;
use App\Models\Message;

class ChatController extends Controller
{
    public function index()
    {
        return view('chat');
    }

    public function getMessages()
    {
        return Message::with('user')->get();
    }

    public function sendMessage()
    {
        $message = auth()->user()->messages()->create([
            'message' => request('message'),
        ]);

        broadcast(new SendChatMessage(auth()->user(), $message))->toOthers();

        return ['status' => 'Message Sent!'];
    }
}
