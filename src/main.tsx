import { ReactNode, useState } from 'react';
import { createRoot } from 'react-dom/client';

window.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('root')!).render(<Playground />);
});

const Playground = () => {
    const [rows, setRows] = useState(10);

    const rowNodes: ReactNode[] = [];
    for (let row = 0; row < rows; row++) {
        rowNodes.push(
            <li
                key={row}
                style={{
                    padding: '20px',
                    borderTop: '1px solid #000',
                    overflow: 'hidden',
                    resize: 'vertical',
                    background: '#fff',
                }}
            >
                ListItem {row}
            </li>,
        );
    }

    return (
        <div>
            <header style={{ marginBottom: '20px' }}>
                行数
                <input value={rows} type="number" onChange={(ev) => setRows(Number(ev.target.value))} />
            </header>
            <ul
                style={{
                    padding: 0,
                    margin: 0,
                    listStyle: 'none',
                    border: '4px solid #000',
                    background: '#c0c0c0',
                    height: '600px',
                    overflow: 'auto',
                    resize: 'both',
                }}
            >
                {rowNodes}
            </ul>
        </div>
    );
};
