import React from 'react';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Conversation } from '../types';

interface ChatsPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatsPanel: React.FC<ChatsPanelProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-3 border-b border-[#2a2931]">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8781ff] hover:bg-[#c4c0ff] text-[#100069] font-semibold text-[13px] transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {conversations.length === 0 ? (
          <div className="text-center py-8 px-4 text-[#918fa1] text-[13px]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet.</p>
            <p className="text-[11px] mt-1 font-mono text-[#c7c4d8]">
              Ask a question to start a new grounded chat.
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-[#2a2931] border-[#8781ff]/50 text-[#e4e1eb] shadow-sm'
                    : 'bg-[#16161f] border-transparent hover:bg-[#1b1b22] hover:border-[#2a2931] text-[#c7c4d8]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#8781ff]' : 'text-[#918fa1] group-hover:text-[#c4c0ff]'
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-medium truncate ${
                        isActive ? 'text-[#e4e1eb]' : 'group-hover:text-[#e4e1eb]'
                      }`}
                    >
                      {conv.title}
                    </p>
                    <span className="text-[10px] font-mono text-[#918fa1]">
                      {new Date(conv.updatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#918fa1] hover:text-[#ffb2b8] hover:bg-[#ff506f]/20 transition-all"
                  title="Delete Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
