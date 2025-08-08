import { Router, Request } from 'express';
import { AppDataSource } from '../config/database';
import { Note } from '../entities/Note';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        [key: string]: any;
      };
    }
  }
}

const router = Router();
const noteRepository = AppDataSource.getRepository(Note);
router.use(authMiddleware);
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user not found' });
  }
  
  const notes = await noteRepository.find({
    where: { user_id: userId },
    order: { last_update: 'DESC' }
  });

  const formattedNotes = notes.map(note => ({
    id: note.note_id,
    title: note.note_title,
    content: note.note_content,
    lastModified: note.last_update,
    createdOn: note.created_on
  }));

  res.json(formattedNotes);
}));

// Get single note
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const note = await noteRepository.findOne({
    where: { note_id: id, user_id: userId }
  });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json({
    id: note.note_id,
    title: note.note_title,
    content: note.note_content,
    lastModified: note.last_update,
    createdOn: note.created_on
  });
}));

// Create new note
router.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user?.userId;

  if (!title || !content) {
    return res.status(400).json({ 
      message: 'Title and content are required',
      fields: ['title', 'content']
    });
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title and content cannot be empty' 
    });
  }

  if (title.length > 255) {
    return res.status(400).json({ 
      message: 'Title cannot exceed 255 characters' 
    });
  }

  const note = noteRepository.create({
    note_title: title.trim(),
    note_content: content.trim(),
    user_id: userId
  });

  await noteRepository.save(note);

  res.status(201).json({
    message: 'Note created successfully',
    note: {
      id: note.note_id,
      title: note.note_title,
      content: note.note_content,
      lastModified: note.last_update,
      createdOn: note.created_on
    }
  });
}));

// Update note
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user?.userId;

  if (!title || !content) {
    return res.status(400).json({ 
      message: 'Title and content are required',
      fields: ['title', 'content']
    });
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title and content cannot be empty' 
    });
  }

  if (title.length > 255) {
    return res.status(400).json({ 
      message: 'Title cannot exceed 255 characters' 
    });
  }

  const note = await noteRepository.findOne({
    where: { note_id: id, user_id: userId }
  });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  note.note_title = title.trim();
  note.note_content = content.trim();
  await noteRepository.save(note);

  res.json({
    message: 'Note updated successfully',
    note: {
      id: note.note_id,
      title: note.note_title,
      content: note.note_content,
      lastModified: note.last_update,
      createdOn: note.created_on
    }
  });
}));

// Delete note
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const note = await noteRepository.findOne({
    where: { note_id: id, user_id: userId }
  });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  await noteRepository.remove(note);

  res.json({ 
    message: 'Note deleted successfully',
    deletedNoteId: id
  });
}));

export default router;
