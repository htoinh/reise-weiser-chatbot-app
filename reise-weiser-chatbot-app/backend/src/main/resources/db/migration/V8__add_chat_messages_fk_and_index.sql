DELETE FROM chat_messages cm
WHERE NOT EXISTS (
    SELECT 1 FROM conversations c WHERE c.id = cm.conversation_id
);

ALTER TABLE chat_messages
    ADD CONSTRAINT fk_chat_messages_conversations
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

CREATE INDEX idx_chat_messages_conversation_created_at
    ON chat_messages(conversation_id, created_at, id);
