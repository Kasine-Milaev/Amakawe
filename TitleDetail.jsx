// src/pages/TitleDetail.jsx
import React from 'react';
import TitlePage from '../components/TitlePage';

const TitleDetail = ({ title }) => {
  return (
    <div className="page-title-detail">
      <h1>Детали тайтла</h1>
      <TitlePage title={title} />
    </div>
  );
};

export default TitleDetail;