import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import askTitle from '../../assets/management/dashboard/ask-title.svg';
import illustration from '../../assets/management/dashboard/ask-illustration.svg';
import closeIcon from '../../assets/management/dashboard/close.svg';
import chatCta from '../../assets/management/dashboard/chat-cta.svg';
import sendIcon from '../../assets/management/dashboard/send.svg';
import newChatIcon from '../../assets/management/dashboard/new-chat.svg';
import historyIcon from '../../assets/management/dashboard/history.svg';
import moreIcon from '../../assets/management/dashboard/more.svg';
import arrowLeftIcon from '../../assets/management/dashboard/arrow-left.svg';
import { sampleConversations, type DashboardChatMessage, type DashboardConversation } from './dashboard-chat-history';

const starters = [
  "What's changed in the last 30 days?",
  'Which agents are most popular?',
  'How is AI usage changing in last 3 month?',
] as const;
const MIN_PANE_WIDTH = 300;
const MAX_PANE_WIDTH = 700;

function sampleAnswer(question: string) {
  const query = question.toLowerCase();
  if (query.includes('agent')) return 'In this sample dashboard, agent popularity is not yet ranked. The overview shows 123,456 conversations in the last 30 days. Connect a reporting source to compare individual agents.';
  if (query.includes('month') || query.includes('changed') || query.includes('usage')) return 'In this sample dashboard, monthly active users are 1,233 (+35.2%), conversations are 123,456 (+22.1%), and token consumption is 12,345,689 (+3.5%) versus the previous period.';
  return 'This is a local demo using the sample dashboard data. Try asking about active users, conversations, or token consumption. No live analytics or AI service is connected.';
}

