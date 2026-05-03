package com.messenger.dto;

import com.messenger.model.Conversation;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ConversationResponse {

    private Long id;
    private String name;
    private boolean groupChat;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<UserResponse> participants;

    public ConversationResponse() {
    }

    public static ConversationResponse from(Conversation conversation) {
        ConversationResponse response = new ConversationResponse();
        response.id = conversation.getId();
        response.name = conversation.getName();
        response.groupChat = conversation.isGroupChat();
        response.createdAt = conversation.getCreatedAt();
        response.updatedAt = conversation.getUpdatedAt();
        response.participants = conversation.getParticipants().stream()
                .map(UserResponse::from)
                .collect(Collectors.toSet());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isGroupChat() { return groupChat; }
    public void setGroupChat(boolean groupChat) { this.groupChat = groupChat; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<UserResponse> getParticipants() { return participants; }
    public void setParticipants(Set<UserResponse> participants) { this.participants = participants; }
}
