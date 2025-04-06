package com.manoj.websocket;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    private int RoomId;
    private List<Message> messages;

    public Room(int RoomId) {
        this.RoomId = RoomId;
        this.messages = new ArrayList<>();
    }
}
