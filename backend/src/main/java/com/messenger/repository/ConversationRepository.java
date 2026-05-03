package com.messenger.repository;

import com.messenger.model.Conversation;
import com.messenger.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p = :user ORDER BY c.updatedAt DESC")
    List<Conversation> findByParticipant(@Param("user") User user);

    @Query("SELECT c FROM Conversation c JOIN c.participants p1 JOIN c.participants p2 " +
           "WHERE p1 = :user1 AND p2 = :user2 AND c.groupChat = false")
    List<Conversation> findDirectConversation(@Param("user1") User user1, @Param("user2") User user2);
}
