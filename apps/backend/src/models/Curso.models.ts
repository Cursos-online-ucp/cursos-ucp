import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default
  } from "sequelize-typescript";
  
  export type Nivel = "basico" | "intermedio" | "avanzado";
  export type Estado = "borrador" | "publicado" | "inactivo";
  
  @Table({
    tableName: "curso",
    timestamps: false
  })
  export default class Curso extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.BIGINT })
    id_curso!: number;
  
    @AllowNull(false)
    @Column({ type: DataType.STRING(200) })
    titulo!: string;
  
    @AllowNull(true)
    @Column({ type: DataType.TEXT })
    descripcion?: string;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING(100) })
    categoria?: string;
  
    @AllowNull(false)
    @Default("basico")
    @Column(DataType.ENUM("basico", "intermedio", "avanzado"))
    nivel!: Nivel;
  
    @AllowNull(false)
    @Default(0)
    @Column(DataType.DECIMAL(10, 2))
    precio!: number;
  
    @AllowNull(true)
    @Column({ type: DataType.STRING(50) })
    idioma?: string;
  
    @AllowNull(true)
    @Default(DataType.NOW)
    @Column({ type: DataType.DATE })
    fecha_creacion?: Date;
  
    @AllowNull(false)
    @Default("borrador")
    @Column(DataType.ENUM("borrador", "publicado", "inactivo"))
    estado!: Estado;
  
    @AllowNull(true)
    @Column({ type: DataType.BIGINT })
    id_productor?: number;
  }
  