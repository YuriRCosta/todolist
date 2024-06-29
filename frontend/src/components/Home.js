import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TaskModal from "./TaskModal";
import BACKEND_URL from "../config";
import "./KanbanBoard.css";
import PomodoroTimer from "./PomodoroTimer";
import "./PomodoroTimer.css";
import { RotatingLines } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    const updatedTasks = tasks.map((task) => {
      if (task.id === parseInt(taskId)) {
        task.status = status;
      }
      return task;
    });
    handleTaskUpdate(taskId, status, date);
    setTasks(updatedTasks);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.post(
          `${BACKEND_URL}/auth/validate-token`,
          { token },
        );
        if (!response.data.isValid) {
          navigate("/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        navigate("/login");
      }
    };
    validateToken();
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [date]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsRequesting(true);
      const response = await axios.post(
        `${BACKEND_URL}/tasks/date`,
        { date },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks(response.data);
      setIsRequesting(false);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setIsRequesting(false);
    }
  };

  const handleTaskCreation = async (taskData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsRequesting(true);
      await axios.post(`${BACKEND_URL}/tasks/create`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      setIsRequesting(false);
    }
  };

  const handleTaskUpdate = async (taskData, status, date) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsRequesting(true);
      await axios.put(
        `${BACKEND_URL}/tasks/${taskData}/status`,
        { status, date },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setIsRequesting(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setIsRequesting(true);
      await axios.delete(`${BACKEND_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      setIsRequesting(false);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      setIsRequesting(false);
    }
  };

  const confirmDelete = (taskId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, delete!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleTaskDelete(taskId);
        Swal.fire("Deletado!", "Sua tarefa foi deletada.", "success");
      }
    });
  };

  const translateRecurrence = (recurrence) => {
    switch (recurrence) {
      case "daily":
        return "Diário";
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensal";
      case "yearly":
        return "Anual";
      default:
        return "Não Recorrente";
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <RotatingLines width="100" />
      </div>
    );
  }

  return (
    <div>
      {isRequesting && (
        <div className="loading-overlay">
          <RotatingLines width="100" />
        </div>
      )}
      <button className="toggle-dark-mode" onClick={toggleDarkMode}>
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      </button>
      <h1>Quadro Kanban</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={() => setIsModalOpen(true)}>Adicionar Tarefa</button>
      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskCreation}
          darkMode={darkMode}
        />
      )}
      <div className="kanban-board">
        {["To-do", "In-progress", "Done"].map((status) => (
          <div
            key={status}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
          >
            <h2>
              {status === "To-do"
                ? "A fazer"
                : status === "In-progress"
                  ? "Em progresso"
                  : "Feito"}
            </h2>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="kanban-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <button onClick={() => confirmDelete(task.id)}>X</button>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>
                    <strong>Recorrência:</strong>{" "}
                    {translateRecurrence(task.recurrence)}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
      <PomodoroTimer />
    </div>
  );
};

export default Home;
