
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles, Cpu, Terminal, ChevronLeft, Trash2, Image as ImageIcon, Camera, FileText, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../services/geminiService';
import { ChatMessage, ChatPart } from '../types';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<{ mimeType: string; data: string; name: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, attachments]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCamera = false) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type 'file' as File to resolve 'unknown' type errors on properties like type and name
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Fix: Ensure the result is a string before attempting to split it
        const result = event.target?.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1];
          setAttachments(prev => [...prev, {
            mimeType: file.type,
            data: base64,
            name: file.name
          }]);
        }
      };
      // Fix: 'file' is now correctly typed as File, which satisfies the Blob requirement
      reader.readAsDataURL(file);
    });
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const parts: ChatPart[] = [];
    if (input.trim()) parts.push({ text: input });
    
    attachments.forEach(att => {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data
        }
      });
    });

    const userMsg: ChatMessage = { role: 'user', parts };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const responseText = await chatWithAI(messages, userMsg);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: responseText || "SYNC_COMPLETE: Feedback integrated." }] 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "LINK_ERROR: Neural bridge collapsed." }] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Purge session logs?")) {
      setMessages([]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="trigger"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative group w-14 h-14 md:w-16 md:h-16 bg-black border border-lime-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.3)]"
          >
            <div className="absolute inset-0 bg-lime-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
            <Terminal className="w-6 h-6 md:w-7 md:h-7 text-lime-400 relative z-10" />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-lime-500 rounded-full border-2 border-black animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) setIsOpen(false);
            }}
            className="glass w-[85vw] md:w-[320px] h-[65vh] md:h-[520px] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col border border-lime-500/20 overflow-hidden"
          >
            {/* Compact Header */}
            <div className="relative p-4 bg-black/60 border-b border-lime-500/10 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 glass rounded-lg border-lime-500/20 hover:border-lime-500/40 transition-all group"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-lime-400" />
                  <span className="text-[9px] font-black text-lime-400 mono uppercase tracking-widest">Back</span>
                </button>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-lime-400 mono uppercase">Core_V4</p>
                  </div>
                  <div className="w-8 h-8 bg-lime-500/10 border border-lime-500/30 rounded-lg flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-lime-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tightened Comms Feed */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 px-4 flex flex-col items-center">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mb-4 border-lime-500/10">
                      <Sparkles className="w-5 h-5 text-lime-500/30" />
                  </div>
                  <p className="text-[9px] font-black mono text-white/10 uppercase tracking-widest">Neural Link Idle</p>
                </div>
              )}
              {messages.map((m, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[95%] p-3 rounded-2xl shadow-md text-[11px] leading-snug flex flex-col gap-2 ${
                    m.role === 'user' 
                      ? 'bg-lime-500 text-black rounded-tr-none font-black mono uppercase tracking-tight' 
                      : 'glass text-slate-300 rounded-tl-none border-l-2 border-l-lime-500 border-lime-500/10'
                  }`}>
                    {m.parts.map((p, pIdx) => (
                      <div key={pIdx}>
                        {p.text && <span>{p.text}</span>}
                        {p.inlineData && (
                          <div className="mt-1 rounded-lg overflow-hidden border border-white/10">
                            {p.inlineData.mimeType.startsWith('image/') ? (
                              <img src={`data:${p.inlineData.mimeType};base64,${p.inlineData.data}`} alt="Shared media" className="w-full h-auto max-h-32 object-cover" />
                            ) : (
                              <div className="p-2 bg-white/5 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-lime-400" />
                                <span className="text-[8px] truncate">Document Attached</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass p-3 rounded-2xl rounded-tl-none flex items-center gap-2 border-lime-500/10">
                    <Loader2 className="w-3 h-3 animate-spin text-lime-400" />
                    <span className="text-[8px] font-black mono text-lime-400/40 uppercase tracking-widest">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Attachments Preview Area */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-black/40 border-t border-lime-500/10 flex gap-2 overflow-x-auto custom-scrollbar"
                >
                  {attachments.map((att, i) => (
                    <div key={i} className="relative group shrink-0">
                      <div className="w-12 h-12 glass rounded-xl overflow-hidden border border-lime-500/30 flex items-center justify-center">
                        {att.mimeType.startsWith('image/') ? (
                          <img src={`data:${att.mimeType};base64,${att.data}`} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-lime-400" />
                        )}
                      </div>
                      <button 
                        onClick={() => removeAttachment(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Slim Input Area */}
            <div className="p-4 bg-black/40 border-t border-lime-500/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-lime-400" title="Gallery/Files">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => cameraInputRef.current?.click()} className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-lime-400" title="Camera">
                    <Camera className="w-4 h-4" />
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-lime-400" title="Attach Doc">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
                  <input ref={cameraInputRef} type="file" capture="environment" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                </div>
                <div className="h-[1px] flex-1 bg-white/5" />
                <button 
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/5 rounded-md transition-colors group"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/10 group-hover:text-red-400" />
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="CMD..."
                  className="w-full bg-black/40 border border-lime-500/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-lime-500/30 transition-all text-[11px] font-black mono uppercase placeholder:text-white/5"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-lime-500 text-black p-2 rounded-lg hover:bg-lime-400 disabled:opacity-20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbot;
