import { Layout } from '../components';
import { Stack, Box, Text, Button } from '@chakra-ui/react';

export default function Pricing() {
  return (
    <Layout>
      <Stack maxW="7xl" mx="auto" width="full">
        <Stack alignItems="center" mt="40" maxW="4xl" mx="auto" width="full" isInline spacing="10">
          <PricingCard width="30%" type="Basic" price="Free" />
          <PricingCard width="40%" height="350px" type="Pro" price="€20/month" />
          <PricingCard width="30%" type="Enterprise" price="€200/year" />
        </Stack>
      </Stack>
    </Layout>
  );
}

function PricingCard({ price, type, width, height = '64' }) {
  return (
    <Stack p="6" rounded="xl" boxShadow="2xl" width={width} bg="white" height={height}>
      <Box flex="1">
        <Text fontSize="xl" fontWeight="semibold">
          {type}
        </Text>
        <Text>{price}</Text>
      </Box>
      <Button height="12" bg="gray.900" color="white" _hover={{}}>
        Choose Plan
      </Button>
    </Stack>
  );
}
