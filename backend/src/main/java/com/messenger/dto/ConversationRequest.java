package com.messenger.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public class ConversationRequest {

    private String name;

    @NotEmpty
    private Set<Long> participantIds;

    private boolean groupChat;

    public ConversationRequest() {
    }

    public ConversationRequest(String name, Set<Long> participantIds, boolean groupChat) {
        this.name = name;
        this.participantIds = participantIds;
        this.groupChat = groupChat;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<Long> getParticipantIds() { return participantIds; }
    public void setParticipantIds(Set<Long> participantIds) { this.participantIds = participantIds; }

    public boolean isGroupChat() { return groupChat; }
    public void setGroupChat(boolean groupChat) { this.groupChat = groupChat; }
}
