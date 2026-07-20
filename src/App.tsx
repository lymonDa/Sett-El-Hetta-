import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import CinematicIntro from '@/components/feature/CinematicIntro';
import PageTransition from '@/components/feature/PageTransition';
import { useCustomerAuthStore } from '@/stores/customerAuthStore';

const INTRO_KEY = 'cinematic_intro_shown';

function DirectionManager({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleLangChange = (lang: string) => {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
      document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
    };

    handleLangChange(i18n.language);

    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, []);

  return <>{children}</>;
}

function CustomerAuthInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = useCustomerAuthStore.getState().initialize();
    return cleanup;
  }, []);

  return <>{children}</>;
}

function AppShell() {
  return (
    <CustomerAuthInit>
      <PageTransition>
        <AppRoutes />
      </PageTransition>
    </CustomerAuthInit>
  );
}

function SupabaseTodos() {
  const [todos, setTodos] = useState<any[]>([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 bg-white dark:bg-black p-4 m-4 rounded shadow">
      <h3 className="font-bold">Supabase Todos:</h3>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </div>
  )
}


function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem(INTRO_KEY);
    if (hasShown) {
      setAppReady(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_KEY, '1');
    setShowIntro(false);
    setAppReady(true);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <DirectionManager>
        <BrowserRouter basename={__BASE_PATH__}>
          {appReady && <AppShell />}
        </BrowserRouter>
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      </DirectionManager>
    </I18nextProvider>
  );
}

export default App;