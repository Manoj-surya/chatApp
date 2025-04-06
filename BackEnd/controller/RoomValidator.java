package com.manoj.websocket.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.manoj.websocket.Room;

@CrossOrigin("*")
@RestController
public class RoomValidator {
    
    @Autowired
    ChatController ctController;

    @GetMapping("/api/validate/{roomId}")
    public boolean isRoomPresent(@PathVariable String roomId){
        try {
        int id = Integer.parseInt(roomId);
        Map<Integer, Room> rooms = ctController.getRooms();
        return rooms != null && rooms.containsKey(id);
    } catch (NumberFormatException e) {
        System.err.println("Invalid room ID: " + roomId);
        return false;
    }
    }

    @GetMapping("/api/create/{roomId}")
    public boolean createRoom(@PathVariable String roomId){
        try {
            int id = Integer.parseInt(roomId);
            Map<Integer, Room> rooms = ctController.getRooms();
            if (rooms == null) return false;
    
            if (rooms.containsKey(id)) {
                return false;
            } else {
                rooms.putIfAbsent(id, new Room(id));
                return true;
            }
        } catch (NumberFormatException e) {
            System.err.println("Invalid room ID: " + roomId);
            return false;
        }
    }
}
