package com.messenger.controller;

import com.messenger.dto.ConversationRequest;
import com.messenger.dto.ConversationResponse;
import com.messenger.service.ConversationService;
import com.messenger.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;
    private final UserService userService;

    public ConversationController(ConversationService conversationService, UserService userService) {
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return userService.findByEmail(email)
                .map(user -> {
                    List<ConversationResponse> conversations = conversationService.getUserConversations(user).stream()
                            .map(ConversationResponse::from)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(conversations);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            @AuthenticationPrincipal OAuth2User principal,
            @Valid @RequestBody ConversationRequest request) {
        String email = principal.getAttribute("email");
        return userService.findByEmail(email)
                .map(user -> {
                    var conversation = conversationService.createConversation(request, user);
                    return ResponseEntity.ok(ConversationResponse.from(conversation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponse> getConversation(@PathVariable Long id) {
        return conversationService.findById(id)
                .map(conv -> ResponseEntity.ok(ConversationResponse.from(conv)))
                .orElse(ResponseEntity.notFound().build());
    }
}
