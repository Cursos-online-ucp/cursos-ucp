import {
    Table, Model, Column, DataType,
    PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo, HasMany
  } from 'sequelize-typescript';
  import Quiz from './Quiz.models';
  import OpcionQuiz from './OpcionQuiz.models';
  
  export type TipoPregunta = 'opcion_multiple' | 'verdadero_falso';
  
  @Table({
    tableName: 'pregunta_quiz',
    timestamps: false
  })
  export default class PreguntaQuiz extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id_pregunta!: number;
  
    @ForeignKey(() => Quiz)
    @Column(DataType.BIGINT)
    id_quiz!: number;
  
    @AllowNull(false)
    @Column(DataType.STRING(500))
    enunciado!: string;
  
    @AllowNull(false)
    @Column(DataType.ENUM('opcion_multiple', 'verdadero_falso'))
    tipo_pregunta!: TipoPregunta;
  
    @Column(DataType.INTEGER)
    orden?: number;
  
    @BelongsTo(() => Quiz, 'id_quiz')
    quiz?: Quiz;
  
    @HasMany(() => OpcionQuiz, { foreignKey: 'id_pregunta', as: 'opciones' })
    opciones?: OpcionQuiz[];
  }
  