import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";

interface SettingsTabsProps {
  tabs: {
    name: string;
    title: string;
    component: React.ReactNode;
  }[];
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ tabs }) => {
  return (
    <Tabs defaultValue={tabs[0].name} className="flex gap-5">
      <TabsList className="h-fit flex-col items-start gap-1.5 bg-transparent">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.name}
            value={tab.name}
            className="flex w-[170px] justify-start rounded-md px-3 py-2 shadow-none"
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.name} value={tab.name} className="w-full">
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};
