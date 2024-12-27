import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookMenuIcon from "@mui/icons-material/MenuBook";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import logo_dark from "../assets/logo-dark.png";
import logo_light from "../assets/logo-light.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { logoutUser, CoursesApi, DashboardApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Account } from "@toolpad/core/Account";
import {
  AuthenticationContext,
  SessionContext,
} from "@toolpad/core/AppProvider";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles"


const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
];


function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        textAlign: "left",
      }}
    >
      <Typography>{pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Dashboard(props) {
  const { children } = props;
  const router = useDemoRouter("/dashboard");
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const theme = useTheme();


  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        // Your existing login logic can go here if needed
      },
      signOut: async () => {
        // logout logic
      },
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await CoursesApi(token); // API call to fetch courses
        console.log("Courses API Response:", response.data);
        setCourses(response.data.courses || []); // Assuming response.data contains the courses
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await DashboardApi(token);
        const userData = {
          username: response.data.username,
          email: response.data.email
        }
        setUser(userData);

        setSession({
          user: {
            name: response.data.username,
            email: response.data.email
          },
        });
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    })
  }, []);

  const logo = theme.palette.mode === "dark" ? logo_light : logo_dark;

  const Logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token Found. Unable to logout");
        return;
      }
      const response = await logoutUser(token);
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out", error.message);
    }
  };

  return (
    <>
      <AppProvider
        navigation={[
          ...NAVIGATION,
          {
            segment: "courses",
            title: "Courses",
            icon: <BookMenuIcon />,
            children: courses.map((course, index) => ({
              segment: `${course.title.replace(/\s+/g, "-")}`,
              title: course.title,
              icon: (
                <Tooltip title={course.title}>
                  <IconButton color="primary">
                    <BookMenuIcon />
                  </IconButton>
                </Tooltip>
              ),
              onClick: () =>
                router.navigate(
                  `/courses/${course.title.replace(/\s+/g, "-")}`
                ),
            })),
          },
          {
            segment: "logout",
            title: "Logout",
            icon: (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 3,
                  width: "50%",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Logout">
                  <IconButton className="bg-accent" onClick={Logout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          },
        ]}
        branding={{
          logo: (
            <img
              src={logo}
              alt="Studysync logo"
              style={{
                height: "40px",
                filter:
                  theme.palette.mode === "dark"
                    ? "brightness(0) invert(1)"
                    : "none",
              }}
            />
          ),
          title: (
            <Typography
              variant="h6"
              sx={{
                color: "#A06CD5",
                fontWeight: "bold",
              }}
            >
              STUDYSYNC
            </Typography>
          ),
          homeUrl: "",
        }}
        router={router}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
          {children}
        </DashboardLayout>
      </AppProvider>
    </>
  );
}


export default Dashboard;
