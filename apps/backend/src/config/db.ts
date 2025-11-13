import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Curso from '../models/Curso.models';
import ModuloCurso from '../models/ModuloCurso.models';
import Leccion from '../models/Leccion.models';
import PrecioProgramado from '../models/PrecioProgramado.models';
import Quiz from '../models/Quiz.models';
import PreguntaQuiz from '../models/PreguntaQuiz.models';
import OpcionQuiz from '../models/OpcionQuiz.models';
dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'mysql',
  models: [Curso, ModuloCurso, Leccion, PrecioProgramado, Quiz, PreguntaQuiz, OpcionQuiz,], 
  logging: false
});

export default db;