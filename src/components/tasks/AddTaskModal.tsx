import type { Task } from '../../types';
import { useStore, useToast } from '../../context/useStore';
import { Modal } from '../shared/Modal';
import { TaskForm } from './TaskForm';

interface Props {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: Props) {
  const { dispatch } = useStore();
  const { showToast } = useToast();

  function handleSubmit(task: Task) {
    dispatch({ type: 'ADD_TASK', task });
    showToast(`Task "${task.title}" created`);
    onClose();
  }

  return (
    <Modal title="New Task" onClose={onClose} width={520}>
      <TaskForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
