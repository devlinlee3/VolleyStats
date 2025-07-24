package com.volley.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameSocketController {

    @MessageMapping("/game.sendMessage")
    @SendTo("/topic/games")
    public String sendMessage(String message) {
        return message;
    }
}
