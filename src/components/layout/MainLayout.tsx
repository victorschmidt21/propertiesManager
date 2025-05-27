
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent } from '@/components/ui/tabs';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const MainLayout = ({ children, requireAdmin = false }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header sidebarCollapsed={sidebarCollapsed} />
        <Tabs defaultValue="default">
          <TabsContent value="default" className="flex-1">
            <main className={cn(
              "flex-1 p-6 transition-all duration-300",
              sidebarCollapsed ? "ml-[80px]" : "ml-[250px]"
            )}>
              {children}
            </main>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainLayout;
