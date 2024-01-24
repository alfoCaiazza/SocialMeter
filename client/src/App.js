import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import Features from './components/Features';
import Header from './components/Header';
import Footer from './components/Footer';
import Results from './components/Results';
import FilteredPosts from './components/FilteredPosts';
import Trends from './components/Trends';
import HotTopics from './components/HotTopics';
import TrendsCategory from './components/TrendsCategory';
import HotTopicsCategory from './components/HotTopicsCategory';
import PostDetail from './components/PostDetail';
import MatrixProfileForms from './components/MatrixProfileForms';
import NewTrends from './components/NewTrends';
import './components/homepage.css';
import './components/features.css';
import './components/header.css';
import './components/card.css';
import './components/filteredposts.css';
import './components/monthlyTrends.css';
import './components/hottopics.css';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/filtered_posts" element={<FilteredPosts />} />
        <Route path="/post/:postId" element={<PostDetail  />} />
        <Route path="/hot_topics_category" element={<HotTopicsCategory />} />
        <Route path="/hot_topics/:category" element={<HotTopics />} />
        <Route path="/trends_category" element={<TrendsCategory />} />
        <Route path="/trends/:category" element={<NewTrends />} />
        <Route path="/matrix_profile" element={<MatrixProfileForms />} />
        <Route path='/results' element={<Results />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