interface DashboardAskPaneProps {
  onClose: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export function DashboardAskPane({ onClose, width, onWidthChange }: DashboardAskPaneProps) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<DashboardChatMessage[]>([]);
  const [history, setHistory] = useState<DashboardConversation[]>(sampleConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyBackRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const stopResizeRef = useRef<(() => void) | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages]);
  useEffect(() => () => stopResizeRef.current?.(), []);

  function send(text: string) {
    const question = text.trim();
    if (!question) return;
    const answer = sampleAnswer(question);
    const id = activeId ?? crypto.randomUUID();
    const nextMessages: DashboardChatMessage[] = [...messages,
      { id: crypto.randomUUID(), role: 'user', text: question },
      { id: crypto.randomUUID(), role: 'assistant', text: answer },
    ];
    const conversation: DashboardConversation = {
      id,
      title: nextMessages.find(message => message.role === 'user')?.text ?? question,
      messages: nextMessages,
      kind: 'session',
      updatedLabel: 'just now',
    };
    setMessages(nextMessages);
    setHistory(current => [conversation, ...current.filter(item => item.id !== id)]);
    setActiveId(id);
    setDraft('');
    setShowHistory(false);
    inputRef.current?.focus();
  }

  function newChat() {
    setMessages([]);
    setActiveId(null);
    setDraft('');
    setShowHistory(false);
    setShowHistoryDetail(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function openConversation(conversation: DashboardConversation) {
    setMessages(conversation.messages);
    setActiveId(conversation.kind === 'session' ? conversation.id : null);
    setShowHistory(false);
    setShowHistoryDetail(true);
    requestAnimationFrame(() => historyBackRef.current?.focus());
  }

  function returnToChat() {
    setShowHistory(false);
    setShowHistoryDetail(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function returnToHistory() {
    setShowHistoryDetail(false);
    setShowHistory(true);
    requestAnimationFrame(() => historyBackRef.current?.focus());
  }

  function constrainWidth(next: number) {
    const sidebarWidth = document.querySelector('.management-page')?.classList.contains('oc-is-collapsed') ? 80 : 280;
    const available = window.innerWidth - sidebarWidth - 520;
    return Math.max(MIN_PANE_WIDTH, Math.min(next, MAX_PANE_WIDTH, available));
  }

  function startResize(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    stopResizeRef.current?.();
    const divider = event.currentTarget;
    const startX = event.clientX;
    const original = width;
    const move = (next: globalThis.PointerEvent) => onWidthChange(constrainWidth(original + startX - next.clientX));
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      document.body.style.cursor = '';
      divider.classList.remove('mg-ask-resize--dragging');
      stopResizeRef.current = null;
    };
    divider.classList.add('mg-ask-resize--dragging');
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    stopResizeRef.current = end;
  }

  function resizeWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const step = event.shiftKey ? 32 : 16;
    const next = event.key === 'Home' ? MIN_PANE_WIDTH : event.key === 'End' ? MAX_PANE_WIDTH : width + (event.key === 'ArrowLeft' ? step : -step);
    onWidthChange(constrainWidth(next));
  }

  return <aside className="mg-ask-pane" aria-label="Ask about your data" onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
    <div className="mg-ask-resize" role="separator" aria-label="Resize dashboard and Ask panels" aria-orientation="vertical" aria-valuemin={MIN_PANE_WIDTH} aria-valuemax={MAX_PANE_WIDTH} aria-valuenow={width} tabIndex={0}
      onPointerDown={startResize} onKeyDown={resizeWithKeyboard}>
      <span className="mg-ask-grip" aria-hidden="true" />
    </div>
    <header className="mg-ask-header">
      <div className="mg-ask-title"><img src={askTitle} alt="" width="24" height="24" /><h2>Ask about your data</h2></div>
      <div className="mg-ask-header-actions">
        <Button size="icon" aria-label="New chat" title="New chat" onClick={newChat}><span className="mg-ask-header-icon"><img src={newChatIcon} alt="" /></span></Button>
        <Button size="icon" aria-label="Chat history" title="Chat history" aria-pressed={showHistory || showHistoryDetail} onClick={() => { setShowHistory(value => !value); setShowHistoryDetail(false); setShowInfo(false); }}><span className="mg-ask-header-icon"><img src={historyIcon} alt="" /></span></Button>
        <Button size="icon" aria-label="About Ask" title="About Ask" aria-pressed={showInfo} onClick={() => { setShowInfo(value => !value); setShowHistory(false); setShowHistoryDetail(false); }}><span className="mg-ask-header-icon"><img src={moreIcon} alt="" /></span></Button>
        <Button size="icon" aria-label="Close Ask panel" title="Close Ask panel" onClick={onClose}><span className="mg-ask-header-icon"><img src={closeIcon} alt="" /></span></Button>
      </div>
    </header>
    <div className="mg-ask-body">
      {showInfo ? <section className="mg-ask-info"><h3>About Ask</h3><p>Answers use sample dashboard figures in this local prototype. No live reporting or AI service is connected.</p><Button variant="outline" onClick={() => setShowInfo(false)}>Back to chat</Button></section>
        : showHistory ? <section className="mg-ask-history" aria-label="Chat history, sample data">
          <Button ref={historyBackRef} className="mg-ask-history-back" onClick={returnToChat}><img src={arrowLeftIcon} alt="" width="20" height="20" />Back to Chat</Button>
          <div className="mg-ask-history-list">{history.map(conversation => <Button key={conversation.id} className="mg-ask-history-row" onClick={() => openConversation(conversation)}><span>{conversation.title}</span><small>{conversation.updatedLabel}</small></Button>)}</div>
        </section>
          : showHistoryDetail || messages.length ? <div className="mg-ask-thread">
            {showHistoryDetail && <Button ref={historyBackRef} className="mg-ask-history-back" onClick={returnToHistory}><img src={arrowLeftIcon} alt="" width="20" height="20" />Back to chat history</Button>}
            <div className="mg-ask-messages" aria-live="polite">{messages.map(message => <article key={message.id} className={`mg-ask-message mg-ask-message--${message.role}`}><p>{message.text}</p></article>)}<div ref={endRef} /></div>
          </div>
            : <div className="mg-ask-empty"><img className="mg-ask-illustration" src={illustration} alt="" width="128" height="122" /><p>Explore usage trends, uncover insights, and find answers across your university.</p><div className="mg-ask-starters">{starters.map(question => <Button key={question} className="mg-ask-starter" onClick={() => send(question)}><span>{question}</span></Button>)}</div></div>}
    </div>
    {!showHistory && <form className="mg-ask-composer" onSubmit={event => { event.preventDefault(); send(draft); }}>
      <label className="mg-sr-only" htmlFor="mg-ask-input">Ask about your dashboard</label>
      <Input unstyled ref={inputRef} id="mg-ask-input" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask anything about your dashboard..." />
      <Button className="mg-ask-send" type="submit" size="icon" aria-label="Send question" disabled={!draft.trim()}><img src={chatCta} alt="" width="36" height="36" /><img className="mg-ask-send-icon" src={sendIcon} alt="" width="18" height="18" /></Button>
    </form>}
  </aside>;
}
