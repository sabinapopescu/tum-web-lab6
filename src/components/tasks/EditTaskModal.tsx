import type { Task } from '../../types';
import { useStore, useToast } from '../../context/useStore';
import { Modal } from '../shared/Modal';
import { TaskForm } from './TaskForm';

interface Props {
  task: Task;
  onClose: () => void;
}

export function EditTaskModal({ task, onClose }: Props) {
  const { dispatch } = useStore();
  const { showToast } = useToast();

  function handleSubmit(updated: Task) {
    dispatch({ type: 'UPDATE_TASK', task: updated });
    showToast(`Task "${updated.title}" updated`);
    onClose();
  }

  return (
    <Modal title="Edit Task" onClose={onClose} width={520}>
      <TaskForm onSubmit={handleSubmit} onCancel={onClose} initial={task} />
    </Modal>
  );
}
