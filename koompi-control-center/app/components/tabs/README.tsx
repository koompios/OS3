import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Subsystem from './Subsystem';

const README = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide</CardTitle>
        <CardDescription>Documentations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          {/* <Input id="name" defaultValue="Name the container" /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default README;
