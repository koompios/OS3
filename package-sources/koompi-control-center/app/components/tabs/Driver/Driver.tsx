import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckDriverForm } from './CheckDriverForm';

const Driver = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Manager</CardTitle>
        <CardDescription>
          Ensure proper installation and updates of your GPU (Graphics
          Processing Unit) to guarantee optimal performance and
          functionality.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <CheckDriverForm />
      </CardContent>
    </Card>
  );
};

export default Driver;
