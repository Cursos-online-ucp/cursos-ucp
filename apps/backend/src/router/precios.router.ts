import { Router } from 'express';
import PrecioProgramado from '../models/PrecioProgramado.models';

const r = Router();

// Programar precio/discount
r.post('/:id_curso', async (req, res) => {
  const id_curso = Number(req.params.id_curso);
  const { precio, descuento_pct, vigente_desde, vigente_hasta } = req.body;
  if (precio == null || !vigente_desde) return res.status(400).json({ error: 'precio y vigente_desde son requeridos' });
  if (descuento_pct != null && (descuento_pct < 0 || descuento_pct > 100)) return res.status(400).json({ error: 'descuento_pct inválido' });

  const pp = await PrecioProgramado.create({ id_curso, precio, descuento_pct, vigente_desde, vigente_hasta });
  res.status(201).json(pp);
});

// Listar programación vigente e histórico
r.get('/:id_curso', async (req, res) => {
  const id_curso = Number(req.params.id_curso);
  const list = await PrecioProgramado.findAll({
    where: { id_curso },
    order: [['vigente_desde', 'DESC']]
  });
  res.json(list);
});

// Anular programación
r.delete('/:id_precio', async (req, res) => {
  const d = await PrecioProgramado.destroy({ where: { id_precio: req.params.id_precio } });
  if (!d) return res.status(404).json({ error: 'No encontrado' });
  res.status(204).send();
});

export default r;
