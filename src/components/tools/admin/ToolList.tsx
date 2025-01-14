'use client'

type Tool = {
  id: string
  name: string
  description: string
  creditCost: number
  promptTemplate: string
  inputField1: string
  inputField1Description: string
}

interface ToolListProps {
  tools: Tool[]
  isLoading: boolean
  onSelectTool: (tool: Tool) => void
}

export default function ToolList({ tools, isLoading, onSelectTool }: ToolListProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-400">Loading tools...</div>
      </div>
    )
  }

  if (!tools.length) {
    return (
      <div className="p-6">
        <div className="text-gray-400">No tools found in this suite.</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{tool.description}</p>
            <div className="text-gray-400 text-sm">
              Credits: {tool.creditCost}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}