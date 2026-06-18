// routes/perfis.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/perfisController');

// RF03 — CRUD completo de perfis
router.get('/',     ctrl.listar);
router.get('/:id',  ctrl.buscarPorId);
router.post('/',    ctrl.criar);
router.put('/:id',  ctrl.atualizar);
router.delete('/:id', ctrl.excluir);

module.exports = router;