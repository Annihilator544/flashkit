import { useEngagementData } from "store/use-engagement-data";
import ConnectAccount from "./components/ConnectAccount";
import { Card, CardContent } from "./components/ui/card";

function AccountSettings() {
    const { Engagement } = useEngagementData();
  return (
    <div>
        <div className="m-10">
            <ConnectAccount/>
            </div>
            <div className="m-10">
            {Engagement && typeof Engagement ==='object' && Object.keys(Engagement).length > 0 ?
            <Card className="flex gap-4">
                <CardContent className="flex-1 p-6">
                <pre>{Engagement.analysis[0].text}</pre>
                </CardContent>
            </Card>
            :<></>
            }
        </div>
    </div>
  );
}

export default AccountSettings;