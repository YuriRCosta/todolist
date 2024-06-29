import React, { useState } from "react";
import "./TaskModal.css";

const TaskModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");

  const handleSave = () => {
    const taskData = {
      title,
      description,
      recurrence: recurrence || null,
      specificDate: specificDate || null,
      dayOfWeek: recurrence === "weekly" ? dayOfWeek : null,
      dayOfMonth: recurrence === "monthly" ? dayOfMonth : null,
    };
    onSave(taskData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Adicionar Tarefa</h2>
        <label>
          Título:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Descrição:
          <textarea
            value={description}
            onChange={(e) => {
              if (e.target.value.length > 100) return;
              setDescription(e.target.value);
            }}
          />
        </label>
        <label>
          Recorrência:
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="">Nenhuma</option>
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="specific">Data Específica</option>
          </select>
        </label>
        {recurrence === "specific" && (
          <label>
            Data Específica:
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
            />
          </label>
        )}
        {recurrence === "weekly" && (
          <label>
            Dia da Semana:
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="0">Domingo</option>
              <option value="1">Segunda-feira</option>
              <option value="2">Terça-feira</option>
              <option value="3">Quarta-feira</option>
              <option value="4">Quinta-feira</option>
              <option value="5">Sexta-feira</option>
              <option value="6">Sábado</option>
            </select>
          </label>
        )}
        {recurrence === "monthly" && (
          <label>
            Dia do Mês:
            <input
              type="number"
              min="1"
              max="31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
            />
          </label>
        )}
        <div className="modal-buttons">
          <button onClick={handleSave}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
