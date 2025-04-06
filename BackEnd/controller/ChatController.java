package com.manoj.websocket.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.manoj.websocket.Message;
import com.manoj.websocket.Room;

import lombok.AllArgsConstructor;
import lombok.Data;

@Controller
@Data
@AllArgsConstructor
public class ChatController {
    private final Map<Integer, Room> rooms = new ConcurrentHashMap<>();

    @MessageMapping("/chat/{roomid}")
    @SendTo("/topic/{roomid}/messages")
    public List<Message> sendMessage(Message message, @DestinationVariable int roomid) {
        System.out.println(roomid);
        rooms.putIfAbsent(roomid, new Room(roomid));
        Room room = rooms.get(roomid);
        room.getMessages().add(message);
        System.out.println("All rooms: " + rooms.keySet());
        return room.getMessages();
    }   
}
