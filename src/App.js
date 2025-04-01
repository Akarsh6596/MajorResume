import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout/RootLayout';
import Home from './components/Home/Home';
import BERT from './components/Bert/Bert';
import ABOUT from './components/About/About'
import Rank from './components/Rank/Rank'
import Comparision from './components/Comparison/Comparison'
import ComparisonV2 from './components/ComparisionV2/ComparisionV2'
import DisplaySummaries from './components/DisplaySummaries/DisplaySummaries'
import ComparisonGraphs from './components/ComparisonGraphs/ComparisonGraphs'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <ABOUT /> },
        { path: '/bert', element: <BERT /> }, // 📌 BERT summarization page
        { path: '/bart', element: <Home/> },
        { path: '/Rank', element:<Rank/> },
        { path: '/Comparision', element:<Comparision/> },
        {path:'/ComparisonV2', element: <ComparisonV2/>},
        {path:'/DisplaySummaries', element: <DisplaySummaries/>},
        {path:'/ComparisonGraphs', element:<ComparisonGraphs/>}
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
