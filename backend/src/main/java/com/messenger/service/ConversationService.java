package com.messenger.service;

import com.messenger.dto.ConversationRequest;
import com.messenger.model.Conversation;
import com.messenger.model.User;
import com.messenger.repository.ConversationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserService userService;

    public ConversationService(ConversationRepository conversationRepository, UserService userService) {
        this.conversationRepository = conversationRepository;
        this.userService = userService;
    }

    public Conversation createConversation(ConversationRequest request, User currentUser) {
        Conversation conversation = new Conversation(request.getName(), request.isGroupChat());

        Set<User> participants = new HashSet<>();
        participants.add(currentUser);

        for (Long userId : request.getParticipantIds()) {
            userService.findById(userId).ifPresent(participants::add);
        }

        conversation.setParticipants(participants);

        if (!request.isGroupChat() && participants.size() == 2) {
            User otherUser = participants.stream()
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    .findFirst()
                    .orElse(null);
            if (otherUser != null) {
                List<Conversation> existing = conversationRepository.findDirectConversation(currentUser, otherUser);
                if (!existing.isEmpty()) {
                    return existing.get(0);
                }
            }
        }

        return conversationRepository.save(conversation);
    }

    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findByParticipant(user);
    }

    public Optional<Conversation> findById(Long id) {
        return conversationRepository.findById(id);
    }

    public void updateTimestamp(Long conversationId) {
        conversationRepository.findById(conversationId).ifPresent(conv -> {
            conv.setUpdatedAt(LocalDateTime.now());
            conversationRepository.save(conv);
        });
    }
}
