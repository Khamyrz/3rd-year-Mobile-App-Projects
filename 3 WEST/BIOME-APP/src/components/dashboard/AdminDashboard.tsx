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
  People as UsersIcon,
  Store as VendorsIcon,
  DirectionsCar as DriversIcon,
  Tour as TouristsIcon,
  TravelExplore as GuidesIcon,
  Assessment as ReportsIcon,
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

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Users"
            value="2,543"
            icon={<UsersIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Vendors"
            value="156"
            icon={<VendorsIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Drivers"
            value="89"
            icon={<DriversIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Tourists"
            value="1,245"
            icon={<TouristsIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Local Guides"
            value="78"
            icon={<GuidesIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Revenue"
            value="$45.2K"
            icon={<ReportsIcon fontSize="large" color="primary" />}
          />
        </Grid>

        {/* User Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            {/* Add user management table/controls here */}
          </Paper>
        </Grid>

        {/* Verification Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Verifications
            </Typography>
            {/* Add verification requests list here */}
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {/* Add activity log here */}
          </Paper>
        </Grid>

        {/* System Reports */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Reports
            </Typography>
            {/* Add reports and analytics here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 