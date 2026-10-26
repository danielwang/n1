import back from '../../assets/projects/detail/back.svg';
import share from '../../assets/projects/detail/share.svg';
import dots from '../../assets/projects/detail/dots.svg';
import mic from '../../assets/projects/detail/mic.svg';
import emptyChats from '../../assets/projects/detail/empty-chats.svg';
import emptyArtifacts from '../../assets/projects/detail/empty-artifacts.svg';
import uploadBackground from '../../assets/projects/detail/upload-background.svg';
import uploadContent from '../../assets/projects/detail/upload-content.svg';
import plusCircle from '../../assets/projects/detail/plus-circle.svg';
import chat from '../../assets/projects/detail/chat.svg';
import chatActive from '../../assets/projects/detail/chat-active.svg';
import artifacts from '../../assets/projects/detail/artifacts.svg';
import artifactsActive from '../../assets/projects/detail/artifacts-active.svg';
import knowledge from '../../assets/projects/detail/knowledge.svg';
import knowledgeActive from '../../assets/projects/detail/knowledge-active.svg';
import instruction from '../../assets/projects/detail/instruction.svg';
import instructionActive from '../../assets/projects/detail/instruction-active.svg';
import memory from '../../assets/projects/detail/memory.svg';
import send from '../../assets/projects/detail/send.svg';
import pdf from '../../assets/projects/detail/pdf.svg';
import excel from '../../assets/projects/detail/excel.svg';
import word from '../../assets/projects/detail/word.svg';
import ppt from '../../assets/projects/detail/ppt.svg';
import code from '../../assets/projects/detail/code.svg';
import markdown from '../../assets/projects/detail/markdown.svg';
import research from '../../assets/projects/detail/research.svg';
import testTube from '../../assets/projects/detail/test-tube.svg';
import remove from '../../assets/projects/detail/delete.svg';

export const detailArt = { back, share, dots, mic, emptyChats, emptyArtifacts, uploadBackground, uploadContent, plusCircle, chat, chatActive, artifacts, artifactsActive, knowledge, knowledgeActive, instruction, instructionActive, memory, send, testTube, remove };
export const projectFileArt = { pdf, excel, word, ppt, code, markdown, research };
export type ProjectArtifactKind = keyof typeof projectFileArt;

export function fileArt(name: string) {
  const extension = name.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return pdf;
  if (extension === 'xlsx' || extension === 'csv') return excel;
  if (extension === 'pptx') return ppt;
  if (extension === 'md' || extension === 'txt') return markdown;
  if (extension === 'json') return code;
  return word;
}
