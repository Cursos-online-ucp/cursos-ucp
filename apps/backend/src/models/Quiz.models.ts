import {
    Table, Model, Column, DataType,
    PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo, HasMany
  } from 'sequelize-typescript';
  import Leccion from './Leccion.models';
  import PreguntaQuiz from './PreguntaQuiz.models';
  
  @Table({
    tableName: 'quiz',
    timestamps: false
  })
  export default class Quiz extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id_quiz!: number;
  
    @ForeignKey(() => Leccion)
    @Column(DataType.BIGINT)
    id_leccion!: number;
  
    @AllowNull(false)
    @Column(DataType.STRING(200))
    titulo!: string;
  
    @AllowNull(true)
    @Column(DataType.TEXT)
    descripcion?: string;
  
    // % mínimo para aprobar el quiz (0–100)
    @AllowNull(true)
    @Column(DataType.DECIMAL(5,2))
    porcentaje_aprobacion?: number;
  
    @BelongsTo(() => Leccion, 'id_leccion')
    leccion?: Leccion;
  
    @HasMany(() => PreguntaQuiz, { foreignKey: 'id_quiz', as: 'preguntas' })
    preguntas?: PreguntaQuiz[];
  }
  