import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Trash2, Check } from 'lucide-react';
import { useT } from '../i18n/useT';

export function TasksPage() {
  const { tasks, toggleTask, deleteTask } = useStore();
  const t = useT();
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.tasks_title}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{t.tasks_sub}</p>
      </div>

      {tasks.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-3xl mb-3">✅</p>
          <p className="text-gray-500">{t.tasks_empty}</p>
        </Card>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{t.todo(pending.length)}</h2>
          <div className="space-y-2">
            {pending.map((task) => (
              <Card key={task.id} className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded-full border-2 border-beige-300 hover:border-calm-green transition-colors shrink-0" />
                <span className="flex-1 text-sm text-gray-700">{task.text}</span>
                <button onClick={() => deleteTask(task.id)} className="p-1.5 hover:bg-calm-red-light rounded-lg text-gray-300 hover:text-calm-red transition-colors">
                  <Trash2 size={14} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">{t.done_section(done.length)}</h2>
          <div className="space-y-2">
            {done.map((task) => (
              <Card key={task.id} className="flex items-center gap-3 opacity-60">
                <button onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded-full bg-calm-green flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" />
                </button>
                <span className="flex-1 text-sm text-gray-400 line-through">{task.text}</span>
                <button onClick={() => deleteTask(task.id)} className="p-1.5 hover:bg-calm-red-light rounded-lg text-gray-300 hover:text-calm-red transition-colors">
                  <Trash2 size={14} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
