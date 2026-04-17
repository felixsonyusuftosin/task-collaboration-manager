import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-datepicker/dist/react-datepicker.css';
import { TaskManagerView } from '@views';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TaskManagerView />
  </React.StrictMode>,
);
