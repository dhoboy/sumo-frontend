import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const TournamentBouts = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { year, month, day } = params;

  useEffect(() => {
    if (!day) navigate(`/tournaments/${year}/${month}/1`);
  }, [day, month, navigate, year]);

  return <div>tournament bouts!</div>;
};

export default TournamentBouts;
