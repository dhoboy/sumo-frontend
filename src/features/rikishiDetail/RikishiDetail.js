import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const RikishiDetail = () => {
  const params = useParams();
  const { name } = params;

  return <div>{`${name}'s rikishi detail mmk`}</div>;
};

export default RikishiDetail;
