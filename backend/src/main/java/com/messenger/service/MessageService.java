package com.messenger.service;

import com.messenger.model.Conversation;
import com.messenger.model.Message;
import com.messenger.model.MessageType;
import com.messenger.model.User;
import com.messenger.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationService conversationService;

    public MessageService(MessageRepository messageRepository, ConversationService conversationService) {
        this.messageRepository = messageRepository;
        this.conversationService = conversationService;
    }

    public Message sendMessage(String content, User sender, Conversation conversation) {
        Message message = new Message(content, sender, conversation, MessageType.CHAT);
        Message saved = messageRepository.save(message);
        conversationService.updateTimestamp(conversation.getId());
        return saved;
    }

    public Page<Message> getMessages(Conversation conversation, int page, int size) {
        return messageRepository.findByConversationOrderByTimestampDesc(conversation, PageRequest.of(page, size));
    }
}
