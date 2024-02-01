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
import FilteredPostsCategory from './components/FilteredPostsCategory';
import AboutUs from './components/AboutUs';
import './components/css/homepage.css';
import './components/css/aboutus.css';
import './components/css/features.css';
import './components/css/header.css';
import './components/css/footer.css';
import './components/css/card.css';
import './components/css/filteredposts.css';
import './components/css/newtrends.css';
import './components/css/monthlyTrends.css';
import './components/css/hottopics.css';
import './components/css/comment.css';
import './components/css/post.css';
import './components/css/matrixprofile.css';
import './components/css/postdetail.css';
import './components/css/totalredditorscard.css';
import './components/css/sentimentsummarybar.css';
import './components/css/sentimentsummarycard.css';
import './components/css/emotioncommunitybar.css';
import './components/css/emotioncommunitycard.css';
import './components/css/scorebar.css';
import './components/css/scorecard.css';
import './components/css/postemotioncard.css';
import './components/css/sentimentbar.css';
import './components/css/sentimentcard.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/filtered_posts_category" element={<FilteredPostsCategory />} />
        <Route path="/filtered_posts/:category" element={<FilteredPosts />} />
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
