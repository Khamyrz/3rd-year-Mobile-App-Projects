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
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  Reviews as ReviewsIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as AnalyticsIcon,
  Star as RatingIcon,
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

const VendorDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value="156"
            icon={<OrdersIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Products"
            value="45"
            icon={<ProductsIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Revenue"
            value="$12.5K"
            icon={<RevenueIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Reviews"
            value="128"
            icon={<ReviewsIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Rating"
            value="4.8"
            icon={<RatingIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Growth"
            value="+24%"
            icon={<AnalyticsIcon fontSize="large" color="primary" />}
          />
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {/* Add orders table here */}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            {/* Add quick action buttons here */}
          </Paper>
        </Grid>

        {/* Product Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Management
            </Typography>
            {/* Add product management controls here */}
          </Paper>
        </Grid>

        {/* Customer Reviews */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Reviews
            </Typography>
            {/* Add reviews list here */}
          </Paper>
        </Grid>

        {/* Sales Analytics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Analytics
            </Typography>
            {/* Add sales charts and analytics here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VendorDashboard; 