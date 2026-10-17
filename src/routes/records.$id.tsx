import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/records/$id')({
  component: RecordDetails,
})

function RecordDetails() {
  const { id } = Route.useParams()
  return <div>{id}</div>
}
