"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar-app/app-sidebar"
import { SidebarInsetTopbar } from "@/components/sidebar-app/inset-topbar"
import { ProspectPipelineTable } from "@/components/prospect-pipeline-table"
import { SPREADSHEET_URL } from "@/lib/prospects"
import { typeClass, useSizeContext } from "@/lib/size-context"
import { cn } from "@/lib/utils"

export default function Page() {
  const { size } = useSizeContext()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarInsetTopbar />
        <main className="flex min-h-0 flex-1 flex-col gap-4 p-6">
          <p className={cn(typeClass("caption", size), "text-muted-foreground")}>
            Seeded from Will and Arush&apos;s{" "}
            <a
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Longtable Prospect Pipeline
            </a>{" "}
            sheet. Edit stages, owners, and next actions in place — email and
            Slack ingestion come next.
          </p>
          <ProspectPipelineTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
