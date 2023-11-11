import { createRoot } from 'react-dom/client';
import { AppShell } from './AppShell';

window.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('root')!).render(<AppShell />);
});
