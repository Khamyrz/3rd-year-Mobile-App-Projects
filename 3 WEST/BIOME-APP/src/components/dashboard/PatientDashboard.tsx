import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import {
  CalendarToday as AppointmentIcon,
  LocalHospital as MedicalIcon,
  Assignment as PrescriptionIcon,
  Timeline as VitalsIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const PatientDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Appointments"
            value="2"
            icon={<AppointmentIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Prescriptions"
            value="3"
            icon={<PrescriptionIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Visits"
            value="5"
            icon={<MedicalIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Health Score"
            value="85%"
            icon={<VitalsIcon fontSize="large" color="primary" />}
          />
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            {/* Add appointments list here */}
          </Paper>
        </Grid>

        {/* Health Vitals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Health Vitals
            </Typography>
            {/* Add vitals charts/metrics here */}
          </Paper>
        </Grid>

        {/* Medical History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Medical History
            </Typography>
            {/* Add medical history timeline here */}
          </Paper>
        </Grid>

        {/* Current Medications */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Medications
            </Typography>
            {/* Add medications list here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard; 