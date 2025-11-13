import {
    Table, Model, Column, DataType,
    PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo
  } from 'sequelize-typescript';
  import ModuloCurso from './ModuloCurso.models';
  import { HasOne } from 'sequelize-typescript';
import Quiz from './Quiz.models';
  
  export type TipoContenido = 'video'|'audio'|'pdf'|'presentacion'|'enlace'|'texto';
  
  @Table({ tableName: 'leccion', timestamps: false })
  export default class Leccion extends Model {
    @PrimaryKey @AutoIncrement @Column(DataType.BIGINT)
    id_leccion!: number;
  
    @ForeignKey(() => ModuloCurso)
    @Column(DataType.BIGINT)
    id_modulo!: number;
  
    @AllowNull(false) @Column(DataType.STRING(200))
    titulo!: string;
  
    @AllowNull(true) @Column(DataType.TEXT)
    descripcion?: string;
  
    @Column(DataType.ENUM('video','audio','pdf','presentacion','enlace','texto'))
    tipo_contenido!: TipoContenido;
  
    @AllowNull(true) @Column(DataType.TEXT)
    url_contenido?: string | null
  
    @AllowNull(true) @Column(DataType.TEXT)
    texto_contenido?: string | null
  
    @Column(DataType.INTEGER)
    duracion_seg?: number | null
  
    @Column(DataType.INTEGER)
    orden!: number;
  
    @BelongsTo(() => ModuloCurso, 'id_modulo')
    modulo?: ModuloCurso;

    @HasOne(() => Quiz, { foreignKey: 'id_leccion', as: 'quiz' })
    quiz?: Quiz;
  }
  