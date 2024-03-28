import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SwitchForm } from './SwitchForm';

const Update = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Software Update</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <SwitchForm />
        </div>
      </CardContent>
    </Card>
  );
};

export default Update;
