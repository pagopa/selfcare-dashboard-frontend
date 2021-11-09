// import React from 'react';
import { Box } from '@mui/material';
import PartyActive from './components/ProductCard/ActiveProductCard';
import PartyToBeActive from './components/ProductCard/NewProductCard';

export default function Dashboard() {
    return (
        <Box mb={6}>
            <PartyActive />
            <PartyToBeActive />
        </Box>
    );
}
