/**
 * Index route: redirect authenticated users to operator, unauthenticated to sign-in.
 */

import { Redirect } from 'expo-router';
import { useSession } from '../lib/SessionContext';
import { View, ActivityIndicator } from 'react-native';

export default function IndexPage() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#E8832A" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(operator)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
