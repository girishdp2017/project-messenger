package com.messenger.controller;

import com.messenger.dto.MessageRequest;
import com.messenger.dto.MessageResponse;
import com.messenger.service.ConversationService;
import com.messenger.service.MessageService;
import com.messenger.service.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ConversationService conversationService;
    private final UserService userService;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate,
                                   MessageService messageService,
                                   ConversationService conversationService,
                                   UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequest messageRequest,
                            SimpMessageHeaderAccessor headerAccessor) {
        String email = (String) headerAccessor.getSessionAttributes().get("email");
        if (email == null) return;

        userService.findByEmail(email).ifPresent(sender ->
            conversationService.findById(messageRequest.getConversationId()).ifPresent(conversation -> {
                var message = messageService.sendMessage(messageRequest.getContent(), sender, conversation);
                var response = MessageResponse.from(message);
                messagingTemplate.convertAndSend(
                    "/topic/conversation." + conversation.getId(), response);
            })
        );
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload java.util.Map<String, Object> payload,
                       SimpMessageHeaderAccessor headerAccessor) {
        String email = (String) headerAccessor.getSessionAttributes().get("email");
        if (email == null) return;

        Long conversationId = Long.valueOf(payload.get("conversationId").toString());
        userService.findByEmail(email).ifPresent(user -> {
            java.util.Map<String, Object> typingEvent = new java.util.HashMap<>();
            typingEvent.put("userId", user.getId());
            typingEvent.put("userName", user.getName());
            typingEvent.put("conversationId", conversationId);
            messagingTemplate.convertAndSend("/topic/conversation." + conversationId + ".typing", typingEvent);
        });
    }
}
