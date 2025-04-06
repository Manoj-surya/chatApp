package com.manoj.websocket.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.manoj.websocket.Message;
import com.manoj.websocket.Room;

@CrossOrigin("*")
@RestController
public class MessageRetriever {
    @Autowired
    ChatController ctController;

    @GetMapping("/api/{roomId}/messages")
    public List<Message> getInitialMessages(@PathVariable String roomId){
        Room room = ctController.getRooms().get(Integer.parseInt(roomId));
        return room.getMessages();
    }
}
