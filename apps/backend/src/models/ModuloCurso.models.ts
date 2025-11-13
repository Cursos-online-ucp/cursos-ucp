import {
    Table, Model, Column, DataType,
    PrimaryKey, AutoIncrement, AllowNull, ForeignKey,
    BelongsTo, HasMany
  } from 'sequelize-typescript';
  import Curso from './Curso.models';
  import Leccion from './Leccion.models';
  
  @Table({ tableName: 'modulocurso', timestamps: false })
  export default class ModuloCurso extends Model {
    @PrimaryKey @AutoIncrement @Column(DataType.BIGINT)
    id_modulo!: number;
  
    @ForeignKey(() => Curso)
    @Column(DataType.BIGINT)
    id_curso!: number;                 // ← CLAVE FORÁNEA QUE SE ESPERA
  
    @AllowNull(false) @Column(DataType.STRING(200))
    titulo!: string;
  
    @Column(DataType.INTEGER)
    orden!: number;
  
    @BelongsTo(() => Curso, 'id_curso')
    curso?: Curso;
  
    @HasMany(() => Leccion, { foreignKey: 'id_modulo', as: 'lecciones' })
    lecciones?: Leccion[];
  }
  