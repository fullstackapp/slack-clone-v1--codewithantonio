'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Thread from '@/features/messages/components/thread';
import Sidebar from '@/features/workspaces/components/sidebar';
import Toolbar from '@/features/workspaces/components/toolbar';
import WorkspaceSidebar from '@/features/workspaces/components/workspace-sidebar';
import { usePanel } from '@/hooks/use-panel';

import { Id } from '../../../../convex/_generated/dataModel';

interface WorkSpaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkSpaceIdLayoutProps) => {
  const { parentMessageId, onCloseMessage } = usePanel();
  const isThreadShown = !!parentMessageId;

  return (
    <div className='h-full'>
      <Toolbar />

      <div className='flex h-[calc(100vh-44px)] w-full'>
        <Sidebar />
        <ResizablePanelGroup
          direction='horizontal'
          autoSaveId={'workspace-layout'}>
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className='bg-[#5e2c5f]'>
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {isThreadShown && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                <Thread
                  messageId={parentMessageId as Id<'messages'>}
                  onClose={onCloseMessage}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
