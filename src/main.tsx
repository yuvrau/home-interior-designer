import React,{useState} from 'react'; import {createRoot} from 'react-dom/client'; import Landing from './pages/Landing'; import Editor from './components/editor/Editor'; import './styles.css';
function App(){const [editor,setEditor]=useState(false);return editor?<Editor onExit={()=>setEditor(false)}/>:<Landing onStart={()=>setEditor(true)} onOpen={()=>setEditor(true)}/>};
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
