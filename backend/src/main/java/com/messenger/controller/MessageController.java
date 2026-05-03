package com.messenger.controller;

import com.messenger.dto.MessageResponse;
import com.messenger.model.Conversation;
import com.messenger.model.User;
import com.messenger.service.ConversationService;
import com.messenger.service.MessageService;
import com.messenger.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserService userService;

    public MessageController(MessageService messageService,
                             ConversationService conversationService,
                             UserService userService) {
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        String email = principal.getAttribute("email");
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        Optional<Conversation> convOpt = conversationService.findById(conversationId);
        if (convOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Conversation conversation = convOpt.get();
        boolean isParticipant = conversation.getParticipants().stream()
                .anyMatch(p -> p.getId().equals(user.getId()));
        if (!isParticipant) {
            return ResponseEntity.status(403).build();
        }

        Page<MessageResponse> messages = messageService.getMessages(conversation, page, size)
                .map(MessageResponse::from);
        return ResponseEntity.ok(messages);
    }
}
