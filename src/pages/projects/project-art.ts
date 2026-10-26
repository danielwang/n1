import biology from '../../assets/projects/biology.svg';
import research from '../../assets/projects/research.svg';
import book from '../../assets/projects/book.svg';
import project from '../../assets/projects/project.svg';
import exam from '../../assets/projects/exam.svg';
import presentation from '../../assets/projects/presentation.svg';

export const projectArt = { biology, research, book, project, exam, presentation };
export type ProjectGlyph = keyof typeof projectArt;
