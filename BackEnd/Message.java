package com.manoj.websocket;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private Sender sender;
    private String text;
    private LocalDateTime timeStamp;
}
