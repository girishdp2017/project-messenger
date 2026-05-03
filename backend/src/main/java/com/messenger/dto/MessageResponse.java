package com.messenger.dto;

import com.messenger.model.Message;
import com.messenger.model.MessageType;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private UserResponse sender;
    private Long conversationId;
    private MessageType type;
    private boolean edited;

    public MessageResponse() {
    }

    public static MessageResponse from(Message message) {
        MessageResponse response = new MessageResponse();
        response.id = message.getId();
        response.content = message.getContent();
        response.timestamp = message.getTimestamp();
        response.sender = UserResponse.from(message.getSender());
        response.conversationId = message.getConversation().getId();
        response.type = message.getType();
        response.edited = message.isEdited();
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public UserResponse getSender() { return sender; }
    public void setSender(UserResponse sender) { this.sender = sender; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }

    public boolean isEdited() { return edited; }
    public void setEdited(boolean edited) { this.edited = edited; }
}
