import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ id, name, description, handleDelete}) => {
	const navigate = useNavigate()

	const handleViewClick = () => {
		navigate(`/course/${id}`)
	}
  return (
    <Card
      sx={{
        backgroundColor: "#E2CFEA",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" color="#000">
          {name}
        </Typography>
        <Typography variant="body2" color="#000">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          onClick={handleViewClick}
          sx={{
            backgroundColor: "#6247AA", // Custom secondary color
            color: "#fff",
            "&:hover": {
              backgroundColor: "#A06CD5",
            },
          }}
        >
          View
        </Button>
        <Button
          size="small"
					variant="contained"
					onClick={() => handleDelete(id)} 
          sx={{
						backgroundColor: "#DC3545",
						color: "#fff",
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

CourseCard.propTypes = {
	id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	handleDelete: PropTypes.func.isRequired,
};

export default CourseCard;
