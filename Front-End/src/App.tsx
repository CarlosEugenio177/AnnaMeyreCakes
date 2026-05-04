import { useState } from 'react';
import { CakeBuilder } from './pages/CakeBuilder';
import { Home } from './pages/Home';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#fffaf2_38%,#F7F0C8_100%)] text-[#3f3434] md:flex md:items-center md:justify-center md:bg-[#f3ded9] md:p-6">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-petal shadow-none md:min-h-[860px] md:rounded-[42px] md:shadow-[0_22px_70px_rgba(139,85,60,0.22)] md:ring-8 md:ring-white/70">
        {started ? <CakeBuilder /> : <Home onStart={() => setStarted(true)} />}
      </div>
    </div>
  );
}

export default App;
