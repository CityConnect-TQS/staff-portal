import { NavbarStaff } from '@/components/navbar'
import { TripDetailsBoard } from '@/components/tripDetails'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/tripDetails')({
  component: TripDetails,
})

function TripDetails() {

  return (
    <div className="flex flex-col gap-16 p-2">
      <NavbarStaff />
      <div>  
        <TripDetailsBoard />
      </div>
    </div>
  )
}