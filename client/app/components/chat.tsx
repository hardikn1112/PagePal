'use client'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import Loader from './Loader';

interface Doc {
    pageContent?: string;
    metadata?: {
        loc?: {
            pageNumber?: number;
        };        
        source?: string;
    }
}

interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents?: Doc[]; 
}

const renderFormatted = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    const nodes: React.ReactNode[] = [];
    parts.forEach((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
            const inner = part.slice(2, -2);
            nodes.push(<strong key={`b-${i}`}>{inner}</strong>);
        } else {
            const sub = part.split('*');
            sub.forEach((chunk, j) => {
                nodes.push(<React.Fragment key={`t-${i}-${j}`}>{chunk}</React.Fragment>);
                if (j < sub.length - 1) nodes.push(<br key={`br-${i}-${j}`} />);
            });
        }
    });
    return nodes;
}

const ChatScreen: React.FC = () => {

    const [placeholder, setPlaceholder] = React.useState<string>('Enter your query here')
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const [isSending, setIsSending] = React.useState<boolean>(false);

    const endRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isSending]);

    const handleSendChat = async () => {
        if (!message.trim()) return;
        const userText = message;
        setMessages((prev) => [...prev, {role:'user', content:userText}]);
        setMessage('');
        setIsSending(true);
        try {
            const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(userText)}`);
            const data = await res.json();
            setPlaceholder('Enter your query here');
            setMessages(prev => [...prev, {role: 'assistant', content: data?.message ?? ''}]);
        } catch (e) {
            setMessages(prev => [...prev, {role: 'assistant', content: 'Sorry, something went wrong.'}]);
        } finally {
            setIsSending(false);
        }
    }
    
    return (
        <div className='h-screen flex flex-col'>
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                {messages.map((m, index) => (
                    <div key={index} className={`w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} max-w-[75%] px-4 py-2 rounded-2xl ${m.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                            {renderFormatted(m.content ?? '')}
                        </div>
                    </div>
                ))}
                {isSending && (
                    <div className='w-full flex justify-start items-center'>
                        <div className='px-2 py-1 rounded-2xl'>
                            <Loader />
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>
            <div className='border-t p-3 bg-white sticky bottom-0'>
                <div className='flex gap-3'>
                    <Input value={message} onKeyDown={e => {if (e.key === 'Enter' && message.trim()) {handleSendChat()} }} onChange={e => setMessage(e.target.value)} placeholder={placeholder} />
                    <Button onClick={handleSendChat} disabled={!message.trim() || isSending} className='bg-black text-white'>Send</Button>
                </div>
            </div>
        </div>

    );

}

export default ChatScreen;