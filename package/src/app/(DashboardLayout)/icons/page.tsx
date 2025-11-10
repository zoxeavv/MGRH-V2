import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard"
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs"
import SyntaxHighlighter from "react-syntax-highlighter"

const Icons = () => {
  return (
    <PageContainer
      title="Icons"
      description="Browse and install Tabler Icons to extend your component library."
    >
      <DashboardCard title="Tabler Icons Library" contentClassName="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">🔍 Explore Icons</h2>
          <p className="text-sm text-muted-foreground">
            Browse and search for icons directly on the{" "}
            <a
              href="https://tabler-icons.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Tabler Icons website
            </a>
            . Each icon is available as an accessible React component.
          </p>
        </div>

        <hr className="border-border/60" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">⚙️ Installation</h3>
          <p className="text-sm text-muted-foreground">
            Install the official React package to start using Tabler Icons within your components:
          </p>
          <SyntaxHighlighter language="bash" style={docco}>
            npm install @tabler/icons-react
          </SyntaxHighlighter>
        </div>

        <hr className="border-border/60" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">🧩 Usage Example</h3>
          <p className="text-sm text-muted-foreground">
            Import and render icons as JSX. Icons inherit the current text color, making them easy to style with utility
            classes.
          </p>
          <SyntaxHighlighter language="typescript" style={docco}>
            {`import { IconHome } from '@tabler/icons-react'

export function MyComponent() {
  return (
    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground">
      <IconHome className="h-4 w-4" aria-hidden="true" />
      <span>Home</span>
    </button>
  )
}`}
          </SyntaxHighlighter>
        </div>
      </DashboardCard>
    </PageContainer>
  )
}

export default Icons
