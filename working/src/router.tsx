import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LuckyRabbitPage from './pages/LuckyRabbitPage';
import VideoDetailPage from './pages/VideoDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/lucky-rabbit',
    element: <LuckyRabbitPage />,
  },
  {
    path: '/video/:videoId',
    element: <VideoDetailPage />,
  },
]);

export default router;