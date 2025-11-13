import {
    Table, Model, Column, DataType,
    PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo
  } from 'sequelize-typescript';
  import PreguntaQuiz from './PreguntaQuiz.models';
  
  @Table({
    tableName: 'opcion_quiz',
    timestamps: false
  })
  export default class OpcionQuiz extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id_opcion!: number;
  
    @ForeignKey(() => PreguntaQuiz)
    @Column(DataType.BIGINT)
    id_pregunta!: number;
  
    @AllowNull(false)
    @Column(DataType.STRING(500))
    texto!: string;
  
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    es_correcta!: boolean;
  
    @Column(DataType.INTEGER)
    orden?: number;
  
    @BelongsTo(() => PreguntaQuiz, 'id_pregunta')
    pregunta?: PreguntaQuiz;
  }
  