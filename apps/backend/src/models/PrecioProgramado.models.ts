import {
    Table, Model, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey, AllowNull
  } from 'sequelize-typescript';
  import Curso from './Curso.models';
  
  @Table({ tableName: 'precio_programado', timestamps: false })
  export default class PrecioProgramado extends Model {
    @PrimaryKey @AutoIncrement @Column(DataType.BIGINT)
    id_precio!: number;
  
    @ForeignKey(() => Curso)
    @Column(DataType.BIGINT)
    id_curso!: number;
  
    @AllowNull(false) @Column(DataType.DECIMAL(10,2))
    precio!: number;
  
    @AllowNull(true) @Column(DataType.DECIMAL(5,2))
    descuento_pct?: number; // 0..100
  
    @AllowNull(false) @Column(DataType.DATE)
    vigente_desde!: Date;
  
    @AllowNull(true) @Column(DataType.DATE)
    vigente_hasta?: Date;   // null = abierto
  }
  