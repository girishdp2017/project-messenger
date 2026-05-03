package com.messenger.controller;

import com.messenger.dto.MessageResponse;
import com.messenger.service.ConversationService;
import com.messenger.service.MessageService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final ConversationService conversationService;

    public MessageController(MessageService messageService, ConversationService conversationService) {
        this.messageService = messageService;
        this.conversationService = conversationService;
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return conversationService.findById(conversationId)
                .map(conversation -> {
                    Page<MessageResponse> messages = messageService.getMessages(conversation, page, size)
                            .map(MessageResponse::from);
                    return ResponseEntity.ok(messages);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
