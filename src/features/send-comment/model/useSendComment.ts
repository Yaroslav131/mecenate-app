import { useState } from 'react';
import { addComment } from '@/entities/comment/api';

export function useSendComment(postId: string) {
  const [isSending, setIsSending] = useState(false);

  const send = async (rawText: string): Promise<boolean> => {
    const text = rawText.trim();
    if (!text || isSending) return false;
    setIsSending(true);
    try {
      await addComment(postId, text);
      return true;
    } catch {
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { isSending, send };
}
