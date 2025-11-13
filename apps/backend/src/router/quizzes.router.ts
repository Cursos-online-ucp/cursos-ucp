import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import Quiz from '../models/Quiz.models';
import Leccion from '../models/Leccion.models';
import PreguntaQuiz from '../models/PreguntaQuiz.models';
import OpcionQuiz from '../models/OpcionQuiz.models';
import {
  createQuizSchema,
  createPreguntaSchema,
  createOpcionSchema
} from '../schemas/quiz.schema';

const r = Router();

/**
 * Crear quiz para una lección
 * body: { id_leccion, titulo, descripcion?, porcentaje_aprobacion? }
 */
r.post('/', validateBody(createQuizSchema), async (req, res) => {
  const { id_leccion, titulo, descripcion, porcentaje_aprobacion } = req.body;

  const leccion = await Leccion.findByPk(id_leccion);
  if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });

  // si ya tiene quiz, podrías decidir si bloquear o permitir varios
  const existente = await Quiz.findOne({ where: { id_leccion } });
  if (existente) {
    return res.status(400).json({ error: 'La lección ya tiene un quiz asociado' });
  }

  const quiz = await Quiz.create({
    id_leccion,
    titulo,
    descripcion,
    porcentaje_aprobacion
  });

  res.status(201).json(quiz);
});

/**
 * Obtener quiz completo de una lección (quiz + preguntas + opciones)
 */
r.get('/leccion/:id_leccion', async (req, res) => {
  const quiz = await Quiz.findOne({
    where: { id_leccion: req.params.id_leccion },
    include: [
      {
        model: PreguntaQuiz,
        as: 'preguntas',
        include: [{ model: OpcionQuiz, as: 'opciones' }]
      }
    ],
    order: [
      [{ model: PreguntaQuiz, as: 'preguntas' }, 'orden', 'ASC'],
      [{ model: PreguntaQuiz, as: 'preguntas' }, { model: OpcionQuiz, as: 'opciones' }, 'orden', 'ASC']
    ]
  });

  if (!quiz) return res.status(404).json({ error: 'Quiz no encontrado para esta lección' });
  res.json(quiz);
});

/**
 * Crear pregunta dentro de un quiz
 * POST /api/quizzes/:id_quiz/preguntas
 */
r.post('/:id_quiz/preguntas', validateBody(createPreguntaSchema), async (req, res) => {
  const id_quiz = Number(req.params.id_quiz);
  const quiz = await Quiz.findByPk(id_quiz);
  if (!quiz) return res.status(404).json({ error: 'Quiz no encontrado' });

  const { enunciado, tipo_pregunta, orden } = req.body;
  const pregunta = await PreguntaQuiz.create({
    id_quiz,
    enunciado,
    tipo_pregunta,
    orden
  });

  res.status(201).json(pregunta);
});

/**
 * Crear opción dentro de una pregunta
 * POST /api/quizzes/preguntas/:id_pregunta/opciones
 */
r.post('/preguntas/:id_pregunta/opciones', validateBody(createOpcionSchema), async (req, res) => {
  const id_pregunta = Number(req.params.id_pregunta);
  const pregunta = await PreguntaQuiz.findByPk(id_pregunta);
  if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });

  const { texto, es_correcta, orden } = req.body;
  const opcion = await OpcionQuiz.create({
    id_pregunta,
    texto,
    es_correcta,
    orden
  });

  res.status(201).json(opcion);
});

/**
 * Eliminar pregunta (y sus opciones)
 */
r.delete('/preguntas/:id_pregunta', async (req, res) => {
  const deleted = await PreguntaQuiz.destroy({ where: { id_pregunta: req.params.id_pregunta } });
  if (!deleted) return res.status(404).json({ error: 'No encontrado' });
  res.status(204).send();
});

/**
 * Eliminar opción
 */
r.delete('/opciones/:id_opcion', async (req, res) => {
  const deleted = await OpcionQuiz.destroy({ where: { id_opcion: req.params.id_opcion } });
  if (!deleted) return res.status(404).json({ error: 'No encontrado' });
  res.status(204).send();
});

export default r;
